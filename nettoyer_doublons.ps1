# Script de nettoyage des pages doublons
# Auteurs: Mehdi Abayad & Zahra Zhar
# Projet: Abhar Santé Maroc

Write-Host "`n🧹 NETTOYAGE DES PAGES DOUBLONS`n" -ForegroundColor Cyan

$baseDir = "apps/web-nextjs/pages"

# Liste des fichiers à supprimer
$filesToDelete = @(
    # Page login obsolète
    "$baseDir/login.tsx",
    
    # Pages login par rôle (obsolètes)
    "$baseDir/auth/login/patient.tsx",
    "$baseDir/auth/login/medecin.tsx",
    "$baseDir/auth/login/chercheur.tsx",
    "$baseDir/auth/login/admin_tenant.tsx",
    
    # Dashboards doublons
    "$baseDir/dashboard/patient.tsx",
    "$baseDir/dashboard/medecin.tsx",
    "$baseDir/dashboard/chercheur.tsx",
    "$baseDir/dashboard/admin.tsx"
)

Write-Host "📋 Fichiers à supprimer:`n" -ForegroundColor Yellow

$deletedCount = 0
$notFoundCount = 0

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Write-Host "  ❌ $file" -ForegroundColor Red
        try {
            Remove-Item $file -Force
            $deletedCount++
            Write-Host "     ✅ Supprimé!" -ForegroundColor Green
        } catch {
            Write-Host "     ⚠️ Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ⚠️ $file (n'existe pas)" -ForegroundColor Gray
        $notFoundCount++
    }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Supprimer les dossiers vides
$emptyDirs = @(
    "$baseDir/auth/login",
    "$baseDir/dashboard"
)

foreach ($dir in $emptyDirs) {
    if (Test-Path $dir) {
        $items = Get-ChildItem -Path $dir -Force
        if ($items.Count -eq 0) {
            Write-Host "`n📁 Suppression dossier vide: $dir" -ForegroundColor Yellow
            Remove-Item $dir -Force
            Write-Host "   ✅ Dossier supprimé!" -ForegroundColor Green
        }
    }
}

Write-Host "`n📊 RÉSUMÉ:" -ForegroundColor Cyan
Write-Host "  ✅ Fichiers supprimés: $deletedCount" -ForegroundColor Green
Write-Host "  ⚠️ Fichiers non trouvés: $notFoundCount" -ForegroundColor Yellow

Write-Host "`n🎉 NETTOYAGE TERMINÉ!`n" -ForegroundColor Green
