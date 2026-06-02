-- Abhar Santé Maroc - PostgreSQL schema (initial)
-- Note: Application must SET app.tenant_id and app.user_id at connection start.
-- Example: SELECT set_config('app.tenant_id', '<tenant-uuid>', false);
--          SELECT set_config('app.user_id', '<user-uuid>', false);

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;

-- Tenants (establishments)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users directory (cross-tenant id with mapping table below)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE, -- Keycloak user id
  email CITEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tenant memberships (isolation by tenant_id)
CREATE TABLE IF NOT EXISTS tenant_users (
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('patient','medecin','chercheur','admin_hopital')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, user_id)
);

-- Patients (as resources owned by a tenant)
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- if patient has a login
  mrn TEXT, -- medical record number (tenant-scoped)
  birth_date DATE,
  sex TEXT CHECK (sex IN ('M','F','O')),
  phi JSONB, -- encrypted or tokenized PHI fields where applicable
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS patients_unique_mrn_per_tenant ON patients(tenant_id, mrn) WHERE mrn IS NOT NULL;

-- Consents (patient-controlled data sharing)
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  grantee_type TEXT NOT NULL CHECK (grantee_type IN ('medecin','chercheur','etablissement')),
  grantee_id UUID, -- user_id or tenant_id depending on type
  scope TEXT NOT NULL, -- e.g. 'all', 'labs', 'imaging', 'visit:<id>', 'research'
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  metadata JSONB
);
CREATE INDEX IF NOT EXISTS consents_patient_idx ON consents(patient_id);

-- Audit events (append-only)
CREATE TABLE IF NOT EXISTS audit_events (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  actor_user_id UUID REFERENCES users(id),
  actor_role TEXT,
  action TEXT NOT NULL, -- e.g. 'READ_PATIENT','UPDATE_CONSENT','LLM_GENERATE_REPORT'
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  hash_prev TEXT, -- for hash-chain
  hash_curr TEXT
);
CREATE INDEX IF NOT EXISTS audit_events_tenant_time_idx ON audit_events(tenant_id, occurred_at DESC);

-- RLS and policies
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Helper functions to read current settings
CREATE OR REPLACE FUNCTION app_current_tenant() RETURNS uuid AS $$
BEGIN
  RETURN NULLIF(current_setting('app.tenant_id', true), '')::uuid;
END; $$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION app_current_user() RETURNS uuid AS $$
BEGIN
  RETURN NULLIF(current_setting('app.user_id', true), '')::uuid;
END; $$ LANGUAGE plpgsql STABLE;

-- Policies: tenant isolation
DO $$
BEGIN
  -- tenant_users
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tenant_users' AND policyname = 'tenant_users_isolation'
  ) THEN
    CREATE POLICY tenant_users_isolation ON tenant_users
      USING (tenant_id = app_current_tenant());
  END IF;

  -- patients
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'patients' AND policyname = 'patients_isolation'
  ) THEN
    CREATE POLICY patients_isolation ON patients
      USING (tenant_id = app_current_tenant());
  END IF;

  -- consents
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'consents' AND policyname = 'consents_isolation'
  ) THEN
    CREATE POLICY consents_isolation ON consents
      USING (tenant_id = app_current_tenant());
  END IF;

  -- audit_events
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'audit_events' AND policyname = 'audit_isolation'
  ) THEN
    CREATE POLICY audit_isolation ON audit_events
      USING (tenant_id = app_current_tenant());
  END IF;
END $$;

-- Optional: restrict INSERT/UPDATE by membership
-- (Application may use elevated roles; fine-tune later.)
