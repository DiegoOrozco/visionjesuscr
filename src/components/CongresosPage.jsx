import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Sparkles, Ticket, ShieldCheck, Menu, X } from 'lucide-react';

export default function CongresosPage({ config = {}, onSelectEvent }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const events = [
    {
      id: 'autenticas',
      title: 'Congreso Mujeres Auténticas 2026',
      subtitle: 'Edición Especial • Mujer Valiente',
      status: 'Entradas Disponibles',
      statusColor: '#34C759',
      date: 'Viernes 18 y Sábado 19 de Octubre, 2026',
      location: 'Auditorio Visión Jesús, San José, CR',
      image: config.autenticas_hero_poster || '/logo.png',
      description: 'El congreso anual de mujeres que marcará un antes y un después. Taller especial "Entre Nosotras", mañana de sanidad, brunch exclusivo y conferencistas invitadas.',
      url: '/autenticas',
      featured: true,
      priceInfo: 'Gold: ₡15.000 • General: ₡10.000'
    },
    {
      id: 'sanados',
      title: 'Sanados para Sanar',
      subtitle: 'Milagros y Restauración',
      status: 'Próximamente',
      statusColor: '#0071E3',
      date: 'Temporada 2026',
      location: 'Auditorio Visión Jesús',
      image: '/logo_oficial_transparente.png',
      description: 'Un tiempo consagrado para recibir sanidad divina, liberación y restauración integral para toda la familia.',
      url: '/sanados',
      featured: false,
      priceInfo: 'Próximamente más detalles'
    }
  ];

  const handleEventClick = (evt) => {
    if (evt.id === 'autenticas') {
      window.location.href = '/autenticas';
    } else {
      window.location.href = evt.url;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--apple-bg-base)',
      color: '#FFFFFF',
      fontFamily: 'var(--apple-font)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* 0. APPLE FLOATING FROSTED NAVBAR */}
      <div className="apple-nav-wrapper" style={{
        top: isScrolled ? '12px' : '20px'
      }}>
        <header 
          className={`apple-nav-bar ${isScrolled ? 'apple-nav-scrolled' : ''}`}
          style={{
            maxWidth: isScrolled ? '1060px' : '1140px'
          }}
        >
          {/* LOGO */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onClick={() => window.location.href = '/'}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img 
              src="/logo_oficial_transparente.png" 
              alt="Visión Jesús Logo" 
              style={{ 
                height: isScrolled ? '38px' : '44px', 
                objectFit: 'contain',
                transition: 'height 0.3s ease',
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))'
              }} 
            />
          </div>

          {/* DESKTOP MENU LINKS */}
          <nav className="apple-nav-links">
            <a 
              href="/" 
              className="apple-nav-link"
              onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
            >
              Inicio
            </a>
            <a 
              href="/nosotros" 
              className="apple-nav-link"
              onClick={(e) => { e.preventDefault(); window.location.href = '/nosotros'; }}
            >
              Nosotros
            </a>
            <a 
              href="/modelo" 
              className="apple-nav-link"
              onClick={(e) => { e.preventDefault(); window.location.href = '/modelo'; }}
            >
              Modelo de Jesús
            </a>
            <a 
              href="/congresos" 
              className="apple-nav-link active"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Congresos
            </a>
            <a 
              href="/#contacto-section" 
              className="apple-nav-link"
              onClick={(e) => { e.preventDefault(); window.location.href = '/#contacto-section'; }}
            >
              Contacto
            </a>
          </nav>

          {/* RIGHT ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={() => window.location.href = '/autenticas'}
              className="apple-btn apple-btn-accent"
              style={{ fontSize: '0.82rem', padding: '8px 18px', borderRadius: '9999px' }}
            >
              <Ticket size={15} />
              <span>Congreso 2026</span>
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="apple-mobile-menu-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '9999px',
                padding: '8px',
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        {/* Mobile Sheet */}
        {mobileMenuOpen && (
          <div className="apple-mobile-sheet">
            <a href="/" className="apple-nav-link" style={{ fontSize: '1rem', padding: '10px 14px' }}>Inicio</a>
            <a href="/nosotros" className="apple-nav-link" style={{ fontSize: '1rem', padding: '10px 14px' }}>Nosotros</a>
            <a href="/modelo" className="apple-nav-link" style={{ fontSize: '1rem', padding: '10px 14px' }}>Modelo de Jesús</a>
            <a href="/congresos" className="apple-nav-link active" style={{ fontSize: '1rem', padding: '10px 14px' }}>Congresos</a>
            <a href="/#contacto-section" className="apple-nav-link" style={{ fontSize: '1rem', padding: '10px 14px' }}>Contacto</a>
          </div>
        )}
      </div>

      {/* HERO SECTION CATALOG - APPLE CINEMATIC */}
      <section style={{
        padding: 'clamp(140px, 18vh, 180px) 20px 40px 20px',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Apple Ambient Center Light */}
        <div 
          className="apple-ambient-glow"
          style={{
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(151, 125, 255, 0.18) 0%, rgba(0, 113, 227, 0.08) 50%, transparent 80%)'
          }}
        />

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="apple-kicker">
            <span className="apple-kicker-dot"></span>
            <span>Acceso & Reservas Oficiales</span>
          </div>

          <h1 className="apple-hero-headline apple-gradient-text" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)', marginBottom: '16px' }}>
            Nuestros Eventos
          </h1>

          <p className="apple-hero-subtitle" style={{ maxWidth: '620px', marginBottom: '0' }}>
            Descubre nuestras conferencias, congresos y actividades especiales. Selecciona el evento para ver detalles y reservar tu lugar.
          </p>
        </div>
      </section>

      {/* EVENTS GRID CATALOG */}
      <section style={{ padding: '40px 20px 100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '30px'
        }}>
          {events.map((evt) => (
            <div 
              key={evt.id}
              onClick={() => handleEventClick(evt)}
              className="apple-bento-card"
              style={{
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Event Image Banner */}
              <div style={{
                height: '250px',
                width: '100%',
                backgroundColor: 'var(--apple-bg-surface-elevated)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src={evt.image} 
                  alt={evt.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: evt.id === 'autenticas' ? 'cover' : 'contain',
                    padding: evt.id === 'autenticas' ? '0' : '30px',
                    opacity: 0.92,
                    transition: 'transform 0.45s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(14, 14, 20, 0.85) 100%)'
                }} />

                {/* Status Badge - Apple Pill */}
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  color: evt.statusColor,
                  border: `1px solid ${evt.statusColor}40`,
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}>
                  {evt.status}
                </span>
              </div>

              {/* Event Content */}
              <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: 'var(--apple-text-secondary)',
                  letterSpacing: '0.04em',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  {evt.subtitle}
                </span>

                <h2 style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: '0 0 10px 0',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25
                }}>
                  {evt.title}
                </h2>

                <p style={{
                  fontSize: '0.94rem',
                  color: 'var(--apple-text-secondary)',
                  lineHeight: 1.55,
                  marginBottom: '20px',
                  flex: 1
                }}>
                  {evt.description}
                </p>

                {/* Date & Location Capsule */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '14px 18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  marginBottom: '24px',
                  fontSize: '0.84rem',
                  color: 'var(--apple-text-primary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} color="var(--apple-purple)" />
                    <span>{evt.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={15} color="var(--apple-purple)" />
                    <span>{evt.location}</span>
                  </div>
                </div>

                {/* Footer Price & Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginTop: 'auto'
                }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--apple-text-secondary)', fontWeight: 500 }}>
                    {evt.priceInfo}
                  </span>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(evt);
                    }}
                    className={`apple-btn ${evt.featured ? 'apple-btn-primary' : 'apple-btn-secondary'}`}
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.84rem'
                    }}
                  >
                    <span>{evt.featured ? 'Ver Detalles' : 'Información'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '30px 20px',
        textAlign: 'center',
        color: '#64748B',
        fontSize: '0.85rem'
      }}>
        © {new Date().getFullYear()} Iglesia Visión Jesús. Todos los derechos reservados.
      </footer>
    </div>
  );
}
