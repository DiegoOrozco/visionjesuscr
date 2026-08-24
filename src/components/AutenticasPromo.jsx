import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ChevronLeft, ChevronRight, ShoppingCart, Star, Navigation, Ticket, Map } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

// Hook for scroll animations
function useOnScreen(options = { threshold: 0.1 }) {
  const [ref, setRef] = useState(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(ref);
      }
    }, options);
    observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, options]);
  return [setRef, visible];
}

const AnimatedSection = ({ children, className = '', style = {}, delay = 0 }) => {
  const [setRef, visible] = useOnScreen();
  return (
    <div
      ref={setRef}
      className={`${className} ${visible ? 'au-in-view' : 'au-out-view'}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function AutenticasPromo({ config, onScrollToMap }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Fecha del evento: 18 y 19 de septiembre a las 7pm
  // El contador apuntará al 18 de septiembre a las 19:00
  const eventDateString = config.autenticas_date_countdown || '2026-09-18T19:00:00';
  
  useEffect(() => {
    let targetDate = new Date(eventDateString).getTime();

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const distance = targetDate - currentTime;
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [eventDateString]);

  // Gallery
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

  useEffect(() => {
    if (gallery.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % gallery.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [gallery.length]);

  const handlePrevSlide = () => setCurrentSlide(prev => (prev - 1 + gallery.length) % gallery.length);
  const handleNextSlide = () => setCurrentSlide(prev => (prev + 1) % gallery.length);

  const heroVideoUrl = config.autenticas_hero_video 
    ? (config.autenticas_hero_video.startsWith('http') ? config.autenticas_hero_video : `${API_URL}${config.autenticas_hero_video}`)
    : 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-crowd-at-a-concert-4475-large.mp4';
    
  const heroImageUrl = config.autenticas_hero_bg 
    ? (config.autenticas_hero_bg.startsWith('http') ? config.autenticas_hero_bg : `${API_URL}${config.autenticas_hero_bg}`)
    : 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600';

  // Speakers (4 required, 2x2 grid)
  let speakers = [];
  try {
    if (config.autenticas_speakers) {
      speakers = typeof config.autenticas_speakers === 'string' ? JSON.parse(config.autenticas_speakers) : config.autenticas_speakers;
    }
  } catch (e) {
    console.error('Failed to parse autenticas speakers:', e);
  }
  if (!speakers || speakers.length === 0) {
    speakers = [
      { name: 'Pr. Rebeca López', title: 'Pastora Principal', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800' },
      { name: 'Invitada 2', title: 'Conferencista Internacional', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800' },
      { name: 'Invitada 3', title: 'Adoradora', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?q=80&w=800' },
      { name: 'Invitada 4', title: 'Salmista', img: 'https://images.unsplash.com/photo-1517486808906-6a1bd2597e12?q=80&w=800' }
    ];
  }

  // Presale Logic
  const presaleEndDate = new Date(config.autenticas_presale_end || '2026-08-31T23:59:59').getTime();
  const isPresale = new Date().getTime() <= presaleEndDate;

  const generalPrice = isPresale ? (config.autenticas_price_general_presale || '₡7.500') : (config.autenticas_price_general_regular || '₡10.000');
  const goldPrice = isPresale ? (config.autenticas_price_gold_presale || '₡12.000') : (config.autenticas_price_gold_regular || '₡15.000');

  return (
    <div className="au-wrapper">
      
      {/* 1. HERO BANNER "AUTÉNTICAS" */}
      <div className="au-hero">
        <video 
          className="au-hero-video"
          autoPlay loop muted playsInline
          poster={heroImageUrl}
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        <div className="au-hero-overlay" />
        <div className="au-hero-particles" />

        <div className="au-hero-content au-animate-up">
          <h1 className="au-hero-title au-glitch-effect" data-text={config.autenticas_title || 'AUTÉNTICAS'}>
            {config.autenticas_title || 'AUTÉNTICAS'}
          </h1>
          <h2 className="au-hero-subtitle au-animate-up au-delay-1">
            {config.autenticas_subtitle || 'CONGRESO DE MUJERES'}
          </h2>
          
          <div className="au-countdown au-animate-up au-delay-2">
            {[
              { val: timeLeft.days, label: 'Días' },
              { val: timeLeft.hours, label: 'Horas' },
              { val: timeLeft.minutes, label: 'Min' },
              { val: timeLeft.seconds, label: 'Seg' }
            ].map((item, idx) => (
              <div key={idx} className="au-countdown-item">
                <div className="au-countdown-ring"></div>
                <span className="au-countdown-val">{String(item.val).padStart(2, '0')}</span>
                <span className="au-countdown-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="au-animate-up au-delay-3" style={{ marginTop: '40px' }}>
            <button 
              onClick={() => {
                document.getElementById('accesos-section')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="au-glow-btn au-btn-primary"
            >
              <span className="au-btn-text">Reservar Mi Lugar</span>
              <span className="au-btn-icon"><ShoppingCart size={20} /></span>
            </button>
          </div>
        </div>
      </div>

      <div className="au-content-section">
        
        {/* 2. DESCRIPTION SECTION */}
        <AnimatedSection className="au-desc-box">
          <Star size={40} className="au-floating-star" />
          <p className="au-desc-text">
            {config.autenticas_description || 'El congreso anual para mujeres que deciden sanar sus heridas, abrazar su historia y descubrir la belleza que Dios ha trazado en cada una de sus cicatrices. Prepárate para dos días de adoración, palabra y milagros.'}
          </p>
        </AnimatedSection>

        {/* 3. EVENT DETAILS (Fecha y Lugar) */}
        <div className="au-details-grid">
          <AnimatedSection delay={100} className="au-glass-card">
            <div className="au-card-icon-wrapper">
              <Calendar className="au-card-icon" size={32} />
              <div className="au-icon-glow"></div>
            </div>
            <h4>Fecha y Hora</h4>
            <p>{config.autenticas_date_info || '18 y 19 de Setiembre - 7:00 PM'}</p>
          </AnimatedSection>

          <AnimatedSection delay={300} className="au-glass-card">
            <div className="au-card-icon-wrapper">
              <MapPin className="au-card-icon" size={32} />
              <div className="au-icon-glow"></div>
            </div>
            <h4>Ubicación</h4>
            <p>{config.autenticas_place_info || 'Auditorio principal Vision Jesus'}</p>
          </AnimatedSection>
        </div>

        {/* 4. ADQUIRIR ACCESOS (TICKETS) */}
        <AnimatedSection id="accesos-section" className="au-section-title-wrap" style={{ marginTop: '80px', marginBottom: '40px' }}>
          <h2 className="au-section-title">Adquirir Accesos</h2>
          <div className="au-title-divider"></div>
        </AnimatedSection>
        
        <div className="au-tickets-grid">
          {/* ACCESO GENERAL */}
          <AnimatedSection delay={100} className="au-ticket-card">
            {isPresale && <div className="au-presale-ribbon">PREVENTA</div>}
            <div className="au-ticket-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507676184212-d0330a156f88?q=80&w=800)' }}></div>
            <div className="au-ticket-overlay"></div>
            <div className="au-ticket-content">
              <span className="au-ticket-label">Acceso</span>
              <h3 className="au-ticket-name">GENERAL</h3>
              <ul className="au-ticket-features" style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', color: '#FFF', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <li>✔️ Viernes 18: Ingreso a las 7:00pm</li>
                <li>✔️ Sábado 19: Ingreso a las 5:00pm</li>
              </ul>
              <p className="au-ticket-price">{generalPrice}</p>
              <button onClick={() => onScrollToMap('general')} className="au-ticket-btn">
                <Ticket size={18} /> Comprar General
              </button>
            </div>
          </AnimatedSection>

          {/* ACCESO GOLD */}
          <AnimatedSection delay={300} className="au-ticket-card au-ticket-gold">
            {isPresale && <div className="au-presale-ribbon">PREVENTA</div>}
            <div className="au-ticket-bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1507676184212-d0330a156f88?q=80&w=800)' }}></div>
            <div className="au-ticket-overlay"></div>
            <div className="au-ticket-glow"></div>
            <div className="au-ticket-content">
              <span className="au-ticket-label">Acceso</span>
              <h3 className="au-ticket-name">GOLD</h3>
              <ul className="au-ticket-features" style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', color: '#FFF', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <li>⭐ Viernes 18: Ingreso a las 7:00pm</li>
                <li>⭐ Sábado 19: Mañana de sanidad a las 9:00am</li>
                <li>⭐ Taller "Entre nosotras"</li>
                <li>⭐ Brunch especial</li>
              </ul>
              <p className="au-ticket-price">{goldPrice}</p>
              <button onClick={() => onScrollToMap('gold')} className="au-ticket-btn">
                <Star size={18} /> Comprar Gold
              </button>
            </div>
          </AnimatedSection>
        </div>

        {/* 5. CÓMO LLEGAR */}
        <AnimatedSection delay={200} className="au-location-banner" style={{ marginTop: '80px', marginBottom: '80px' }}>
          <div className="au-location-bg"></div>
          <div className="au-location-content">
            <h2>¿CÓMO LLEGAR?</h2>
            <p>del Cementerio de San Antonio, 200mts NE.<br/>Auditorio principal Vision Jesus.</p>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a 
                href={config.autenticas_waze_url || "https://waze.com/ul?ll=9.897379,-84.066497&navigate=yes"}
                target="_blank" 
                rel="noopener noreferrer"
                className="au-waze-btn"
              >
                <Navigation size={24} />
                Waze
              </a>
              <a 
                href={config.autenticas_maps_url || "https://goo.gl/maps/PLACEHOLDER"}
                target="_blank" 
                rel="noopener noreferrer"
                className="au-google-btn"
              >
                <Map size={24} />
                Google Maps
              </a>
            </div>
          </div>
        </AnimatedSection>

        {/* 6. INVITADAS ESPECIALES */}
        <AnimatedSection className="au-section-title-wrap" style={{ marginBottom: '50px' }}>
          <h2 className="au-section-title">Invitadas Especiales</h2>
          <div className="au-title-divider"></div>
        </AnimatedSection>
        
        <div className="au-speakers-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px'
        }}>
          {speakers.map((s, idx) => (
            <AnimatedSection key={idx} delay={idx * 150} className="au-speaker-card">
              <div className="au-speaker-image-wrap">
                <img src={s.img} alt={s.name} />
                <div className="au-speaker-overlay"></div>
              </div>
              <div className="au-speaker-info">
                <h3 className="au-speaker-name">{s.name}</h3>
                <span className="au-speaker-title">{s.title}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* 7. CARRETE / CAROUSEL DE FOTOS */}
        {gallery.length > 0 && (
          <AnimatedSection className="au-gallery-section" style={{ marginTop: '100px', marginBottom: '100px' }}>
            <h2 className="au-section-title">Galería</h2>
            <div className="au-title-divider" style={{ marginBottom: '40px' }}></div>
            
            <div className="au-gallery-container">
              <img 
                src={gallery[currentSlide].startsWith('http') ? gallery[currentSlide] : `${API_URL}${gallery[currentSlide]}`} 
                alt={`Slide ${currentSlide + 1}`}
                className="au-gallery-img"
              />
              
              {gallery.length > 1 && (
                <div className="au-gallery-nav">
                  <button onClick={handlePrevSlide} className="au-gallery-btn"><ChevronLeft size={28} /></button>
                  <button onClick={handleNextSlide} className="au-gallery-btn"><ChevronRight size={28} /></button>
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

      </div>
    </div>
  );
}
