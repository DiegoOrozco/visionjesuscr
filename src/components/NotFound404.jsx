import React from 'react';
import { Home, AlertTriangle } from 'lucide-react';

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
      backgroundColor: '#030812',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Outfit', 'Inter', sans-serif"
    }}>
      {/* OFFICIAL VISIÓN JESÚS HEADER */}
      <header style={{
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(3, 8, 18, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* LOGO */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={handleHomeClick}
        >
          <img src="/logo_oficial_transparente.png" alt="Visión Jesús Logo" style={{ height: '62px', objectFit: 'contain' }} />
        </div>

        {/* MENU LINKS */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); handleHomeClick(); }} 
            style={{ color: '#977DFF', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', textDecoration: 'none', cursor: 'pointer' }}
          >
            INICIO
          </a>
          <a 
            href="/nosotros" 
            onClick={(e) => { e.preventDefault(); window.location.href = '/nosotros'; }} 
            style={{ color: '#EAEDF8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#977DFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#EAEDF8'}
          >
            NOSOTROS
          </a>
          <a 
            href="/#vision-section" 
            onClick={(e) => { e.preventDefault(); window.location.href = '/#vision-section'; }} 
            style={{ color: '#EAEDF8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#977DFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#EAEDF8'}
          >
            CONOCÉ LA VISIÓN
          </a>
          <a 
            href="/#horarios-section" 
            onClick={(e) => { e.preventDefault(); window.location.href = '/#horarios-section'; }} 
            style={{ color: '#EAEDF8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#977DFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#EAEDF8'}
          >
            PRÉDICAS Y HORARIOS
          </a>
          <a 
            href="/#contacto-section" 
            onClick={(e) => { e.preventDefault(); window.location.href = '/#contacto-section'; }} 
            style={{ color: '#EAEDF8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#977DFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#EAEDF8'}
          >
            CONTACTO
          </a>
        </nav>
      </header>

      {/* MAIN 404 CONTENT */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
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

          {/* 404 Header */}
          <h1 style={{
            fontSize: '5rem',
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

          {/* Action Button - ONLY HOME */}
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={handleHomeClick}
              style={{
                padding: '14px 32px',
                backgroundColor: '#0033FF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.25s ease',
                boxShadow: '0 6px 20px rgba(0, 51, 255, 0.4)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Home size={18} />
              Volver al Inicio
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
