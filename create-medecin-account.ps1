# Script PowerShell pour créer un compte médecin
# Abhar Santé Maroc

$body = @{
    email = "dr.mehdi@chu-casablanca.ma"
    password = "Medecin2024!"
    role = "MEDECIN"
    tenantId = "chu-casablanca"
    firstName = "Mehdi"
    lastName = "Abayad"
    codeInpe = "INPE-MED-12345"
    speciality = "Cardiologie"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "X-Tenant-Id" = "chu-casablanca"
}

Write-Host "Création du compte médecin..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/auth/register" -Method Post -Body $body -Headers $headers
    Write-Host "✅ Compte créé avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📧 Email: dr.mehdi@chu-casablanca.ma" -ForegroundColor Cyan
    Write-Host "🔑 Mot de passe: Medecin2024!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌐 Connexion: http://localhost:3000/login" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Détails du compte:" -ForegroundColor White
    Write-Host $response | ConvertTo-Json
} catch {
    Write-Host "❌ Erreur lors de la création du compte:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "Détails de l'erreur:" -ForegroundColor Yellow
    Write-Host $_.ErrorDetails.Message
}
