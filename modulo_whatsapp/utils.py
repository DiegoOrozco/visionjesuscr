import os
import re
import json
import urllib.parse
from datetime import datetime
from pathlib import Path

def normalize_phone_number(phone_raw: str, default_country: str = "506") -> str:
    """
    Limpia el número de teléfono y antepone el código de país si es necesario.
    """
    if not phone_raw:
        return ""

    # Eliminar cualquier carácter que no sea un dígito
    digits = re.sub(r'\D', '', str(phone_raw))

    if not digits:
        return ""

    # Si es un número local de Costa Rica (8 dígitos), agregar el código de país
    if len(digits) == 8:
        digits = f"{default_country}{digits}"

    return digits

def generate_whatsapp_url(phone: str, message: str, use_web_url: bool = True) -> str:
    """
    Genera el enlace directo para abrir el chat de WhatsApp con el mensaje codificado.
    """
    encoded_message = urllib.parse.quote(message)
    if use_web_url:
        return f"https://web.whatsapp.com/send?phone={phone}&text={encoded_message}"
    else:
        return f"https://api.whatsapp.com/send?phone={phone}&text={encoded_message}"

class SentLogger:
    """
    Mantiene un registro persistente en JSON de los números a los que ya se les ha enviado mensaje.
    """
    def __init__(self, log_path: str):
        self.log_path = Path(log_path)
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
        self.sent_records = self._load()

    def _load(self) -> dict:
        if self.log_path.exists():
            try:
                with open(self.log_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"[Warn] No se pudo leer el archivo de registro {self.log_path}: {e}")
                return {}
        return {}

    def is_sent(self, phone: str) -> bool:
        return phone in self.sent_records

    def mark_sent(self, phone: str, status: str = "sent", message_preview: str = ""):
        self.sent_records[phone] = {
            "timestamp": datetime.now().isoformat(),
            "status": status,
            "preview": message_preview[:50]
        }
        self._save()

    def _save(self):
        with open(self.log_path, 'w', encoding='utf-8') as f:
            json.dump(self.sent_records, f, ensure_ascii=False, indent=2)

def load_numbers_from_file(file_path: str, default_country: str = "506") -> list:
    """
    Carga números desde un archivo de texto o CSV.
    """
    path = Path(file_path)
    if not path.exists():
        print(f"[Error] El archivo de números no existe: {file_path}")
        return []

    numbers = []
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                norm = normalize_phone_number(line, default_country)
                if norm and norm not in numbers:
                    numbers.append(norm)
    return numbers

def load_message_template(file_path: str) -> str:
    """
    Carga la plantilla del mensaje desde un archivo de texto.
    """
    path = Path(file_path)
    if not path.exists():
        print(f"[Error] El archivo de mensaje no existe: {file_path}")
        return ""

    with open(path, 'r', encoding='utf-8') as f:
        return f.read().strip()
