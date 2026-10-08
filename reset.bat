@echo off
cd /d "%~dp0"
if exist "modulo_whatsapp\logs\sent_log.json" (
    del /f /q "modulo_whatsapp\logs\sent_log.json"
    echo Registro de envios reiniciado exitosamente.
) else (
    echo No se encontro historial de envios para reiniciar.
)
pause
