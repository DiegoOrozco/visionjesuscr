import React from 'react';
import { Calendar, MapPin, ArrowRight, Sparkles, Ticket } from 'lucide-react';

export default function CongresosPage({ config = {}, onSelectEvent }) {
  const events = [
    {
      id: 'autenticas',
      title: 'Congreso Mujeres Auténticas 2026',
      subtitle: 'EDICIÓN ESPECIAL • MUJER VALIENTE',
      status: 'ENTRADAS DISPONIBLES',
      statusColor: '#10B981',
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
      title: 'SANADOS PARA SANAR',
      subtitle: 'MILAGROS Y RESTAURACIÓN',
      status: 'PRÓXIMAMENTE',
      statusColor: '#3B82F6',
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
      backgroundColor: '#030812',
      color: '#FFFFFF',
      fontFamily: "'Outfit', 'Inter', sans-serif"
    }}>
      {/* HEADER OFFICIAL VISIÓN JESÚS */}
      <header style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(3, 8, 18, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* LOGO */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => window.location.href = '/'}
        >
          <img src="/logo_oficial_transparente.png" alt="Visión Jesús Logo" style={{ height: '58px', objectFit: 'contain' }} />
        </div>

        {/* MENU LINKS */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} 
            style={{ color: '#EAEDF8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#977DFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#EAEDF8'}
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
            href="/modelo" 
            onClick={(e) => { e.preventDefault(); window.location.href = '/modelo'; }} 
            style={{ color: '#EAEDF8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#977DFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#EAEDF8'}
          >
            MODELO DE JESÚS
          </a>

          <a 
            href="/congresos" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            style={{ color: '#977DFF', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
          >
            CONGRESOS
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

          <button 
            onClick={() => window.location.href = '/autenticas'}
            style={{
              background: 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50px',
              padding: '10px 24px',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '0.85rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 15px rgba(0, 51, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🎟️ CONGRESO 2026
          </button>
        </nav>
      </header>

      {/* HERO SECTION CATALOG */}
      <section style={{
        padding: '80px 20px 40px 20px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 20%, rgba(151, 125, 255, 0.15) 0%, rgba(3, 8, 18, 0) 70%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '2.5px',
            color: '#977DFF',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            ADQUIERE ACCESOS A
          </span>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 950,
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            NUESTROS EVENTOS
          </h1>
          <div style={{
            width: '40px',
            height: '4px',
            backgroundColor: '#977DFF',
            borderRadius: '2px',
            margin: '0 auto 24px auto'
          }}></div>
          <p style={{
            color: '#94A3B8',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
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
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: evt.featured ? '2px solid rgba(151, 125, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: evt.featured ? '0 20px 40px rgba(151, 125, 255, 0.15)' : '0 10px 30px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#977DFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = evt.featured ? 'rgba(151, 125, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)';
              }}
            >
              {/* Event Image Banner */}
              <div style={{
                height: '240px',
                width: '100%',
                backgroundColor: '#0F172A',
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
                    opacity: 0.9,
                    transition: 'transform 0.5s ease'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(3, 8, 18, 0.2) 0%, rgba(3, 8, 18, 0.9) 100%)'
                }} />

                {/* Status Badge */}
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: evt.statusColor,
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: '30px',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  letterSpacing: '1px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}>
                  {evt.status}
                </span>
              </div>

              {/* Event Content */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#977DFF',
                  letterSpacing: '1.5px',
                  marginBottom: '6px',
                  textTransform: 'uppercase'
                }}>
                  {evt.subtitle}
                </span>

                <h2 style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 12px 0',
                  lineHeight: 1.3
                }}>
                  {evt.title}
                </h2>

                <p style={{
                  fontSize: '0.9rem',
                  color: '#94A3B8',
                  lineHeight: 1.5,
                  marginBottom: '20px',
                  flex: 1
                }}>
                  {evt.description}
                </p>

                {/* Date & Location */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  fontSize: '0.83rem',
                  color: '#CBD5E1'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} color="#977DFF" />
                    <span>{evt.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="#977DFF" />
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
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
                    {evt.priceInfo}
                  </span>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(evt);
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: evt.featured ? '#0033FF' : 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      border: evt.featured ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '50px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: evt.featured ? '0 4px 15px rgba(0, 51, 255, 0.4)' : 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span>{evt.featured ? 'Ver Detalles' : 'Información'}</span>
                    <ArrowRight size={16} />
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
