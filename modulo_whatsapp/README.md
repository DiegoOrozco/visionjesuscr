# ⚡ AUTOMATIZADOR ÚNICO DE WHATSAPP (macOS)

Este sistema te permite enviar todos tus mensajes de WhatsApp de forma autónoma con **UN SOLO COMANDO**, ajustando la cantidad de mensajes por hora (envíos cada 7-8 min), restringiendo la ejecución a **horario de oficina (8:00 AM a 5:00 PM)**, enviando imágenes adjuntas y escribiendo cada mensaje con **velocidad y ritmo humano realista** para proteger tu cuenta contra bloqueos.

---

## 🚀 UN SOLO COMANDO PARA TODO

Abre tu Terminal en macOS y ejecuta:

```bash
./iniciar.sh
```

¡Eso es todo! El sistema se encargará de todo el proceso automáticamente.

---

## ⏰ Restricción a Horario de Oficina (8:00 AM a 5:00 PM)

El bot está configurado para operar **únicamente entre las 8:00 AM y las 5:00 PM**.

- Si abres el bot dentro de ese horario, comenzará a enviar de inmediato.
- Si dan las 5:00 PM mientras se ejecuta, **se pausará automáticamente** y mostrará una cuenta regresiva para reanudarse al día siguiente a las 8:00 AM.
- Si abres el bot de noche o en la madrugada, se dormirá pacíficamente hasta las 8:00 AM.

---

## 📸 Enviar Imágenes Adjuntas (Afiches, Logos, Fotografías)

Está configurado para enviar la imagen oficial de la Conferencia de Mujeres:

```json
"default_image_file": "../media/imagen-whatsapp.jpg"
```

El bot adjuntará la imagen y escribirá la plantilla de mensaje con sintaxis Spintax como **pie de foto** con tipeo humano.

---

## ⚙️ Configuración Fácil (`modulo_whatsapp/config.json`)

```json
{
  "mensajes_por_hora": 8,
  "default_country_code": "506",
  "velocidad_tipeo_min_ms": 35,
  "velocidad_tipeo_max_ms": 110,
  "default_numbers_file": "../numeros-formato-whatsapp.txt",
  "default_message_file": "../mensaje-whatsapp.txt",
  "default_image_file": "../media/imagen-whatsapp.jpg",
  "solo_horario_oficina": true,
  "hora_inicio": 8,
  "hora_fin": 17
}
```

---

## 🔑 Sesión Única de WhatsApp Web
1. **La primera vez que ejecutes `./iniciar.sh`**, se abrirá la ventana para que escanees el código QR de WhatsApp Web.
2. **¡Solo debes escanearlo una vez!** La sesión se guarda en la carpeta `whatsapp_session`.
3. En las siguientes ejecuciones, el bot entrará directamente sin solicitar el código QR.

---

## 📊 Registro de Envíos
Todos los números procesados se guardan en `modulo_whatsapp/logs/sent_log.json` para evitar enviar dos veces al mismo destinatario.
