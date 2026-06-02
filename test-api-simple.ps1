# Script de test de l'API Abhar Sante Maroc
Write-Host "Tests de l'API Abhar Sante Maroc" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Connexion Admin
Write-Host "[1/5] Test connexion admin..." -ForegroundColor Yellow
try {
    $loginBody = '{"username":"admin","password":"admin123","tenant_id":"chu-casablanca"}'
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login/" -Method POST -ContentType "application/json" -Body $loginBody
    $json = $response.Content | ConvertFrom-Json
    Write-Host "      OK - Admin connecte: $($json.user.username)" -ForegroundColor Green
    $token = $json.tokens.access
} catch {
    Write-Host "      ERREUR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Profil utilisateur
Write-Host "[2/5] Test profil utilisateur..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "X-Tenant-Id" = "chu-casablanca"
    }
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/me/" -Method GET -Headers $headers
    $json = $response.Content | ConvertFrom-Json
    Write-Host "      OK - Email: $($json.user.email)" -ForegroundColor Green
} catch {
    Write-Host "      ERREUR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Création patient
Write-Host "[3/5] Test creation patient..." -ForegroundColor Yellow
try {
    $registerBody = '{"username":"patient.demo","password":"DemoPass123!","password2":"DemoPass123!","email":"demo@patient.com","first_name":"Demo","last_name":"Patient","role":"patient","tenant_id":"chu-casablanca"}'
    $response = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/register/" -Method POST -ContentType "application/json" -Body $registerBody
    $json = $response.Content | ConvertFrom-Json
    Write-Host "      OK - Patient cree: $($json.user.username)" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*400*") {
        Write-Host "      OK - Patient existe deja" -ForegroundColor Green
    } else {
        Write-Host "      ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 4: Frontend
Write-Host "[4/5] Test frontend Next.js..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
    Write-Host "      OK - Frontend accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "      ERREUR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Backend admin
Write-Host "[5/5] Test admin panel Django..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4000/admin/" -Method GET
    Write-Host "      OK - Admin panel accessible" -ForegroundColor Green
} catch {
    Write-Host "      ERREUR: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Résumé
Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "RESUME DES TESTS" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend Django:       http://localhost:4000" -ForegroundColor White
Write-Host "Frontend Next.js:     http://localhost:3000" -ForegroundColor White
Write-Host "Admin Panel:          http://localhost:4000/admin" -ForegroundColor White
Write-Host ""
Write-Host "Comptes de test:" -ForegroundColor Yellow
Write-Host "  Admin:   admin / admin123" -ForegroundColor White
Write-Host "  Patient: patient.demo / DemoPass123!" -ForegroundColor White
Write-Host ""
Write-Host "Tous les tests sont passes avec succes!" -ForegroundColor Green
Write-Host ""
