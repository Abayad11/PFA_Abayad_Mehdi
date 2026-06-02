# 🔐 Documentation API d'Authentification - Abhar Santé Maroc

## Base URL
```
http://localhost:4000/api/auth/
```

---

## 📋 Endpoints Disponibles

### 1. **Inscription** (Register)
Créer un nouveau compte utilisateur.

**Endpoint:** `POST /api/auth/register/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "username": "ahmed.bennani",
  "password": "SecurePass123!",
  "password2": "SecurePass123!",
  "email": "ahmed.bennani@email.com",
  "first_name": "Ahmed",
  "last_name": "Bennani",
  "role": "patient",
  "tenant_id": "chu-casablanca",
  "telephone": "+212 6 12 34 56 78",
  "date_naissance": "1990-01-15",
  
  // Champs spécifiques selon le rôle
  // Pour patient:
  "groupe_sanguin": "A+",
  "allergies": "Pénicilline",
  "maladies_chroniques": "Diabète type 2",
  
  // Pour médecin:
  "specialite": "Cardiologie",
  "inpe": "12345678",
  
  // Pour chercheur:
  "institution": "Université Mohammed VI Polytechnique",
  "domaine_recherche": "Intelligence Artificielle en Santé"
}
```

**Response Success (201):**
```json
{
  "user": {
    "id": 1,
    "username": "ahmed.bennani",
    "email": "ahmed.bennani@email.com",
    "first_name": "Ahmed",
    "last_name": "Bennani",
    "role": "patient",
    "tenant_id": "chu-casablanca",
    "is_verified": false,
    "created_at": "2025-01-25T10:30:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "message": "Utilisateur créé avec succès"
}
```

---

### 2. **Connexion** (Login)
Se connecter avec un compte existant.

**Endpoint:** `POST /api/auth/login/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "username": "ahmed.bennani",
  "password": "SecurePass123!",
  "tenant_id": "chu-casablanca"
}
```

**Response Success (200):**
```json
{
  "user": {
    "id": 1,
    "username": "ahmed.bennani",
    "email": "ahmed.bennani@email.com",
    "first_name": "Ahmed",
    "last_name": "Bennani",
    "role": "patient",
    "tenant_id": "chu-casablanca"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "message": "Connexion réussie"
}
```

**Response Error (401):**
```json
{
  "error": "Identifiants invalides"
}
```

**Response Error (403):**
```json
{
  "error": "Accès refusé pour cet établissement"
}
```

---

### 3. **Déconnexion** (Logout)
Se déconnecter et blacklister le refresh token.

**Endpoint:** `POST /api/auth/logout/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Body:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response Success (200):**
```json
{
  "message": "Déconnexion réussie"
}
```

---

### 4. **Rafraîchir le Token** (Refresh Token)
Obtenir un nouveau access token avec le refresh token.

**Endpoint:** `POST /api/auth/token/refresh/`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response Success (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

### 5. **Vérifier le Token** (Verify Token)
Vérifier si le token est valide.

**Endpoint:** `GET /api/auth/verify/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>"
}
```

**Response Success (200):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "username": "ahmed.bennani",
    "role": "patient",
    "tenant_id": "chu-casablanca"
  }
}
```

---

### 6. **Profil Utilisateur** (Me)
Obtenir ou mettre à jour le profil de l'utilisateur connecté.

**Endpoint GET:** `GET /api/auth/me/`

**Headers:**
```json
{
  "Authorization": "Bearer <access_token>",
  "X-Tenant-Id": "chu-casablanca"
}
```

**Response Success (200):**
```json
{
  "user": {
    "id": 1,
    "username": "ahmed.bennani",
    "email": "ahmed.bennani@email.com",
    "first_name": "Ahmed",
    "last_name": "Bennani",
    "role": "patient",
    "tenant_id": "chu-casablanca",
    "telephone": "+212 6 12 34 56 78",
    "groupe_sanguin": "A+",
    "allergies": "Pénicilline",
    "created_at": "2025-01-25T10:30:00Z"
  }
}
```

