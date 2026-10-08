import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { CheckCircle, Copy, Download, ExternalLink, MessageCircle, Share2, Sparkles, Ticket, Check, Smartphone } from 'lucide-react';
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
          dark: '#0A0A0E',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('QR rendering error:', error);
      });
    }

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#0071E3', '#60A5FA', '#F59E0B', '#10B981', '#FFFFFF']
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
        backgroundColor: '#0A0A10',
        scale: 3 // Ultra-sharp Retina resolution
      }).then(canvas => {
        const imageUri = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        const firstTicket = reservation.assigned_tickets[0] || 'Boleto';
        link.download = `Pase-Digital-${firstTicket.replace(/\s+/g, '-')}.png`;
        link.href = imageUri;
        link.click();
      }).catch(err => {
        console.error('Error generating ticket image:', err);
        alert('Hubo un error al generar la imagen del boleto.');
      });
    }
  };

  const formattedSeatList = reservation.assigned_tickets.map(t => 
    t.includes(' - ') && !t.startsWith('Fila') && !t.startsWith('Asiento') 
      ? t.split(' - ').slice(1).join(' - ') 
      : t
  ).join(' • ');

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 16px', fontFamily: 'var(--apple-font)' }}>
      
      {/* Top Header Feedback */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.05) 70%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34D399',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px',
          boxShadow: '0 0 35px rgba(16, 185, 129, 0.25)'
        }}>
          <CheckCircle size={38} strokeWidth={2.3} />
        </div>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#FBBF24',
          marginBottom: '14px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FBBF24', display: 'inline-block' }}></span>
          Comprobante en Verificación
        </span>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#F5F5F7',
          lineHeight: 1.15,
          marginBottom: '10px'
        }}>
          ¡Reserva Confirmada!
        </h1>

        <p style={{
          color: 'var(--apple-text-secondary)',
          fontSize: '0.96rem',
          lineHeight: 1.5,
          maxWidth: '520px',
          margin: '0 auto'
        }}>
          Tus lugares han sido apartados. Una vez validado tu pago, este pase digital estará activo para escanear en la entrada.
        </p>
      </div>

      {/* APPLE WALLET DIGITAL PASS */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
        <div 
          ref={ticketCardRef}
          style={{
            width: '100%',
            maxWidth: '380px',
            background: 'linear-gradient(180deg, #181824 0%, #0E0E16 60%, #08080E 100%)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '26px',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.05)',
            padding: '24px 22px',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Apple Glow inside Card */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '260px',
            height: '140px',
            background: 'radial-gradient(ellipse, rgba(0, 113, 227, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          {/* Pass Top Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '14px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0071E3, #2563EB)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Ticket size={16} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', color: '#F5F5F7', textTransform: 'uppercase' }}>
                VISIÓN JESÚS PASS
              </span>
            </div>

            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#A1A1A6',
              letterSpacing: '0.04em'
            }}>
              2026
            </span>
          </div>

          {/* Event Title on Pass */}
          <div style={{ margin: '16px 0 18px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--apple-blue)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Congreso Anual de Mujeres
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              AUTÉNTICAS 2026
            </div>
          </div>

          {/* QR Code Pure Canvas Container */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            zIndex: 1,
            margin: '0 auto 18px',
            maxWidth: '280px'
          }}>
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', height: 'auto', borderRadius: '10px' }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6B7280', letterSpacing: '0.08em', marginTop: '8px', textTransform: 'uppercase' }}>
              Presentar este código al ingresar
            </span>
          </div>

          {/* Zone & Seats Badge */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: '4px' }}>
              {reservation.zone_name}
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
              {formattedSeatList}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#A1A1A6', marginTop: '4px', fontWeight: 500 }}>
              {reservation.quantity} {reservation.quantity === 1 ? 'Lugar Reservado' : 'Lugares Reservados'}
            </div>
          </div>

          {/* Perforated Divider Line */}
          <div style={{
            position: 'relative',
            margin: '14px -22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#000000',
              position: 'absolute',
              left: '-9px'
            }} />
            <div style={{
              flex: 1,
              borderTop: '1px dashed rgba(255, 255, 255, 0.16)',
              margin: '0 16px'
            }} />
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#000000',
              position: 'absolute',
              right: '-9px'
            }} />
          </div>

          {/* Pass Metadata Footer */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            paddingTop: '6px',
            fontSize: '0.82rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', color: '#6E6E73', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                TITULAR
              </span>
              <strong style={{ color: '#F5F5F7', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap' }}>
                {reservation.purchaser_name}
              </strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '0.68rem', color: '#6E6E73', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                CÓDIGO CONTROL
              </span>
              <strong style={{ color: 'var(--apple-blue)', fontFamily: 'monospace', fontSize: '0.92rem', fontWeight: 800 }}>
                {reservation.qr_code_hash.substring(0, 6).toUpperCase()}
              </strong>
            </div>
          </div>

        </div>
      </div>

      {/* ACTION BUTTONS (Apple Pill Physics) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleSendWhatsApp}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px 20px',
            borderRadius: '999px',
            backgroundColor: '#25D366',
            color: '#052E16',
            fontWeight: 700,
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(37, 211, 102, 0.28)',
            transition: 'all 0.2s var(--apple-ease)'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={20} strokeWidth={2.4} />
          <span>Enviar por WhatsApp</span>
        </button>

        <button
          onClick={handleDownloadQR}
          className="apple-btn apple-btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '14px 20px',
            fontSize: '0.95rem'
          }}
        >
          <Download size={18} strokeWidth={2.2} />
          <span>Guardar Pase Digital</span>
        </button>
      </div>

      {/* Persistent URL Pill */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{ overflow: 'hidden', minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: '0.72rem', color: '#6E6E73', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Enlace permanente del pase
          </span>
          <span style={{ display: 'block', fontSize: '0.85rem', color: '#D2D2D7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {ticketUrl}
          </span>
        </div>

        <button
          onClick={handleCopyLink}
          style={{
            background: copied ? '#10B981' : 'rgba(255, 255, 255, 0.12)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            padding: '8px 16px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
        </button>
      </div>

      {/* Return CTA */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--apple-blue)',
            fontSize: '0.92rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '10px 18px',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          ← Realizar otra reservación
        </button>
      </div>

    </div>
  );
}
