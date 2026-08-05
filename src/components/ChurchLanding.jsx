import React, { useState } from 'react';
import { Calendar, Heart, MapPin, Mail, Phone, ExternalLink, MessageCircle, HelpCircle, Compass, Users } from 'lucide-react';

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
    <div style={{ backgroundColor: '#FAF8F5', color: '#2C1A0E', minHeight: '100vh', fontFamily: 'var(--font-main)' }}>
      
      {/* 1. HERO SECTION WITH IMAGE BACKGROUND */}
      <div style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        textAlign: 'center',
        padding: '60px 20px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', zIndex: 2 }}>
          
          <span className="badge" style={{ backgroundColor: 'var(--accent-gold)', color: '#FFFFFF', padding: '6px 18px', fontSize: '0.9rem', marginBottom: '20px', display: 'inline-block' }}>
            ✨ PASIONADOS POR SU PRESENCIA
          </span>

          <h1 style={{
            fontSize: '3.8rem',
            fontWeight: 900,
            marginBottom: '16px',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            lineHeight: 1.15
          }}>
            {config.hero_title || 'Bienvenido a TU CASA'}
          </h1>

          <p style={{
            fontSize: '1.4rem',
            opacity: 0.95,
            marginBottom: '36px',
            maxWidth: '720px',
            margin: '0 auto 36px',
            fontWeight: 400,
            fontStyle: 'italic'
          }}>
            {config.hero_subtitle || 'Iglesia Visión Jesús — Un lugar de fe, amor y restauración'}
          </p>

          {/* Quick Buttons Layout similar to screenshots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginTop: '20px'
          }}>
            <button 
              onClick={onGoToTickets}
              className="btn-primary" 
              style={{
                backgroundColor: 'var(--accent-coffee)',
                borderColor: 'var(--accent-coffee)',
                padding: '16px 28px',
                fontSize: '1.1rem',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}
            >
              🎟️ Congreso de Mujeres 2026 (Reservar Boletos)
            </button>

            <button 
              onClick={() => setModalType('nuevo')}
              className="btn-secondary" 
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFF',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '16px 28px',
                fontSize: '1.1rem',
                fontWeight: 800
              }}
            >
              ✋ Soy nuevo
            </button>

            <button 
              onClick={() => setModalType('creyente')}
              className="btn-secondary"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFF',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '16px 28px',
                fontSize: '1.1rem',
                fontWeight: 800
              }}
            >
              📖 Soy nuevo creyente
            </button>

            <button 
              onClick={() => setModalType('ofrendar')}
              className="btn-secondary"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFF',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '16px 28px',
                fontSize: '1.1rem',
                fontWeight: 800
              }}
            >
              ❤️ Ofrendar
            </button>
          </div>
        </div>
      </div>

      {/* 2. ABOUT US BRIEF */}
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--accent-coffee)', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
            Nuestra Comunidad
          </h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            {config.about_text || 'Somos una comunidad apasionada por compartir el mensaje de esperanza, amor y gracia de Jesucristo en Costa Rica y el mundo entero. ¡Nuestras puertas están abiertas para ti!'}
          </p>
        </div>
      </div>

      {/* 3. SCHEDULES SECTION WITH CHURCH PHOTO BACKGROUND */}
      <div style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1548625361-155deee223cb?q=80&w=1600")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 20px',
        color: '#FFFFFF',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Compass size={48} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
          
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            marginBottom: '40px',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '1px'
          }}>
            HORARIOS DE SERVICIOS
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            fontSize: '1.8rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.5px'
          }}>
            <div>{config.schedule_thursday || 'JUEVES 7:30PM'}</div>
            <div>{config.schedule_saturday || 'SÁBADOS 5:30PM'}</div>
            <div>{config.schedule_sunday_1 || 'DOMINGOS 9:00AM'}</div>
            <div>{config.schedule_sunday_2 || 'DOMINGOS 11:00AM'}</div>
            <div style={{ color: 'var(--accent-gold)' }}>
              {config.schedule_sunday_virtual || 'DOMINGOS (VIRTUAL) 5:30PM'}
            </div>
          </div>

          <p style={{ marginTop: '40px', opacity: 0.8, fontSize: '0.95rem' }}>
            Servicios en hora de Costa Rica (CST).
          </p>

          <button 
            onClick={() => setModalType('pregunta')}
            className="btn-primary" 
            style={{
              backgroundColor: '#008F7A',
              borderColor: '#008F7A',
              marginTop: '24px',
              padding: '14px 28px',
              fontSize: '1rem',
              fontWeight: 800
            }}
          >
            ¿TENÉS ALGUNA PREGUNTA?
          </button>
        </div>
      </div>

      {/* 4. FOOTER & CONTACT DETAILS */}
      <footer style={{
        backgroundColor: '#1E242B',
        color: '#FAF8F5',
        padding: '60px 20px',
        fontSize: '0.92rem'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#FFFFFF', marginBottom: '16px' }}>
              VISIÓN JESÚS
            </h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#A0AEC0', lineHeight: 1.5 }}>
              <MapPin size={20} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{config.contact_address || '50 norte y 50 oeste de la Cruz Roja de Desamparados. Auditorio Principal.'}</span>
            </div>
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '16px' }}>
              Contacto Directo
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#A0AEC0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="var(--accent-gold)" />
                <span>{config.contact_email || 'info@somosimpact.com'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="var(--accent-gold)" />
                <span>{config.contact_phone_1 || '+506 4115 1212'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="var(--accent-gold)" />
                <span>{config.contact_phone_2 || '+506 6453 1212'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#FFFFFF', marginBottom: '16px' }}>
              Síguenos en
            </h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {config.social_fb && (
                <a href={config.social_fb} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}>
                  Facebook
                </a>
              )}
              {config.social_ig && (
                <a href={config.social_ig} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}>
                  Instagram
                </a>
              )}
              {config.social_yt && (
                <a href={config.social_yt} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}>
                  YouTube
                </a>
              )}
              {config.social_spotify && (
                <a href={config.social_spotify} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem', color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}>
                  Spotify
                </a>
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #2D3748', marginTop: '40px', paddingTop: '20px', textAlign: 'center', color: '#718096', fontSize: '0.82rem' }}>
          © {new Date().getFullYear()} Iglesia Visión Jesús. Todos los derechos reservados.
        </div>
      </footer>

      {/* MODAL POPUPS */}
      {modalType && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '24px' }}>
            
            {modalType === 'nuevo' && (
              <div style={{ padding: '28px' }}>
                <h3 style={{ color: 'var(--accent-coffee)', fontSize: '1.4rem', marginBottom: '8px' }}>✋ ¡Bienvenido a Casa!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Nos alegra mucho que nos visites. Compártenos tus datos para ponernos en contacto contigo y darte la bienvenida oficial.
                </p>

                {formSubmitted ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-green)', fontWeight: 700, padding: '20px' }}>
                    🎉 ¡Gracias! Nos comunicaremos muy pronto contigo.
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Nombre Completo</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Teléfono móvil</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Correo electrónico</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>Enviar Datos</button>
                  </form>
                )}
              </div>
            )}

            {modalType === 'creyente' && (
              <div style={{ padding: '28px' }}>
                <h3 style={{ color: 'var(--accent-coffee)', fontSize: '1.4rem', marginBottom: '8px' }}>📖 Decisión de Fe</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  ¡Felicidades por dar este paso de fe! Queremos acompañarte en tu caminar cristiano y enviarte material de crecimiento espiritual.
                </p>

                {formSubmitted ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-green)', fontWeight: 700, padding: '20px' }}>
                    🙌 ¡Gloria a Dios! Te enviaremos información pronto.
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Nombre Completo</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Teléfono móvil</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>Confirmar mi Decisión</button>
                  </form>
                )}
              </div>
            )}

            {modalType === 'pregunta' && (
              <div style={{ padding: '28px' }}>
                <h3 style={{ color: 'var(--accent-coffee)', fontSize: '1.4rem', marginBottom: '8px' }}>💬 Enviar Pregunta</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  ¿Tienes alguna duda sobre nuestros horarios, ministerios o actividades? Escríbenos directamente aquí.
                </p>

                {formSubmitted ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-green)', fontWeight: 700, padding: '20px' }}>
                    📧 ¡Mensaje recibido! Te responderemos por correo o WhatsApp.
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Tu Nombre</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Correo de contacto</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Pregunta / Comentario</label>
                      <textarea name="question" rows="3" value={formData.question} onChange={handleInputChange} required style={{ width: '100%', borderRadius: '10px', border: '1px solid #CCC', padding: '10px' }}></textarea>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>Enviar Mensaje</button>
                  </form>
                )}
              </div>
            )}

            {modalType === 'ofrendar' && (
              <div style={{ padding: '28px' }}>
                <h3 style={{ color: 'var(--accent-coffee)', fontSize: '1.4rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={24} color="var(--accent-gold)" /> Datos de Ofrendas y Diezmos
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Agradecemos tu generosidad para seguir construyendo un futuro y sosteniendo la obra social y evangelística de Visión Jesús.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', backgroundColor: '#FAF8F5', padding: '16px', borderRadius: '16px', border: '1px solid var(--accent-beige-border)' }}>
                  <div>
                    <strong>💸 SINPE Móvil:</strong>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-coffee)' }}>8761-1212</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>A nombre de: Asociación Visión Jesús</div>
                  </div>

                  <div style={{ borderTop: '1px solid #DDD', paddingTop: '10px' }}>
                    <strong>🏦 Cuenta IBAN Banco Nacional (Colones):</strong>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.9rem', marginTop: '4px' }}>
                      CR38010010072044819203
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #DDD', paddingTop: '10px' }}>
                    <strong>🏦 Cuenta IBAN BAC Credomatic (Dólares):</strong>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.9rem', marginTop: '4px' }}>
                      CR05010200001944837201
                    </div>
                  </div>
                </div>

                <button onClick={() => setModalType(null)} className="btn-secondary" style={{ width: '100%', marginTop: '20px', padding: '12px' }}>
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
