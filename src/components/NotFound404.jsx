import React from 'react';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function NotFound404({ onGoHome }) {
  const handleHomeClick = () => {
    if (onGoHome) onGoHome();
    else {
      window.location.href = '/';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#F5F5F7',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--apple-font)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Apple Ambient Glow */}
      <div className="apple-ambient-glow" style={{
        top: '-150px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'radial-gradient(circle, rgba(0, 113, 227, 0.18) 0%, transparent 70%)'
      }} />

      {/* MAIN 404 CONTENT */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 20px 60px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: '#0E0E14',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '28px',
          padding: '48px 32px',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(24px)'
        }}>
          
          {/* Badge 404 */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 14px',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '999px',
            color: '#F87171',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>
            <AlertTriangle size={14} />
            Error 404 • Página No Encontrada
          </div>

          {/* 404 Headline */}
          <h1 className="apple-hero-headline apple-gradient-text" style={{
            fontSize: 'clamp(4.5rem, 9vw, 6.5rem)',
            fontWeight: 900,
            margin: '0 0 10px 0',
            lineHeight: 1
          }}>
            404
          </h1>

          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#F5F5F7',
            letterSpacing: '-0.02em',
            marginBottom: '12px'
          }}>
            Página fuera del radar
          </h2>

          <p style={{
            fontSize: '0.94rem',
            color: 'var(--apple-text-secondary)',
            lineHeight: 1.5,
            maxWidth: '400px',
            margin: '0 auto 32px'
          }}>
            La página que buscas no existe o ha sido trasladada a una nueva dirección.
          </p>

          {/* Action Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleHomeClick}
              className="apple-btn apple-btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                fontSize: '0.95rem'
              }}
            >
              <Home size={18} />
              <span>Volver al Inicio</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
