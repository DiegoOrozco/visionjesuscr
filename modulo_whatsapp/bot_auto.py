#!/usr/bin/env python3
"""
Motor de Automatización Autónoma de WhatsApp con Tipeo Humano, Envíos Separados (Imagen + Texto) y Horario de Oficina.
Visión Jesús CRM
"""

import os
import sys
import json
import random
import asyncio
from pathlib import Path
from datetime import datetime, timedelta

# Directorio base
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from spintax import spin
from human_typer import human_type
from utils import (
    normalize_phone_number,
    SentLogger,
    load_numbers_from_file,
    load_message_template
)

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("❌ Falta la librería Playwright. Ejecuta: ./iniciar.sh para auto-instalarla.")
    sys.exit(1)

def load_config():
    config_path = BASE_DIR / "config.json"
    if config_path.exists():
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "delay_min_minutos": 7,
        "delay_max_minutos": 15,
        "mensajes_por_hora": 6,
        "default_country_code": "506",
        "velocidad_tipeo_min_ms": 35,
        "velocidad_tipeo_max_ms": 110,
        "default_numbers_file": "../numeros-formato-whatsapp.txt",
        "default_message_file": "../mensaje-whatsapp.txt",
        "default_image_file": "../media/imagen-whatsapp.jpg",
        "logs_file": "logs/sent_log.json",
        "session_dir": "whatsapp_session",
        "headless": False,
        "solo_horario_oficina": True,
        "hora_inicio": 8,
        "hora_fin": 20
    }

async def is_past_working_hours(config: dict) -> bool:
    if not config.get("solo_horario_oficina", True):
        return False
    hora_inicio = config.get("hora_inicio", 8)
    hora_fin = config.get("hora_fin", 20)
    now = datetime.now()
    return now.hour < hora_inicio or now.hour >= hora_fin

async def check_and_wait_working_hours(config: dict):
    if not config.get("solo_horario_oficina", True):
        return

    hora_inicio = config.get("hora_inicio", 8)
    hora_fin = config.get("hora_fin", 20)

    now = datetime.now()
    if now.hour < hora_inicio or now.hour >= hora_fin:
        if now.hour >= hora_fin:
            target_date = (now + timedelta(days=1)).replace(hour=hora_inicio, minute=0, second=0, microsecond=0)
        else:
            target_date = now.replace(hour=hora_inicio, minute=0, second=0, microsecond=0)

        wait_seconds = max(1.0, (target_date - now).total_seconds())
        horas_espera = wait_seconds / 3600.0
        print(f"\n🌙 Horario permitido finalizado (Hora actual: {now.strftime('%I:%M %p')}).")
        print(f"💤 Pausando envíos durante {horas_espera:.1f} horas...")
        print(f"⏰ Se reanudará automáticamente el {target_date.strftime('%d/%m/%Y a las %I:%M %p')}.\n")

        await asyncio.sleep(wait_seconds)

async def send_text_only(page, text: str, config: dict):
    """
    Envía únicamente texto en WhatsApp Web con tipeo humano y envío limpio por teclado.
    """
    chat_box_selector = "footer div[contenteditable='true'], div[contenteditable='true'][data-tab='10'], div[contenteditable='true']"
    await page.wait_for_selector(chat_box_selector, timeout=30000)

    await human_type(
        page,
        chat_box_selector,
        text,
        min_delay_ms=config.get("velocidad_tipeo_min_ms", 35),
        max_delay_ms=config.get("velocidad_tipeo_max_ms", 110)
    )

    await asyncio.sleep(1.0)
    print("📤 Enviando mensaje de texto...")
    await page.keyboard.press("Enter")
    await asyncio.sleep(2.5)