**Endpoint PUT:** `PUT /api/auth/me/`

**Body:**
```json
{
  "first_name": "Ahmed",
  "last_name": "Bennani",
  "telephone": "+212 6 98 76 54 32",
  "adresse": "123 Rue Mohammed V, Casablanca"
}
```

**Response Success (200):**
```json
{
  "user": { /* updated user data */ },
  "message": "Profil mis à jour avec succès"
}
```

---

### 7. **Changer le Mot de Passe** (Change Password)
Changer le mot de passe de l'utilisateur connecté.

**Endpoint:** `POST /api/auth/change-password/`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

**Body:**
```json
{
  "old_password": "OldPass123!",
  "new_password": "NewSecurePass456!",
  "new_password2": "NewSecurePass456!"
}
```

**Response Success (200):**
```json
{
  "message": "Mot de passe changé avec succès"
}
```

**Response Error (400):**
```json
{
  "error": "Ancien mot de passe incorrect"
}
```

---

## 🔑 Utilisation des Tokens JWT

### Format du Token
Les tokens JWT sont envoyés dans le header `Authorization`:
```
Authorization: Bearer <access_token>
```

### Durée de Vie
- **Access Token:** 1 heure
- **Refresh Token:** 7 jours

### Claims Personnalisés
Les tokens contiennent:
- `user_id`: ID de l'utilisateur
- `role`: Rôle de l'utilisateur (patient, medecin, chercheur, admin)
- `tenant_id`: ID de l'établissement

---

## 🏢 Multi-Tenant

### Header Obligatoire
Pour toutes les requêtes authentifiées (sauf login/register):
```
X-Tenant-Id: chu-casablanca
```

### Isolation
- Chaque utilisateur appartient à un seul `tenant_id`
- L'accès aux ressources est filtré par `tenant_id`
- Un utilisateur ne peut pas accéder aux données d'un autre établissement

---

## 🛡️ Rôles et Permissions

### Rôles Disponibles
1. **patient** - Patients de l'établissement
2. **medecin** - Médecins et personnel soignant
3. **chercheur** - Chercheurs et data scientists
4. **admin** - Administrateurs de l'établissement

### Routes Protégées par Rôle
- `/api/patient/*` → Réservé aux patients
- `/api/medecin/*` → Réservé aux médecins
- `/api/chercheur/*` → Réservé aux chercheurs
- `/api/admin/*` → Réservé aux admins

Les admins ont accès à toutes les routes.

---

## 🔒 Sécurité

### Validation des Mots de Passe
- Minimum 8 caractères
- Ne peut pas être trop similaire aux autres informations
- Ne peut pas être un mot de passe commun
- Ne peut pas être entièrement numérique

### CORS
Origines autorisées:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

### Headers CORS Personnalisés
- `X-Tenant-Id` - ID de l'établissement

---

## 📝 Exemples d'Utilisation

### Exemple JavaScript (Fetch)
```javascript
// Connexion
const login = async () => {
  const response = await fetch('http://localhost:4000/api/auth/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'ahmed.bennani',
      password: 'SecurePass123!',
      tenant_id: 'chu-casablanca'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('access_token', data.tokens.access);
  localStorage.setItem('refresh_token', data.tokens.refresh);
  localStorage.setItem('tenant_id', data.user.tenant_id);
};

// Requête authentifiée
const getProfile = async () => {
  const token = localStorage.getItem('access_token');
  const tenantId = localStorage.getItem('tenant_id');
  
  const response = await fetch('http://localhost:4000/api/auth/me/', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-Tenant-Id': tenantId
    }
  });
  
  const data = await response.json();
  return data.user;
};
```

---

## 🚨 Codes d'Erreur

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès refusé |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

---

## 🔄 Workflow Complet

1. **Inscription** → Obtenir tokens
2. **Connexion** → Obtenir tokens
3. **Stocker** access_token, refresh_token, tenant_id
4. **Requêtes** avec Authorization header et X-Tenant-Id
5. **Rafraîchir** le token quand il expire
6. **Déconnexion** → Blacklister le refresh token
