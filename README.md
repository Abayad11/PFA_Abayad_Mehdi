# Abhar Santé Maroc

Projet de plateforme médicale intégrée.

- Auteurs: Mehdi Abayad, Zahra Zhar
- Licence: Apache-2.0
- Namespace: abhar-sante
- Domaine (placeholder): abhar-sante.ma

## Vision
Créer un écosystème de santé numérique sécurisé pour connecter patients, médecins, hôpitaux et chercheurs, avec IA et partage éthique des données.

## Architecture (résumé)
- Frontend: Next.js (FR) + React Native (FR)
- Backend API: NestJS (RBAC, Consentement, Workflows)
- IA/LLM: Services FastAPI (GPU), MLflow (à prévoir)
- Interop: HAPI FHIR (JPA), Orthanc + OHIF (DICOM)
- Données: PostgreSQL 16 (RLS, pgcrypto, pgvector), MinIO (S3), OpenSearch
- Sécurité/IAM: Keycloak (MFA), Vault (Secrets/Transit/PKI), Kong (API GW)
- Événements: Kafka (Strimzi)
- Observabilité: Prometheus, Loki, Tempo, Grafana
- Infra: AWS (eu-west-3), EKS, Helm, Argo CD, GitHub Actions

## Multi-tenant & Sécurité
- Isolation par établissement (tenant): RLS PostgreSQL + realms Keycloak + buckets MinIO par tenant
- Chiffrement: TLS partout, secrets via Vault, champs PHI chiffrés (Vault Transit + pgcrypto)
- MFA: obligatoire pour tous les rôles

## Répertoires
- apps/web-nextjs: Portail web patient/clinicien (FR)
- apps/mobile-rn: Application mobile (FR)
- services/api-nest: API métier
- services/llm-assistant: Assistant LLM avec garde-fous
- services/ai-infer-example: Service d’inférence IA (exemple)
- platform/*: Charts/manifests Helm pour Keycloak, Kong, Postgres, MinIO, Kafka, OpenSearch, Vault, HAPI FHIR, Orthanc
- infra/*: Terraform/Helm/Argo CD
- security: Policies RLS, MFA, anonymisation
- shared: Libs partagées (TS/Python)

## Prochaines étapes
- Générer squelettes Next.js, React Native, NestJS, FastAPI
- Ajouter charts Helm concrets et pipelines CI/CD
- Déployer l’infra de base sur AWS (EKS, Postgres, MinIO, etc.)



