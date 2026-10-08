Set-Location -Path $PSScriptRoot
$logFile = "modulo_whatsapp\logs\sent_log.json"
if (Test-Path $logFile) {
    Remove-Item $logFile -Force
    Write-Host "Registro de envios reiniciado exitosamente." -ForegroundColor Green
} else {
    Write-Host "No se encontro historial de envios para reiniciar." -ForegroundColor Yellow
}
