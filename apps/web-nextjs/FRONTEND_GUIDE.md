# 🎨 Guide Frontend - Abhar Santé Maroc

**Auteurs**: Mehdi Abayad, Zahra Zhar  
**Framework**: Next.js 14 + React 18 + TypeScript  
**Styling**: TailwindCSS + Lucide Icons

---

## 📁 Structure du projet

```
apps/web-nextjs/
├── pages/                      # Pages Next.js
│   ├── _app.tsx               # Configuration globale
│   ├── login.tsx              # Connexion
│   ├── signup.tsx             # Inscription
│   ├── mfa.tsx                # Authentification MFA
│   ├── profile.tsx            # Profil utilisateur
│   │
│   ├── medecin/               # Pages médecin
│   │   ├── dashboard.tsx      # Dashboard médecin
│   │   ├── patients.tsx       # Liste patients
│   │   ├── dossiers.tsx       # ✅ Gestion dossiers médicaux
│   │   ├── rendez-vous.tsx    # ✅ Gestion rendez-vous
│   │   ├── messagerie.tsx     # ✅ Messagerie
│   │   └── conseiller-ia.tsx  # Assistant IA
│   │
│   ├── patient/               # Pages patient
│   │   ├── dashboard.tsx      # Dashboard patient
│   │   ├── dossiers.tsx       # Mes dossiers
│   │   ├── dossiers/[id].tsx  # Détail dossier
│   │   ├── messagerie.tsx     # Messagerie
│   │   ├── conseiller-ia.tsx  # Assistant IA
│   │   └── partage-recherche.tsx
│   │
│   ├── chercheur/             # Pages chercheur
│   │   ├── dashboard.tsx      # Dashboard chercheur
│   │   ├── datasets.tsx       # Datasets
│   │   └── challenges.tsx     # Challenges
│   │
│   ├── admin/                 # Pages admin
│   │   ├── dashboard.tsx      # Dashboard admin
│   │   ├── gestion-centralisee.tsx
│   │   ├── disponibilite-medecins.tsx
│   │   └── transparence-rapports.tsx
│   │
│   └── orchestrator/          # Orchestrateur LLM
│       └── index.tsx          # Interface orchestration
│
├── components/                # Composants réutilisables
│   ├── ui/                    # ✅ Composants UI de base
│   │   ├── Card.tsx           # ✅ Cartes
│   │   ├── Button.tsx         # ✅ Boutons
│   │   ├── Modal.tsx          # ✅ Modales
│   │   ├── Input.tsx          # ✅ Inputs & TextArea
│   │   ├── Badge.tsx          # ✅ Badges
│   │   └── index.ts           # ✅ Export centralisé
│   │
│   ├── layout/                # Layouts
│   └── nav/                   # Navigation
│
├── styles/                    # Styles globaux
│   └── globals.css            # TailwindCSS
│
├── public/                    # Assets statiques
├── context/                   # Contextes React
└── package.json               # Dépendances

```

---

## 🎨 Composants UI créés

### 1. Card
Composant de carte flexible avec header, content et footer.

```tsx
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui';

<Card hover onClick={() => {}}>
  <CardHeader 
    title="Titre"
    subtitle="Sous-titre"
    icon={<Icon />}
    action={<Button />}
  />
  <CardContent>
    Contenu de la carte
  </CardContent>
  <CardFooter>
    Actions
  </CardFooter>
</Card>
```

### 2. Button
Bouton avec variantes et états de chargement.

```tsx
import { Button } from '@/components/ui';

<Button 
  variant="primary" // primary | secondary | danger | success | outline
  size="md"         // sm | md | lg
  loading={false}
  icon={<Icon />}
  fullWidth
>
  Texte du bouton
</Button>
```

### 3. Modal
Modale responsive avec header et footer personnalisables.

```tsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Titre de la modale"
  size="md"  // sm | md | lg | xl
  footer={
    <>
      <Button variant="secondary">Annuler</Button>
      <Button>Confirmer</Button>
    </>
  }
>
  Contenu de la modale
</Modal>
```

### 4. Input & TextArea
Champs de formulaire avec label, erreur et helper text.

```tsx
import { Input, TextArea } from '@/components/ui';

<Input
  label="Nom"
  error="Champ requis"
  helperText="Entrez votre nom complet"
  icon={<Icon />}
  required
/>

<TextArea
  label="Description"
  rows={4}
  required
/>
```

### 5. Badge
Badge coloré pour les statuts.

```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" size="md">
  Actif
</Badge>
// Variantes: default | success | warning | danger | info
```

---

## 📄 Pages créées

### ✅ Médecin - Gestion des rendez-vous
**Route**: `/medecin/rendez-vous`

