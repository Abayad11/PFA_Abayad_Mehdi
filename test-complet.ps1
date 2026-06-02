# 🧪 Script de Test Automatique - Abhar Santé Maroc
# Teste toutes les fonctionnalités de l'application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST COMPLET - ABHAR SANTÉ MAROC" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Variables globales
$API_URL = "http://localhost:4000"
$FRONTEND_URL = "http://localhost:3000"
$TENANT_ID = "chu-casablanca"
$testsPassed = 0
$testsFailed = 0

# Fonction pour afficher les résultats
function Test-Result {
    param($testName, $success)
    if ($success) {
        Write-Host "✅ $testName" -ForegroundColor Green
        $script:testsPassed++
    } else {
        Write-Host "❌ $testName" -ForegroundColor Red
        $script:testsFailed++
    }
}

# ============================================
# ÉTAPE 1: Vérifier les conteneurs
# ============================================
Write-Host "`n📦 ÉTAPE 1: Vérification des conteneurs Docker" -ForegroundColor Yellow
Write-Host "--------------------------------------------"

try {
    $containers = docker ps --format "{{.Names}}" | Select-String "projet-federateur"
    $requiredContainers = @(
        "projet-federateur-backend-django-1",
        "projet-federateur-web-nextjs-1",
        "projet-federateur-postgres-1"
    )
    
    $allRunning = $true
    foreach ($container in $requiredContainers) {
        if ($containers -match $container) {
            Test-Result "Conteneur $container en cours d'exécution" $true
        } else {
            Test-Result "Conteneur $container en cours d'exécution" $false
            $allRunning = $false
        }
    }
} catch {
    Test-Result "Vérification des conteneurs" $false
    Write-Host "Erreur: $_" -ForegroundColor Red
}

# ============================================
# ÉTAPE 2: Test Backend - Endpoints de base
# ============================================
Write-Host "`n🔌 ÉTAPE 2: Test des endpoints Backend" -ForegroundColor Yellow
Write-Host "--------------------------------------------"

# Test 2.1: Health check
try {
    $response = Invoke-WebRequest -Uri "$API_URL/admin/" -Method GET -TimeoutSec 5
    Test-Result "Backend accessible (admin)" ($response.StatusCode -eq 200)
} catch {
    Test-Result "Backend accessible" $false
}

