#!/usr/bin/env python3
"""
Módulo Local de Envío Masivo por WhatsApp (Navegador del Sistema)
Visión Jesús CRM / Eventos
"""

import os
import sys
import json
import time
import random
import argparse
import webbrowser
from pathlib import Path

# Asegurar importación de módulos locales
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from spintax import spin
from utils import (
    normalize_phone_number,
    generate_whatsapp_url,
    SentLogger,
    load_numbers_from_file,
    load_message_template
)

def load_config():
    config_path = BASE_DIR / "config.json"
    if config_path.exists():
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[Warn] No se pudo leer config.json: {e}")
    
    return {
        "default_country_code": "506",
        "delay_seconds_between_opens": 6,
        "default_numbers_file": "../numeros-formato-whatsapp.txt",
        "default_message_file": "../mensaje-whatsapp.txt",
        "logs_file": "logs/sent_log.json",
        "use_whatsapp_web_url": True
    }

def main():
    parser = argparse.ArgumentParser(description="Módulo Local de Envío de Mensajes por WhatsApp Web")
    parser.add_argument("--send", action="store_true", help="Ejecutar el proceso de apertura de chats en el navegador")
    parser.add_argument("--dry-run", action="store_true", help="Probar el proceso y ver mensajes procesados sin abrir el navegador")
    parser.add_argument("--limit", type=int, default=0, help="Límite máximo de mensajes a enviar en esta corrida (0 = sin límite)")
    parser.add_argument("--force", action="store_true", help="Forzar el envío a números que ya fueron marcados como enviados")
    parser.add_argument("--numbers", type=str, default="", help="Ruta personalizada al archivo de números")
    parser.add_argument("--message", type=str, default="", help="Ruta personalizada a la plantilla de mensaje")
    parser.add_argument("--delay", type=float, default=0, help="Segundos de pausa entre aperturas de navegador")
    parser.add_argument("--reset-logs", action="store_true", help="Reiniciar el registro de envíos")

    args = parser.parse_args()
    config = load_config()

    # Archivo de registro
    log_file_path = BASE_DIR / config.get("logs_file", "logs/sent_log.json")
    logger = SentLogger(str(log_file_path))

    if args.reset_logs:
        if log_file_path.exists():
            log_file_path.unlink()
            print(f"✅ Registro de envíos reiniciado ({log_file_path}).")
        else:
            print("ℹ️ No hay registro de envíos previo para reiniciar.")
        if not args.send and not args.dry_run:
            return

    # Determinar rutas de archivos
    numbers_rel_path = args.numbers or config.get("default_numbers_file", "../numeros-formato-whatsapp.txt")
    numbers_file = (BASE_DIR / numbers_rel_path).resolve()

    message_rel_path = args.message or config.get("default_message_file", "../mensaje-whatsapp.txt")
    message_file = (BASE_DIR / message_rel_path).resolve()

    country_code = config.get("default_country_code", "506")
    delay = args.delay if args.delay > 0 else config.get("delay_seconds_between_opens", 6)
    use_web_url = config.get("use_whatsapp_web_url", True)

    print("=" * 60)
    print("🚀 MÓDULO DE ENVÍO DE WHATSAPP (NAVEGADOR DEL SISTEMA)")
    print("=" * 60)
    print(f"📍 Archivo de números: {numbers_file}")
    print(f"📍 Archivo de mensaje: {message_file}")
    print(f"📍 Código país defecto: +{country_code}")
    print(f"📍 Registro de envíos: {log_file_path}")
    print("=" * 60)

    # Cargar datos
    all_numbers = load_numbers_from_file(str(numbers_file), country_code)
    template = load_message_template(str(message_file))

    if not all_numbers:
        print("❌ No se encontraron números para procesar.")
        sys.exit(1)

    if not template:
        print("❌ No se encontró la plantilla de mensaje.")
        sys.exit(1)

    # Filtrar números ya enviados si no es --force
    pending_numbers = []
    for num in all_numbers:
        if args.force or not logger.is_sent(num):
            pending_numbers.append(num)

    total_all = len(all_numbers)
    total_pending = len(pending_numbers)
    already_sent = total_all - total_pending

    print(f"📊 Estado actual:")
    print(f"   • Total números cargados: {total_all}")
    print(f"   • Previamente enviados:   {already_sent}")
    print(f"   • Pendientes de envío:    {total_pending}")

    if total_pending == 0:
        print("\n🎉 ¡Todos los números de la lista ya han recibido el mensaje!")
        print("💡 Sugerencia: Usa --force si deseas volver a enviar a todos los destinatarios.")
        return

    # Aplicar límite de lote si se especifica
    if args.limit > 0 and len(pending_numbers) > args.limit:
        print(f"⚙️ Aplicando límite de lote: Se procesarán los primeros {args.limit} números de los {total_pending} pendientes.")
        targets = pending_numbers[:args.limit]
    else:
        targets = pending_numbers

    # MODO DRY-RUN (Modo prueba)
    if args.dry_run or not args.send:
        print("\n🧪 --- MODO DE PRUEBA (DRY-RUN) ---")
        print("No se abrirá el navegador ni se enviará ningún mensaje.")
        print("A continuación se muestra un ejemplo de las variaciones Spintax generadas:")
        print("-" * 60)
        
        for idx, phone in enumerate(targets[:5], 1):
            mensaje_generado = spin(template)
            url = generate_whatsapp_url(phone, mensaje_generado, use_web_url)
            print(f"\n[{idx}/{len(targets)}] Destinatario: +{phone}")
            print(f"🔗 URL: {url[:80]}...")
            print(f"📝 Mensaje (Previsualización):\n{mensaje_generado[:180]}...")
            print("-" * 60)
        
        if len(targets) > 5:
            print(f"\n... y {len(targets) - 5} destinatarios más.")

        print("\n💡 Para ejecutar el proceso real y abrir los enlaces en tu navegador, ejecuta:")
        print(f"   python3 {Path(__file__).name} --send")
        return

    # MODO ENVÍO REAL (--send)
    print(f"\n🚀 Iniciando apertura de {len(targets)} chats en tu navegador predeterminado...")
    print("⚠️ Asegúrate de tener WhatsApp Web ya abierto e iniciado sesión en tu navegador.")
    print("Acepta la apertura de la ventana de diálogo de WhatsApp Web si el navegador lo solicita.\n")

    enviados_count = 0
    for idx, phone in enumerate(targets, 1):
        mensaje_variado = spin(template)
        url = generate_whatsapp_url(phone, mensaje_variado, use_web_url)

        print(f"[{idx}/{len(targets)}] Abriendo chat para +{phone}...")
        webbrowser.open(url)
        
        # Registrar como procesado/enviado
        logger.mark_sent(phone, status="sent", message_preview=mensaje_variado)
        enviados_count += 1

        if idx < len(targets):
            delay_min_sec = config.get("delay_min_minutos", 7) * 60
            delay_max_sec = config.get("delay_max_minutos", 15) * 60
            current_delay = args.delay if args.delay > 0 else random.uniform(delay_min_sec, delay_max_sec)
            print(f"   ⏳ Pausa aleatoria: Esperando {current_delay/60.0:.1f} minutos ({int(current_delay)}s) antes de la siguiente apertura...")
            time.sleep(current_delay)

    print("\n" + "=" * 60)
    print(f"✅ ¡Proceso completado! Se abrieron {enviados_count} enlaces en el navegador.")
    print(f"📁 Registro actualizado en: {log_file_path}")
    print("=" * 60)

if __name__ == "__main__":
    main()
