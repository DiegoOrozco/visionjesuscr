import React from 'react';
import { Home, Ticket, AlertTriangle, Compass } from 'lucide-react';

export default function NotFound404({ onGoHome, onGoToTickets }) {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#030812',
      color: '#FFFFFF',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '48px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(16px)'
      }}>
        
        {/* Badge 404 */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '30px',
          color: '#F87171',
          fontSize: '0.85rem',
          fontWeight: 800,
          letterSpacing: '1px',
          marginBottom: '24px'
        }}>
          <AlertTriangle size={16} />
          ERROR 404 • PÁGINA NO ENCONTRADA
        </div>

        {/* Large 404 Header */}
        <h1 style={{
          fontSize: '4.5rem',
          fontWeight: 900,
          margin: '0 0 12px 0',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#FFFFFF',
          marginBottom: '16px'
        }}>
          Parece que te has desviado del camino
        </h2>

        <p style={{
          fontSize: '1rem',
          color: '#94A3B8',
          lineHeight: 1.6,
          marginBottom: '36px',
          maxWidth: '440px',
          margin: '0 auto 36px auto'
        }}>
          La página que buscas no existe, ha sido movida o la dirección ingresada es incorrecta.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => {
              if (onGoHome) onGoHome();
              else {
                window.history.pushState({}, '', '/');
                window.location.reload();
              }
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0033FF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.2s, background-color 0.2s',
              boxShadow: '0 4px 14px rgba(0, 51, 255, 0.4)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Home size={18} />
            Volver al Inicio
          </button>

          <button
            onClick={() => {
              if (onGoToTickets) onGoToTickets();
              else {
                window.history.pushState({}, '', '/autenticas');
                window.location.reload();
              }
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'transform 0.2s, background-color 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; }}
          >
            <Ticket size={18} />
            Congreso Auténticas
          </button>
        </div>

      </div>
    </div>
  );
}