async def send_image_then_text(page, image_path: str, message_text: str, config: dict):
    """
    1. Adjunta y envía la imagen por separado (sin texto de pie de foto).
    2. Enfoca la vista previa de la imagen para asegurar que se procese el envío.
    3. Escribe y envía el texto completo como un segundo mensaje independiente.
    """
    print("📸 Adjuntando y enviando solo la imagen...")
    file_input_selector = "input[type='file']"
    await page.wait_for_selector(file_input_selector, state="attached", timeout=30000)

    file_inputs = await page.query_selector_all(file_input_selector)
    if file_inputs:
        await file_inputs[0].set_input_files(image_path)
    else:
        raise Exception("No se encontró el campo para adjuntar archivos.")

    # Esperar a que se renderice la ventana de vista previa de la imagen
    await asyncio.sleep(2.5)

    # 1. Dar foco al cuadro dentro del modal de la imagen para que Enter responda correctamente
    editables = await page.query_selector_all("div[contenteditable='true']")
    if editables:
        try:
            await editables[-1].click(force=True)
            await asyncio.sleep(0.5)
        except Exception:
            pass

    print("📤 Enviando imagen...")
    await page.keyboard.press("Enter")
    await asyncio.sleep(1.0)

    # 2. Respaldo: Clic explícito en el botón circular de enviar del modal si no se cerró
    send_selectors = [
        "div[aria-label='Enviar']",
        "div[aria-label='Send']",
        "span[data-icon='send']",
        "span[data-icon='wds-ic-send-filled']",
        "span[data-testid='send']",
        "button[aria-label*='Send']",
        "button[aria-label*='Enviar']"
    ]

    for selector in send_selectors:
        btns = await page.query_selector_all(selector)
        if btns:
            try:
                await btns[-1].click(force=True)
                print("📤 Clic realizado en el botón de la imagen.")
                break
            except Exception:
                continue

    print("⏳ Esperando 4 segundos a que se complete el envío de la imagen...")
    await asyncio.sleep(4.0)

    # PASO 2: Enviar el mensaje de texto por aparte
    if message_text:
        print("✍️ Escribiendo mensaje de texto por separado con tipeo humano...")
        await send_text_only(page, message_text, config)

