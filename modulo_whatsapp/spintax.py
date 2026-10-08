import re
import random

def spin(text: str) -> str:
    """
    Procesa plantillas de texto con formato Spintax:
    {{Opción 1|Opción 2|Opción 3}} o {Opción 1|Opción 2}
    Selecciona de forma aleatoria una opción para cada grupo.
    """
    if not text:
        return ""

    # Patrón para grupos con doble llave {{a|b}} o llaves simples {a|b}
    pattern_double = re.compile(r'\{\{([^{}]+)\}\}')
    pattern_single = re.compile(r'\{([^{}]+)\}')

    while pattern_double.search(text):
        text = pattern_double.sub(lambda m: random.choice(m.group(1).split('|')), text)

    while pattern_single.search(text):
        text = pattern_single.sub(lambda m: random.choice(m.group(1).split('|')), text)

    return text

if __name__ == "__main__":
    ejemplo = "{{Hola|Saludos|Buen día}}, {{gracias por registrarte|bienvenida a la conferencia}}."
    for _ in range(3):
        print("Variación:", spin(ejemplo))