# Test 2.2: Login Patient
Write-Host "`n🔐 Test Login Patient..." -ForegroundColor Cyan
try {
    $body = @{
        username = 'patient'
        password = 'patient123'
        tenant_id = $TENANT_ID
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$API_URL/api/auth/login/" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -Headers @{"X-Tenant-Id"=$TENANT_ID}
    
    $data = $response.Content | ConvertFrom-Json
    $patientToken = $data.tokens.access
    
    Test-Result "Login Patient (Status 200)" ($response.StatusCode -eq 200)
    Test-Result "Token JWT reçu" ($null -ne $patientToken)
    
    Write-Host "   Token: $($patientToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Test-Result "Login Patient" $false
    Write-Host "   Erreur: $_" -ForegroundColor Red
}

# Test 2.3: Login Médecin
Write-Host "`n👨‍⚕️ Test Login Médecin..." -ForegroundColor Cyan
try {
    $body = @{
        username = 'medecin'
        password = 'medecin123'
        tenant_id = $TENANT_ID
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$API_URL/api/auth/login/" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -Headers @{"X-Tenant-Id"=$TENANT_ID}
    
    $data = $response.Content | ConvertFrom-Json
    $medecinToken = $data.tokens.access
    
    Test-Result "Login Médecin (Status 200)" ($response.StatusCode -eq 200)
    Test-Result "Token JWT reçu" ($null -ne $medecinToken)
} catch {
    Test-Result "Login Médecin" $false
}

# Test 2.4: Login Chercheur
Write-Host "`n🔬 Test Login Chercheur..." -ForegroundColor Cyan
try {
    $body = @{
        username = 'chercheur'
        password = 'chercheur123'
        tenant_id = $TENANT_ID
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$API_URL/api/auth/login/" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -Headers @{"X-Tenant-Id"=$TENANT_ID}
    
    Test-Result "Login Chercheur (Status 200)" ($response.StatusCode -eq 200)
} catch {
    Test-Result "Login Chercheur" $false
}

# ============================================
# ÉTAPE 3: Test API avec authentification
# ============================================
Write-Host "`n🔒 ÉTAPE 3: Test API avec authentification" -ForegroundColor Yellow
Write-Host "--------------------------------------------"

if ($patientToken) {
    $headers = @{
        "Authorization" = "Bearer $patientToken"
        "X-Tenant-Id" = $TENANT_ID
    }
    
    # Test 3.1: Récupérer les dossiers
    try {
        $response = Invoke-WebRequest -Uri "$API_URL/api/dossiers/" -Headers $headers
        Test-Result "GET /api/dossiers/ (Status 200)" ($response.StatusCode -eq 200)
        
        $dossiers = $response.Content | ConvertFrom-Json
        Write-Host "   Nombre de dossiers: $($dossiers.Count)" -ForegroundColor Gray
    } catch {
        Test-Result "GET /api/dossiers/" $false
    }
    
    # Test 3.2: Récupérer les consultations
    try {
        $response = Invoke-WebRequest -Uri "$API_URL/api/consultations/" -Headers $headers
        Test-Result "GET /api/consultations/ (Status 200)" ($response.StatusCode -eq 200)
    } catch {
        Test-Result "GET /api/consultations/" $false
    }
    
    # Test 3.3: Récupérer les conversations
    try {
        $response = Invoke-WebRequest -Uri "$API_URL/api/messagerie/conversations/" -Headers $headers
        Test-Result "GET /api/messagerie/conversations/ (Status 200)" ($response.StatusCode -eq 200)
    } catch {
        Test-Result "GET /api/messagerie/conversations/" $false
    }
}

# ============================================
# ÉTAPE 4: Test Frontend
# ============================================
Write-Host "`n🌐 ÉTAPE 4: Test Frontend" -ForegroundColor Yellow
Write-Host "--------------------------------------------"

# Test 4.1: Page d'accueil
try {
    $response = Invoke-WebRequest -Uri $FRONTEND_URL -TimeoutSec 10
    Test-Result "Page d'accueil accessible" ($response.StatusCode -eq 200)
    Test-Result "Contient 'Abhar Santé'" ($response.Content -match "Abhar")
} catch {
    Test-Result "Page d'accueil accessible" $false
}

# Test 4.2: Page de login
try {
    $response = Invoke-WebRequest -Uri "$FRONTEND_URL/auth/login" -TimeoutSec 10
    Test-Result "Page de login accessible" ($response.StatusCode -eq 200)
} catch {
    Test-Result "Page de login accessible" $false
}

# ============================================
# ÉTAPE 5: Test Microservices IA
# ============================================
Write-Host "`n🤖 ÉTAPE 5: Test Microservices IA" -ForegroundColor Yellow
Write-Host "--------------------------------------------"

# Test 5.1: LLM Assistant
try {
    $body = @{
        message = "Test de connexion"
        context = "patient"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" `
        -Method GET `
        -TimeoutSec 5
    
    Test-Result "LLM Assistant accessible" ($response.StatusCode -eq 200)
} catch {
    Test-Result "LLM Assistant accessible" $false
}

# Test 5.2: AI Inference
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8001/health" `
        -Method GET `
        -TimeoutSec 5
    
    Test-Result "AI Inference accessible" ($response.StatusCode -eq 200)
} catch {
    Test-Result "AI Inference accessible" $false
}

# ============================================
# ÉTAPE 6: Test Base de Données
# ============================================
Write-Host "`n🗄️ ÉTAPE 6: Test Base de Données" -ForegroundColor Yellow
Write-Host "--------------------------------------------"

try {
    $result = docker exec projet-federateur-postgres-1 psql -U postgres -d abhar -c "SELECT COUNT(*) FROM users_customuser;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Test-Result "PostgreSQL accessible" $true
        Test-Result "Table users_customuser existe" $true
        Write-Host "   $result" -ForegroundColor Gray
    } else {
        Test-Result "PostgreSQL accessible" $false
    }
} catch {
    Test-Result "PostgreSQL accessible" $false
}

# ============================================
# RÉSUMÉ FINAL
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RÉSUMÉ DES TESTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$totalTests = $testsPassed + $testsFailed
$successRate = if ($totalTests -gt 0) { [math]::Round(($testsPassed / $totalTests) * 100, 2) } else { 0 }

Write-Host "`nTests réussis: $testsPassed" -ForegroundColor Green
Write-Host "Tests échoués: $testsFailed" -ForegroundColor Red
Write-Host "Total: $totalTests tests" -ForegroundColor White
Write-Host "Taux de réussite: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 50) { "Yellow" } else { "Red" })

if ($testsFailed -eq 0) {
    Write-Host "`n🎉 Tous les tests sont passés avec succès!" -ForegroundColor Green
    Write-Host "✅ L'application est prête à être utilisée!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Certains tests ont échoué." -ForegroundColor Yellow
    Write-Host "Consultez GUIDE_TEST_COMPLET.md pour plus de détails." -ForegroundColor Yellow
}

Write-Host "`nProchaines etapes:" -ForegroundColor Cyan
Write-Host "1. Ouvrir http://localhost:3000 dans votre navigateur"
Write-Host "2. Se connecter avec: patient@chu-casablanca.ma / patient123"
Write-Host "3. Explorer les fonctionnalites!"
Write-Host ""
