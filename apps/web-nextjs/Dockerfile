# Web Next.js Dockerfile - Mode Développement
FROM node:20-alpine
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Installer les dépendances
RUN if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
    else npm i; fi

# Copier tout le code source
COPY . .

# Variables d'environnement
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NODE_ENV=development

# Exposer le port
EXPOSE 3000

# Démarrer en mode développement (pas de build SSG)
CMD ["npm", "run", "dev"]
