import React from 'react';
import { Compass, Users, Heart, Coffee, Sparkles, MapPin, ArrowRight, ShieldCheck, Calendar, Clock, ChevronRight } from 'lucide-react';

export default function NosotrosPage({ config = {}, onGoHome }) {
  const API_URL = import.meta.env.VITE_API_URL || '';

  const heroBgRaw = config.nosotros_hero_bg || config.hero_bg || '';
  const heroBg = heroBgRaw
    ? (heroBgRaw.startsWith('http') ? heroBgRaw : `${API_URL}${heroBgRaw}`)
    : 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600';

  const title = config.nosotros_title || 'NOSOTROS • VISIÓN JESÚS';
  const subtitle = config.nosotros_subtitle || 'Una iglesia apasionada por la presencia de Dios, la familia y el discipulado.';

  const visionTitle = config.vision_title || 'NUESTRA VISIÓN';
  const visionText = config.vision_text || 'Evangelizar, Afirmar, Discipular y Enviar. Formar una generación de creyentes empoderados por el Espíritu Santo para impactar sus familias, comunidades y la sociedad.';

  const misionTitle = config.mision_title || 'NUESTRA MISIÓN';
  const misionText = config.mision_text || 'Llevar el evangelio de Jesucristo con poder y amor, construyendo una casa de adoración, fe y restauración donde cada persona descubra su propósito divino.';

  const valoresTitle = config.valores_title || 'NUESTROS VALORES';
  const valoresText = config.valores_text || 'Amor Incondicional, Excelencia en el Servicio, Integridad, Unidad Familiar y Apasionados por la Adoración.';

  const kickerText = config.nosotros_kicker !== undefined ? config.nosotros_kicker : 'CONOCÉ LA VISIÓN';
  const showKicker = config.nosotros_kicker_hidden !== true && config.nosotros_kicker_hidden !== 'true';
  const showButtons = config.nosotros_buttons_hidden !== true && config.nosotros_buttons_hidden !== 'true';
  const buttonsAlign = config.nosotros_buttons_align || 'center';

  let flexAlign = 'center';
  if (buttonsAlign === 'left') flexAlign = 'flex-start';
  if (buttonsAlign === 'right') flexAlign = 'flex-end';

  let nosotrosButtons = [];
  try {
    if (config.nosotros_buttons) {
      nosotrosButtons = typeof config.nosotros_buttons === 'string' ? JSON.parse(config.nosotros_buttons) : config.nosotros_buttons;
    }
  } catch (e) {
    console.error('Failed to parse nosotros_buttons:', e);
  }

  if (!nosotrosButtons || nosotrosButtons.length === 0) {
    nosotrosButtons = [
      { label: 'Unirte a un Grupo de Amistad', link: '/grupos-de-amistad', primary: true },
      { label: 'Horarios de Servicios', link: '/', primary: false }
    ];
  }

  // Parse 3 Columns Cards
  let cards = [];
  try {
    if (config.nosotros_cards) {
      cards = typeof config.nosotros_cards === 'string' ? JSON.parse(config.nosotros_cards) : config.nosotros_cards;
    }
  } catch (e) {
    console.error('Failed to parse nosotros_cards:', e);
  }

  if (!cards || cards.length === 0) {
    cards = [
      {
        id: 'vj-kids',
        title: 'VJ KIDS',
        tagline: 'FE Y DIVERSIÓN PARA LOS PEQUEÑOS',
        description: 'Un espacio especialmente preparado para que niños y niñas aprendan de la Palabra de Dios a través de dinámicas, alabanzas y enseñanzas interactivas.',
        badge: 'CADA SERVICIO',
        icon: 'Sparkles',
        image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=800'
      },
      {
        id: 'cafeteria',
        title: 'CAFETERÍA VISIÓN',
        tagline: 'COMPAÑERISMO Y CAFÉ DE ESPECIALIDAD',
        description: 'El lugar perfecto para conectar en comunidad, disfrutar de deliciosas bebidas y bocadillos, y compartir momentos especiales en familia antes y después del servicio.',
        badge: 'ABIERTO EN SERVICIOS',
        icon: 'Coffee',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800'
      },
      {
        id: 'grupos-amistad',
        title: 'GRUPOS DE AMISTAD',
        tagline: 'CRECER EN FAMILIA Y COMUNIDAD',
        description: 'Nuestra red de grupos pequeños y Casas de Paz distribuidas por cantones y zonas. Un ambiente cálido para edificar la fe, orar unos por otros y hacer verdaderos amigos.',
        badge: 'SEMANAL',
        icon: 'Users',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800',
        link: '/grupos-de-amistad'
      }
    ];
  }

  // Parse Pastors Profile
  let pastores = [];
  try {
    if (config.pastores_profiles) {
      pastores = typeof config.pastores_profiles === 'string' ? JSON.parse(config.pastores_profiles) : config.pastores_profiles;
    }
  } catch (e) {
    console.error('Failed to parse pastores_profiles:', e);
  }

  if (!pastores || pastores.length === 0) {
    pastores = [
      {
        id: 'pastor-wagner',
        name: 'Pastor Wagner Castro',
        role: 'Pastor Principal',
        bio: 'Liderando con visión y pasión por la presencia de Dios y la transformación de las familias.',
        image: `${API_URL}/uploads/comprobantes/1788309651553-080761e7-6073-4dab-8aed-0e3e7895156d.jpg`
      },
      {
        id: 'pastora-dayana',
        name: 'Pastora Dayana de Castro',
        role: 'Pastora Principal',
        bio: 'Apasionada por la adoración, el discipulado y el empoderamiento de las generaciones.',
        image: `${API_URL}/uploads/comprobantes/1788309659550-70c28495-5cd4-4c79-8e44-45bcf3f09bc0.jpg`
      }
    ];
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07070B', color: '#FFFFFF', fontFamily: 'var(--apple-font, -apple-system, BlinkMacSystemFont, sans-serif)' }}>
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '140px 24px 80px',
        backgroundImage: `linear-gradient(180deg, rgba(7, 7, 11, 0.6) 0%, rgba(7, 7, 11, 0.95) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {showKicker && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '6px 18px',
              borderRadius: '30px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '1px',
              color: '#E0E7FF',
              marginBottom: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <Compass size={16} color="#977DFF" /> {kickerText}
            </span>
          )}

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 850,
            lineHeight: 1.1,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #C7D2FE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {title}
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2.5vw, 1.35rem)',
            color: 'rgba(255, 255, 255, 0.82)',
            maxWidth: '720px',
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            {subtitle}
          </p>

          {showButtons && (
            <div style={{ display: 'flex', gap: '16px', justifyContent: flexAlign, flexWrap: 'wrap' }}>
              {nosotrosButtons.map((btn, idx) => (
                <a
                  key={idx}
                  href={btn.link || '/'}
                  onClick={(e) => {
                    if (btn.link) {
                      if (btn.link.startsWith('http')) return;
                      e.preventDefault();
                      window.location.href = btn.link;
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: btn.primary ? '#3B82F6' : 'rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    border: btn.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.25)',
                    padding: '14px 28px',
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    boxShadow: btn.primary ? '0 8px 25px rgba(59, 130, 246, 0.4)' : 'none',
                    backdropFilter: btn.primary ? 'none' : 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {btn.label} {btn.primary && <ArrowRight size={18} />}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VISIÓN, MISIÓN Y VALORES BLOCK */}
      <section style={{ padding: '80px 24px', backgroundColor: '#0B0C10' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#977DFF', textTransform: 'uppercase', letterSpacing: '2px' }}>
              FUNDAMENTOS CONGREGACIONALES
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '8px' }}>
              Identidad y Propósito Divino
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {/* VISION CARD */}
            <div style={{
              backgroundColor: 'rgba(20, 22, 32, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '36px 28px',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(151, 125, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Compass size={24} color="#977DFF" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>{visionTitle}</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6, fontSize: '0.98rem', margin: 0 }}>
                {visionText}
              </p>
            </div>

            {/* MISION CARD */}
            <div style={{
              backgroundColor: 'rgba(20, 22, 32, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '36px 28px',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={24} color="#3B82F6" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>{misionTitle}</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6, fontSize: '0.98rem', margin: 0 }}>
                {misionText}
              </p>
            </div>

            {/* VALORES CARD */}
            <div style={{
              backgroundColor: 'rgba(20, 22, 32, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '36px 28px',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} color="#10B981" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>{valoresTitle}</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6, fontSize: '0.98rem', margin: 0 }}>
                {valoresText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 COLUMNS EXPERIENCE BLOCK (VJ Kids, Cafetería, Grupos de Amistad) */}
      <section style={{ padding: '80px 24px', backgroundColor: '#07070B' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '2px' }}>
              VIVE LA EXPERIENCIA EN IGLESIA VISIÓN JESÚS
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', marginTop: '8px' }}>
              Espacios Diseñados para Ti y Tu Familia
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.65)', maxWidth: '650px', margin: '12px auto 0', fontSize: '1.05rem' }}>
              Nos aseguramos de que cada visita sea confortante, inspiradora y edificante para todas las edades.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            {cards.map((c) => (
              <div key={c.id} style={{
                backgroundColor: 'rgba(18, 20, 29, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '28px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                transition: 'transform 0.3s ease, boxShadow 0.3s ease'
              }}>
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img 
                    src={c.image && c.image.startsWith('http') ? c.image : (c.image ? `${API_URL}${c.image}` : 'https://images.unsplash.com/photo-1511649475669-e288648b2339?q=80&w=800')} 
                    alt={c.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#977DFF',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {c.badge || 'DESTACADO'}
                  </span>
                </div>

                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {c.tagline}
                    </span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginTop: '6px', marginBottom: '12px' }}>
                      {c.title}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.96rem', lineHeight: 1.6, margin: 0 }}>
                      {c.description}
                    </p>
                  </div>

                  {c.link && (
                    <div style={{ marginTop: '24px' }}>
                      <a 
                        href={c.link}
                        onClick={(e) => { e.preventDefault(); window.location.href = c.link; }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#3B82F6',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          textDecoration: 'none'
                        }}
                      >
                        Ver más información <ChevronRight size={16} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASTORS SECTION */}
      <section style={{ padding: '80px 24px', backgroundColor: '#0B0C10' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '2px' }}>
              LIDERAZGO PASTORAL
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '8px' }}>
              Pastores Principales
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {pastores.map((p, idx) => (
              <div key={p.id || idx} style={{
                backgroundColor: 'rgba(20, 22, 32, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '32px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <img 
                  src={p.image && p.image.startsWith('http') ? p.image : (p.image ? `${API_URL}${p.image}` : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800')}
                  alt={p.name}
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px', border: '3px solid #977DFF' }}
                />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px' }}>{p.name}</h3>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#977DFF', marginBottom: '14px' }}>{p.role}</span>
                <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.94rem', lineHeight: 1.6, margin: 0 }}>
                  {p.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <footer style={{ padding: '60px 24px', backgroundColor: '#040406', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', margin: 0 }}>
          © {new Date().getFullYear()} Iglesia Visión Jesús • San José, Costa Rica. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
