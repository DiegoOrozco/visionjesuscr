import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowRight, Sparkles, Ticket, ShieldCheck, Menu, X, Filter, Clock, Tag } from 'lucide-react';

export default function CongresosPage({ config = {}, onSelectEvent }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeYear, setActiveYear] = useState('todos'); // 'todos' | '2026' | '2027'
  const [activeCategory, setActiveCategory] = useState('Todas'); // 'Todas' | 'Congresos' | 'Adoración' | 'Jóvenes'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allEvents = [
    {
      id: 'autenticas',
      year: '2026',
      category: 'Congresos',
      title: 'Congreso Mujeres Auténticas 2026',
      subtitle: 'Edición Especial • Sanidad & Dignidad',
      status: 'Entradas Disponibles',
      statusColor: '#10B981',
      date: 'Viernes 18 y Sábado 19 de Noviembre, 2026',
      time: '7:00 PM',
      location: 'Auditorio Visión Jesús, Desamparados, CR',
      image: config.autenticas_hero_bg || '/logo_oficial_transparente.png',
      description: 'El congreso anual para mujeres que deciden sanar sus heridas, abrazar su historia y descubrir la belleza que Dios ha trazado en cada cicatriz.',
      url: '/autenticas',
      featured: true,
      priceInfo: 'Gold: ₡12.000 / General: ₡7.500'
    },
    {
      id: 'sanados',
      year: '2026',
      category: 'Adoración',
      title: 'Noche de Milagros - Sanados para Sanar 2026',
      subtitle: 'Unción, Sanidad Interior y Restauración',
      status: 'Entrada Libre',
      statusColor: '#0033FF',
      date: 'Sábado 28 de Noviembre, 2026',
      time: '6:30 PM',
      location: 'Auditorio Principal Visión Jesús',
      image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1000',
      description: 'Un tiempo especial consagrado para la intercesión, oración por los enfermos y manifestación del poder de Dios en las familias.',
      url: '/oracion',
      featured: false,
      priceInfo: 'Entrada Gratuita • Cupo Limitado'
    },
    {
      id: 'fiesta2026',
      year: '2026',
      category: 'Congregacional',
      title: 'Cierre Anual de Acción de Gracias 2026',
      subtitle: 'Celebración & Noche de Gratitud',
      status: 'Próximamente',
      statusColor: '#F59E0B',
      date: 'Domingo 20 de Diciembre, 2026',
      time: '5:00 PM',
      location: 'Auditorio Principal Visión Jesús',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000',
      description: 'Gran servicio congregacional para dar gracias a Dios por cada victoria del año 2026 y consagrar los proyectos del nuevo año.',
      url: '/#horarios-section',
      featured: false,
      priceInfo: 'Entrada Gratuita'
    },
    {
      id: 'liderazgo2027',
      year: '2027',
      category: 'Congresos',
      title: 'Congreso Internacional de Liderazgo 2027',
      subtitle: 'Equipamiento & Visión del Reino',
      status: 'Proyección 2027',
      statusColor: '#977DFF',
      date: 'Febrero 2027',
      time: 'Por Confirmar',
      location: 'Auditorio Principal Visión Jesús',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000',
      description: 'Capacitación intensiva para pastores, líderes de célula y servidores. Herramientas prácticas y principios apostólicos para el crecimiento.',
      url: '/modelo',
      featured: false,
      priceInfo: 'Detalles de inscripción en Enero 2027'
    },
    {
      id: 'move2027',
      year: '2027',
      category: 'Jóvenes',
      title: 'Encuentro MOVE Jóvenes 2027',
      subtitle: 'Generación sin Reservas',
      status: 'Proyección 2027',
      statusColor: '#977DFF',
      date: 'Mayo 2027',
      time: '5:30 PM',
      location: 'Sede Desamparados',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000',
      description: 'El movimiento juvenil de Visión Jesús en un festival de alabanza, adoración extrema y mensaje transformador para adolescentes y jóvenes.',
      url: '/#contacto-section',
      featured: false,
      priceInfo: 'Entrada Gratuita'
    },
    {
      id: 'fuxion2027',
      year: '2027',
      category: 'Congresos',
      title: 'Congreso de Hombres & Familias FUXION 2027',
      subtitle: 'Varones de Carácter & Sacerdocio',
      status: 'Proyección 2027',
      statusColor: '#977DFF',
      date: 'Julio 2027',
      time: 'Por Confirmar',
      location: 'Auditorio Principal',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000',
      description: 'Congreso enfocado en afirma la identidad del hombre como sacerdote del hogar, líder espiritual y testimonio activo en la sociedad.',
      url: '/modelo',
      featured: false,
      priceInfo: 'Próximamente'
    }
  ];

  const handleEventClick = (evt) => {
    if (evt.id === 'autenticas') {
      window.location.href = '/autenticas';
    } else {
      window.location.href = evt.url;
    }
  };

  const filteredEvents = allEvents.filter(evt => {
    const matchesYear = activeYear === 'todos' || evt.year === activeYear;
    const matchesCategory = activeCategory === 'Todas' || evt.category === activeCategory;
    return matchesYear && matchesCategory;
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030812',
      color: '#FFFFFF',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* 0. APPLE FLOATING FROSTED NAVBAR */}
      <div className="apple-nav-wrapper" style={{ top: isScrolled ? '12px' : '20px' }}>
        <header 
          className={`apple-nav-bar ${isScrolled ? 'apple-nav-scrolled' : ''}`}
          style={{ maxWidth: isScrolled ? '1060px' : '1140px' }}
        >
          {/* LOGO */}
          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => window.location.href = '/'}
          >
            <img 
              src="/logo_oficial_transparente.png" 
              alt="Visión Jesús Logo" 
              style={{ height: isScrolled ? '38px' : '44px', objectFit: 'contain' }} 
            />
          </div>

          {/* DESKTOP MENU LINKS */}
          <nav className="apple-nav-links">
            <a href="/" className="apple-nav-link" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>Inicio</a>
            <a href="/nosotros" className="apple-nav-link" onClick={(e) => { e.preventDefault(); window.location.href = '/nosotros'; }}>Nosotros</a>
            <a href="/modelo" className="apple-nav-link" onClick={(e) => { e.preventDefault(); window.location.href = '/modelo'; }}>Modelo de Jesús</a>
            <a href="/grupos-de-amistad" className="apple-nav-link" onClick={(e) => { e.preventDefault(); window.location.href = '/grupos-de-amistad'; }}>Grupos de Amistad</a>
            <a href="/eventos" className="apple-nav-link active" onClick={(e) => { e.preventDefault(); }}>Eventos</a>
            <a href="/oracion" className="apple-nav-link" onClick={(e) => { e.preventDefault(); window.location.href = '/oracion'; }}>Oración</a>
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
            <a href="/" className="apple-nav-link">Inicio</a>
            <a href="/nosotros" className="apple-nav-link">Nosotros</a>
            <a href="/modelo" className="apple-nav-link">Modelo de Jesús</a>
            <a href="/grupos-de-amistad" className="apple-nav-link">Grupos de Amistad</a>
            <a href="/eventos" className="apple-nav-link active">Eventos</a>
            <a href="/oracion" className="apple-nav-link">Oración</a>
          </div>
        )}
      </div>

      {/* HERO SECTION */}
      <section style={{
        padding: 'clamp(120px, 16vh, 160px) 20px 40px',
        textAlign: 'center',
        position: 'relative',
        background: 'radial-gradient(circle at 50% 20%, rgba(0, 51, 255, 0.2) 0%, rgba(3, 8, 18, 1) 75%)'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div className="apple-kicker">
            <span className="apple-kicker-dot"></span>
            <span>CARTELERA & AGENDA INSTITUCIONAL</span>
          </div>

          <h1 className="apple-hero-headline apple-gradient-text" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)', marginBottom: '16px' }}>
            Eventos Visión Jesús
          </h1>

          <p className="apple-hero-subtitle" style={{ maxWidth: '680px', margin: '0 auto 30px' }}>
            Descubre nuestras actividades especiales para el **cierre del 2026** y la **proyección del año 2027**. Selecciona el evento para ver detalles y registrarte.
          </p>

          {/* YEAR FILTER TABS */}
          <div style={{
            display: 'inline-flex',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '6px',
            borderRadius: '50px',
            backdropFilter: 'blur(16px)'
          }}>
            <button
              onClick={() => setActiveYear('todos')}
              style={{
                padding: '8px 20px',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: 'none',
                background: activeYear === 'todos' ? 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)' : 'transparent',
                color: activeYear === 'todos' ? '#FFFFFF' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ⚡ Todos los Eventos
            </button>

            <button
              onClick={() => setActiveYear('2026')}
              style={{
                padding: '8px 20px',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: 'none',
                background: activeYear === '2026' ? 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)' : 'transparent',
                color: activeYear === '2026' ? '#FFFFFF' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📅 Cierre 2026
            </button>

            <button
              onClick={() => setActiveYear('2027')}
              style={{
                padding: '8px 20px',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: 'none',
                background: activeYear === '2027' ? 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)' : 'transparent',
                color: activeYear === '2027' ? '#FFFFFF' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🚀 Proyección 2027
            </button>
          </div>
        </div>
      </section>

      {/* EVENTS GRID */}
      <section style={{ padding: '20px 20px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '30px'
        }}>
          {filteredEvents.map((evt) => (
            <div 
              key={evt.id}
              onClick={() => handleEventClick(evt)}
              className="apple-bento-card"
              style={{
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(151, 125, 255, 0.2)',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'rgba(0, 3, 61, 0.45)',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Event Image Banner */}
              <div style={{
                height: '220px',
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img 
                  src={evt.image} 
                  alt={evt.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                />
                
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(3, 8, 18, 0.2) 0%, rgba(3, 8, 18, 0.95) 100%)'
                }} />

                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: evt.statusColor,
                  color: '#FFFFFF',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  {evt.status}
                </div>

                {/* Year Pill */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(3, 8, 18, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#EAEDF8',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}>
                  {evt.year}
                </div>
              </div>

              {/* Event Card Body */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#977DFF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                  {evt.subtitle}
                </span>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px', lineHeight: 1.25, letterSpacing: '-0.3px' }}>
                  {evt.title}
                </h3>

                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
                  {evt.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EAEDF8', fontSize: '0.88rem' }}>
                    <Calendar size={15} style={{ color: '#977DFF', flexShrink: 0 }} />
                    <span>{evt.date}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EAEDF8', fontSize: '0.88rem' }}>
                    <MapPin size={15} style={{ color: '#977DFF', flexShrink: 0 }} />
                    <span>{evt.location}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '0.88rem', fontWeight: 700 }}>
                    <Tag size={15} style={{ flexShrink: 0 }} />
                    <span>{evt.priceInfo}</span>
                  </div>
                </div>

                <button 
                  className="apple-btn apple-btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    borderRadius: '50px',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}
                >
                  <span>{evt.id === 'autenticas' ? 'Reservar Entradas' : 'Ver Detalles del Evento'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
