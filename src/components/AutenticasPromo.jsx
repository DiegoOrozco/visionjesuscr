import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Tag, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function AutenticasPromo({ config, onScrollToMap }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Parse gallery
  let gallery = [];
  try {
    if (config.autenticas_gallery) {
      gallery = typeof config.autenticas_gallery === 'string' ? JSON.parse(config.autenticas_gallery) : config.autenticas_gallery;
    }
  } catch (e) {
    console.error('Failed to parse autenticas gallery:', e);
  }
  if (!gallery || gallery.length === 0) {
    gallery = [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000',
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1000',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000'
    ];
  }

  // Auto-scroll gallery slides every 5 seconds
  useEffect(() => {
    if (gallery.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % gallery.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [gallery.length]);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % gallery.length);
  };

  const heroBgUrl = config.autenticas_hero_bg 
    ? (config.autenticas_hero_bg.startsWith('http') ? config.autenticas_hero_bg : `${API_URL}${config.autenticas_hero_bg}`)
    : 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600';

  return (
    <div style={{ marginBottom: '40px' }}>
      
      {/* 1. HERO BANNER "AUTÉNTICAS" */}
      <div style={{
        position: 'relative',
        backgroundImage: `linear-gradient(180deg, rgba(250, 245, 239, 0.25) 0%, rgba(255, 255, 255, 1) 100%), url(${heroBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '320px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '30px',
        border: '1px solid var(--accent-beige-border)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(44, 26, 14, 0.4)', // Coffee overlay
          borderRadius: '24px',
          zIndex: 1
        }} />

        <div style={{ zIndex: 2, position: 'relative' }}>
          <h1 style={{
            color: '#FFFFFF',
            fontSize: '4.5rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontFamily: "'Outfit', 'Inter', sans-serif",
            textShadow: '0 4px 12px rgba(0,0,0,0.6)',
            margin: 0
          }}>
            {config.autenticas_title || 'AUTÉNTICAS'}
          </h1>
          <h2 style={{
            color: '#FAF5EF',
            fontSize: '1.6rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '4px',
            marginTop: '10px',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)'
          }}>
            {config.autenticas_subtitle || 'CONGRESO DE MUJERES'}
          </h2>
        </div>
      </div>

      {/* 2. DESCRIPTION SECTION */}
      <div style={{
        textAlign: 'center',
        maxWidth: '750px',
        margin: '0 auto 36px',
        padding: '0 10px'
      }}>
        <p style={{
          fontSize: '1.15rem',
          color: 'var(--accent-coffee)',
          lineHeight: 1.6,
          fontWeight: 600
        }}>
          {config.autenticas_description || 'El congreso anual para mujeres que deciden sanar sus heridas, abrazar su historia y descubrir la belleza que Dios ha trazado en cada una de sus cicatrices.'}
        </p>
      </div>

      {/* 3. EVENT DETAILS CARDS (GOLD/COFFEE THEMED) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* CARD: FECHA */}
        <div style={{
          backgroundColor: '#FFFBF7',
          border: '2px solid var(--accent-beige-border)',
          borderRadius: '20px',
          padding: '24px',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#FAF5EF',
            color: 'var(--accent-coffee)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px'
          }}>
            <Calendar size={24} />
          </div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginBottom: '6px' }}>
            Fecha y Hora
          </h4>
          <p style={{ fontSize: '1.05rem', color: 'var(--accent-coffee)', fontWeight: 800, margin: 0 }}>
            {config.autenticas_date_info || 'Sábado 15 de Noviembre - 5:00 PM'}
          </p>
        </div>

        {/* CARD: LUGAR */}
        <div style={{
          backgroundColor: '#FFFBF7',
          border: '2px solid var(--accent-beige-border)',
          borderRadius: '20px',
          padding: '24px',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#FAF5EF',
            color: 'var(--accent-coffee)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px'
          }}>
            <MapPin size={24} />
          </div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginBottom: '6px' }}>
            Lugar / Auditorio
          </h4>
          <p style={{ fontSize: '1.05rem', color: 'var(--accent-coffee)', fontWeight: 800, margin: 0 }}>
            {config.autenticas_place_info || 'Auditorio Principal - Desamparados'}
          </p>
        </div>

        {/* CARD: PRECIO */}
        <div style={{
          backgroundColor: '#FFFBF7',
          border: '2px solid var(--accent-beige-border)',
          borderRadius: '20px',
          padding: '24px',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#FAF5EF',
            color: 'var(--accent-coffee)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px'
          }}>
            <Tag size={24} />
          </div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginBottom: '6px' }}>
            Inversión / Precio
          </h4>
          <p style={{ fontSize: '1.05rem', color: 'var(--accent-coffee)', fontWeight: 800, margin: 0 }}>
            {config.autenticas_price_info || 'General ₡7.500 / Gold ₡12.000'}
          </p>
        </div>
      </div>

      {/* 4. CARRETE / CAROUSEL DE FOTOS */}
      {gallery.length > 0 && (
        <div style={{
          position: 'relative',
          maxWidth: '800px',
          margin: '0 auto 40px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(44, 26, 14, 0.15)',
          border: '2px solid var(--accent-beige-border)'
        }}>
          <div style={{
            width: '100%',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F3EFE9',
            position: 'relative'
          }}>
            <img 
              src={gallery[currentSlide].startsWith('http') ? gallery[currentSlide] : `${API_URL}${gallery[currentSlide]}`} 
              alt={`Slide ${currentSlide + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'opacity 0.5s ease'
              }}
            />

            {/* Slider Navigation Buttons */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={handlePrevSlide}
                  style={{
                    position: 'absolute',
                    left: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: 'var(--accent-coffee)',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 2
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNextSlide}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: 'var(--accent-coffee)',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 2
                  }}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Indicator Dots */}
            {gallery.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '16px',
                display: 'flex',
                gap: '8px',
                zIndex: 2
              }}>
                {gallery.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: currentSlide === i ? 'var(--accent-coffee)' : 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. ACTION BUTTON TO SCROLL TO MAP */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={onScrollToMap}
          className="btn-primary"
          style={{
            padding: '16px 44px',
            fontSize: '1.15rem',
            fontWeight: 800,
            borderRadius: '50px',
            boxShadow: '0 10px 25px rgba(44, 26, 14, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            border: 'none'
          }}
        >
          <ShoppingCart size={20} />
          <span>Comprar Boletos / Seleccionar Asiento</span>
        </button>
      </div>

    </div>
  );
}
