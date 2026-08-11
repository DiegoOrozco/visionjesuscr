import React from 'react';
import { Home } from 'lucide-react';

const BACKGROUNDS = {
  sanados: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1600', // Peaceful path / forest / sunrise
  modelo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600',  // Strategy / blueprint / leadership
  move: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600',    // Concert / youth festival / energetic
  tienda: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600'    // Bookstore / cozy library
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
  tienda: 'Ropa oficial, bebidas, literatura y recursos variados de la iglesia.'
};

export default function UnderConstruction({ pageName, onGoHome }) {
  const bg = BACKGROUNDS[pageName] || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600';
  const title = TITLES[pageName] || pageName.toUpperCase();
  const subtitle = SUBTITLES[pageName] || 'Estamos construyendo algo grandioso para ti. Vuelve pronto.';

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `linear-gradient(180deg, rgba(17, 19, 30, 0.75) 0%, rgba(9, 10, 15, 0.95) 100%), url(${bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#FFFFFF',
      textAlign: 'center',
      padding: '40px 20px',
      fontFamily: "'Outfit', 'Inter', sans-serif"
    }}>
      
      {/* Background Glow Effect */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(185, 28, 28, 0.25) 0%, rgba(185, 28, 28, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ zIndex: 1, maxWidth: '600px', width: '100%' }}>
        {/* Transparent Logo */}
        <img 
          src="/logo_oficial_transparente.png" 
          alt="Visión Jesús Logo" 
          style={{ height: '90px', objectFit: 'contain', marginBottom: '30px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
        />

        {/* Section Title */}
        <span style={{
          backgroundColor: 'rgba(185, 28, 28, 0.2)',
          border: '1px solid rgba(185, 28, 28, 0.5)',
          color: '#FF8A8A',
          padding: '6px 18px',
          borderRadius: '50px',
          fontSize: '0.8rem',
          fontWeight: 800,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          display: 'inline-block',
          marginBottom: '16px'
        }}>
          PRÓXIMAMENTE
        </span>

        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: 900,
          marginBottom: '14px',
          letterSpacing: '-1px',
          textTransform: 'uppercase',
          lineHeight: 1.1
        }}>
          {title}
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#D1D5DB',
          marginBottom: '40px',
          lineHeight: 1.5,
          fontWeight: 400
        }}>
          {subtitle}
        </p>

        {/* Action Button */}
        <button
          onClick={onGoHome}
          className="btn-primary"
          style={{
            padding: '14px 36px',
            fontSize: '1rem',
            fontWeight: 800,
            borderRadius: '50px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            backgroundColor: '#B91C1C',
            border: '2px solid #EF4444',
            boxShadow: '0 8px 24px rgba(185, 28, 28, 0.4)'
          }}
        >
          <Home size={18} />
          <span>Volver al Inicio</span>
        </button>
      </div>

    </div>
  );
}
