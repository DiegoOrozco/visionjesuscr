import React, { useState } from 'react';
import { Calendar, Heart, MapPin, Mail, Phone, ExternalLink, MessageCircle, HelpCircle, Compass, Users, Flame, ArrowRight, Music, PlayCircle, Ticket } from 'lucide-react';

export default function ChurchLanding({ config, onGoToTickets }) {
  const [modalType, setModalType] = useState(null); // 'nuevo' | 'creyente' | 'ofrendar' | 'pregunta'
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', question: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setModalType(null);
      setFormSubmitted(false);
      setFormData({ name: '', phone: '', email: '', question: '' });
    }, 3000);
  };

  const heroBg = config.hero_bg || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600';

  return (
    <div style={{ 
      backgroundColor: '#0A0B10', 
      color: '#F3F4F6', 
      minHeight: '100vh', 
      fontFamily: "'Outfit', 'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* GLOW EFFECT OVERLAYS (Evangelical Worship Vibe) */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(185, 28, 28, 0.25) 0%, rgba(185, 28, 28, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '-15%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(185, 28, 28, 0.18) 0%, rgba(185, 28, 28, 0) 75%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* 1. HERO SECTION (Dynamic Worship Atmosphere) */}
      <div style={{
        position: 'relative',
        backgroundImage: `linear-gradient(180deg, rgba(10, 11, 16, 0.3) 0%, rgba(10, 11, 16, 0.95) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
      }}>
        
        {/* Dynamic Dark Red Bottom Border Gradient */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #B91C1C 0%, #DC2626 50%, #F59E0B 100%)'
        }} />

        <div style={{ maxWidth: '1000px', margin: '0 auto', zIndex: 2, textAlign: 'center' }}>
          
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            backgroundColor: 'rgba(185, 28, 28, 0.25)', 
            border: '1px solid rgba(185, 28, 28, 0.6)', 
            color: '#FF8A8A', 
            padding: '8px 20px', 
            borderRadius: '50px', 
            fontSize: '0.9rem', 
            fontWeight: 800, 
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '28px',
            boxShadow: '0 0 20px rgba(185,28,28,0.2)'
          }}>
            <Flame size={16} />
            <span>PASIONADOS POR SU PRESENCIA</span>
          </div>

          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            marginBottom: '20px',
            lineHeight: 1.05,
            textTransform: 'uppercase',
            letterSpacing: '-1.5px',
            background: 'linear-gradient(to bottom, #FFFFFF 60%, #FFD6D6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}>
            {config.hero_title || 'Bienvenido a TU CASA'}
          </h1>

          <p style={{
            fontSize: '1.6rem',
            color: '#E5E7EB',
            maxWidth: '800px',
            margin: '0 auto 48px',
            fontWeight: 400,
            lineHeight: 1.4,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            letterSpacing: '0.5px'
          }}>
            {config.hero_subtitle || 'Iglesia Visión Jesús — Un lugar de fe, amor y restauración'}
          </p>

          {/* Quick Buttons Layout (Glowing Cards style) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <button 
              onClick={onGoToTickets}
              style={{
                backgroundColor: '#B91C1C',
                color: '#FFFFFF',
                border: '2px solid #EF4444',
                padding: '20px 24px',
                fontSize: '1.1rem',
                fontWeight: 900,
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(185,28,28,0.45)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              className="btn-glow"
            >
              <Ticket size={22} />
              <span>Congreso de Mujeres</span>
            </button>

            <button 
              onClick={() => setModalType('nuevo')}
              style={{
                backgroundColor: '#11131E',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '20px 24px',
                fontSize: '1.1rem',
                fontWeight: 800,
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ✋ Soy nuevo
            </button>

            <button 
              onClick={() => setModalType('creyente')}
              style={{
                backgroundColor: '#11131E',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '20px 24px',
                fontSize: '1.1rem',
                fontWeight: 800,
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📖 Soy nuevo creyente
            </button>

            <button 
              onClick={() => setModalType('ofrendar')}
              style={{
                backgroundColor: '#11131E',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '20px 24px',
                fontSize: '1.1rem',
                fontWeight: 800,
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ❤️ Ofrendar
            </button>
          </div>
        </div>
      </div>

      {/* 2. ABOUT US SECTION (High Contrast Callout) */}
      <div className="container" style={{ padding: '80px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{
          backgroundColor: '#11131E',
          border: '1px solid rgba(185, 28, 28, 0.25)',
          borderRadius: '32px',
          padding: '48px 32px',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          background: 'linear-gradient(135deg, #11131E 0%, #1A0D12 100%)'
        }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            color: '#FFFFFF', 
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '20px',
            letterSpacing: '-0.5px'
          }}>
            NUESTRA PASIÓN ES JESÚS
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            lineHeight: '1.7', 
            color: '#D1D5DB',
            maxWidth: '780px',
            margin: '0 auto'
          }}>
            {config.about_text || 'Somos una comunidad apasionada por compartir el mensaje de esperanza, amor y gracia de Jesucristo en Costa Rica y el mundo entero. ¡Nuestras puertas están abiertas para ti!'}
          </p>
        </div>
      </div>

      {/* 3. SCHEDULES SECTION (Dynamic Church Building / Stage Light theme) */}
      <div style={{
        backgroundImage: 'linear-gradient(180deg, rgba(10, 11, 16, 0.9) 0%, rgba(10, 11, 16, 0.95) 100%), url("https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 20px',
        color: '#FFFFFF',
        textAlign: 'center',
        borderTop: '1px solid rgba(185, 28, 28, 0.2)',
        borderBottom: '1px solid rgba(185, 28, 28, 0.2)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(185, 28, 28, 0.3) 0%, rgba(185, 28, 28, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Flame size={48} color="#B91C1C" style={{ marginBottom: '20px', filter: 'drop-shadow(0 0 10px rgba(185,28,28,0.5))' }} />
          
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 900,
            marginBottom: '48px',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            HORARIOS DE SERVICIOS
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
              <PlayCircle size={28} color="#B91C1C" />
              <span>{config.schedule_thursday || 'JUEVES 7:30PM'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
              <PlayCircle size={28} color="#B91C1C" />
              <span>{config.schedule_saturday || 'SÁBADOS 5:30PM'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
              <PlayCircle size={28} color="#B91C1C" />
              <span>{config.schedule_sunday_1 || 'DOMINGOS 9:00AM'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
              <PlayCircle size={28} color="#B91C1C" />
              <span>{config.schedule_sunday_2 || 'DOMINGOS 11:00AM'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', color: 'var(--accent-gold)' }}>
              <Music size={28} color="var(--accent-gold)" />
              <span>{config.schedule_sunday_virtual || 'DOMINGOS (VIRTUAL) 5:30PM'}</span>
            </div>
          </div>

          <button 
            onClick={() => setModalType('pregunta')}
            style={{
              backgroundColor: '#B91C1C',
              color: '#FFF',
              border: '2px solid #EF4444',
              borderRadius: '12px',
              marginTop: '48px',
              padding: '16px 36px',
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(185,28,28,0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            ¿TENÉS ALGUNA PREGUNTA?
          </button>
        </div>
      </div>

      {/* 4. FOOTER & CONTACT DETAILS */}
      <footer style={{
        backgroundColor: '#090A0F',
        color: '#9CA3AF',
        padding: '80px 20px',
        fontSize: '0.95rem'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '20px', letterSpacing: '0.5px' }}>
              VISIÓN JESÚS
            </h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#9CA3AF', lineHeight: 1.6 }}>
              <MapPin size={22} color="#B91C1C" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{config.contact_address || '50 norte y 50 oeste de la Cruz Roja de Desamparados. Auditorio Principal.'}</span>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '20px' }}>
              Contacto Directo
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#9CA3AF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#B91C1C" />
                <span>{config.contact_email || 'info@somosimpact.com'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#B91C1C" />
                <span>{config.contact_phone_1 || '+506 4115 1212'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#B91C1C" />
                <span>{config.contact_phone_2 || '+506 6453 1212'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '20px' }}>
              Síguenos en
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {config.social_fb && (
                <a href={config.social_fb} target="_blank" rel="noreferrer" className="btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px 16px', fontSize: '0.85rem', color: '#FFF', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Facebook
                </a>
              )}
              {config.social_ig && (
                <a href={config.social_ig} target="_blank" rel="noreferrer" className="btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px 16px', fontSize: '0.85rem', color: '#FFF', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Instagram
                </a>
              )}
              {config.social_yt && (
                <a href={config.social_yt} target="_blank" rel="noreferrer" className="btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px 16px', fontSize: '0.85rem', color: '#FFF', borderColor: 'rgba(255,255,255,0.1)' }}>
                  YouTube
                </a>
              )}
              {config.social_spotify && (
                <a href={config.social_spotify} target="_blank" rel="noreferrer" className="btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px 16px', fontSize: '0.85rem', color: '#FFF', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Spotify
                </a>
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1F2937', marginTop: '60px', paddingTop: '24px', textAlign: 'center', color: '#4B5563', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Iglesia Visión Jesús. Todos los derechos reservados.
        </div>
      </footer>

      {/* MODAL POPUPS */}
      {modalType && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '24px', backgroundColor: '#11131E', border: '1px solid rgba(185, 28, 28, 0.3)', color: '#FFF' }}>
            
            {modalType === 'nuevo' && (
              <div style={{ padding: '28px' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginBottom: '8px' }}>✋ ¡Bienvenido a Casa!</h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Nos alegra mucho que nos visites. Compártenos tus datos para ponernos en contacto contigo y darte la bienvenida oficial.
                </p>

                {formSubmitted ? (
                  <div style={{ textAlign: 'center', color: '#34D399', fontWeight: 700, padding: '20px' }}>
                    🎉 ¡Gracias! Nos comunicaremos muy pronto contigo.
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Nombre Completo</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Teléfono móvil</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required style={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Correo electrónico</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', backgroundColor: '#B91C1C', borderColor: '#EF4444' }}>Enviar Datos</button>
                  </form>
                )}
              </div>
            )}

            {modalType === 'creyente' && (
              <div style={{ padding: '28px' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginBottom: '8px' }}>📖 Decisión de Fe</h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '20px' }}>
                  ¡Felicidades por dar este paso de fe! Queremos acompañarte en tu caminar cristiano y enviarte material de crecimiento espiritual.
                </p>

                {formSubmitted ? (
                  <div style={{ textAlign: 'center', color: '#34D399', fontWeight: 700, padding: '20px' }}>
                    🙌 ¡Gloria a Dios! Te enviaremos información pronto.
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Nombre Completo</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Teléfono móvil</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required style={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', backgroundColor: '#B91C1C', borderColor: '#EF4444' }}>Confirmar mi Decisión</button>
                  </form>
                )}
              </div>
            )}

            {modalType === 'pregunta' && (
              <div style={{ padding: '28px' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginBottom: '8px' }}>💬 Enviar Pregunta</h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '20px' }}>
                  ¿Tienes alguna duda sobre nuestros horarios, ministerios o actividades? Escríbenos directamente aquí.
                </p>

                {formSubmitted ? (
                  <div style={{ textAlign: 'center', color: '#34D399', fontWeight: 700, padding: '20px' }}>
                    📧 ¡Mensaje recibido! Te responderemos por correo o WhatsApp.
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Tu Nombre</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Correo de contacto</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Pregunta / Comentario</label>
                      <textarea name="question" rows="3" value={formData.question} onChange={handleInputChange} required style={{ width: '100%', borderRadius: '10px', backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF', padding: '10px' }}></textarea>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', backgroundColor: '#B91C1C', borderColor: '#EF4444' }}>Enviar Mensaje</button>
                  </form>
                )}
              </div>
            )}

            {modalType === 'ofrendar' && (
              <div style={{ padding: '28px' }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={24} color="var(--accent-gold)" /> Datos de Ofrendas y Diezmos
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Agradecemos tu generosidad para seguir construyendo un futuro y sosteniendo la obra social y evangelística de Visión Jesús.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', backgroundColor: '#1F2937', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <strong>💸 SINPE Móvil:</strong>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-gold)' }}>8761-1212</div>
                    <div style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>A nombre de: Asociación Visión Jesús</div>
                  </div>

                  <div style={{ borderTop: '1px solid #374151', paddingTop: '10px' }}>
                    <strong>🏦 Cuenta IBAN Banco Nacional (Colones):</strong>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.9rem', marginTop: '4px', color: '#FFF' }}>
                      CR38010010072044819203
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #374151', paddingTop: '10px' }}>
                    <strong>🏦 Cuenta IBAN BAC Credomatic (Dólares):</strong>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.9rem', marginTop: '4px', color: '#FFF' }}>
                      CR05010200001944837201
                    </div>
                  </div>
                </div>

                <button onClick={() => setModalType(null)} className="btn-secondary" style={{ width: '100%', marginTop: '20px', padding: '12px', color: '#FFF', borderColor: '#374151' }}>
                  Cerrar Ventana
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
