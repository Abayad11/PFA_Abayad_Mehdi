@echo off
echo.
echo ========================================
echo   Abhar Sante Maroc - Demarrage
echo ========================================
echo.

REM Verifier si Docker est installe
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Docker n'est pas installe ou n'est pas dans le PATH
    echo.
    echo Telechargez Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [OK] Docker est installe
echo.

REM Demarrer Docker Compose
echo Demarrage des services...
echo.
docker compose up --build

pause
