# Script PowerShell pour créer un compte médecin via l'endpoint DEV
# Abhar Santé Maroc

$body = @{
    email = "dr.mehdi@chu-casablanca.ma"
    password = "Medecin2024!"
    tenantId = "chu-casablanca"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "X-Tenant-Id" = "chu-casablanca"
}

Write-Host "Création du compte médecin (DEV)..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/auth/dev/create-medecin" -Method Post -Body $body -Headers $headers
    Write-Host "✅ Compte créé avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "📧 EMAIL:        dr.mehdi@chu-casablanca.ma" -ForegroundColor White
    Write-Host "🔑 MOT DE PASSE: Medecin2024!" -ForegroundColor White
    Write-Host "🏥 ÉTABLISSEMENT: chu-casablanca" -ForegroundColor White
    Write-Host "👨‍⚕️ RÔLE:        Médecin (Généraliste)" -ForegroundColor White
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌐 CONNEXION:" -ForegroundColor Magenta
    Write-Host "   http://localhost:3000/login" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 DASHBOARD:" -ForegroundColor Magenta
    Write-Host "   http://localhost:3000/medecin/dashboard" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "❌ Erreur lors de la création du compte:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    if ($_.ErrorDetails.Message) {
        Write-Host "Détails:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message
    }
}