**Fonctionnalités**:
- Liste des rendez-vous avec filtres (tous, aujourd'hui, semaine)
- Stats (total, confirmés, en attente, annulés)
- Modal de détails avec actions (confirmer/annuler)
- Badges de statut colorés
- Recherche et tri

### ✅ Médecin - Gestion des dossiers
**Route**: `/medecin/dossiers`

**Fonctionnalités**:
- Liste des dossiers médicaux
- Recherche par nom, prénom, numéro sécu
- Filtres par statut (actif, archivé, en cours)
- Stats globales
- Actions: voir, modifier, exporter
- Modal de création de nouveau dossier

### ✅ Médecin - Messagerie
**Route**: `/medecin/messagerie`

**Fonctionnalités**:
- Interface de messagerie en temps réel
- Liste des conversations avec compteur non lus
- Zone de messages avec scroll automatique
- Envoi de messages
- Recherche de conversations
- Design moderne type chat

---

## 🎨 Design System

### Couleurs principales
```css
/* Gradient violet-bleu (identité visuelle) */
from-violet-600 to-blue-600

/* Backgrounds */
bg-gradient-to-br from-violet-50 via-white to-blue-50

/* États */
success: green-600
warning: yellow-600
danger: red-600
info: blue-600
```

### Typographie
```css
/* Titres */
text-4xl font-bold text-gray-900  /* H1 */
text-2xl font-bold text-gray-900  /* H2 */
text-xl font-semibold text-gray-900  /* H3 */

/* Corps */
text-base text-gray-700  /* Normal */
text-sm text-gray-600    /* Small */
text-xs text-gray-500    /* Extra small */
```

### Espacements
```css
/* Padding */
p-4  /* 1rem */
p-6  /* 1.5rem */
p-8  /* 2rem */

/* Margin */
mb-4  /* 1rem */
mb-6  /* 1.5rem */
mb-8  /* 2rem */

/* Gap */
gap-3  /* 0.75rem */
gap-4  /* 1rem */
gap-6  /* 1.5rem */
```

### Ombres et bordures
```css
/* Ombres */
shadow-lg      /* Cartes */
shadow-xl      /* Cartes hover */
shadow-2xl     /* Modales */

/* Bordures */
rounded-lg     /* 0.5rem */
rounded-xl     /* 0.75rem */
rounded-2xl    /* 1rem */
rounded-full   /* Badges, avatars */
```

---

## 🚀 Démarrage

### Installation
```bash
cd apps/web-nextjs
npm install
```

### Développement
```bash
npm run dev
# Ouvre http://localhost:3000
```

### Build production
```bash
npm run build
npm run start
```

---

## 📦 Dépendances principales

```json
{
  "dependencies": {
    "next": "14.2.4",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "lucide-react": "^0.441.0",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^2.5.2"
  },
  "devDependencies": {
    "typescript": "5.4.5",
    "@types/react": "18.2.66",
    "@types/node": "20.12.7",
    "tailwindcss": "^3.4.10",
    "postcss": "^8.4.41",
    "autoprefixer": "^10.4.20"
  }
}
```

---

## 🔄 Prochaines étapes

### À compléter
- [ ] Pages patient (rendez-vous, messagerie complète)
- [ ] Pages chercheur (gestion datasets, challenges)
- [ ] Pages admin (gestion utilisateurs, rapports)
- [ ] Dashboards avec graphiques (Chart.js ou Recharts)
- [ ] Composants avancés (Select, DatePicker, FileUpload)
- [ ] Tests unitaires (Jest + React Testing Library)
- [ ] Responsive mobile amélioré
- [ ] Dark mode

### Backend à connecter
- [ ] API rendez-vous (`/api/rendez-vous`)
- [ ] API dossiers (`/api/dossiers`)
- [ ] API messagerie (`/api/messagerie`)
- [ ] WebSocket pour messagerie temps réel
- [ ] Upload de fichiers

---

## 📝 Conventions de code

### Nommage
- **Composants**: PascalCase (`Button.tsx`)
- **Fichiers utils**: camelCase (`formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)

### Structure des composants
```tsx
import { useState } from 'react';
import { Icon } from 'lucide-react';
import { Component } from '@/components/ui';

interface Props {
  // Props typées
}

export default function PageName() {
  // 1. Hooks
  const [state, setState] = useState();

  // 2. Fonctions
  const handleAction = () => {};

  // 3. Effects
  useEffect(() => {}, []);

  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

---

## 🎯 Bonnes pratiques

1. **Toujours typer avec TypeScript**
2. **Utiliser les composants UI réutilisables**
3. **Responsive first (mobile → desktop)**
4. **Accessibilité (ARIA labels, keyboard navigation)**
5. **Performance (lazy loading, memoization)**
6. **Sécurité (validation inputs, XSS protection)**

---

**🎉 Frontend Abhar Santé Maroc - Prêt pour le développement!**

Pour toute question, consulter ce guide ou contacter l'équipe.
