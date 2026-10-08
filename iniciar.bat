@echo off
chcp 65001 > nul
cls
echo ======================================================================
echo  INICIANDO AUTOMATIZADOR DE WHATSAPP (Windows)
echo ======================================================================

cd /d "%~dp0"

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no esta instalado o no esta agregado al PATH de Windows.
    echo Por favor instala Python 3 desde python.org y marca la casilla "Add Python to PATH".
    pause
    exit /b 1
)

if not exist "modulo_whatsapp\venv\Scripts\activate.bat" (
    echo Configurando entorno virtual de Python en Windows...
    python -m venv modulo_whatsapp\venv
)

call modulo_whatsapp\venv\Scripts\activate.bat

python -c "from playwright.async_api import async_playwright" >nul 2>&1
if errorlevel 1 (
    echo Instalando dependencias de automatizacion (Playwright)...
    pip install playwright
    python -m playwright install chromium
)

echo Ejecutando automatizador...
python modulo_whatsapp\bot_auto.py
pause
