# Script de test pour créer un compte et se connecter

# Désactiver la vérification SSL pour le développement
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

Write-Host "=== TEST CREATION DE COMPTE ===" -ForegroundColor Cyan

# 1. Créer un compte Patient
$signupBody = @{
    email = "ahmed.benali@chu-casablanca.ma"
    password = "TestPatient2025!"
    firstName = "Ahmed"
    lastName = "Benali"
    role = "PATIENT"
    tenantId = "chu-casablanca"
    birthDate = "1990-05-15"
} | ConvertTo-Json

Write-Host "`n1. Creation du compte..." -ForegroundColor Yellow
try {
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/register" `
        -Method POST `
        -Body $signupBody `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✓ Compte cree avec succes!" -ForegroundColor Green
    Write-Host ($signupResponse | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "✗ Erreur lors de la creation:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host $_.ErrorDetails.Message
    exit 1
}

# 2. Se connecter avec le compte créé
Write-Host "`n2. Connexion avec le compte..." -ForegroundColor Yellow
$loginBody = @{
    email = "ahmed.benali@chu-casablanca.ma"
    password = "TestPatient2025!"
    tenantId = "chu-casablanca"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:4000/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "✓ Connexion reussie!" -ForegroundColor Green
    Write-Host ($loginResponse | ConvertTo-Json -Depth 10)
    
    # Afficher les identifiants
    Write-Host "`n=== IDENTIFIANTS DU COMPTE ===" -ForegroundColor Cyan
    Write-Host "Email: ahmed.benali@chu-casablanca.ma" -ForegroundColor White
    Write-Host "Mot de passe: TestPatient2025!" -ForegroundColor White
    Write-Host "Etablissement: chu-casablanca" -ForegroundColor White
    Write-Host "Role: PATIENT" -ForegroundColor White
    
} catch {
    Write-Host "✗ Erreur lors de la connexion:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host $_.ErrorDetails.Message
    exit 1
}

Write-Host "`n=== TEST TERMINE AVEC SUCCES ===" -ForegroundColor Green
