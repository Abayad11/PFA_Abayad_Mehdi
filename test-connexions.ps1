# Script de test automatique des connexions
# Auteurs: Mehdi Abayad & Zahra Zhar
# Projet: Abhar Santé Maroc

Write-Host "`n🧪 TEST AUTOMATIQUE DES CONNEXIONS`n" -ForegroundColor Cyan

$API_URL = "http://localhost:4000"
$TENANT_ID = "chu-casablanca"

# Fonction pour tester une connexion
function Test-Login {
    param(
        [string]$Username,
        [string]$Password,
        [string]$Role
    )
    
    Write-Host "🔐 Test connexion $Role..." -ForegroundColor Yellow
    
    $body = @{
        username = $Username
        password = $Password
        tenant_id = $TENANT_ID
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest `
            -Uri "$API_URL/api/auth/login/" `
            -Method POST `
            -Headers @{
                'Content-Type' = 'application/json'
                'X-Tenant-Id' = $TENANT_ID
            } `
            -Body $body `
            -ErrorAction Stop
        
        $data = $response.Content | ConvertFrom-Json
        
        if ($data.tokens.access -and $data.user.role -eq $Role) {
            Write-Host "   ✅ Connexion $Role réussie!" -ForegroundColor Green
            Write-Host "   📧 Email: $($data.user.email)" -ForegroundColor Gray
            Write-Host "   🔑 Token: $($data.tokens.access.Substring(0, 20))..." -ForegroundColor Gray
            return $true
        } else {
            Write-Host "   ❌ Erreur: Rôle incorrect" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "   ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Fonction pour tester la vérification du token
function Test-TokenVerify {
    param([string]$Token)
    
    Write-Host "`n🔍 Test vérification token..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest `
            -Uri "$API_URL/api/auth/verify/" `
            -Method GET `
            -Headers @{
                'Authorization' = "Bearer $Token"
                'X-Tenant-Id' = $TENANT_ID
            } `
            -ErrorAction Stop
        
        $data = $response.Content | ConvertFrom-Json
        
        if ($data.valid) {
            Write-Host "   ✅ Token valide!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "   ❌ Token invalide" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "   ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Tests
$results = @{
    patient = $false
    medecin = $false
    chercheur = $false
    admin = $false
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Test Patient
$results.patient = Test-Login -Username "patient" -Password "patient123" -Role "patient"
Start-Sleep -Seconds 1

# Test Médecin
$results.medecin = Test-Login -Username "medecin" -Password "medecin123" -Role "medecin"
Start-Sleep -Seconds 1

# Test Chercheur
$results.chercheur = Test-Login -Username "chercheur" -Password "chercheur123" -Role "chercheur"
Start-Sleep -Seconds 1

# Test Admin
$results.admin = Test-Login -Username "admin" -Password "admin123" -Role "admin"

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Test de vérification de token (avec le dernier token admin)
$body = @{
    username = "admin"
    password = "admin123"
    tenant_id = $TENANT_ID
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "$API_URL/api/auth/login/" `
    -Method POST `
    -Headers @{'Content-Type'='application/json'; 'X-Tenant-Id'='chu-casablanca'} `
    -Body $body

$data = $response.Content | ConvertFrom-Json
Test-TokenVerify -Token $data.tokens.access

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Résumé
Write-Host "`n📊 RÉSUMÉ DES TESTS:`n" -ForegroundColor Cyan

$total = 0
$success = 0

foreach ($key in $results.Keys) {
    $total++
    $status = if ($results[$key]) { "✅ PASS"; $success++ } else { "❌ FAIL" }
    $color = if ($results[$key]) { "Green" } else { "Red" }
    Write-Host "   $status - Connexion $key" -ForegroundColor $color
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "`n🎯 Score: $success/$total tests réussis" -ForegroundColor $(if ($success -eq $total) { "Green" } else { "Yellow" })

if ($success -eq $total) {
    Write-Host "`n🎉 TOUS LES TESTS SONT PASSÉS!`n" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Certains tests ont échoué. Vérifiez les logs ci-dessus.`n" -ForegroundColor Yellow
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
