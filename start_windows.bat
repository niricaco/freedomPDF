@echo off
setlocal
title FreedomPDF Inditasa / Starting FreedomPDF

echo.
echo ===================================================
echo   FreedomPDF - Elinditas / Startup
echo ===================================================
echo.

:: Check for Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [HU] A Node.js nincs telepitve.
    echo      Kerlek toltsd le es telepitsd a kovetkezo oldalrol (LTS verzio ajanlott):
    echo      https://nodejs.org/
    echo.
    echo [EN] Node.js is not installed.
    echo      Please download and install it from (LTS version recommended):
    echo      https://nodejs.org/
    echo.
    echo [HU] Megnyitom a letoltesi oldalt...
    echo [EN] Opening download page...
    timeout /t 5
    start https://nodejs.org/
    echo.
    echo [HU] Ha feltelepited, futtasd ujra ezt a fajlt.
    echo [EN] After installation, run this file again.
    pause
    exit /b
)

echo [HU] Node.js ellenorzes rendben.
echo [EN] Node.js check passed.
echo.

:: Install dependencies
if not exist "node_modules" (
    echo [HU] Elso inditas: fuggosegek telepitese... (ez eltarthat egy darabig)
    echo [EN] First run: installing dependencies... (this may take a while)
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [HU] HIBA tortent a telepites soran.
        echo [EN] ERROR during installation.
        pause
        exit /b
    )
) else (
    echo [HU] Fuggosegek mar telepitve vannak.
    echo [EN] Dependencies are already installed.
)

echo.
echo [HU] A szerver inditasa... Ne zard be ezt az ablakot!
echo [EN] Starting server... Do not close this window!
echo.
echo [HU] Ha a szerver elindult, a bongeszo automatikusan megnyilik.
echo [EN] Once the server starts, the browser will open automatically.
echo.

:: Open browser in background after a slight delay (assuming server takes a few secs)
start "" cmd /c "timeout /t 10 >nul && start http://localhost:3000"

:: Start the server
call npm run dev

pause
