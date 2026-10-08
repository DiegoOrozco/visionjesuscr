import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Calendar, CheckCircle, Clock, MapPin, MessageCircle, ShieldAlert, Sparkles, User, Users, Download, ArrowLeft, Ticket } from 'lucide-react';
import html2canvas from 'html2canvas';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function TicketView({ qrHash, onGoHome }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const canvasRef = useRef(null);
  const ticketCardRef = useRef(null);

  const handleDownloadTicketImage = () => {
    if (ticketCardRef.current) {
      html2canvas(ticketCardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0A0A10',
        scale: 3 // Retina resolution
      }).then(canvas => {
        const imageUri = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        const firstTicket = ticket.attendees[0]?.assigned_ticket_code || 'Boleto';
        link.download = `Pase-Digital-${firstTicket.replace(/\s+/g, '-')}.png`;
        link.href = imageUri;
        link.click();
      }).catch(err => {
        console.error('Error generating ticket image:', err);
        alert('Hubo un error al generar la imagen del boleto.');
      });
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/tickets/${qrHash}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTicket(data.ticket);
        } else {
          setErrorMsg(data.message || 'Boleto no encontrado.');
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMsg('Error al conectar con el servidor.');
      })
      .finally(() => setLoading(false));
  }, [qrHash]);

  useEffect(() => {
    if (ticket && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, ticket.qr_code_hash, {
        width: 260,
        margin: 2,
        color: {
          dark: '#0A0A0E',
          light: '#FFFFFF'
        }
      });
    }
  }, [ticket]);

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--apple-font)',
        color: '#F5F5F7'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: 'var(--apple-blue)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '16px'
        }} />
        <p style={{ fontSize: '1rem', color: 'var(--apple-text-secondary)', fontWeight: 500 }}>
          Cargando pase digital...
        </p>
      </div>
    );
  }

  const formatTicketCode = (ticketCode) => {
    if (!ticketCode) return '';
    const match = ticketCode.match(/^([A-Z\-]+)-(\d+)$/);
    if (!match) {
      return ticketCode.includes(' - ') && !ticketCode.startsWith('Fila') && !ticketCode.startsWith('Asiento') 
        ? ticketCode.split(' - ').slice(1).join(' - ') 
        : ticketCode;
    }
    const prefix = match[1];
    const queueIndex = parseInt(match[2], 10);
    const getRowSeat = (qIndex, seatsPerRow, offsetRows = 0) => {
      const zeroBased = qIndex - 1;
      const rowIndex = Math.floor(zeroBased / seatsPerRow) - offsetRows;
      const seatNumber = (zeroBased % seatsPerRow) + 1;
      return { rowIndex, seatNumber };
    };
    let rowLabel = "", seatNum = 0;
    const labels = ["Fila A", "Fila B", "Fila C", "Fila D", "Fila E", "Fila F", "Fila G", "Fila H", "Fila I", "Fila J"];
    
    if (prefix === 'VIP-CTR') {
      const r = getRowSeat(queueIndex, 9, 2);
      rowLabel = `Fila ${r.rowIndex + 3}`; seatNum = r.seatNumber;
    } else if (prefix === 'VIP-IZQ' || prefix === 'VIP-DER') {
      const r = getRowSeat(queueIndex, 8, 0);
      rowLabel = `Fila ${r.rowIndex + 1}`; seatNum = r.seatNumber;
    } else if (prefix === 'GEN-CTR') {
      const r = getRowSeat(queueIndex, 15, 0);
      rowLabel = labels[r.rowIndex] || `Fila ${r.rowIndex + 1}`; seatNum = r.seatNumber;
    } else if (prefix === 'GEN-IZQ' || prefix === 'GEN-DER') {
      const r = getRowSeat(queueIndex, 10, 0);
      rowLabel = labels[r.rowIndex] || `Fila ${r.rowIndex + 1}`; seatNum = r.seatNumber;
    } else {
      return ticketCode;
    }
    return `${rowLabel} - Asiento #${seatNum}`;
  };

  if (errorMsg || !ticket) {
    return (
      <div style={{ maxWidth: '480px', margin: '60px auto', padding: '0 20px', fontFamily: 'var(--apple-font)' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '36px 24px',
          textAlign: 'center'
        }}>
          <ShieldAlert size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F5F5F7', marginBottom: '8px' }}>
            Pase No Encontrado
          </h2>
          <p style={{ color: 'var(--apple-text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
            {errorMsg}
          </p>
          <button onClick={onGoHome} className="apple-btn apple-btn-primary" style={{ padding: '12px 28px' }}>
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const renderStatusBadge = () => {
    switch (ticket.status) {
      case 'aprobado':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: 'rgba(16, 185, 129, 0.14)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34D399'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34D399' }} />
            Pase Verificado y Aprobado
          </span>
        );
      case 'usado':
        const usedTime = ticket.scanned_at 
          ? new Date(ticket.scanned_at + 'Z').toLocaleTimeString('es-CR', { timeZone: 'America/Costa_Rica', hour: '2-digit', minute: '2-digit' }) 
          : '';
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: 'rgba(59, 130, 246, 0.14)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            color: '#60A5FA'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#60A5FA' }} />
            Ingresado al Evento {usedTime ? `(${usedTime})` : ''}
          </span>
        );
      case 'rechazado':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: 'rgba(239, 68, 68, 0.14)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#F87171'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F87171' }} />
            Reserva Rechazada
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: 'rgba(245, 158, 11, 0.14)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: '#FBBF24'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FBBF24' }} />
            Revisión de Pago Pendiente
          </span>
        );
    }
  };

  const formattedSeatList = ticket.attendees.map(a => formatTicketCode(a.assigned_ticket_code)).join(' • ');

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '30px 16px', fontFamily: 'var(--apple-font)' }}>
      
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button
          onClick={onGoHome}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--apple-text-secondary)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 0',
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#F5F5F7'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--apple-text-secondary)'}
        >
          <ArrowLeft size={16} />
          <span>Inicio</span>
        </button>

        <div>{renderStatusBadge()}</div>
      </div>

      {/* APPLE WALLET DIGITAL PASS */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
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
              OFICIAL
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

          {/* QR Code Canvas */}
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
              Escanear para acceso oficial
            </span>
          </div>

          {/* Zone & Seats Badge */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: '4px' }}>
              {ticket.zone_name}
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
              {formattedSeatList}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#A1A1A6', marginTop: '4px', fontWeight: 500 }}>
              {ticket.quantity} {ticket.quantity === 1 ? 'Lugar Asignado' : 'Lugares Asignados'}
            </div>
          </div>

          {/* Perforated Divider */}
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
                COMPRADOR
              </span>
              <strong style={{ color: '#F5F5F7', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap' }}>
                {ticket.purchaser_name}
              </strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '0.68rem', color: '#6E6E73', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                CÓDIGO CONTROL
              </span>
              <strong style={{ color: 'var(--apple-blue)', fontFamily: 'monospace', fontSize: '0.92rem', fontWeight: 800 }}>
                {ticket.qr_code_hash.substring(0, 6).toUpperCase()}
              </strong>
            </div>
          </div>

        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
        <button
          onClick={handleDownloadTicketImage}
          className="apple-btn apple-btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            fontSize: '0.92rem'
          }}
        >
          <Download size={18} strokeWidth={2.2} />
          <span>Guardar Pase en Fotos</span>
        </button>
      </div>

      {/* Detailed Reservation Glass Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: '#F5F5F7',
          letterSpacing: '-0.01em',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Users size={18} color="var(--apple-blue)" />
          <span>Detalles de la Reserva</span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          fontSize: '0.88rem',
          marginBottom: '20px'
        }}>
          <div>
            <span style={{ color: 'var(--apple-text-secondary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Responsable
            </span>
            <strong style={{ color: '#F5F5F7', fontWeight: 600 }}>{ticket.purchaser_name}</strong>
          </div>

          <div>
            <span style={{ color: 'var(--apple-text-secondary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Boletos
            </span>
            <strong style={{ color: '#F5F5F7', fontWeight: 600 }}>{ticket.quantity} {ticket.quantity === 1 ? 'Persona' : 'Personas'}</strong>
          </div>

          <div>
            <span style={{ color: 'var(--apple-text-secondary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Total Pagado
            </span>
            <strong style={{ color: '#34D399', fontWeight: 700 }}>₡{Number(ticket.total_amount).toLocaleString('es-CR')}</strong>
          </div>

          <div>
            <span style={{ color: 'var(--apple-text-secondary)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Teléfono de Contacto
            </span>
            <strong style={{ color: '#F5F5F7', fontWeight: 600 }}>{ticket.purchaser_phone}</strong>
          </div>
        </div>

        {/* Attendee breakdown */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--apple-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '12px' }}>
            Lista de Asistentes Acreditados
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ticket.attendees.map((att, i) => {
              const cleanSeat = formatTicketCode(att.assigned_ticket_code);
              return (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.88rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--apple-text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>#{i + 1}</span>
                    <strong style={{ color: '#F5F5F7', fontWeight: 600 }}>{att.full_name}</strong>
                    {att.phone && (
                      <span style={{ color: 'var(--apple-text-secondary)', fontSize: '0.8rem' }}>({att.phone})</span>
                    )}
                  </div>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--apple-blue)',
                    background: 'rgba(0, 113, 227, 0.12)',
                    padding: '3px 10px',
                    borderRadius: '999px'
                  }}>
                    {cleanSeat}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
