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
- code_source/backend: API Django REST (implémenté)
- services/llm-assistant: Assistant LLM avec garde-fous
- services/ai-infer-example: Service d’inférence IA (exemple)
- platform/*: Charts/manifests Helm pour Keycloak, Kong, Postgres, MinIO, Kafka, OpenSearch, Vault, HAPI FHIR, Orthanc
- infra/*: Terraform/Helm/Argo CD
- security: Policies RLS, MFA, anonymisation
- shared: Libs partagées (TS/Python)

## 🚀 Démarrage Rapide

### Prérequis
- Docker & Docker Compose installés
- Git installé

### Cloner le projet
```bash
git clone https://github.com/Abayad11/PFA_Abayad_Mehdi.git
cd projet-federateur
```

### Lancer les services
```bash
docker compose up -d
```

### Vérifier l'état
```bash
docker compose ps
```

**Services accessibles :**
- Frontend (Next.js): http://localhost:3000
- Backend (Django): http://localhost:4000
- LLM Assistant: http://localhost:8000
- AI Infer: http://localhost:8001
- PostgreSQL: localhost:5432

### Comptes de test
| Rôle | Username | Password | Tenant |
|------|----------|----------|--------|
| Admin | admin | admin123 | chu-casablanca |
| Médecin | medecin | medecin123 | chu-casablanca |
| Patient | patient | patient123 | chu-casablanca |
| Chercheur | chercheur | chercheur123 | chu-casablanca |

### Arrêter les services
```bash
docker compose down
```

## 📚 Documentation
- `GUIDE_TEST_COMPLET_FINAL.md` - Guide de test complet (étape par étape)
- `DOCUMENTATION_COMPLETE.md` - Documentation technique détaillée
- `CLAUDE.md` - Guide pour contributeurs et IA

## Prochaines étapes
- Générer squelettes Next.js, React Native, NestJS, FastAPI
- Ajouter charts Helm concrets et pipelines CI/CD
- Déployer l’infra de base sur AWS (EKS, Postgres, MinIO, etc.)



