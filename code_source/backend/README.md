# 🔐 Backend Abhar Santé Maroc - Authentification JWT

## 🐳 Démarrage Rapide avec Docker (Recommandé)

### Option 1: Tout en 1 commande
```bash
# Depuis la racine du projet
docker compose up --build
```

✅ **Tout est automatique !**
- Installation des dépendances
- Création de la base de données
- Migrations appliquées
- Superutilisateur créé (admin/admin123)
- Serveur démarré sur http://localhost:4000

Voir [DOCKER_QUICKSTART.md](../../DOCKER_QUICKSTART.md) pour plus de détails.

---

## 💻 Installation Manuelle (Alternative)

### 1. Installer les dépendances
```bash
cd code_source/backend
pip install -r requirements.txt
```

### 2. Créer les migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Créer un superutilisateur (optionnel)
```bash
python manage.py createsuperuser
```

### 4. Lancer le serveur
```bash
python manage.py runserver 0.0.0.0:4000
```

Le serveur sera accessible sur `http://localhost:4000`

---

## 📋 Structure du Projet

```
backend/
├── abhar_project/          # Configuration Django
│   ├── settings.py         # Configuration JWT, CORS, Multi-tenant
│   ├── urls.py             # Routes principales
│   └── wsgi.py
├── users/                  # App d'authentification
│   ├── models.py           # Modèle CustomUser avec multi-tenant
│   ├── serializers.py      # Serializers pour API
│   ├── views.py            # Vues d'authentification
│   ├── urls.py             # Routes d'authentification
│   └── middleware.py       # Middlewares multi-tenant et permissions
├── manage.py
├── requirements.txt
└── README.md
```

---

## 🔑 Fonctionnalités Implémentées

### ✅ Authentification JWT Complète
- [x] Inscription (Register)
- [x] Connexion (Login)
- [x] Déconnexion (Logout) avec blacklist
- [x] Rafraîchissement de token
- [x] Vérification de token
- [x] Profil utilisateur (GET/PUT)
- [x] Changement de mot de passe

### ✅ Multi-Tenant
- [x] Isolation par `tenant_id`
- [x] Header `X-Tenant-Id` obligatoire
- [x] Middleware de vérification
- [x] Filtrage automatique des données

### ✅ Gestion des Rôles
- [x] 4 rôles: patient, medecin, chercheur, admin
- [x] Permissions basées sur les rôles
- [x] Middleware de vérification des permissions
- [x] Claims JWT personnalisés

### ✅ Sécurité
- [x] Validation des mots de passe
- [x] CORS configuré
- [x] Token blacklist
- [x] Rotation des tokens
- [x] Headers personnalisés sécurisés

---

## 📡 Endpoints API

### Authentification
```
POST   /api/auth/register/          - Inscription
POST   /api/auth/login/             - Connexion
POST   /api/auth/logout/            - Déconnexion
POST   /api/auth/token/refresh/     - Rafraîchir token
GET    /api/auth/verify/            - Vérifier token
GET    /api/auth/me/                - Obtenir profil
PUT    /api/auth/me/                - Mettre à jour profil
POST   /api/auth/change-password/   - Changer mot de passe
```

Voir [API_AUTH_DOCUMENTATION.md](./API_AUTH_DOCUMENTATION.md) pour les détails complets.

---

## 🧪 Tester l'API

### Avec cURL

#### 1. Inscription
```bash
curl -X POST http://localhost:4000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ahmed.bennani",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "email": "ahmed.bennani@email.com",
    "first_name": "Ahmed",
    "last_name": "Bennani",
    "role": "patient",
    "tenant_id": "chu-casablanca"
  }'
```

#### 2. Connexion
```bash
curl -X POST http://localhost:4000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ahmed.bennani",
    "password": "SecurePass123!",
    "tenant_id": "chu-casablanca"
  }'
```

#### 3. Obtenir le profil
```bash
curl -X GET http://localhost:4000/api/auth/me/ \
  -H "Authorization: Bearer <access_token>" \
  -H "X-Tenant-Id: chu-casablanca"
```

### Avec Postman
1. Importer la collection depuis `API_AUTH_DOCUMENTATION.md`
2. Configurer l'environnement avec `base_url = http://localhost:4000`
3. Tester les endpoints

---

## 🔧 Configuration

### Variables d'Environnement (Optionnel)
Créer un fichier `.env`:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60  # minutes
JWT_REFRESH_TOKEN_LIFETIME=10080  # minutes (7 days)

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Base de Données
Par défaut: SQLite (`db.sqlite3`)

Pour PostgreSQL, modifier `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'abhar_db',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## 👥 Modèle Utilisateur

### Champs Communs
- `username` - Nom d'utilisateur unique
- `email` - Email
- `first_name` - Prénom
- `last_name` - Nom
- `role` - Rôle (patient, medecin, chercheur, admin)
- `tenant_id` - ID de l'établissement
- `telephone` - Numéro de téléphone
- `adresse` - Adresse
- `date_naissance` - Date de naissance
- `is_verified` - Compte vérifié
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

### Champs Spécifiques Médecin
- `specialite` - Spécialité médicale
- `inpe` - Numéro INPE (unique)

### Champs Spécifiques Patient
- `groupe_sanguin` - Groupe sanguin
- `allergies` - Allergies
- `maladies_chroniques` - Maladies chroniques

### Champs Spécifiques Chercheur
- `institution` - Institution de recherche
- `domaine_recherche` - Domaine de recherche

---

## 🛡️ Sécurité

### Validation des Mots de Passe
- Minimum 8 caractères
- Pas trop similaire aux informations personnelles
- Pas un mot de passe commun
- Pas entièrement numérique

### CORS
Configuré pour accepter les requêtes depuis:
- `http://localhost:3000` (Frontend Next.js)
- `http://127.0.0.1:3000`

### Multi-Tenant
- Isolation stricte par `tenant_id`
- Vérification automatique via middleware
- Header `X-Tenant-Id` obligatoire

---

## 🐛 Dépannage

### Erreur: "No module named 'corsheaders'"
```bash
pip install django-cors-headers
```

### Erreur: "Table doesn't exist"
```bash
python manage.py migrate
```

### Erreur: "CORS policy"
Vérifier que `corsheaders` est dans `INSTALLED_APPS` et `MIDDLEWARE` dans `settings.py`

### Erreur: "Invalid token"
Le token a peut-être expiré. Utiliser `/api/auth/token/refresh/` pour obtenir un nouveau token.

---

## 📚 Documentation Complète

Voir [API_AUTH_DOCUMENTATION.md](./API_AUTH_DOCUMENTATION.md) pour:
- Tous les endpoints détaillés
- Exemples de requêtes/réponses
- Codes d'erreur
- Workflow complet
- Exemples JavaScript

---

## 🚀 Prochaines Étapes

1. ✅ Authentification JWT - **TERMINÉ**
2. ⏳ Endpoints CRUD pour chaque rôle
3. ⏳ Upload de fichiers
4. ⏳ Messagerie temps réel (WebSocket)
5. ⏳ Intégration IA
6. ⏳ Tests unitaires
7. ⏳ Documentation Swagger

---

## 👨‍💻 Auteurs

**Abhar Santé Maroc**
- Mehdi Abayad
- Zahra Zhar

---

## 📄 Licence

Propriétaire - Tous droits réservés
