import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Calendar, CheckCircle, Clock, MapPin, MessageCircle, ShieldAlert, Sparkles, User, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function TicketView({ qrHash, onGoHome }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const canvasRef = useRef(null);

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
        width: 250,
        margin: 2,
        color: {
          dark: '#2C1A0E',
          light: '#FFFFFF'
        }
      });
    }
  }, [ticket]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--accent-coffee)' }}>
        <h2>Cargando boleto digital...</h2>
      </div>
    );
  }

  if (errorMsg || !ticket) {
    return (
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 20px' }}>
        <div className="card-glass" style={{ textAlign: 'center' }}>
          <ShieldAlert size={48} color="var(--color-red)" style={{ marginBottom: '16px' }} />
          <h2>Boleto No Encontrado</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{errorMsg}</p>
          <button onClick={onGoHome} className="btn-primary" style={{ marginTop: '20px' }}>
            Ir a Inicio
          </button>
        </div>
      </div>
    );
  }

  const statusBadge = () => {
    switch (ticket.status) {
      case 'aprobado':
        return <span className="badge badge-approved">✓ Boleto Verificado y Aprobado</span>;
      case 'ingresado':
        return <span className="badge badge-used">✓ Ingresado al Evento ({new Date(ticket.scanned_at).toLocaleTimeString()})</span>;
      case 'rechazado':
        return <span className="badge badge-rejected">✕ Reserva Rechazada</span>;
      default:
        return <span className="badge badge-pending">⏳ Revisión de Pago Pendiente</span>;
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '20px auto', padding: '0 20px' }}>
      <div className="card-glass" style={{ borderRadius: '24px', padding: '30px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>{statusBadge()}</div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-coffee)' }}>Conferencia de Mujeres</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Boleto Digital de Acceso Oficial</p>
        </div>

        {/* QR Box */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid var(--accent-gold)',
            borderRadius: '20px',
            padding: '20px',
            display: 'inline-block',
            boxShadow: 'var(--shadow-md)'
          }}>
            <canvas ref={canvasRef} />
             <div style style={{ marginTop: '12px' }}>
               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                 {ticket.zone_name}
               </div>
               <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-coffee)' }}>
                 {ticket.attendees.map(a => {
                   const t = a.assigned_ticket_code || '';
                   return t.includes(' - ') && !t.startsWith('Fila') && !t.startsWith('Asiento') 
                     ? t.split(' - ').slice(1).join(' - ') 
                     : t;
                 }).join(' • ')}
               </div>
             </div>
           </div>
         </div>
 
         {/* Details Grid */}
         <div style={{
           backgroundColor: '#FAF8F5',
           border: '1px solid var(--accent-beige-border)',
           borderRadius: '16px',
           padding: '20px',
           marginBottom: '24px'
         }}>
           <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', borderBottom: '1px solid var(--accent-beige-border)', paddingBottom: '8px' }}>
             Resumen de la Reserva
           </h3>
 
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.9rem' }}>
             <div>
               <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>COMPRADOR:</span>
               <strong>{ticket.purchaser_name}</strong>
             </div>
 
             <div>
               <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>CANTIDAD DE BOLETOS:</span>
               <strong>{ticket.quantity} {ticket.quantity === 1 ? 'Persona' : 'Personas'}</strong>
             </div>
 
             <div>
               <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>TOTAL PAGADO:</span>
               <strong>₡{Number(ticket.total_amount).toLocaleString('es-CR')}</strong>
             </div>
 
             <div>
               <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>CONTACTO:</span>
               <strong>{ticket.purchaser_phone}</strong>
             </div>
           </div>
 
           {/* Attendee List */}
           <div style={{ marginTop: '16px', borderTop: '1px dashed var(--accent-beige-border)', paddingTop: '12px' }}>
             <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-coffee)' }}>
               Lista de Asistentes:
             </span>
             <ul style={{ listStyle: 'none', marginTop: '8px', padding: 0 }}>
               {ticket.attendees.map((att, i) => {
                 const t = att.assigned_ticket_code || '';
                 const cleanSeat = t.includes(' - ') && !t.startsWith('Fila') && !t.startsWith('Asiento') 
                   ? t.split(' - ').slice(1).join(' - ') 
                   : t;
                 return (
                   <li key={i} style={{ fontSize: '0.88rem', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                     <span>• <strong>{att.full_name}</strong> ({att.phone})</span>
                     <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--accent-gold)' }}>{cleanSeat}</span>
                   </li>
                 );
               })}
             </ul>
           </div>
         </div>

        <button onClick={onGoHome} className="btn-secondary" style={{ width: '100%', padding: '12px' }}>
          Volver a Inicio
        </button>
      </div>
    </div>
  );
}
