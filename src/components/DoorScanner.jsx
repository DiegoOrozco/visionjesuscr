import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CheckCircle2, QrCode, RefreshCw, ShieldAlert, Sparkles, UserCheck, XCircle } from 'lucide-react';

export default function DoorScanner({ adminUser }) {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); // { success: boolean, code: string, message: string, reservation: object }
  const [manualHash, setManualHash] = useState('');
  const [cameraError, setCameraError] = useState('');
  const scannerRef = useRef(null);

  const startCameraScanner = async () => {
    setCameraError('');
    setScanResult(null);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("reader");
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async (decodedText) => {
          // Stop camera scanning temporarily upon detection
          if (scannerRef.current && scannerRef.current.isScanning) {
            await scannerRef.current.stop();
          }
          setScanning(false);
          processQrCode(decodedText);
        },
        (errorMessage) => {
          // Ignore minor frame read failures
        }
      );
      setScanning(true);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('No se pudo acceder a la cámara. Asegúrate de otorgar permisos de cámara en tu navegador.');
      setScanning(false);
    }
  };

  const stopCameraScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  // Process QR Code scan API check
  const processQrCode = async (qrHash) => {
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qr_hash: qrHash.trim(),
          scanned_by: adminUser ? adminUser.full_name : 'Personal de Puerta'
        })
      });

      const data = await res.json();
      setScanResult(data);

      // Play audio beep tone depending on green/red
      playBeepSound(data.success);

    } catch (err) {
      console.error('Scan API error:', err);
      setScanResult({
        success: false,
        code: 'NETWORK_ERROR',
        message: 'Error de red o conexión al validar el boleto.'
      });
    }
  };

  // Play audio frequency for green/red feedback
  const playBeepSound = (isSuccess) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isSuccess) {
        osc.frequency.value = 880; // High tone for green
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.frequency.value = 220; // Low error tone for red
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualHash) {
      processQrCode(manualHash);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '20px auto', padding: '0 20px' }}>
      
      {/* --- FULLSCREEN GREEN SCREEN (APPROVED / PASS) --- */}
      {scanResult && scanResult.success && (
        <div className="scan-screen-overlay scan-screen-green" onClick={() => setScanResult(null)}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <CheckCircle2 size={70} color="#FFFFFF" />
          </div>

          <span className="badge" style={{ backgroundColor: '#FFFFFF', color: '#1B5E20', marginBottom: '12px', fontSize: '1rem' }}>
            PASAR / ENTRADA PERMITIDA
          </span>

          <h1 style={{ color: '#FFFFFF', fontSize: '2.4rem', margin: '0 0 10px', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            ¡ENTRADA VÁLIDA!
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.95, marginBottom: '24px' }}>
            Bienvenida a la Conferencia de Mujeres
          </p>

          {/* Ticket Details Box */}
          {scanResult.reservation && (
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              padding: '20px 24px',
              width: '100%',
              maxWidth: '450px',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', opacity: 0.9 }}>
                ZONA DE ASIENTOS: <strong>{scanResult.reservation.zone_name}</strong>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px' }}>
                {scanResult.reservation.attendees ? scanResult.reservation.attendees.map(a => a.assigned_ticket_code).join(' • ') : 'BOLETO APROBADO'}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '12px', marginTop: '12px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  👤 Responsable: {scanResult.reservation.purchaser_name}
                </div>
                <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                  👥 Cantidad: {scanResult.reservation.quantity} {scanResult.reservation.quantity === 1 ? 'Persona' : 'Personas'}
                </div>
              </div>
            </div>
          )}

          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            (Toca la pantalla en cualquier lugar para escanear el siguiente boleto)
          </p>
        </div>
      )}

      {/* --- FULLSCREEN RED SCREEN (REJECTED / ERROR) --- */}
      {scanResult && !scanResult.success && (
        <div className="scan-screen-overlay scan-screen-red" onClick={() => setScanResult(null)}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <XCircle size={70} color="#FFFFFF" />
          </div>

          <span className="badge" style={{ backgroundColor: '#FFFFFF', color: '#8E0000', marginBottom: '12px', fontSize: '1rem' }}>
            ⛔ ACCESO DENEGADO
          </span>

          <h1 style={{ color: '#FFFFFF', fontSize: '2.4rem', margin: '0 0 10px' }}>
            NO PUEDE INGRESAR
          </h1>

          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '16px',
            padding: '18px 24px',
            maxWidth: '450px',
            fontSize: '1.1rem',
            lineHeight: 1.4,
            marginBottom: '24px',
            whiteSpace: 'pre-line'
          }}>
            {scanResult.message}
          </div>

          {scanResult.reservation && (
            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '16px' }}>
              Reserva a nombre de: <strong>{scanResult.reservation.purchaser_name}</strong>
            </div>
          )}

          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            (Toca la pantalla en cualquier lugar para escanear de nuevo)
          </p>
        </div>
      )}

      {/* SCANNER CONTAINER */}
      <div className="card-glass" style={{ borderRadius: '24px', padding: '30px', textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--accent-coffee)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px'
        }}>
          <Camera size={28} />
        </div>

        <h2 style={{ fontSize: '1.75rem', color: 'var(--accent-coffee)' }}>Validación de Código QR en Puerta</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Apunta la cámara del celular al código QR de la asistente para verificar su acceso en tiempo real.
        </p>

        {cameraError && (
          <div style={{ backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem' }}>
            ⚠️ {cameraError}
          </div>
        )}

        {/* Camera Video Container */}
        <div style={{
          position: 'relative',
          backgroundColor: '#000',
          borderRadius: '20px',
          overflow: 'hidden',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          border: '3px solid var(--accent-gold)'
        }}>
          <div id="reader" style={{ width: '100%' }}></div>
          {!scanning && (
            <div style={{ position: 'absolute', color: '#FFF', textAlign: 'center', padding: '20px' }}>
              <QrCode size={64} style={{ opacity: 0.6, marginBottom: '10px' }} />
              <div>Cámara inactiva</div>
            </div>
          )}
        </div>

        {/* Camera Start / Stop Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '28px' }}>
          {!scanning ? (
            <button onClick={startCameraScanner} className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <Camera size={20} /> Encender Cámara Escáner
            </button>
          ) : (
            <button onClick={stopCameraScanner} className="btn-secondary" style={{ padding: '14px 28px', color: 'var(--color-red)' }}>
              Detener Cámara
            </button>
          )}
        </div>

        {/* Manual Hash Entry fallback */}
        <div style={{ borderTop: '1px solid var(--accent-beige-border)', paddingTop: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            ¿Problemas con la cámara? Ingresa el código/código hash del boleto manualmente:
          </span>

          <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Pegar o escribir código hash del boleto..." 
              value={manualHash}
              onChange={e => setManualHash(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Validar
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
