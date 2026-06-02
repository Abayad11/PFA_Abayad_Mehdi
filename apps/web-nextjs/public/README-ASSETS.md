# Assets Abhar Santé Maroc

## Logo principal
- **Fichier**: `logo-abhar.png`
- **Usage**: Navbar (toutes les pages)
- **Format**: PNG avec transparence, 512x512px recommandé
- **Couleurs**: Vert/turquoise médical (#10b981)

## Logos modèles IA (4 modèles)

### 1. Segmentation tête fœtale
- **Fichier**: `model-fetal.png`
- **Usage**: Page modèles, cards
- **Icône**: 🧠 ou image échographie fœtale

### 2. Détection phase Alzheimer
- **Fichier**: `model-alzheimer.png`
- **Usage**: Page modèles, cards
- **Icône**: 🧬 ou cerveau avec zones colorées

### 3. Détection cancer
- **Fichier**: `model-cancer.png`
- **Usage**: Page modèles, cards
- **Icône**: 🎗️ ou cellules

### 4. Prédiction diabète
- **Fichier**: `model-diabetes.png`
- **Usage**: Page modèles, cards
- **Icône**: 💉 ou graphique glycémie

## Vidéos background

### Login
- **Fichier**: `vid_background.mp4` (déjà en place)
- **Alternative**: `bg-login.mp4`
- **Format**: MP4, H.264, max 5MB, loop

### Dashboards
- **Médecin**: `bg-medecin.mp4` ou `bg-medecin.jpg`
- **Patient**: `bg-patient.mp4` ou `bg-patient.jpg`
- **Chercheur**: `bg-chercheur.mp4` ou `bg-chercheur.jpg`

### Pages inférence
- **Modèles**: `bg-models.mp4`
- **Résultats**: `bg-results.mp4`

### Pages assistant LLM
- **Chat**: `bg-chat.mp4`

## Favicon
- **Fichier**: `favicon.ico`
- **Format**: ICO multi-résolution (16, 32, 64, 128, 256px)
- **Source**: Logo Abhar simplifié

## Palette de couleurs (Tailwind)

```js
brand: {
  DEFAULT: '#10b981',  // Vert principal
  dark: '#059669',     // Vert foncé
  light: '#34d399',    // Vert clair
  50-900: dégradés
}

gray: {
  DEFAULT: '#4b5563',  // Gris principal
  600: '#4b5563',      // Gris foncé
  700: '#374151',      // Gris très foncé
  50-900: dégradés
}
```

## Instructions

1. Placez tous les fichiers dans `apps/web-nextjs/public/`
2. Respectez les noms de fichiers exacts
3. Optimisez les images (compression sans perte)
4. Vidéos: max 5MB, format MP4, codec H.264
5. Redémarrez le conteneur web après ajout: `docker compose restart web-nextjs`
