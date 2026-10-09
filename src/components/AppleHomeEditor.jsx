import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  Clock, 
  Globe, 
  Phone, 
  ExternalLink, 
  Check, 
  CheckCircle2, 
  RefreshCw, 
  Image, 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  Users, 
  Flame, 
  MapPin 
} from 'lucide-react';

export default function AppleHomeEditor({
  configFields = {},
  handleConfigChange,
  localSchedules = [],
  handleAddSchedule,
  handleRemoveSchedule,
  handleScheduleTextChange,
  handleScheduleVirtualToggle,
  localButtons = [],
  handleAddButton,
  handleRemoveButton,
  handleButtonChange,
  localNewsItems = [],
  handleAddNews,
  handleRemoveNews,
  handleNewsChange,
  handleNewsImageUpload,
  uploadingNewsImage,
  handleHeroUpload,
  uploadingHero,
  openMediaLibrary,
  handleSaveHomePageApple,
  saveLoading = false,
  saveSuccessMsg = '',
  onSelectWebPage,
  API_URL = ''
}) {
  const [activeSubTab, setActiveSubTab] = useState('hero');

  return (
    <div style={{
      backgroundColor: '#0A0D14',
      borderRadius: '28px',
      padding: 'clamp(20px, 3.5vw, 40px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      color: '#EAEDF8',
      fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Apple Ambient Cinematic Glow */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '380px',
        height: '380px',
        background: 'radial-gradient(circle, rgba(151, 125, 255, 0.18) 0%, rgba(0, 113, 227, 0.1) 50%, transparent 75%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* TOP BAR: APPLE HUB HEADER */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        paddingBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#C4B5FD',
            letterSpacing: '0.04em',
            marginBottom: '10px'
          }}>
            <Sparkles size={13} />
            <span>APPLE STUDIO · PÁGINA 1 DE 8</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            margin: '0 0 6px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <span>Inicio (Página Principal · /)</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(52, 199, 89, 0.15)',
              color: '#34C759',
              border: '1px solid rgba(52, 199, 89, 0.3)',
              fontWeight: 700,
              letterSpacing: '0.02em'
            }}>
              ● EN VIVO
            </span>
          </h2>
          <p style={{ color: 'rgba(234, 237, 248, 0.65)', fontSize: '0.92rem', margin: 0, maxWidth: '680px' }}>
            Edición visual moderna y en tiempo real de la portada de la iglesia: banner hero, pilares de la visión, horarios semanales, noticias destacadas y canales de contacto.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '9999px',
              color: '#EAEDF8',
              fontSize: '0.88rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <ExternalLink size={15} />
            <span>Ver Portada en Vivo</span>
          </a>

          <button
            type="button"
            onClick={handleSaveHomePageApple}
            disabled={saveLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #0071E3 0%, #977DFF 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              cursor: saveLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(151, 125, 255, 0.35)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: saveLoading ? 0.7 : 1
            }}
          >
            {saveLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Publicando Cambios...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Guardar y Publicar Inicio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SUCCESS MESSAGE PILL */}
      {saveSuccessMsg && (
        <div style={{
          marginTop: '20px',
          padding: '14px 22px',
          backgroundColor: 'rgba(52, 199, 89, 0.12)',
          border: '1px solid rgba(52, 199, 89, 0.35)',
          borderRadius: '16px',
          color: '#34C759',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.92rem',
          fontWeight: 700,
          boxShadow: '0 4px 20px rgba(52, 199, 89, 0.15)'
        }}>
          <CheckCircle2 size={18} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* PAGE INVENTORY PROGRESS BAR (Apple Style) */}
      <div style={{
        marginTop: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Inventario de Páginas:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'home', name: '1. Inicio (/)', active: true },
              { id: 'nosotros', name: '2. Nosotros', active: false },
              { id: 'congresos', name: '3. Eventos & Congresos', active: false },
              { id: 'grupos-de-amistad', name: '4. Grupos de Amistad', active: false },
              { id: 'oracion', name: '5. Oración & Testimonios', active: false },
              { id: 'donar', name: '6. Donar', active: false },
              { id: 'autenticas', name: '7. Auténticas', active: false },
              { id: 'sanados', name: '8. Sanados', active: false },
              { id: 'modelo', name: '9. Modelo', active: false },
              { id: 'move', name: '10. Move', active: false },
              { id: 'tienda', name: '11. Tienda', active: false }
            ].map((pg) => (
              <span
                key={pg.id}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: pg.active ? 800 : 500,
                  backgroundColor: pg.active ? 'rgba(151, 125, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: pg.active ? '1.5px solid #977DFF' : '1px solid rgba(255, 255, 255, 0.06)',
                  color: pg.active ? '#FFFFFF' : 'rgba(234, 237, 248, 0.5)',
                  cursor: pg.active ? 'default' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  if ((pg.id === 'nosotros' || pg.id === 'congresos' || pg.id === 'grupos-de-amistad') && onSelectWebPage) {
                    onSelectWebPage(pg.id);
                  } else if (!pg.active) {
                    alert(`Estamos renovando el sistema página por página. Puedes navegar entre 1. Inicio, 2. Nosotros, 3. Eventos & Congresos y 4. Grupos de Amistad. ¡Pronto habilitaremos el editor exclusivo de ${pg.name}!`);
                  }
                }}
              >
                {pg.name}
              </span>
            ))}
          </div>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'rgba(234, 237, 248, 0.5)' }}>
          Página 1 de 11 activa
        </span>
      </div>

      {/* APPLE SEGMENTED SUBTABS FOR PAGE 1 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '24px',
        marginBottom: '28px',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        padding: '6px',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflowX: 'auto'
      }}>
        {[
          { id: 'hero', label: 'Portada (Hero)', icon: <Sparkles size={15} /> },
          { id: 'pillars', label: 'Pilares & ADN', icon: <Compass size={15} /> },
          { id: 'schedules', label: 'Horarios de Servicios', icon: <Clock size={15} /> },
          { id: 'news', label: 'Noticias & Destacados', icon: <Globe size={15} /> },
          { id: 'contact', label: 'Redes & Contacto Directo', icon: <Phone size={15} /> }
        ].map((tab) => {
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                color: isSelected ? '#000000' : 'rgba(234, 237, 248, 0.7)',
                fontWeight: isSelected ? 800 : 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 4px 14px rgba(0, 0, 0, 0.25)' : 'none'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUBTAB 1: PORTADA PRINCIPAL (HERO BANNER)
         ========================================================================= */}
      {activeSubTab === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* LIVE HERO PREVIEW BOX */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Vista Previa en Tiempo Real de la Portada
              </label>
              <span style={{ fontSize: '0.75rem', color: 'rgba(234, 237, 248, 0.5)' }}>
                Refleja exactamente lo que verán los visitantes al entrar
              </span>
            </div>
            
            <div style={{
              position: 'relative',
              width: '100%',
              minHeight: '280px',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#000000',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '40px 20px',
              boxSizing: 'border-box'
            }}>
              {/* Background display */}
              {configFields.hero_bg ? (
                configFields.hero_bg.match(/\.(mp4|webm|mov|ogg)($|\?)/i) ? (
                  <video
                    src={configFields.hero_bg.startsWith('http') ? configFields.hero_bg : `${API_URL}${configFields.hero_bg}`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35, zIndex: 0 }}
                  />
                ) : (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `url("${configFields.hero_bg.startsWith('http') ? configFields.hero_bg : `${API_URL}${configFields.hero_bg}`}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.45,
                    zIndex: 0
                  }} />
                )
              ) : (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(151,125,255,0.15) 0%, #000000 100%)', zIndex: 0 }} />
              )}

              {/* Gradient bottom overlay */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(180deg, transparent 0%, #000000 100%)', zIndex: 1 }} />

              {/* Live Content */}
              <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', width: '100%' }}>
                {configFields.hero_kicker_hidden !== 'true' && configFields.hero_kicker_hidden !== true && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34C759' }}></span>
                    <span>{configFields.hero_kicker || 'Comunidad de Fe & Esperanza'}</span>
                  </div>
                )}

                <h1 style={{
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  margin: '0 0 10px 0',
                  lineHeight: 1.15
                }}>
                  {configFields.hero_title || 'Bienvenido a TU CASA'}
                </h1>

                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(234, 237, 248, 0.8)',
                  margin: '0 auto 20px auto',
                  lineHeight: 1.5,
                  maxWidth: '520px'
                }}>
                  {configFields.hero_subtitle || 'Iglesia Visión Jesús — Un lugar de fe, amor y restauración'}
                </p>

                {configFields.hero_buttons_hidden !== 'true' && configFields.hero_buttons_hidden !== true && localButtons && localButtons.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: configFields.hero_buttons_align || 'center', flexWrap: 'wrap', width: '100%' }}>
                    {localButtons.map((btn, idx) => (
                      <span
                        key={btn.id || idx}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '9999px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          backgroundColor: btn.style === 'primary' || idx === 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.12)',
                          color: btn.style === 'primary' || idx === 0 ? '#000000' : '#FFFFFF',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {btn.emoji && <span>{btn.emoji}</span>}
                        <span>{btn.label}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CONTROLS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* 1. TEXT FIELDS CARD */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
                <Sparkles size={16} color="#977DFF" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Textos y Etiqueta de Portada
                </h3>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  Etiqueta Flotante Superior (Kicker Badge)
                </label>
                <input
                  type="text"
                  name="hero_kicker"
                  value={configFields.hero_kicker !== undefined ? configFields.hero_kicker : 'Comunidad de Fe & Esperanza'}
                  onChange={handleConfigChange}
                  placeholder="Ej: Comunidad de Fe & Esperanza"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: '#EAEDF8', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  name="hero_kicker_hidden"
                  checked={configFields.hero_kicker_hidden === 'true' || configFields.hero_kicker_hidden === true}
                  onChange={(e) => handleConfigChange({ target: { name: 'hero_kicker_hidden', value: e.target.checked ? 'true' : 'false' } })}
                  style={{ width: '18px', height: '18px', accentColor: '#977DFF', cursor: 'pointer' }}
                />
                <span>🚫 Ocultar Etiqueta Superior (Pill / Kicker)</span>
              </label>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  Título Principal de Bienvenida (Headline)
                </label>
                <input
                  type="text"
                  name="hero_title"
                  value={configFields.hero_title || ''}
                  onChange={handleConfigChange}
                  placeholder="Ej: Bienvenido a TU CASA"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  Subtítulo / Lema de la Iglesia
                </label>
                <textarea
                  rows={3}
                  name="hero_subtitle"
                  value={configFields.hero_subtitle || ''}
                  onChange={handleConfigChange}
                  placeholder="Ej: Iglesia Visión Jesús — Un lugar de fe, amor y restauración"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* 2. BACKGROUND MEDIA CARD */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
                <Image size={16} color="#977DFF" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Fondo Cinematográfico (Imagen o Video)
                </h3>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  URL de Imagen o Video (.mp4 / Unsplash / Directo)
                </label>
                <input
                  type="text"
                  name="hero_bg"
                  value={configFields.hero_bg || ''}
                  onChange={handleConfigChange}
                  placeholder="https://images.unsplash.com/... o /uploads/..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* Upload File Input */}
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(151, 125, 255, 0.15)',
                  border: '1px solid rgba(151, 125, 255, 0.3)',
                  borderRadius: '12px',
                  color: '#C4B5FD',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: uploadingHero ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <Upload size={16} />
                  <span>{uploadingHero ? 'Subiendo archivo...' : 'Subir Imagen/Video'}</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleHeroUpload}
                    disabled={uploadingHero}
                    style={{ display: 'none' }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => openMediaLibrary(['config', 'hero_bg'])}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#EAEDF8',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={15} />
                  <span>Medios</span>
                </button>
              </div>

              <div style={{ fontSize: '0.76rem', color: 'rgba(234, 237, 248, 0.5)', lineHeight: 1.4 }}>
                💡 Tip: Los videos en formato MP4 o WebM se reproducirán en bucle automáticamente con sonido silenciado para un efecto cinematográfico como en la web de Apple.
              </div>
            </div>

          </div>

          {/* 3. CALL TO ACTION BUTTONS SECTION */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Botones de Acción en Portada (CTA)
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'rgba(234, 237, 248, 0.6)' }}>
                  Configura la posición, alineación o bien oculta los botones si prefieres una portada sin elementos sobrepuestos.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleAddButton}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(151, 125, 255, 0.15)',
                    border: '1px solid rgba(151, 125, 255, 0.3)',
                    borderRadius: '9999px',
                    color: '#C4B5FD',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} />
                  <span>Agregar Botón</span>
                </button>

                {localButtons && localButtons.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('¿Deseas eliminar TODOS los botones de la portada?')) {
                        handleButtonChange(null, 'CLEAR_ALL');
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: 'rgba(255, 59, 48, 0.12)',
                      border: '1px solid rgba(255, 59, 48, 0.3)',
                      borderRadius: '9999px',
                      color: '#FF3B30',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Eliminar Todos</span>
                  </button>
                )}
              </div>
            </div>

            {/* BUTTON CONTROLS (HIDE TOGGLE + ALIGNMENT SELECTOR) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              padding: '16px',
              borderRadius: '14px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.86rem', color: '#EAEDF8', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  name="hero_buttons_hidden"
                  checked={configFields.hero_buttons_hidden === 'true' || configFields.hero_buttons_hidden === true}
                  onChange={(e) => handleConfigChange({ target: { name: 'hero_buttons_hidden', value: e.target.checked ? 'true' : 'false' } })}
                  style={{ width: '18px', height: '18px', accentColor: '#977DFF', cursor: 'pointer' }}
                />
                <span>🚫 Ocultar Todos los Botones de la Portada</span>
              </label>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '4px' }}>
                  Alineación Horizontal de Botones
                </label>
                <select
                  name="hero_buttons_align"
                  value={configFields.hero_buttons_align || 'center'}
                  onChange={handleConfigChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#1E293B',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <option value="center">Centro (Recomendado)</option>
                  <option value="flex-start">Izquierda (Alinear a la izquierda)</option>
                  <option value="flex-end">Derecha (Alinear a la derecha)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {localButtons.map((btn, bIdx) => (
                <div
                  key={btn.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr 1fr auto auto',
                    gap: '12px',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#977DFF', width: '22px' }}>
                    #{bIdx + 1}
                  </span>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Texto del Botón
                    </label>
                    <input
                      type="text"
                      value={btn.label}
                      onChange={(e) => handleButtonChange(btn.id, 'label', e.target.value)}
                      placeholder="Ej: Conocé la Visión"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.86rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Ruta o Enlace (Destino)
                    </label>
                    <input
                      type="text"
                      value={btn.url}
                      onChange={(e) => handleButtonChange(btn.id, 'url', e.target.value)}
                      placeholder="Ej: /nosotros, #horarios-section, /autenticas"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.86rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Estilo
                    </label>
                    <select
                      value={btn.style || 'secondary'}
                      onChange={(e) => handleButtonChange(btn.id, 'style', e.target.value)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#1E293B',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                    >
                      <option value="primary">Primario (Destacado)</option>
                      <option value="secondary">Secundario (Cristal)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveButton(btn.id)}
                    style={{
                      padding: '8px',
                      backgroundColor: 'rgba(255, 59, 48, 0.12)',
                      border: '1px solid rgba(255, 59, 48, 0.25)',
                      borderRadius: '8px',
                      color: '#FF3B30',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: PILARES Y ADN DE LA VISIÓN (VISIÓN, MISIÓN, VALORES)
         ========================================================================= */}
      {activeSubTab === 'pillars' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1.5px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '20px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 8px 30px rgba(239, 68, 68, 0.15)'
          }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#F87171' }}>●</span>
                <span>Visibilidad de la Sección "Pilares & ADN" en Inicio</span>
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(234, 237, 248, 0.75)', lineHeight: 1.5 }}>
                Marque esta casilla si desea ocultar el bloque de <strong>Visión, Misión y Valores</strong> en la página principal para que no se repita con la página de Nosotros.
              </p>
            </div>

            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#FFFFFF',
              fontWeight: 800,
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              padding: '10px 18px',
              borderRadius: '12px'
            }}>
              <input
                type="checkbox"
                name="home_pillars_hidden"
                checked={configFields.home_pillars_hidden === true || configFields.home_pillars_hidden === 'true'}
                onChange={(e) => handleConfigChange({ target: { name: 'home_pillars_hidden', value: e.target.checked } })}
                style={{ accentColor: '#EF4444', width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span>Ocultar esta Sección en Inicio (/)</span>
            </label>
          </div>

          {/* 3 BENTO CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            
            {/* 1. VISIÓN */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(151, 125, 255, 0.15)',
                  border: '1px solid rgba(151, 125, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C4B5FD'
                }}>
                  <Compass size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Pilar #1
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Nuestra Visión
                  </h4>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                  Título del Pilar
                </label>
                <input
                  type="text"
                  name="vision_title"
                  value={configFields.vision_title || 'NUESTRA VISIÓN'}
                  onChange={handleConfigChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                  Descripción Inspiradora
                </label>
                <textarea
                  rows={5}
                  name="vision_text"
                  value={configFields.vision_text || ''}
                  onChange={handleConfigChange}
                  placeholder="Ser una iglesia viva que inspira a miles de personas a experimentar una relación personal con Dios..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* 2. MISIÓN */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 149, 0, 0.15)',
                  border: '1px solid rgba(255, 149, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF9500'
                }}>
                  <Flame size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FF9500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Pilar #2
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Nuestra Misión
                  </h4>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                  Título del Pilar
                </label>
                <input
                  type="text"
                  name="mision_title"
                  value={configFields.mision_title || 'NUESTRA MISIÓN'}
                  onChange={handleConfigChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                  Descripción de Acción y Evangelismo
                </label>
                <textarea
                  rows={5}
                  name="mision_text"
                  value={configFields.mision_text || ''}
                  onChange={handleConfigChange}
                  placeholder="Evangelizar, consolidar, edificar y enviar a cada creyente a vivir su propósito divino..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* 3. VALORES */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(52, 199, 89, 0.15)',
                  border: '1px solid rgba(52, 199, 89, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34C759'
                }}>
                  <Users size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34C759', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Pilar #3
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Nuestros Valores
                  </h4>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                  Título del Pilar
                </label>
                <input
                  type="text"
                  name="valores_title"
                  value={configFields.valores_title || 'NUESTROS VALORES'}
                  onChange={handleConfigChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                  Principios Fundamentales
                </label>
                <textarea
                  rows={5}
                  name="valores_text"
                  value={configFields.valores_text || ''}
                  onChange={handleConfigChange}
                  placeholder="Amor incondicional, adoración genuina, excelencia en el servicio, integridad moral, restauración familiar..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: HORARIOS DE SERVICIOS Y UBICACIÓN
         ========================================================================= */}
      {activeSubTab === 'schedules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
              Horarios Semanales & Navegación (Mapas)
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(234, 237, 248, 0.65)' }}>
              Administra los días y horas de las reuniones presenciales y transmisiones en línea.
            </p>
          </div>

          {/* LIST OF SCHEDULES */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                Reuniones y Servicios Semanales
              </h4>
              <button
                type="button"
                onClick={handleAddSchedule}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: 'rgba(151, 125, 255, 0.15)',
                  border: '1px solid rgba(151, 125, 255, 0.3)',
                  borderRadius: '9999px',
                  color: '#C4B5FD',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
                <span>Agregar Horario</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {localSchedules.map((s, idx) => (
                <div
                  key={s.id || idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#977DFF', width: '22px' }}>
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={s.text}
                      onChange={(e) => handleScheduleTextChange(s.id, e.target.value)}
                      placeholder="Ej: DOMINGOS 9:00AM"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '0.92rem',
                        fontWeight: 700
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* iOS Switch Toggle for Virtual */}
                    <button
                      type="button"
                      onClick={() => handleScheduleVirtualToggle(s.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: s.isVirtual ? '1px solid rgba(151, 125, 255, 0.4)' : '1px solid rgba(0, 113, 227, 0.4)',
                        backgroundColor: s.isVirtual ? 'rgba(151, 125, 255, 0.15)' : 'rgba(0, 113, 227, 0.15)',
                        color: s.isVirtual ? '#C4B5FD' : '#0071E3',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {s.isVirtual ? '🌐 En Línea (Virtual)' : '🏛️ Presencial'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveSchedule(s.id)}
                      style={{
                        padding: '8px',
                        backgroundColor: 'rgba(255, 59, 48, 0.12)',
                        border: '1px solid rgba(255, 59, 48, 0.25)',
                        borderRadius: '8px',
                        color: '#FF3B30',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LOCATION & NAVIGATION MAPS */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
              <MapPin size={16} color="#977DFF" />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                Ubicación y Enlaces de Llegada (Waze / Google Maps)
              </h4>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                Dirección Física Completa
              </label>
              <input
                type="text"
                name="contact_address"
                value={configFields.contact_address || ''}
                onChange={handleConfigChange}
                placeholder="Ej: 50 norte y 50 oeste de la Cruz Roja de Desamparados. Auditorio Principal..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  Enlace de Waze Directo
                </label>
                <input
                  type="text"
                  name="maps_waze_url"
                  value={configFields.maps_waze_url || ''}
                  onChange={handleConfigChange}
                  placeholder="https://waze.com/ul/..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  Enlace de Google Maps
                </label>
                <input
                  type="text"
                  name="maps_google_url"
                  value={configFields.maps_google_url || ''}
                  onChange={handleConfigChange}
                  placeholder="https://maps.google.com/..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 4: NOTICIAS & DESTACADOS DE PORTADA
         ========================================================================= */}
      {activeSubTab === 'news' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                Noticias, Congresos & Anuncios Especiales
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(234, 237, 248, 0.65)' }}>
                Tarjetas y banners que se muestran en el carrusel de novedades en la página de inicio.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddNews}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                backgroundColor: 'rgba(151, 125, 255, 0.15)',
                border: '1px solid rgba(151, 125, 255, 0.3)',
                borderRadius: '9999px',
                color: '#C4B5FD',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Nueva Noticia</span>
            </button>
          </div>

          {localNewsItems.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              textAlign: 'center',
              color: 'rgba(234, 237, 248, 0.6)'
            }}>
              <Globe size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 600 }}>
                No hay noticias o anuncios destacados configurados actualmente.
              </p>
              <button
                type="button"
                onClick={handleAddNews}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(151, 125, 255, 0.2)',
                  border: '1px solid #977DFF',
                  borderRadius: '9999px',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                + Agregar la primera noticia o evento
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {localNewsItems.map((item, nIdx) => (
                <div
                  key={item.id || nIdx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C4B5FD', textTransform: 'uppercase' }}>
                      Noticia #{nIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNews(item.id)}
                      style={{
                        padding: '6px',
                        backgroundColor: 'rgba(255, 59, 48, 0.12)',
                        border: '1px solid rgba(255, 59, 48, 0.25)',
                        borderRadius: '8px',
                        color: '#FF3B30',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Etiqueta / Badge
                    </label>
                    <input
                      type="text"
                      value={item.badge || ''}
                      onChange={(e) => handleNewsChange(item.id, 'badge', e.target.value)}
                      placeholder="Ej: DESTACADO, CONGRESO, PRÓXIMAMENTE"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.84rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Título de la Noticia
                    </label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => handleNewsChange(item.id, 'title', e.target.value)}
                      placeholder="Ej: Congreso Auténticas 2026"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 700
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Descripción Corta
                    </label>
                    <textarea
                      rows={2}
                      value={item.description || ''}
                      onChange={(e) => handleNewsChange(item.id, 'description', e.target.value)}
                      placeholder="Breve reseña del evento..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.84rem',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Enlace de Destino (URL)
                    </label>
                    <input
                      type="text"
                      value={item.link || ''}
                      onChange={(e) => handleNewsChange(item.id, 'link', e.target.value)}
                      placeholder="Ej: /autenticas o /congresos"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.84rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Imagen de Portada
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={item.image || ''}
                        onChange={(e) => handleNewsChange(item.id, 'image', e.target.value)}
                        placeholder="URL imagen..."
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.82rem'
                        }}
                      />
                      <label style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(151, 125, 255, 0.15)',
                        border: '1px solid rgba(151, 125, 255, 0.3)',
                        borderRadius: '8px',
                        color: '#C4B5FD',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Upload size={13} />
                        <span>{uploadingNewsImage === item.id ? '...' : 'Subir'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleNewsImageUpload(item.id, e)}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUBTAB 5: CANALES DE CONTACTO DIRECTO & REDES SOCIALES
         ========================================================================= */}
      {activeSubTab === 'contact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
              Canales de Contacto Directo & Redes Oficiales
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(234, 237, 248, 0.65)' }}>
              Configura WhatsApp, números telefónicos, correo y redes visibles en el pie de página y botones de contacto.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* 1. CANALES DE COMUNICACIÓN */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
                <Phone size={16} color="#977DFF" />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Contacto y Atención
                </h4>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  WhatsApp Oficial de la Iglesia
                </label>
                <input
                  type="text"
                  name="contact_phone_2"
                  value={configFields.contact_phone_2 || ''}
                  onChange={handleConfigChange}
                  placeholder="+506 6453 1212"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  Teléfono de Oficina
                </label>
                <input
                  type="text"
                  name="contact_phone_1"
                  value={configFields.contact_phone_1 || ''}
                  onChange={handleConfigChange}
                  placeholder="+506 4115 1212"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  Correo Electrónico Institucional
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={configFields.contact_email || ''}
                  onChange={handleConfigChange}
                  placeholder="info@somosimpact.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* 2. REDES SOCIALES */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
                <Globe size={16} color="#977DFF" />
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Redes Sociales Oficiales
                </h4>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  Instagram URL
                </label>
                <input
                  type="text"
                  name="social_ig"
                  value={configFields.social_ig || ''}
                  onChange={handleConfigChange}
                  placeholder="https://instagram.com/visionjesus"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  Facebook URL
                </label>
                <input
                  type="text"
                  name="social_fb"
                  value={configFields.social_fb || ''}
                  onChange={handleConfigChange}
                  placeholder="https://facebook.com/visionjesus"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  YouTube URL
                </label>
                <input
                  type="text"
                  name="social_yt"
                  value={configFields.social_yt || ''}
                  onChange={handleConfigChange}
                  placeholder="https://youtube.com/visionjesus"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  Spotify / Podcasts URL
                </label>
                <input
                  type="text"
                  name="social_spotify"
                  value={configFields.social_spotify || ''}
                  onChange={handleConfigChange}
                  placeholder="https://spotify.com/visionjesus"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FLOATING QUICK SAVE PILL AT BOTTOM RIGHT */}
      <div style={{
        position: 'fixed',
        bottom: '28px',
        right: '32px',
        zIndex: 9999
      }}>
        <button
          type="button"
          onClick={handleSaveHomePageApple}
          disabled={saveLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #0071E3 0%, #977DFF 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '0.92rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            cursor: saveLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 12px 32px rgba(151, 125, 255, 0.5), 0 2px 6px rgba(0,0,0,0.4)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: saveLoading ? 0.75 : 1
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {saveLoading ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>Publicando...</span>
            </>
          ) : (
            <>
              <Check size={18} />
              <span>Publicar Cambios de Inicio</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
