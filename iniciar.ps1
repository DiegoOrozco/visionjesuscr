Set-Location -Path $PSScriptRoot
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🚀 INICIANDO AUTOMATIZADOR DE WHATSAPP (Windows PowerShell)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

if (-not (Test-Path "modulo_whatsapp\venv\Scripts\activate.ps1")) {
    Write-Host "📦 Configurando entorno virtual de Python..." -ForegroundColor Yellow
    python -m venv modulo_whatsapp\venv
}

& "modulo_whatsapp\venv\Scripts\Activate.ps1"

python -c "from playwright.async_api import async_playwright" *>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📦 Instalando dependencias (Playwright)..." -ForegroundColor Yellow
    pip install playwright
    python -m playwright install chromium
}

python modulo_whatsapp\bot_auto.py
