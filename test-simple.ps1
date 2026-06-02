# Test simple des connexions
Write-Host "`n=== TEST CONNEXIONS ABHAR SANTE MAROC ===`n" -ForegroundColor Cyan

$API_URL = "http://localhost:4000"

# Test Patient
Write-Host "Test 1: Connexion Patient..." -ForegroundColor Yellow
$body1 = '{"username":"patient","password":"patient123","tenant_id":"chu-casablanca"}'
try {
    $r1 = Invoke-WebRequest -Uri "$API_URL/api/auth/login/" -Method POST -ContentType "application/json" -Body $body1
    $d1 = $r1.Content | ConvertFrom-Json
    if ($d1.user.role -eq "patient") {
        Write-Host "  OK - Patient connecte!" -ForegroundColor Green
    }
} catch {
    Write-Host "  ERREUR" -ForegroundColor Red
}

# Test Medecin
Write-Host "`nTest 2: Connexion Medecin..." -ForegroundColor Yellow
$body2 = '{"username":"medecin","password":"medecin123","tenant_id":"chu-casablanca"}'
try {
    $r2 = Invoke-WebRequest -Uri "$API_URL/api/auth/login/" -Method POST -ContentType "application/json" -Body $body2
    $d2 = $r2.Content | ConvertFrom-Json
    if ($d2.user.role -eq "medecin") {
        Write-Host "  OK - Medecin connecte!" -ForegroundColor Green
    }
} catch {
    Write-Host "  ERREUR" -ForegroundColor Red
}

# Test Chercheur
Write-Host "`nTest 3: Connexion Chercheur..." -ForegroundColor Yellow
$body3 = '{"username":"chercheur","password":"chercheur123","tenant_id":"chu-casablanca"}'
try {
    $r3 = Invoke-WebRequest -Uri "$API_URL/api/auth/login/" -Method POST -ContentType "application/json" -Body $body3
    $d3 = $r3.Content | ConvertFrom-Json
    if ($d3.user.role -eq "chercheur") {
        Write-Host "  OK - Chercheur connecte!" -ForegroundColor Green
    }
} catch {
    Write-Host "  ERREUR" -ForegroundColor Red
}

# Test Admin
Write-Host "`nTest 4: Connexion Admin..." -ForegroundColor Yellow
$body4 = '{"username":"admin","password":"admin123","tenant_id":"chu-casablanca"}'
try {
    $r4 = Invoke-WebRequest -Uri "$API_URL/api/auth/login/" -Method POST -ContentType "application/json" -Body $body4
    $d4 = $r4.Content | ConvertFrom-Json
    if ($d4.user.role -eq "admin") {
        Write-Host "  OK - Admin connecte!" -ForegroundColor Green
    }
} catch {
    Write-Host "  ERREUR" -ForegroundColor Red
}

Write-Host "`n=== TESTS TERMINES ===`n" -ForegroundColor Cyan
