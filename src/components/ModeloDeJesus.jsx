import React, { useState, useEffect } from 'react';
import { Users, Heart, Sparkles, ChevronRight, MessageCircle, Instagram, Facebook, ArrowRight, Flame, Shield, Gem, Award, Calendar } from 'lucide-react';

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

const AnimatedSection = ({ children, className = '', style = {}, delay = 0, id }) => {
  const [setRef, visible] = useOnScreen();
  return (
    <div
      id={id}
      ref={setRef}
      className={`${className} ${visible ? 'au-in-view' : 'au-out-view'}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const renderNetworkIcon = (iconName, netId) => {
  if (iconName === 'Gem' || netId === 'diamante') return <Gem size={20} />;
  if (iconName === 'Heart' || netId === 'vj-kids') return <Heart size={20} />;
  if (iconName === 'Flame' || netId === 'prejuz-move') return <Flame size={20} />;
  if (iconName === 'Shield' || netId === 'fuxion') return <Shield size={20} />;
  if (iconName === 'Award' || netId === 'move-plus') return <Award size={20} />;
  return <Sparkles size={20} />;
};

export default function ModeloDeJesus({ config = {}, onGoHome }) {
  const title = config.modelo_title || 'MODELO DE JESÚS';
  const subtitle = config.modelo_subtitle || 'Trabajamos con redes y grupos organizados que cuidan de las personas en cada etapa de su vida, formando líderes con carácter y corazón de servicio.';

  const rawBg = config.modelo_hero_bg || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600';
  const heroBg = rawBg.startsWith('http') ? rawBg : `${API_URL}${rawBg}`;

  // Dynamic Networks / Ministries configuration or fallbacks
  let networks = [];
  try {
    if (config.modelo_networks) {
      networks = typeof config.modelo_networks === 'string' ? JSON.parse(config.modelo_networks) : config.modelo_networks;
    }
  } catch (e) {
    console.error('Error parsing modelo_networks:', e);
  }

  if (!networks || networks.length === 0) {
    networks = [
      {
        id: 'vj-kids',
        name: 'VJ Kids',
        badge: 'Red de Niños',
        age: 'De 0 a 9 años',
        iconName: 'Heart',
        logo: '',
        description: 'Trabajamos con niños en grupos de acuerdo a sus edades. Nuestras enseñanzas para los más pequeños están basadas en Principios y Valores del Reino donde no solo formamos, sino que también pastoreamos con amor y dedicación.',
        image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=1000',
        instagram: '',
        facebook: '',
        whatsapp: ''
      },
      {
        id: 'prejuz-move',
        name: 'PreJuzMOVE',
        badge: 'Red de Preadolescentes',
        age: 'De 10 a 12 años',
        iconName: 'Flame',
        logo: '',
        description: 'Un espacio dinámico e interactivo diseñado especialmente para preadolescentes. Guiamos a los chicos en la transición clave hacia la juventud, cimentando principios bíblicos, valor propio y verdaderas amistades.',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000',
        instagram: '',
        facebook: '',
        whatsapp: ''
      },
      {
        id: 'move-teens',
        name: 'MOVE',
        badge: 'Red de Adolescentes',
        age: 'De 13 a 17 años',
        iconName: 'Sparkles',
        logo: '',
        description: 'Somos el espacio donde los adolescentes encuentran propósito, pertenencia y una relación sana con Dios. Un ambiente libre de señalamientos y críticas, enfocado en guiarles con amor perfecto a una vida transformadora.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000',
        instagram: '',
        facebook: '',
        whatsapp: ''
      },
      {
        id: 'move-plus',
        name: 'MOVE PLUS',
        badge: 'Red de Jóvenes Adultos',
        age: 'De 18 en adelante',
        iconName: 'Award',
        logo: '',
        description: 'Una generación determinada a dejar huella en nuestro país y fronteras. Formamos jóvenes con identidad, carácter y crecimiento integral en sus áreas espiritual, profesional y personal para ser de alta influencia.',
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000',
        instagram: '',
        facebook: '',
        whatsapp: ''
      },
      {
        id: 'fuxion',
        name: 'FUXION',
        badge: 'Red de Adultos',
        age: 'Adultos y Familias',
        iconName: 'Shield',
        logo: '',
        description: 'Unidos en fe, familia y propósito. Nos enfocamos en consolidar la unidad familiar, matrimonios fuertes y el crecimiento espiritual de cada hombre y mujer sobre los fundamentos firmes del Evangelio de Jesucristo.',
        image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000',
        instagram: '',
        facebook: '',
        whatsapp: ''
      },
      {
        id: 'diamante',
        name: 'DIAMANTE',
        badge: 'Red de Adultos Mayores',
        age: 'Adultos Mayores / Plenitud',
        iconName: 'Gem',
        logo: '',
        description: 'Un espacio de honra, fraternidad y legado. Promovemos una plenitud activa en fe, compartiendo la sabiduría acumulada, la oración continua y el gozo en cada reunión y actividad especial.',
        image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000',
        instagram: '',
        facebook: '',
        whatsapp: ''
      }
    ];
  }

  return (
    <div style={{
      backgroundColor: '#030812',
      color: '#FFFFFF',
      minHeight: '100vh',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* Dynamic Keyframes CSS */}
      <style>{`
        .au-out-view {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .au-in-view {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .network-card {
          background: rgba(0, 3, 61, 0.5);
          border: 1px solid rgba(151, 125, 255, 0.15);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s ease;
          backdrop-filter: blur(12px);
        }
        .network-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0, 51, 255, 0.5);
          box-shadow: 0 20px 40px rgba(0, 51, 255, 0.25);
        }
      `}</style>

      {/* APPLE FLOATING FROSTED GLASS HEADER */}
      <div className="apple-nav-wrapper">
        <header className="apple-nav-bar">
          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => window.location.href = '/'}
          >
            <img 
              src="/logo_oficial_transparente.png" 
              alt="Visión Jesús Logo" 
              style={{ height: '46px', objectFit: 'contain' }} 
            />
          </div>

          <nav className="apple-nav-links">
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} 
              className="apple-nav-link"
            >
              Inicio
            </a>

            <a 
              href="/nosotros" 
              onClick={(e) => { e.preventDefault(); window.location.href = '/nosotros'; }} 
              className="apple-nav-link"
            >
              Nosotros
            </a>

            <a 
              href="/modelo" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="apple-nav-link"
              style={{ color: '#FFFFFF' }}
            >
              Modelo de Jesús
            </a>

            <a 
              href="/grupos-de-amistad" 
              onClick={(e) => { e.preventDefault(); window.location.href = '/grupos-de-amistad'; }} 
              className="apple-nav-link"
            >
              Grupos de Amistad
            </a>

            <a 
              href="/eventos" 
              onClick={(e) => { e.preventDefault(); window.location.href = '/eventos'; }} 
              className="apple-nav-link"
            >
              Eventos
            </a>

            <a 
              href="/oracion" 
              onClick={(e) => { e.preventDefault(); window.location.href = '/oracion'; }} 
              className="apple-nav-link"
            >
              Oración & Testimonios
            </a>

            <a 
              href="/donar" 
              onClick={(e) => { e.preventDefault(); window.location.href = '/donar'; }} 
              className="apple-nav-link"
            >
              Donar
            </a>

            <a 
              href="/#contacto-section" 
              onClick={(e) => { e.preventDefault(); window.location.href = '/#contacto-section'; }} 
              className="apple-nav-link"
            >
              Contacto
            </a>
          </nav>

          {/* Admin Profile Controls */}
          {(() => {
            const currentAdmin = (localStorage.getItem('admin_user') ? JSON.parse(localStorage.getItem('admin_user')) : null);
            if (!currentAdmin) return null;
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
                {(currentAdmin.role === 'admin' || currentAdmin.role === 'scanner') && (
                  <button 
                    onClick={() => window.location.href = '/escanear'}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '0.8rem', padding: '6px 14px',
                      fontWeight: 800, borderRadius: '50px',
                      border: '1px solid #977DFF',
                      backgroundColor: 'rgba(151, 125, 255, 0.15)',
                      color: '#977DFF', cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    📱 Escáner Puerta
                  </button>
                )}

                {currentAdmin.role !== 'scanner' && (
                  <button 
                    onClick={() => window.location.href = '/admin'}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '0.8rem', padding: '6px 14px',
                      fontWeight: 800, borderRadius: '50px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)',
                      color: '#FFFFFF', cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0, 51, 255, 0.4)',
                      textTransform: 'uppercase'
                    }}
                  >
                    🛡️ Panel Admin ({currentAdmin.username})
                  </button>
                )}

                <button 
                  onClick={() => {
                    localStorage.removeItem('admin_user');
                    window.location.href = '/';
                  }}
                  style={{
                    fontSize: '0.8rem', color: '#FF4D4D', background: 'none',
                    border: 'none', textDecoration: 'underline', cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  Salir
                </button>
              </div>
            );
          })()}

          <button 
            onClick={() => window.location.href = '/eventos'}
            className="apple-btn apple-btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <Calendar size={14} />
            <span>Eventos</span>
          </button>
        </header>
      </div>

      {/* HERO SECTION */}
      <div style={{
        position: 'relative',
        minHeight: '65vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(180deg, rgba(3, 8, 18, 0.75) 0%, rgba(3, 8, 18, 0.98) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        padding: '100px 20px 60px'
      }}>
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 51, 255, 0.25) 0%, rgba(151, 125, 255, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ zIndex: 1, maxWidth: '850px', margin: '0 auto' }}>
          <AnimatedSection>
            <span style={{
              backgroundColor: 'rgba(0, 51, 255, 0.15)',
              border: '1px solid rgba(151, 125, 255, 0.3)',
              color: '#977DFF',
              padding: '6px 20px',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <Users size={16} /> NUESTRAS REDES Y MINISTERIOS
            </span>

            <h1 style={{
              fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {title}
            </h1>

            <p style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: '#94A3B8',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 30px'
            }}>
              {subtitle}
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* NETWORKS / REDES CONTAINER */}
      <div className="container" style={{ padding: '40px 20px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        <AnimatedSection delay={100}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
              Formando Carácter a la Semejanza de Cristo
            </h2>
            <div style={{ height: '4px', width: '60px', background: 'linear-gradient(90deg, #0033FF, #977DFF)', margin: '0 auto 16px', borderRadius: '2px' }} />
            <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Acompañamos cada etapa del desarrollo espiritual de nuestras familias a través de grupos integrados.
            </p>
          </div>
        </AnimatedSection>

        {/* NETWORKS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {networks.map((net, idx) => {
            const netImg = net.image 
              ? (net.image.startsWith('http') ? net.image : `${API_URL}${net.image}`)
              : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000';

            return (
              <AnimatedSection key={net.id || idx} delay={150 + idx * 100}>
                <div className="network-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  
                  {/* Image container */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img
                      src={netImg}
                      alt={net.name}
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
                      background: 'linear-gradient(180deg, rgba(3, 8, 18, 0.1) 0%, rgba(0, 3, 61, 0.95) 100%)'
                    }} />

                    {/* Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: 'rgba(0, 51, 255, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFFFFF',
                      padding: '4px 14px',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {net.badge || 'Red de Iglesia'}
                    </div>

                    {/* Age */}
                    {net.age && (
                      <div style={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                        backgroundColor: 'rgba(3, 8, 18, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(151, 125, 255, 0.25)',
                        color: '#EAEDF8',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        {net.age}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '12px' }}>
                      <h3 style={{
                        fontSize: '1.6rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                        margin: 0,
                        letterSpacing: '-0.5px'
                      }}>
                        {net.name}
                      </h3>

                      {net.logo ? (
                        <div style={{
                          padding: '6px 12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <img
                            src={net.logo.startsWith('http') || net.logo.startsWith('/') ? (net.logo.startsWith('/') ? `${API_URL}${net.logo}` : net.logo) : `${API_URL}/${net.logo}`}
                            alt={`Logo ${net.name}`}
                            style={{ height: '32px', maxWidth: '90px', objectFit: 'contain' }}
                          />
                        </div>
                      ) : (
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, rgba(0, 51, 255, 0.25) 0%, rgba(151, 125, 255, 0.2) 100%)',
                          border: '1px solid rgba(151, 125, 255, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#977DFF',
                          boxShadow: '0 4px 12px rgba(0, 51, 255, 0.2)',
                          flexShrink: 0
                        }}>
                          {renderNetworkIcon(net.iconName, net.id)}
                        </div>
                      )}
                    </div>

                    <p style={{
                      color: '#94A3B8',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      marginBottom: '24px',
                      flex: 1
                    }}>
                      {net.description}
                    </p>

                    {/* Links & Socials */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      paddingTop: '16px',
                      marginTop: 'auto'
                    }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {net.instagram && (
                          <a
                            href={net.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#94A3B8',
                              padding: '8px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#977DFF'; e.currentTarget.style.backgroundColor = 'rgba(151,125,255,0.15)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                          >
                            <Instagram size={18} />
                          </a>
                        )}
                        {net.facebook && (
                          <a
                            href={net.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#94A3B8',
                              padding: '8px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#0033FF'; e.currentTarget.style.backgroundColor = 'rgba(0,51,255,0.15)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                          >
                            <Facebook size={18} />
                          </a>
                        )}
                      </div>

                      {net.whatsapp ? (
                        <a
                          href={net.whatsapp.startsWith('http') ? net.whatsapp : `https://wa.me/${net.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            color: '#4ADE80',
                            padding: '8px 16px',
                            borderRadius: '50px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            textDecoration: 'none'
                          }}
                        >
                          <MessageCircle size={15} />
                          <span>Más Información</span>
                        </a>
                      ) : (
                        <button
                          onClick={onGoHome}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'rgba(0, 51, 255, 0.15)',
                            border: '1px solid rgba(151, 125, 255, 0.3)',
                            color: '#977DFF',
                            padding: '8px 16px',
                            borderRadius: '50px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <span>Visión Jesús</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>

      {/* FOOTER VISIÓN JESÚS */}
      <footer style={{
        backgroundColor: '#04060A',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        color: '#94A3B8',
        padding: '30px 20px',
        fontSize: '0.88rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/logo_oficial_transparente.png" 
            alt="Visión Jesús Logo" 
            style={{ height: '40px', objectFit: 'contain', opacity: 0.8 }}
          />
          <p style={{ margin: 0, fontSize: '0.85rem' }}>© 2026 Iglesia Visión Jesús • Modelo de Jesús</p>
        </div>
      </footer>
    </div>
  );
}
