import React from 'react';
import { Home } from 'lucide-react';

const BACKGROUNDS = {
  sanados: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1600',
  modelo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600',
  move: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600',
  tienda: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600'
};

const TITLES = {
  sanados: 'SANADOS PARA SANAR',
  modelo: 'MODELO DE JESÚS',
  move: 'MOVE',
  tienda: 'TIENDA VISIÓN'
};

const SUBTITLES = {
  sanados: 'Un espacio de restauración, sanidad interior y libertad en Cristo.',
  modelo: 'Capacitación, discipulado y formación de líderes comprometidos.',
  move: 'El movimiento de jóvenes de Iglesia Visión Jesús. Pasión, adoración y propósito.',
  tienda: 'Ropa oficial, literatura y recursos variados de la iglesia.'
};

export default function UnderConstruction({ pageName, config = {}, onGoHome }) {
  const API_URL = import.meta.env.VITE_API_URL || '';

  const heroBgKey = `${pageName}_hero_bg`;
  const titleKey = `${pageName}_title`;
  const subtitleKey = `${pageName}_subtitle`;

  const rawBg = config[heroBgKey] || BACKGROUNDS[pageName];
  const bg = rawBg 
    ? (rawBg.startsWith('http') ? rawBg : `${API_URL}${rawBg}`)
    : 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600';

  const title = config[titleKey] || TITLES[pageName] || pageName.toUpperCase();
  const subtitle = config[subtitleKey] || SUBTITLES[pageName] || 'Estamos construyendo algo grandioso para ti. Vuelve pronto.';

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.94) 100%), url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#FFFFFF',
      textAlign: 'center',
      padding: '60px 20px',
      fontFamily: 'var(--apple-font)',
      overflow: 'hidden'
    }}>
      
      {/* Background Ambient Glow */}
      <div className="apple-ambient-glow" style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(0, 113, 227, 0.22) 0%, transparent 70%)'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '580px',
        width: '100%',
        backgroundColor: 'rgba(14, 14, 20, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '32px',
        padding: '48px 32px',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Apple Logo 46px */}
        <img 
          src="/logo_oficial_transparente.png" 
          alt="Visión Jesús Logo" 
          style={{ height: '48px', objectFit: 'contain', marginBottom: '24px' }}
        />

        {/* Section Kicker */}
        <div>
          <span className="apple-kicker" style={{ marginBottom: '14px' }}>
            PRÓXIMAMENTE • VISIÓN JESÚS
          </span>
        </div>

        <h1 className="apple-hero-headline apple-gradient-text" style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          marginBottom: '12px',
          lineHeight: 1.15
        }}>
          {title}
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--apple-text-secondary)',
          marginBottom: '32px',
          lineHeight: 1.5,
          maxWidth: '460px',
          margin: '0 auto 32px'
        }}>
          {subtitle}
        </p>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onGoHome}
            className="apple-btn apple-btn-primary"
            style={{
              padding: '14px 32px',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Home size={18} />
            <span>Volver al Inicio</span>
          </button>
        </div>
      </div>

    </div>
  );
}
