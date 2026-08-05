import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, X, ArrowRight } from 'lucide-react';

export default function ZoneModal({ zone, onClose, onContinue }) {
  const [quantity, setQuantity] = useState(1);

  if (!zone) return null;

  const maxCapacity = Math.min(10, zone.available_capacity || 1);
  const formatCRC = (val) => `₡${Number(val).toLocaleString('es-CR')}`;
  const totalPrice = formatCRC(quantity * zone.price);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '24px',
          borderBottom: '1px solid var(--accent-beige-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <span className="badge badge-approved" style={{ backgroundColor: 'var(--accent-gold)', color: '#FFF' }}>
              {zone.name}
            </span>
            <h2 style={{ fontSize: '1.75rem', marginTop: '8px', marginBottom: '4px' }}>
              {zone.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Conferencia Anual de Mujeres "Visionarias de Fe"
            </p>
          </div>
          
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--accent-beige-border)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-coffee)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
            backgroundColor: '#FAF8F5',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--accent-beige-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={20} color="var(--accent-coffee)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FECHA DEL EVENTO</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sábado 15 de Noviembre</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="var(--accent-coffee)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HORA DE APERTURA</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>4:00 PM (Puertas)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} color="var(--accent-coffee)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LUGAR / AUDITORIO</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Auditorio Principal</div>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--accent-coffee)' }}>
              ¿Cuántas personas van a asistir?
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--accent-coffee)'
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, width: '40px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxCapacity, quantity + 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-secondary)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--accent-coffee)'
                  }}
                >
                  +
                </button>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {quantity === 1 ? '1 Boleto individual' : `${quantity} Boletos`}
              </div>
            </div>
          </div>

          {/* Price Calculation Card */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>PRECIO POR BOLETO: {formatCRC(zone.price)}</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-coffee)' }}>
                Total a pagar: {totalPrice}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-green)' }}>
              <Users size={16} /> <span>Colas auto-asignadas</span>
            </div>
          </div>

          {/* Action */}
          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
            onClick={() => onContinue(quantity)}
          >
            <span>Siguiente (Ingresar datos de los asistentes)</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
