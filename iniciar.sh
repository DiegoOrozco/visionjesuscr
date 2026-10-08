#!/bin/bash

# ==============================================================================
# Script de Inicio Único para Automatización de WhatsApp (Visión Jesús CRM)
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "======================================================================"
echo "🚀 INICIANDO AUTOMATIZADOR DE WHATSAPP"
echo "======================================================================"
echo "📍 Directorio: $DIR"
echo "======================================================================"

VENV_DIR="$DIR/modulo_whatsapp/venv"

# 1. Crear entorno virtual local si no existe (solución PEP 668 para macOS / Homebrew)
if [ ! -d "$VENV_DIR" ]; then
    echo "📦 Configurando entorno de ejecución aislado para Python (venv)..."
    python3 -m venv "$VENV_DIR"
fi

# 2. Activar entorno virtual
source "$VENV_DIR/bin/activate"

# 3. Instalar Playwright dentro del entorno virtual si no está listo
if ! python -c "from playwright.async_api import async_playwright" &> /dev/null; then
    echo "📦 Instalando dependencias de automatización (Playwright)..."
    pip install --quiet playwright
    python -m playwright install chromium
fi

# 4. Ejecutar el automatizador
python modulo_whatsapp/bot_auto.py
