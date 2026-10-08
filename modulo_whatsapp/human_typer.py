import asyncio
import random
import unicodedata

async def human_type(page, selector: str, text: str, min_delay_ms: int = 35, max_delay_ms: int = 110):
    """
    Escribe texto letra por letra simulando el comportamiento y ritmo de tipeo de una persona real.
    - Limpia caracteres invisibles de control Unicode (como U+2060).
    - Usa Shift+Enter para los saltos de línea sin enviar prematuramente.
    - Pausas naturales entre letras y puntuaciones.
    """
    # 1. Limpiar caracteres invisibles de formato (Zero-Width Space, Word Joiners, etc.)
    clean_text = "".join(
        ch for ch in text 
        if ch == '\n' or (unicodedata.category(ch) != 'Cf' and ord(ch) != 0xFEFF)
    )

    # 2. Localizar y hacer clic explícito para dar foco al cuadro de texto activo
    element = await page.wait_for_selector(selector, timeout=30000)
    try:
        await element.click(force=True)
    except Exception:
        await element.focus()

    await asyncio.sleep(random.uniform(0.6, 1.2))

    punctuation = {',', '.', '!', '?', ';', ':'}

    for char in clean_text:
        if char == '\n':
            # Shift+Enter inserta salto de línea en WhatsApp Web sin enviar
            await page.keyboard.press("Shift+Enter")
            delay = random.uniform(0.2, 0.45)
        else:
            try:
                await page.keyboard.type(char)
            except Exception:
                # Si es un carácter especial (ej. emoji o símbolo extenso), insertarlo directamente
                await page.keyboard.insert_text(char)

            if char in punctuation:
                delay = random.uniform(0.35, 0.7)
            elif char == ' ':
                delay = random.uniform(0.08, 0.18)
            else:
                delay = random.uniform(min_delay_ms / 1000.0, max_delay_ms / 1000.0)

            # 3% de probabilidad de hacer una pequeña pausa pensativa humana
            if random.random() < 0.03:
                delay += random.uniform(0.25, 0.6)

        await asyncio.sleep(delay)

    await asyncio.sleep(random.uniform(1.5, 3.0))
