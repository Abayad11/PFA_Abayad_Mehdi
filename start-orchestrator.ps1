# Script de démarrage de l'orchestrateur LLM
# Abhar Santé Maroc - Mehdi Abayad, Zahra Zhar

Write-Host "🚀 Démarrage de l'orchestrateur LLM Abhar Santé Maroc" -ForegroundColor Cyan
Write-Host ""

# Vérification Docker
Write-Host "🔍 Vérification de Docker..." -ForegroundColor Yellow
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker n'est pas installé!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker détecté" -ForegroundColor Green

# Vérification Docker Compose
if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose n'est pas installé!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker Compose détecté" -ForegroundColor Green
Write-Host ""

# Démarrage des services
Write-Host "🐳 Démarrage des services Docker..." -ForegroundColor Yellow
docker-compose -f docker-compose.orchestrator.yml up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Services démarrés avec succès!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "📊 Services disponibles:" -ForegroundColor Cyan
    Write-Host "  • LLM Orchestrator:  http://localhost:8002" -ForegroundColor White
    Write-Host "  • LLM Vision:        http://localhost:8003" -ForegroundColor White
    Write-Host "  • LLM Text:          http://localhost:8004" -ForegroundColor White
    Write-Host "  • LLM FHIR:          http://localhost:8005" -ForegroundColor White
    Write-Host "  • LLM Research:      http://localhost:8006" -ForegroundColor White
    Write-Host "  • PostgreSQL:        localhost:5432" -ForegroundColor White
    Write-Host "  • Redis:             localhost:6379" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🔍 Vérification de la santé des services..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Health checks
    $services = @(
        @{Name="Orchestrator"; Url="http://localhost:8002/health"},
        @{Name="Vision"; Url="http://localhost:8003/health"},
        @{Name="Text"; Url="http://localhost:8004/health"},
        @{Name="FHIR"; Url="http://localhost:8005/health"},
        @{Name="Research"; Url="http://localhost:8006/health"}
    )
    
    foreach ($service in $services) {
        try {
            $response = Invoke-WebRequest -Uri $service.Url -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Host "  ✅ $($service.Name) - OK" -ForegroundColor Green
            }
        } catch {
            Write-Host "  ⚠️  $($service.Name) - En attente..." -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "📖 Consultez le guide complet: GUIDE_ORCHESTRATEUR_LLM.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎉 L'orchestrateur LLM est prêt!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Pour voir les logs:" -ForegroundColor White
    Write-Host "  docker-compose -f docker-compose.orchestrator.yml logs -f" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Pour arrêter les services:" -ForegroundColor White
    Write-Host "  docker-compose -f docker-compose.orchestrator.yml down" -ForegroundColor Gray
    
} else {
    Write-Host "❌ Erreur lors du démarrage des services" -ForegroundColor Red
    exit 1
}
