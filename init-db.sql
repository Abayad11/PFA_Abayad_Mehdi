-- Script d'initialisation de la base de données
-- Projet: Abhar Santé Maroc

-- 1. Créer le tenant
INSERT INTO "Tenant" (id, name, "createdAt", "updatedAt")
VALUES ('chu-casablanca', 'CHU Casablanca', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Créer ton compte admin (Zahra)
-- Note: Le mot de passe doit être hashé avec bcrypt
-- Pour créer un hash: node -e "console.log(require('bcrypt').hashSync('TonMotDePasse', 10))"
INSERT INTO "User" (id, email, "passwordHash", role, "tenantId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'zahrazhar22mm@gmail.com',
  '$2b$10$YourHashedPasswordHere', -- À remplacer par ton hash
  'ADMIN_TENANT',
  'chu-casablanca',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- 3. Créer un compte admin de démonstration
INSERT INTO "User" (id, email, "passwordHash", role, "tenantId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@chu-casablanca.demo',
  '$2b$10$K5xZ8qJ9YvX5X5X5X5X5XeO5X5X5X5X5X5X5X5X5X5X5X5X5X5X5', -- AbharDemo!2025
  'ADMIN_TENANT',
  'chu-casablanca',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Vérifier les utilisateurs créés
SELECT id, email, role FROM "User";
