# Script PowerShell pour démarrer Abhar Santé Maroc avec Docker

Write-Host "🚀 Démarrage d'Abhar Santé Maroc..." -ForegroundColor Cyan
Write-Host ""

# Vérifier si Docker est installé
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "📥 Téléchargez Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Vérifier si Docker est démarré
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker n'est pas démarré" -ForegroundColor Red
    Write-Host "🔄 Démarrez Docker Desktop et réessayez" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Docker est prêt" -ForegroundColor Green
Write-Host ""

# Demander si on veut reconstruire les images
$rebuild = Read-Host "Voulez-vous reconstruire les images? (o/N)"
if ($rebuild -eq "o" -or $rebuild -eq "O") {
    Write-Host "🔨 Construction des images Docker..." -ForegroundColor Yellow
    docker compose up --build
} else {
    Write-Host "🚀 Démarrage des services..." -ForegroundColor Yellow
    docker compose up
}
