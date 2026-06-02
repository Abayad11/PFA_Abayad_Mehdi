#!/bin/bash

# Script de démarrage pour le backend Django
echo "🚀 Démarrage du backend Abhar Santé Maroc..."

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente de PostgreSQL..."
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  echo "PostgreSQL n'est pas encore prêt - attente..."
  sleep 2
done
echo "✅ PostgreSQL est prêt!"

# Supprimer l'ancienne base SQLite si elle existe
if [ -f "db.sqlite3" ]; then
    echo "🗑️  Suppression de l'ancienne base SQLite..."
    rm -f db.sqlite3
fi

# Supprimer les anciennes migrations si elles existent
echo "🧹 Nettoyage des anciennes migrations..."
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

# Créer les nouvelles migrations
echo "📦 Création des migrations..."
python manage.py makemigrations users
python manage.py makemigrations

# Appliquer les migrations
echo "🔄 Application des migrations..."
python manage.py migrate

# Créer un superutilisateur par défaut et des utilisateurs de test
echo "👤 Création des utilisateurs par défaut..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()

# Créer le superutilisateur admin
try:
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@abhar.ma',
            password='admin123',
            tenant_id='chu-casablanca',
            role='admin',
            first_name='Admin',
            last_name='System'
        )
        print('✅ Superutilisateur créé: admin / admin123')
    else:
        print('ℹ️  Superutilisateur existe déjà')
except Exception as e:
    print(f'⚠️  Erreur lors de la création du superutilisateur: {e}')

# Créer un patient de test
try:
    if not User.objects.filter(username='patient').exists():
        User.objects.create_user(
            username='patient',
            email='patient@chu-casablanca.ma',
            password='patient123',
            tenant_id='chu-casablanca',
            role='patient',
            first_name='Patient',
            last_name='Test'
        )
        print('✅ Patient de test créé: patient / patient123')
    else:
        print('ℹ️  Patient de test existe déjà')
except Exception as e:
    print(f'⚠️  Erreur lors de la création du patient: {e}')

# Créer un médecin de test
try:
    if not User.objects.filter(username='medecin').exists():
        User.objects.create_user(
            username='medecin',
            email='medecin@chu-casablanca.ma',
            password='medecin123',
            tenant_id='chu-casablanca',
            role='medecin',
            first_name='Dr.',
            last_name='Médecin'
        )
        print('✅ Médecin de test créé: medecin / medecin123')
    else:
        print('ℹ️  Médecin de test existe déjà')
except Exception as e:
    print(f'⚠️  Erreur lors de la création du médecin: {e}')

# Créer un chercheur de test
try:
    if not User.objects.filter(username='chercheur').exists():
        User.objects.create_user(
            username='chercheur',
            email='chercheur@chu-casablanca.ma',
            password='chercheur123',
            tenant_id='chu-casablanca',
            role='chercheur',
            first_name='Chercheur',
            last_name='Test'
        )
        print('✅ Chercheur de test créé: chercheur / chercheur123')
    else:
        print('ℹ️  Chercheur de test existe déjà')
except Exception as e:
    print(f'⚠️  Erreur lors de la création du chercheur: {e}')
EOF

# Lancer le serveur
echo "🌐 Lancement du serveur sur 0.0.0.0:4000..."
python manage.py runserver 0.0.0.0:4000