async def run_bot():
    config = load_config()

    mensajes_por_hora = config.get("mensajes_por_hora", 8)
    intervalo_base = 3600.0 / max(1, mensajes_por_hora)

    country_code = config.get("default_country_code", "506")
    session_dir = BASE_DIR / config.get("session_dir", "whatsapp_session")
    session_dir.mkdir(parents=True, exist_ok=True)

    log_path = BASE_DIR / config.get("logs_file", "logs/sent_log.json")
    logger = SentLogger(str(log_path))

    numbers_path = (BASE_DIR / config.get("default_numbers_file", "../numeros-formato-whatsapp.txt")).resolve()
    message_path = (BASE_DIR / config.get("default_message_file", "../mensaje-whatsapp.txt")).resolve()

    image_rel_path = config.get("default_image_file", "").strip()
    image_path = None
    if image_rel_path:
        possible_image = (BASE_DIR / image_rel_path).resolve()
        if possible_image.exists():
            image_path = str(possible_image)
            print(f"🖼️ Imagen adjunta detectada: {image_path}")
        else:
            print(f"⚠️ Advertencia: La imagen especificada no existe ({possible_image}). Se enviará solo texto.")

    numbers = load_numbers_from_file(str(numbers_path), country_code)
    template = load_message_template(str(message_path))

    if not numbers or not template:
        print("❌ Error: No se encontraron números o la plantilla de mensaje.")
        return

    pending = [n for n in numbers if not logger.is_sent(n)]

    delay_min_min = config.get("delay_min_minutos", 7)
    delay_max_min = config.get("delay_max_minutos", 15)

    print("=" * 65)
    print("🤖 AUTOMATIZADOR AUTÓNOMO DE WHATSAPP WEB")
    print("=" * 65)
    print(f"📊 Ritmo de envío: Pausa aleatoria entre {delay_min_min} y {delay_max_min} minutos entre cada mensaje")
    print(f"⏰ Horario permitido: {config.get('hora_inicio', 8)}:00 AM a {config.get('hora_fin', 20) - 12}:00 PM")
    print(f"👥 Total números en lista: {len(numbers)}")
    print(f"✅ Ya enviados: {len(numbers) - len(pending)}")
    print(f"⏳ Pendientes: {len(pending)}")
    if image_path:
        print(f"🖼️ Modo de Envío: Imagen primero, seguido del mensaje de texto")
    print(f"📂 Carpeta de sesión: {session_dir}")
    print("=" * 65)

    if not pending:
        print("\n🎉 ¡Todos los números han sido procesados!")
        return

    await check_and_wait_working_hours(config)

    print("\n🚀 Iniciando navegador de automatización...")

    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=str(session_dir),
            headless=config.get("headless", False),
            args=["--no-sandbox", "--disable-setuid-sandbox"]
        )

        page = context.pages[0] if context.pages else await context.new_page()

        print("🌐 Cargando WhatsApp Web...")
        try:
            await page.goto("https://web.whatsapp.com", wait_until="domcontentloaded", timeout=60000)
        except Exception as e:
            print(f"⚠️ Advertencia al cargar portada: {e}")

        print("⏳ Verificando sesión activa...")
        try:
            await page.wait_for_selector("div[contenteditable='true'], #pane-side", timeout=120000)
            print("✅ ¡Sesión de WhatsApp Web detectada con éxito!")
        except Exception:
            print("❌ Tiempo de espera agotado para el inicio de sesión.")
            await context.close()
            return

        for idx, phone in enumerate(pending, 1):
            await check_and_wait_working_hours(config)

            print(f"\n------------------------------------------------------------")
            print(f"📌 [{idx}/{len(pending)}] Procesando destinatario: +{phone}")
            print(f"⏰ Hora actual: {datetime.now().strftime('%I:%M:%S %p')}")

            try:
                url = f"https://web.whatsapp.com/send?phone={phone}"
                try:
                    await page.goto(url, wait_until="domcontentloaded", timeout=60000)
                except Exception as goto_err:
                    print(f"⚠️ Advertencia en navegación (+{phone}): {goto_err}. Verificando caja de chat...")

                chat_box_selector = "footer div[contenteditable='true'], div[contenteditable='true'][data-tab='10'], input[type='file']"
                try:
                    await page.wait_for_selector(chat_box_selector, timeout=30000)
                except Exception:
                    invalid_popup = await page.query_selector("div[data-animate-modal-popup='true']")
                    if invalid_popup:
                        print(f"⚠️ El número +{phone} no está registrado en WhatsApp. Omitiendo...")
                        logger.mark_sent(phone, status="invalid", message_preview="Número no válido")
                        continue
                    else:
                        print(f"⚠️ No se pudo cargar el chat para +{phone}. Reintentando...")
                        continue

                mensaje_variado = spin(template)

                if image_path:
                    await send_image_then_text(page, image_path, mensaje_variado, config)
                else:
                    await send_text_only(page, mensaje_variado, config)

                print(f"✅ Proceso completado exitosamente para +{phone}")
                logger.mark_sent(phone, status="sent", message_preview=f"[IMAGEN+TEXTO] {mensaje_variado[:40]}")

            except Exception as e:
                print(f"❌ Error al procesar +{phone}: {e}")

            if idx < len(pending):
                if await is_past_working_hours(config):
                    hora_fin = config.get("hora_fin", 20)
                    hora_fin_fmt = f"{hora_fin - 12}:00 PM" if hora_fin > 12 else f"{hora_fin}:00 AM"
                    print(f"\n🔔 Se completó el envío activo para +{phone}. Como se han alcanzado las {hora_fin_fmt}, los próximos envíos quedan pausados para mañana.")
                    await check_and_wait_working_hours(config)
                else:
                    delay_min_min = config.get("delay_min_minutos", 7)
                    delay_max_min = config.get("delay_max_minutos", 15)
                    espera_actual = random.uniform(delay_min_min * 60.0, delay_max_min * 60.0)
                    minutos_espera = espera_actual / 60.0
                    print(f"\n💤 Pausa aleatoria programada: Esperando {minutos_espera:.1f} minutos ({int(espera_actual)}s) hasta el próximo envío...")
                    await asyncio.sleep(espera_actual)

        print("\n" + "=" * 65)
        print("🎉 ¡TODOS LOS MENSAJES PENDIENTES FUERON ENVIADOS CON ÉXITO!")
        print("=" * 65)
        await context.close()

def main():
    try:
        asyncio.run(run_bot())
    except KeyboardInterrupt:
        print("\n🛑 Proceso detenido por el usuario.")

if __name__ == "__main__":
    main()
