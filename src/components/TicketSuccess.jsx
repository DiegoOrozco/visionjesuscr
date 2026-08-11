import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { CheckCircle, Copy, Download, ExternalLink, MessageCircle, Share2, Sparkles, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

export default function TicketSuccess({ reservation, onReset }) {
  const canvasRef = useRef(null);
  const ticketCardRef = useRef(null);
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

  // Clean WhatsApp handler opening direct chat with phone number
  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    
    const cleanPhone = (p) => {
      if (!p) return '';
      let cleaned = String(p).replace(/\D/g, '');
      if (cleaned.length === 8) {
        cleaned = '506' + cleaned;
      }
      return cleaned;
    };

    const phone = reservation.purchaser_phone ? cleanPhone(reservation.purchaser_phone) : '';
    
    // Format seats list nicely for message
    const formattedTickets = reservation.assigned_tickets.map(t => 
      t.includes(' - ') && !t.startsWith('Fila') && !t.startsWith('Asiento') 
        ? t.split(' - ').slice(1).join(' - ') 
        : t
    ).join(', ');

    const message = `¡Hola! Confirmo mi reservación para el CONGRESO ANUAL DE MUJERES AUTÉNTICAS 2026.\n\n` +
      `Zona: ${reservation.zone_name}\n` +
      `Boletos: ${formattedTickets}\n` +
      `Responsable: ${reservation.purchaser_name}\n\n` +
      `Puedes abrir y visualizar mi boleto con código QR digital aquí:\n${ticketUrl}`;

    const encoded = encodeURIComponent(message);
    const targetUrl = phone
      ? `https://wa.me/${phone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ticketUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadQR = () => {
    if (ticketCardRef.current) {
      html2canvas(ticketCardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        scale: 3 // Higher resolution
      }).then(canvas => {
        const imageUri = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        const firstTicket = reservation.assigned_tickets[0] || 'Boleto';
        link.download = `Boleto-${firstTicket.replace(/\s+/g, '-')}.png`;
        link.href = imageUri;
        link.click();
      }).catch(err => {
        console.error('Error generating ticket image:', err);
        alert('Hubo un error al generar la imagen del boleto.');
      });
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
          Comprobante en Proceso de Verificación
        </span>

        <h2 style={{ fontSize: '2rem', color: 'var(--accent-coffee)', marginBottom: '8px' }}>
          ¡Reserva Registrada Exitosamente!
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
          Tus boletos han sido apartados. Una vez que el administrador valide tu comprobante de pago, el código QR estará habilitado para el ingreso al evento.
        </p>

        {/* QR Box */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div 
            ref={ticketCardRef}
            style={{
              backgroundColor: '#FFFFFF',
              border: '4px solid #C5A880',
              borderRadius: '24px',
              padding: '30px 24px',
              display: 'inline-block',
              boxShadow: 'var(--shadow-md)',
              width: '100%',
              maxWidth: '360px',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
          >
            <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto', borderRadius: '12px' }} />
            
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '0.9rem', color: '#8C7456', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' }}>
                {reservation.zone_name}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2C1A0E', lineHeight: 1.2 }}>
                {reservation.assigned_tickets.map(t => 
                  t.includes(' - ') && !t.startsWith('Fila') && !t.startsWith('Asiento') 
                    ? t.split(' - ').slice(1).join(' - ') 
                    : t
              ).join(' • ')}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: 600, marginTop: '2px' }}>
              {reservation.zone_name} ({reservation.quantity} {reservation.quantity === 1 ? 'Persona' : 'Personas'})
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '14px', borderTop: '1px solid #F3F4F6', paddingTop: '10px' }}>
              CÓDIGO DE CONTROL: <strong style={{ color: '#111827', fontFamily: 'monospace' }}>{reservation.qr_code_hash}</strong>
            </div>
          </div>
        </div>
      </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={handleSendWhatsApp}
            className="btn-primary"
            style={{ backgroundColor: '#25D366', textDecoration: 'none', padding: '14px', border: 'none', cursor: 'pointer' }}
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
            Enlace persistente: {ticketUrl}
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
              marginLeft: '8px',
              cursor: 'pointer'
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
