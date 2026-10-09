import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Quote, 
  MessageCircle, 
  ExternalLink, 
  Check, 
  CheckCircle2, 
  RefreshCw, 
  Trash2, 
  ShieldCheck, 
  Plus, 
  Clock, 
  Send, 
  BookOpen
} from 'lucide-react';

export default function AppleOracionEditor({
  configFields = {},
  handleConfigChange,
  openMediaLibrary,
  handleSaveOracionPageApple,
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
      {/* Apple Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '380px',
        height: '380px',
        background: 'radial-gradient(circle, rgba(151, 125, 255, 0.18) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 75%)',
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
            backgroundColor: 'rgba(151, 125, 255, 0.12)',
            border: '1px solid rgba(151, 125, 255, 0.25)',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#C4B5FD',
            letterSpacing: '0.04em',
            marginBottom: '10px'
          }}>
            <Sparkles size={13} />
            <span>APPLE STUDIO · PÁGINA 5 DE 11</span>
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
            <span>Oración & Testimonios (/oracion)</span>
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
            Edita los textos inspiradores del Centro de Fe: título principal, subtítulo, pasaje bíblico con su referencia y la promesa del altar.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="/oracion"
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
            <span>Ver Oración en Vivo</span>
          </a>

          <button
            type="button"
            onClick={handleSaveOracionPageApple}
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
                <span>Guardar y Publicar Oración</span>
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
              { id: 'home', name: '1. Inicio (/)', active: false },
              { id: 'nosotros', name: '2. Nosotros', active: false },
              { id: 'congresos', name: '3. Eventos & Congresos', active: false },
              { id: 'grupos-de-amistad', name: '4. Grupos de Amistad', active: false },
              { id: 'oracion', name: '5. Oración & Testimonios', active: true },
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
                  backgroundColor: pg.active ? 'rgba(151, 125, 255, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: pg.active ? '1.5px solid #977DFF' : '1px solid rgba(255, 255, 255, 0.06)',
                  color: pg.active ? '#FFFFFF' : 'rgba(234, 237, 248, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  if ((pg.id === 'home' || pg.id === 'nosotros' || pg.id === 'congresos' || pg.id === 'grupos-de-amistad') && onSelectWebPage) {
                    onSelectWebPage(pg.id);
                  } else if (!pg.active) {
                    alert(`Estamos renovando el sistema página por página. Puedes navegar entre 1. Inicio, 2. Nosotros, 3. Eventos & Congresos, 4. Grupos de Amistad y 5. Oración. ¡Pronto habilitaremos el editor exclusivo de ${pg.name}!`);
                  }
                }}
              >
                {pg.name}
              </span>
            ))}
          </div>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'rgba(234, 237, 248, 0.5)' }}>
          Página 5 de 11 activa
        </span>
      </div>

      {/* APPLE SEGMENTED SUBTABS FOR PAGE 5 */}
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
          { id: 'hero', label: 'Portada & Textos Principal', icon: <Sparkles size={15} /> },
          { id: 'verse', label: 'Pasaje Bíblico & Promesa Altar', icon: <Quote size={15} /> }
        ].map((tab) => {
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: isSelected ? '#977DFF' : 'transparent',
                color: isSelected ? '#FFFFFF' : 'rgba(234, 237, 248, 0.65)',
                fontSize: '0.86rem',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap',
                boxShadow: isSelected ? '0 4px 16px rgba(151, 125, 255, 0.3)' : 'none'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: PORTADA & TEXTOS PRINCIPAL */}
      {activeSubTab === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* PREVIEW CONTAINER */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '28px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#C4B5FD', letterSpacing: '0.04em' }}>
                VISTA PREVIA EN TIEMPO REAL · HERO DE ORACIÓN
              </span>
            </div>

            <div style={{
              borderRadius: '20px',
              padding: '40px 24px',
              textAlign: 'center',
              background: 'radial-gradient(circle at 50% 20%, rgba(0, 51, 255, 0.18) 0%, rgba(3, 8, 18, 1) 75%)',
              border: '1px solid rgba(151, 125, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
                {configFields.oracion_kicker_hidden !== true && configFields.oracion_kicker_hidden !== 'true' && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 14px',
                    backgroundColor: 'rgba(151, 125, 255, 0.12)',
                    border: '1px solid rgba(151, 125, 255, 0.3)',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#977DFF',
                    marginBottom: '16px',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase'
                  }}>
                    <Heart size={14} />
                    <span>{configFields.oracion_kicker || 'CENTRO DE FE Y INTERCESIÓN'}</span>
                  </div>
                )}

                <h1 style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  margin: '0 0 10px 0',
                  lineHeight: 1.15,
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {configFields.oracion_title || 'Peticiones de Oración & Testimonios'}
                </h1>

                <p style={{
                  fontSize: '0.95rem',
                  color: '#94A3B8',
                  margin: '0 auto',
                  lineHeight: 1.6,
                  maxWidth: '560px'
                }}>
                  {configFields.oracion_subtitle || 'Creemos que no hay imposible para Dios, por tanto, cualquiera que sea tu problema, ¡tiene solución!'}
                </p>
              </div>
            </div>
          </div>

          {/* CONTROLS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* KICKER BADGE CARD */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="#977DFF" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Etiqueta Superior (Kicker)
                  </h3>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#977DFF', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="oracion_kicker_hidden"
                    checked={configFields.oracion_kicker_hidden === true || configFields.oracion_kicker_hidden === 'true'}
                    onChange={(e) => handleConfigChange({ target: { name: 'oracion_kicker_hidden', value: e.target.checked } })}
                    style={{ accentColor: '#977DFF', width: '16px', height: '16px' }}
                  />
                  <span>Ocultar Etiqueta</span>
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#977DFF', marginBottom: '6px' }}>
                  Texto de la Etiqueta
                </label>
                <input
                  type="text"
                  name="oracion_kicker"
                  value={configFields.oracion_kicker !== undefined ? configFields.oracion_kicker : 'CENTRO DE FE Y INTERCESIÓN'}
                  onChange={handleConfigChange}
                  placeholder="Ej: CENTRO DE FE Y INTERCESIÓN"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* TITLE & SUBTITLE CARD */}
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
                <Heart size={16} color="#60A5FA" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Título & Subtítulo Principal
                </h3>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  Título Principal (H1)
                </label>
                <input
                  type="text"
                  name="oracion_title"
                  value={configFields.oracion_title || ''}
                  onChange={handleConfigChange}
                  placeholder="Ej: Peticiones de Oración & Testimonios"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  Subtítulo / Bajada de Fe
                </label>
                <textarea
                  name="oracion_subtitle"
                  rows={3}
                  value={configFields.oracion_subtitle || ''}
                  onChange={handleConfigChange}
                  placeholder="Escribe el mensaje alentador para motivar a enviar peticiones..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 2: PASAJE BÍBLICO & PROMESA ALTAR */}
      {activeSubTab === 'verse' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Pasaje Bíblico de la Promesa de Oración
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'rgba(234, 237, 248, 0.6)' }}>
                  Personaliza la cita bíblica destacada en el banner flotante de la página de oración.
                </p>
              </div>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#977DFF', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  name="oracion_verse_hidden"
                  checked={configFields.oracion_verse_hidden === true || configFields.oracion_verse_hidden === 'true'}
                  onChange={(e) => handleConfigChange({ target: { name: 'oracion_verse_hidden', value: e.target.checked } })}
                  style={{ accentColor: '#977DFF', width: '16px', height: '16px' }}
                />
                <span>Ocultar Tarjeta Bíblica</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              
              {/* Verse Text */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                  Texto del Pasaje Bíblico
                </label>
                <textarea
                  name="oracion_verse_text"
                  rows={4}
                  value={configFields.oracion_verse_text !== undefined ? configFields.oracion_verse_text : '«Si dos de vosotros se pusieren de acuerdo en la tierra acerca de cualquiera cosa que pidieren, les será hecho por mi Padre que está en los cielos.»'}
                  onChange={handleConfigChange}
                  placeholder="Texto completo del versículo..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Verse Reference & Altar Promise */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                    Referencia Bíblica
                  </label>
                  <input
                    type="text"
                    name="oracion_verse_ref"
                    value={configFields.oracion_verse_ref !== undefined ? configFields.oracion_verse_ref : 'MATEO 18:19'}
                    onChange={handleConfigChange}
                    placeholder="Ej: MATEO 18:19"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#F59E0B', marginBottom: '6px' }}>
                    Promesa del Altar (Pie de Tarjeta)
                  </label>
                  <input
                    type="text"
                    name="oracion_altar_note"
                    value={configFields.oracion_altar_note !== undefined ? configFields.oracion_altar_note : 'Impresas y colocadas en el altar durante los días de servicio'}
                    onChange={handleConfigChange}
                    placeholder="Ej: Impresas y colocadas en el altar..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
