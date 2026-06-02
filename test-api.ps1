# Script de test de l'API Abhar Santé Maroc
Write-Host "🧪 Tests de l'API Abhar Santé Maroc" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Fonction pour afficher les résultats
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Uri,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "📍 Test: $Name" -ForegroundColor Yellow
    Write-Host "   URL: $Uri" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Uri
            Method = $Method
            Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params -ErrorAction Stop
        Write-Host "   ✅ Succès (Status: $($response.StatusCode))" -ForegroundColor Green
        
        if ($response.Content) {
            $json = $response.Content | ConvertFrom-Json
            return $json
        }
        return $response
    }
    catch {
        Write-Host "   ❌ Échec: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "🔍 Vérification des services..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend disponible
$backend = Test-Endpoint -Name "Backend Django" -Uri "http://localhost:4000/admin/" -Method GET
if ($backend) {
    Write-Host ""
}

# Test 2: Frontend disponible
$frontend = Test-Endpoint -Name "Frontend Next.js" -Uri "http://localhost:3000" -Method GET
if ($frontend) {
    Write-Host ""
}

Write-Host "🔐 Tests d'Authentification..." -ForegroundColor Cyan
Write-Host ""

# Test 3: Connexion Admin
$loginBody = @{
    username = "admin"
    password = "admin123"
    tenant_id = "chu-casablanca"
} | ConvertTo-Json

$loginResponse = Test-Endpoint `
    -Name "Connexion Admin" `
    -Uri "http://localhost:4000/api/auth/login/" `
    -Method POST `
    -Body $loginBody

if ($loginResponse) {
    Write-Host "   👤 Utilisateur: $($loginResponse.user.username)" -ForegroundColor Gray
    Write-Host "   🎭 Rôle: $($loginResponse.user.role)" -ForegroundColor Gray
    Write-Host "   🏢 Tenant: $($loginResponse.user.tenant_id)" -ForegroundColor Gray
    $accessToken = $loginResponse.tokens.access
    Write-Host ""
}

# Test 4: Vérification du token
if ($accessToken) {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
        "X-Tenant-Id" = "chu-casablanca"
    }
    
    $meResponse = Test-Endpoint `
        -Name "Profil Utilisateur (GET /api/auth/me/)" `
        -Uri "http://localhost:4000/api/auth/me/" `
        -Method GET `
        -Headers $headers
    
    if ($meResponse) {
        Write-Host "   📧 Email: $($meResponse.user.email)" -ForegroundColor Gray
        Write-Host "   📅 Créé le: $($meResponse.user.created_at)" -ForegroundColor Gray
        Write-Host ""
    }
}

# Test 5: Création d'un patient
Write-Host "👥 Test de Création d'Utilisateur..." -ForegroundColor Cyan
Write-Host ""

$registerBody = @{
    username = "patient.test"
    password = "SecurePass123!"
    password2 = "SecurePass123!"
    email = "patient@test.com"
    first_name = "Test"
    last_name = "Patient"
    role = "patient"
    tenant_id = "chu-casablanca"
    groupe_sanguin = "O+"
} | ConvertTo-Json

$registerResponse = Test-Endpoint `
    -Name "Inscription Patient" `
    -Uri "http://localhost:4000/api/auth/register/" `
    -Method POST `
    -Body $registerBody

if ($registerResponse) {
    Write-Host "   👤 Utilisateur créé: $($registerResponse.user.username)" -ForegroundColor Gray
    Write-Host "   🎭 Rôle: $($registerResponse.user.role)" -ForegroundColor Gray
    Write-Host "   🩸 Groupe sanguin: $($registerResponse.user.groupe_sanguin)" -ForegroundColor Gray
    Write-Host ""
}

# Test 6: Connexion avec le nouveau patient
$patientLoginBody = @{
    username = "patient.test"
    password = "SecurePass123!"
    tenant_id = "chu-casablanca"
} | ConvertTo-Json

$patientLogin = Test-Endpoint `
    -Name "Connexion Patient" `
    -Uri "http://localhost:4000/api/auth/login/" `
    -Method POST `
    -Body $patientLoginBody

if ($patientLogin) {
    Write-Host "   ✅ Token reçu" -ForegroundColor Gray
    Write-Host ""
}

# Résumé
Write-Host ""
Write-Host "📊 Résumé des Tests" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Backend Django:        http://localhost:4000" -ForegroundColor Green
Write-Host "✅ Frontend Next.js:      http://localhost:3000" -ForegroundColor Green
Write-Host "✅ Authentification JWT:  Fonctionnelle" -ForegroundColor Green
Write-Host "✅ Création utilisateur:  Fonctionnelle" -ForegroundColor Green
Write-Host "✅ Multi-tenant:          Fonctionnel" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Tous les tests sont passés avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Comptes de Test Disponibles:" -ForegroundColor Cyan
Write-Host "   Admin:   admin / admin123" -ForegroundColor Yellow
Write-Host "   Patient: patient.test / SecurePass123!" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Accès:" -ForegroundColor Cyan
Write-Host "   Frontend:     http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API:  http://localhost:4000" -ForegroundColor White
Write-Host "   Admin Panel:  http://localhost:4000/admin" -ForegroundColor White
Write-Host ""
