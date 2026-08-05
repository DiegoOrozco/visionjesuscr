import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { CheckCircle, Copy, Download, ExternalLink, MessageCircle, Share2, Sparkles, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TicketSuccess({ reservation, onReset }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const ticketUrl = `${window.location.origin}/ticket/${reservation.qr_code_hash}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, reservation.qr_code_hash, {
        width: 260,
        margin: 2,
        color: {
          dark: '#2C1A0E',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('QR rendering error:', error);
      });
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [reservation]);

  // Clean WhatsApp handler preventing double-encoding of %20
  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const message = `¡Hola! Confirmo mi reservación para el CONGRESO ANUAL DE MUJERES AUTÉNTICAS 2026.\n\n` +
      `🎟️ Zona: ${reservation.zone_name}\n` +
      `🔢 Boletos: ${reservation.assigned_tickets.join(', ')}\n` +
      `👤 Responsable: ${reservation.purchaser_name}\n\n` +
      `🔗 Puedes abrir y visualizar mi boleto con código QR digital aquí:\n${ticketUrl}`;

    const encoded = encodeURIComponent(message);
    const targetUrl = isMobile 
      ? `https://wa.me/?text=${encoded}` 
      : `https://web.whatsapp.com/send?text=${encoded}`;

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ticketUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadQR = () => {
    if (canvasRef.current) {
      const imageUri = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `QR-Boleto-${reservation.assigned_tickets.join('-')}.png`;
      link.href = imageUri;
      link.click();
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', padding: '30px 0' }}>
      <div className="card-glass" style={{ textAlign: 'center', borderRadius: '24px', padding: '36px 24px' }}>
        
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-green-light)',
          color: 'var(--color-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <CheckCircle size={44} />
        </div>

        <span className="badge badge-pending" style={{ marginBottom: '10px', display: 'inline-block' }}>
          ⏳ Comprobante en Proceso de Verificación
        </span>

        <h2 style={{ fontSize: '2rem', color: 'var(--accent-coffee)', marginBottom: '8px' }}>
          ¡Reserva Registrada Exitosamente!
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
          Tus boletos han sido apartados. Una vez que el administrador valide tu comprobante de pago, el código QR estará habilitado para el ingreso al evento.
        </p>

        {/* QR Box */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2px dashed var(--accent-gold)',
          borderRadius: '20px',
          padding: '24px',
          display: 'inline-block',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '24px'
        }}>
          <canvas ref={canvasRef} style={{ borderRadius: '12px' }} />
          
          <div style={{ marginTop: '14px', borderTop: '1px solid #EEE', paddingTop: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              BOLETOS ASIGNADOS
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-coffee)' }}>
              {reservation.assigned_tickets.join(' • ')}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: 600, marginTop: '2px' }}>
              {reservation.zone_name} ({reservation.quantity} {reservation.quantity === 1 ? 'Persona' : 'Personas'})
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={handleSendWhatsApp}
            className="btn-primary"
            style={{ backgroundColor: '#25D366', textDecoration: 'none', padding: '14px', border: 'none' }}
          >
            <MessageCircle size={20} />
            <span>Enviar por WhatsApp</span>
          </button>

          <button
            onClick={handleDownloadQR}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}
          >
            <Download size={18} />
            <span>Guardar Imagen QR</span>
          </button>
        </div>

        {/* Persistent URL Box */}
        <div style={{
          backgroundColor: '#FAF8F5',
          border: '1px solid var(--accent-beige-border)',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          fontSize: '0.88rem'
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
            🔗 Enlace persistente: {ticketUrl}
          </span>
          <button
            onClick={handleCopyLink}
            style={{
              backgroundColor: 'var(--accent-coffee)',
              color: '#FFF',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              marginLeft: '8px'
            }}
          >
            {copied ? '¡Copiado!' : 'Copiar Enlace'}
          </button>
        </div>

        <button
          onClick={onReset}
          className="btn-secondary"
          style={{ width: '100%', padding: '12px' }}
        >
          Hacer otra reservación
        </button>

      </div>
    </div>
  );
}
