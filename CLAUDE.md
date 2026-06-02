# Guide Claude — Projet Fédérateur “Abhar Santé Maroc”

## 1) Objectif du repo
Plateforme médicale intégrée (web + mobile + API + services IA). Le repo contient à la fois:
- une implémentation **fonctionnelle** (Docker Compose) autour d’un **backend Django** + **web Next.js** + **services FastAPI**,
- et une **vision cible** plus large (Keycloak/Kong/Vault/Kafka/FHIR/DICOM/Helm/Terraform) décrite dans `README.md` et les dossiers `platform/` et `infra/`.

Quand tu ajoutes du code, distingue toujours:
- **MVP local (actuel)**: `docker-compose.yml`.
- **Architecture cible (roadmap)**: `platform/`, `infra/`, services d’orchestration LLM (`docker-compose.orchestrator.yml`).

## 2) Stack technique (constaté dans le code)

### Frontend Web (actuel)
- Framework: **Next.js 14.2.4** (`apps/web-nextjs/package.json`)
- UI: **React 18**, **TailwindCSS**, `class-variance-authority`, `tailwind-merge`, `lucide-react`
- Langage: **TypeScript**
- Runtime: **Node 20** (Dockerfile)
- Variable d’environnement principale: `NEXT_PUBLIC_API_BASE_URL` (utilisée pour pointer l’API)

### Mobile (actuel)
- **Expo (SDK 54)** + **React Native 0.74** (`apps/mobile-rn/package.json`, `apps/mobile-rn/app.json`)
- Scripts: `expo start`, `expo run:android`, `expo run:ios`

### Backend API (actuel)
- Framework: **Django 5.2.7** + **Django REST Framework** (`code_source/backend/requirements.txt`)
- Auth: **JWT** via `djangorestframework-simplejwt` (+ blacklist)
- CORS: `django-cors-headers`
- Filtrage: `django-filter`
- DB:
  - **PostgreSQL** via `dj-database-url` + `psycopg2-binary` quand `DATABASE_URL` est défini
  - fallback **SQLite** sinon (voir `abhar_project/settings.py`)
- Pattern transversal: **multi-tenant** (header `X-Tenant-Id` requis — cf. README backend)
- Port dev: **4000** (compose + Dockerfile)

### Services IA/LLM (actuels)
- **FastAPI** + **Uvicorn**
- `services/ai-infer-example`: inférence **TensorFlow/Keras** (port **8001**)
- `services/llm-assistant`: “assistant” qui appelle `ai-infer-example` (port **8000**) via `AI_INFER_URL`
- `services/llm-orchestrator` + `services/llm-vision|llm-text|llm-fhir|llm-research`:
  - orchestration + RAG
  - dépendances: **Torch**, **Transformers**, **LangChain**, **OpenAI SDK**, **pgvector**, **Redis**, **SQLAlchemy**, **Prometheus client**, **python-jose**...
  - compose dédié: `docker-compose.orchestrator.yml`

### Conteneurisation
- Orchestration locale: **Docker Compose**
  - `docker-compose.yml`: `backend-django`, `web-nextjs`, `postgres`, `llm-assistant`, `ai-infer-example`
  - `docker-compose.orchestrator.yml`: orchestrateur LLM + services spécialisés + postgres pgvector + redis + GPU (NVIDIA)

## 3) Arborescence (repères)
- `apps/web-nextjs/`: portail web
- `apps/mobile-rn/`: app mobile Expo
- `code_source/backend/`: API Django (auth, rôles, multi-tenant)
- `services/*`: microservices IA/LLM (FastAPI)
- `platform/`: manifests/charts (vision cible)
- `infra/`: infra as code (vision cible)
- `security/`: éléments sécurité (vision cible)

## 4) Commandes de dev (recommandées)

### Démarrer le MVP complet (web + django + postgres + infer + llm assistant)
Depuis la racine:
```bash
docker compose up --build
```
Services exposés:
- Web Next.js: http://localhost:3000
- API Django: http://localhost:4000
- LLM Assistant: http://localhost:8000
- AI infer: http://localhost:8001
- Postgres: localhost:5432

### Backend Django (manuel)
```bash
pip install -r code_source/backend/requirements.txt
python code_source/backend/manage.py migrate
python code_source/backend/manage.py runserver 0.0.0.0:4000
```

### Web Next.js (manuel)
```bash
cd apps/web-nextjs
npm i
npm run dev
```

### Mobile Expo (manuel)
```bash
cd apps/mobile-rn
npm i
npm run start
```

### Orchestrateur LLM (stack séparée)
```bash
docker compose -f docker-compose.orchestrator.yml up --build
```
Ports:
- Orchestrator: http://localhost:8002
- Vision: http://localhost:8003
- Text: http://localhost:8004
- FHIR: http://localhost:8005
- Research: http://localhost:8006
- Postgres (pgvector): localhost:5432
- Redis: localhost:6379

## 5) Conventions de contribution (guidelines)

### Principes
- **Pas de secrets en dur** (même en dev). Utilise `.env` local non versionné.
- **Docker-first** pour reproduire l’environnement.
- **Définir explicitement la cible** (MVP vs roadmap) dans tes PR.

### Nommage & dossiers
- Web: composants React/TS dans `apps/web-nextjs`.
- Backend Django: une app par domaine (ex: `users`, `dossiers`, `messagerie`).
- Services: un service = un dossier dans `services/`.

### API (contrats)
- API Django:
  - Toujours rappeler le header `X-Tenant-Id` quand pertinent.
  - JWT: garder les endpoints d’auth sous `/api/auth/*`.
- Services FastAPI:
  - Exposer `/health`.
  - Documenter via `/docs` (Swagger) et maintenir des schémas Pydantic.

### Tests
Le repo contient des scripts de test (PowerShell / HTML). Si tu ajoutes des tests:
- Backend Django: privilégier `pytest` ou `unittest` Django (à standardiser si besoin).
- Web: proposer Playwright/Jest (non présent à ce stade).
- FastAPI: `pytest` + `httpx` TestClient.

## 6) Sécurité & données (règles projet)
- Données sensibles (PHI): minimiser, journaliser avec prudence.
- Multi-tenant: toute donnée “métier” doit être filtrée par `tenant_id` (backend).
- CORS: restreindre en prod.
- JWT: rotation/blacklist déjà prévue côté Django.

## 7) Comment utiliser Claude efficacement sur ce repo

### Quand tu me demandes d’implémenter une feature
Indique:
- **où** (web / mobile / django / service fastapi / orchestrator)
- **mode** (docker compose MVP ou orchestrator)
- **contrat API** attendu (payload, endpoints)
- contraintes multi-tenant (`tenant_id`, `X-Tenant-Id`)

### Format de demande recommandé
- Contexte: “Je suis sur le MVP docker-compose.yml”
- Objectif: “Ajouter endpoint `GET /api/dossiers/` filtré par tenant”
- Données: modèle, champs, exemples
- UX: pages Next.js ou écrans mobile concernés

## 8) Points d’attention / incohérences connues
- Le `README.md` racine mentionne un backend **NestJS** (`services/api-nest`) mais **ce dossier n’est pas présent** dans le repo actuel. Le backend réellement présent et câblé par Docker Compose est **Django**.
- Certains guides dans `services/*` contiennent des commandes Windows/PowerShell. Sur Linux, utilise l’équivalent bash.

