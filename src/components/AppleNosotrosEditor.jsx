import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  Heart, 
  ShieldCheck, 
  Coffee, 
  Users, 
  ExternalLink, 
  Check, 
  CheckCircle2, 
  RefreshCw, 
  Image, 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  Award,
  ArrowRight
} from 'lucide-react';

export default function AppleNosotrosEditor({
  configFields = {},
  handleConfigChange,
  localNosotrosCards = [],
  handleAddNosotrosCard,
  handleRemoveNosotrosCard,
  handleNosotrosCardChange,
  handleNosotrosCardImageUpload,
  uploadingNosotrosCardImage,
  localPastoresProfiles = [],
  handleAddPastor,
  handleRemovePastor,
  handlePastorChange,
  handlePastorImageUpload,
  uploadingPastorImage,
  localNosotrosButtons = [],
  handleAddNosotrosButton,
  handleRemoveNosotrosButton,
  handleNosotrosButtonChange,
  handleNosotrosHeroUpload,
  uploadingNosotrosHero,
  openMediaLibrary,
  handleSaveNosotrosPageApple,
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
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(151, 125, 255, 0.1) 50%, transparent 75%)',
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
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#60A5FA',
            letterSpacing: '0.04em',
            marginBottom: '10px'
          }}>
            <Sparkles size={13} />
            <span>APPLE STUDIO · PÁGINA 2 DE 8</span>
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
            <span>Nosotros (Acerca de la Visión · /nosotros)</span>
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
            Edición visual moderna de la identidad de la iglesia: portada inspiradora, fundamentos de fe, espacios de experiencia y liderazgo pastoral.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="/nosotros"
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
            <span>Ver Nosotros en Vivo</span>
          </a>

          <button
            type="button"
            onClick={handleSaveNosotrosPageApple}
            disabled={saveLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #977DFF 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              cursor: saveLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
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
                <span>Guardar y Publicar Nosotros</span>
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
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Inventario de Páginas:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'home', name: '1. Inicio (/)', active: false },
              { id: 'nosotros', name: '2. Nosotros', active: true },
              { id: 'congresos', name: '3. Congresos', active: false },
              { id: 'autenticas', name: '4. Auténticas', active: false },
              { id: 'sanados', name: '5. Sanados', active: false },
              { id: 'modelo', name: '6. Modelo', active: false },
              { id: 'move', name: '7. Move', active: false },
              { id: 'tienda', name: '8. Tienda', active: false }
            ].map((pg) => (
              <span
                key={pg.id}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: pg.active ? 800 : 500,
                  backgroundColor: pg.active ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: pg.active ? '1.5px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.06)',
                  color: pg.active ? '#FFFFFF' : 'rgba(234, 237, 248, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  if (pg.id === 'home' && onSelectWebPage) {
                    onSelectWebPage('home');
                  } else if (!pg.active) {
                    alert(`Estamos renovando el sistema página por página como indicaste. ¡Actualmente estamos en Página 2: Nosotros! Pronto continuaremos con ${pg.name}.`);
                  }
                }}
              >
                {pg.name}
              </span>
            ))}
          </div>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'rgba(234, 237, 248, 0.5)' }}>
          Paso 2 de 8 en progreso
        </span>
      </div>

      {/* APPLE SEGMENTED SUBTABS FOR PAGE 2 */}
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
          { id: 'foundations', label: 'Fundamentos de Fe', icon: <Compass size={15} /> },
          { id: 'experiences', label: 'Espacios & Experiencias', icon: <Coffee size={15} /> },
          { id: 'pastors', label: 'Pastores Principales', icon: <Users size={15} /> }
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
          SUBTAB 1: PORTADA PRINCIPAL DE NOSOTROS
         ========================================================================= */}
      {activeSubTab === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* LIVE HERO PREVIEW BOX */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Vista Previa de la Portada de Nosotros
              </label>
              <span style={{ fontSize: '0.75rem', color: 'rgba(234, 237, 248, 0.5)' }}>
                Reflejo exacto de la cabecera en /nosotros
              </span>
            </div>
            
            <div style={{
              position: 'relative',
              width: '100%',
              minHeight: '280px',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#07070B',
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
              {configFields.nosotros_hero_bg || configFields.hero_bg ? (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  backgroundImage: `url("${(configFields.nosotros_hero_bg || configFields.hero_bg).startsWith('http') ? (configFields.nosotros_hero_bg || configFields.hero_bg) : `${API_URL}${configFields.nosotros_hero_bg || configFields.hero_bg}`}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.35,
                  zIndex: 0
                }} />
              ) : (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, #07070B 100%)', zIndex: 0 }} />
              )}

              {/* Gradient bottom overlay */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(180deg, transparent 0%, #07070B 100%)', zIndex: 1 }} />

              {/* Live Content */}
              <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
                {configFields.nosotros_kicker_hidden !== true && configFields.nosotros_kicker_hidden !== 'true' && (
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
                    <Compass size={14} color="#977DFF" />
                    <span>{configFields.nosotros_kicker !== undefined ? configFields.nosotros_kicker : 'CONOCÉ LA VISIÓN'}</span>
                  </div>
                )}

                <h1 style={{
                  fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
                  fontWeight: 850,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  margin: '0 0 10px 0',
                  lineHeight: 1.15
                }}>
                  {configFields.nosotros_title || 'NOSOTROS • VISIÓN JESÚS'}
                </h1>

                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.82)',
                  margin: '0 auto 20px auto',
                  lineHeight: 1.5,
                  maxWidth: '540px'
                }}>
                  {configFields.nosotros_subtitle || 'Una iglesia apasionada por la presencia de Dios, la familia y el discipulado.'}
                </p>

                {configFields.nosotros_buttons_hidden !== true && configFields.nosotros_buttons_hidden !== 'true' && (
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: (configFields.nosotros_buttons_align === 'left' ? 'flex-start' : configFields.nosotros_buttons_align === 'right' ? 'flex-end' : 'center'),
                    flexWrap: 'wrap'
                  }}>
                    {(localNosotrosButtons.length > 0 ? localNosotrosButtons : [
                      { label: 'Unirte a un Grupo de Amistad', link: '/grupos-de-amistad', primary: true },
                      { label: 'Horarios de Servicios', link: '/', primary: false }
                    ]).map((btn, idx) => (
                      <span key={idx} style={{
                        padding: '8px 18px',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        backgroundColor: btn.primary ? '#3B82F6' : 'rgba(255, 255, 255, 0.12)',
                        color: '#FFFFFF',
                        border: btn.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>{btn.label || 'Botón'}</span>
                        {btn.primary && <ArrowRight size={14} />}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CONTROLS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* 1. KICKER BADGE CARD */}
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
                  <Compass size={16} color="#977DFF" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Etiqueta Superior (Pill)
                  </h3>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#977DFF', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="nosotros_kicker_hidden"
                    checked={configFields.nosotros_kicker_hidden === true || configFields.nosotros_kicker_hidden === 'true'}
                    onChange={(e) => handleConfigChange({ target: { name: 'nosotros_kicker_hidden', value: e.target.checked } })}
                    style={{ accentColor: '#977DFF', width: '16px', height: '16px' }}
                  />
                  <span>Ocultar Etiqueta</span>
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#977DFF', marginBottom: '6px' }}>
                  Texto de la Etiqueta ("Pill")
                </label>
                <input
                  type="text"
                  name="nosotros_kicker"
                  value={configFields.nosotros_kicker !== undefined ? configFields.nosotros_kicker : 'CONOCÉ LA VISIÓN'}
                  onChange={handleConfigChange}
                  disabled={configFields.nosotros_kicker_hidden === true || configFields.nosotros_kicker_hidden === 'true'}
                  placeholder="Ej: CONOCÉ LA VISIÓN"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    opacity: (configFields.nosotros_kicker_hidden === true || configFields.nosotros_kicker_hidden === 'true') ? 0.4 : 1
                  }}
                />
              </div>
            </div>

            {/* 2. TEXT FIELDS CARD */}
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
                <Sparkles size={16} color="#60A5FA" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Textos de Cabecera
                </h3>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  Título Principal de la Página
                </label>
                <input
                  type="text"
                  name="nosotros_title"
                  value={configFields.nosotros_title !== undefined ? configFields.nosotros_title : 'NOSOTROS • VISIÓN JESÚS'}
                  onChange={handleConfigChange}
                  placeholder="Ej: NOSOTROS • VISIÓN JESÚS"
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  Subtítulo / Mensaje Inspirador
                </label>
                <textarea
                  rows={3}
                  name="nosotros_subtitle"
                  value={configFields.nosotros_subtitle !== undefined ? configFields.nosotros_subtitle : 'Una iglesia apasionada por la presencia de Dios, la familia y el discipulado.'}
                  onChange={handleConfigChange}
                  placeholder="Ej: Una iglesia apasionada por la presencia de Dios..."
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

            {/* 3. BACKGROUND MEDIA CARD */}
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
                <Image size={16} color="#60A5FA" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Fondo de Portada (Imagen)
                </h3>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  URL de Imagen de Fondo
                </label>
                <input
                  type="text"
                  name="nosotros_hero_bg"
                  value={configFields.nosotros_hero_bg || ''}
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
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  color: '#60A5FA',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: uploadingNosotrosHero ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <Upload size={16} />
                  <span>{uploadingNosotrosHero ? 'Subiendo imagen...' : 'Subir Imagen'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNosotrosHeroUpload}
                    disabled={uploadingNosotrosHero}
                    style={{ display: 'none' }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => openMediaLibrary(['config', 'nosotros_hero_bg'])}
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
                💡 Tip: Si dejas el fondo vacío, se usará automáticamente la foto de portada principal de la iglesia.
              </div>
            </div>

            {/* 4. BUTTONS DISPLAY & ALIGNMENT CARD */}
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
                  <ArrowRight size={16} color="#60A5FA" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Visualización & Posición de Botones
                  </h3>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#F87171', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="nosotros_buttons_hidden"
                    checked={configFields.nosotros_buttons_hidden === true || configFields.nosotros_buttons_hidden === 'true'}
                    onChange={(e) => handleConfigChange({ target: { name: 'nosotros_buttons_hidden', value: e.target.checked } })}
                    style={{ accentColor: '#F87171', width: '16px', height: '16px' }}
                  />
                  <span>Ocultar Todos los Botones</span>
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  Alineación de Botones en Pantalla
                </label>
                <select
                  name="nosotros_buttons_align"
                  value={configFields.nosotros_buttons_align || 'center'}
                  onChange={handleConfigChange}
                  disabled={configFields.nosotros_buttons_hidden === true || configFields.nosotros_buttons_hidden === 'true'}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    opacity: (configFields.nosotros_buttons_hidden === true || configFields.nosotros_buttons_hidden === 'true') ? 0.4 : 1
                  }}
                >
                  <option value="center" style={{ background: '#0D1117' }}>Centrado (Recomendado)</option>
                  <option value="left" style={{ background: '#0D1117' }}>Alineado a la Izquierda</option>
                  <option value="right" style={{ background: '#0D1117' }}>Alineado a la Derecha</option>
                </select>
              </div>
            </div>

            {/* 5. BUTTONS LIST EDITOR CARD */}
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Editar / Quitar / Agregar Botones de la Portada
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(234, 237, 248, 0.5)' }}>
                    Personaliza el texto, enlace y estilo de cada botón
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleNosotrosButtonChange && handleNosotrosButtonChange(0, 'CLEAR_ALL')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '10px',
                      color: '#F87171',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Quitar Todos los Botones</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddNosotrosButton}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '10px',
                      color: '#60A5FA',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={14} />
                    <span>Agregar Nuevo Botón</span>
                  </button>
                </div>
              </div>

              {localNosotrosButtons.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(234, 237, 248, 0.5)', fontSize: '0.88rem' }}>
                  No hay botones configurados. Haz clic en "Agregar Nuevo Botón" para crear uno o activa "Ocultar Todos los Botones".
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {localNosotrosButtons.map((btn, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '14px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ flex: 2, minWidth: '180px' }}>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', fontWeight: 700, marginBottom: '4px' }}>
                          Texto del Botón
                        </label>
                        <input
                          type="text"
                          value={btn.label || ''}
                          onChange={(e) => handleNosotrosButtonChange(idx, 'label', e.target.value)}
                          placeholder="Ej: Unirte a un Grupo de Amistad"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontSize: '0.88rem',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div style={{ flex: 2, minWidth: '180px' }}>
                        <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', fontWeight: 700, marginBottom: '4px' }}>
                          Enlace / Destino
                        </label>
                        <input
                          type="text"
                          value={btn.link || ''}
                          onChange={(e) => handleNosotrosButtonChange(idx, 'link', e.target.value)}
                          placeholder="Ej: /grupos-de-amistad"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontSize: '0.88rem',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '16px' }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.8rem', color: '#60A5FA', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={btn.primary === true}
                            onChange={(e) => handleNosotrosButtonChange(idx, 'primary', e.target.checked)}
                            style={{ accentColor: '#3B82F6' }}
                          />
                          <span>Destacado (Azul)</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveNosotrosButton(idx)}
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            color: '#F87171',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Eliminar botón"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: FUNDAMENTOS DE FE (VISIÓN, MISIÓN, VALORES)
         ========================================================================= */}
      {activeSubTab === 'foundations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                Sección "Fundamentos Congregacionales" (Visión, Misión, Valores)
              </h3>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'rgba(234, 237, 248, 0.6)' }}>
                Si no deseas repetir el bloque de Visión/Misión de la página de Inicio, puedes ocultarlo en /nosotros con un clic.
              </p>
            </div>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', color: '#F87171', fontWeight: 700 }}>
              <input
                type="checkbox"
                name="nosotros_foundations_hidden"
                checked={configFields.nosotros_foundations_hidden === true || configFields.nosotros_foundations_hidden === 'true'}
                onChange={(e) => handleConfigChange({ target: { name: 'nosotros_foundations_hidden', value: e.target.checked } })}
                style={{ accentColor: '#F87171', width: '18px', height: '18px' }}
              />
              <span>Ocultar esta Sección en /nosotros</span>
            </label>
          </div>

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
                    Fundamento 1
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Nuestra Visión
                  </h4>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                  Título
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
                  Texto Doctrinal
                </label>
                <textarea
                  rows={5}
                  name="vision_text"
                  value={configFields.vision_text || ''}
                  onChange={handleConfigChange}
                  placeholder="Evangelizar, Afirmar, Discipular y Enviar..."
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
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60A5FA'
                }}>
                  <Heart size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Fundamento 2
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Nuestra Misión
                  </h4>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                  Título
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
                  Texto Doctrinal
                </label>
                <textarea
                  rows={5}
                  name="mision_text"
                  value={configFields.mision_text || ''}
                  onChange={handleConfigChange}
                  placeholder="Llevar el evangelio de Jesucristo con poder y amor..."
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
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34C759', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Fundamento 3
                  </span>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Nuestros Valores
                  </h4>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                  Título
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
                  Texto Doctrinal
                </label>
                <textarea
                  rows={5}
                  name="valores_text"
                  value={configFields.valores_text || ''}
                  onChange={handleConfigChange}
                  placeholder="Amor Incondicional, Excelencia en el Servicio, Integridad..."
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
          SUBTAB 3: ESPACIOS & EXPERIENCIAS FAMILIARES (VJ KIDS, CAFETERÍA, GRUPOS)
         ========================================================================= */}
      {activeSubTab === 'experiences' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                Espacios Diseñados para Ti y Tu Familia
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(234, 237, 248, 0.65)' }}>
                Tarjetas interactivas de experiencia: VJ Kids, Cafetería Visión, Grupos de Amistad u otros ministerios.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddNosotrosCard}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '9999px',
                color: '#60A5FA',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Nuevo Espacio</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {localNosotrosCards.map((c, cIdx) => (
              <div
                key={c.id || cIdx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase' }}>
                    Tarjeta #{cIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNosotrosCard(c.id)}
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
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={c.title || ''}
                    onChange={(e) => handleNosotrosCardChange(c.id, 'title', e.target.value)}
                    placeholder="Ej: VJ KIDS"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      fontWeight: 800
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Lema / Tagline
                    </label>
                    <input
                      type="text"
                      value={c.tagline || ''}
                      onChange={(e) => handleNosotrosCardChange(c.id, 'tagline', e.target.value)}
                      placeholder="Ej: FE Y DIVERSIÓN..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Badge / Horario
                    </label>
                    <input
                      type="text"
                      value={c.badge || ''}
                      onChange={(e) => handleNosotrosCardChange(c.id, 'badge', e.target.value)}
                      placeholder="Ej: CADA SERVICIO"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    value={c.description || ''}
                    onChange={(e) => handleNosotrosCardChange(c.id, 'description', e.target.value)}
                    placeholder="Detalle del espacio o ministerio..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '0.86rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                    Enlace de Destino (Opcional)
                  </label>
                  <input
                    type="text"
                    value={c.link || ''}
                    onChange={(e) => handleNosotrosCardChange(c.id, 'link', e.target.value)}
                    placeholder="Ej: /grupos-de-amistad"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                    Foto de Portada del Espacio
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={c.image || ''}
                      onChange={(e) => handleNosotrosCardChange(c.id, 'image', e.target.value)}
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
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#60A5FA',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Upload size={13} />
                      <span>{uploadingNosotrosCardImage === c.id ? '...' : 'Subir'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleNosotrosCardImageUpload(c.id, e)}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 4: PASTORES PRINCIPALES & EQUIPO DE LIDERAZGO
         ========================================================================= */}
      {activeSubTab === 'pastors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                Liderazgo Pastoral & Equipo
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(234, 237, 248, 0.65)' }}>
                Perfiles oficiales con foto circular, rol ministerial y biografía pastoral que se muestran en Nosotros.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddPastor}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                backgroundColor: 'rgba(52, 199, 89, 0.15)',
                border: '1px solid rgba(52, 199, 89, 0.3)',
                borderRadius: '9999px',
                color: '#34C759',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Nuevo Pastor / Líder</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {localPastoresProfiles.map((p, pIdx) => (
              <div
                key={p.id || pIdx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div style={{ alignSelf: 'flex-end', marginTop: '-8px' }}>
                  <button
                    type="button"
                    onClick={() => handleRemovePastor(p.id)}
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

                {/* Circular Photo Preview */}
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #977DFF',
                  backgroundColor: '#1E293B',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
                  position: 'relative'
                }}>
                  <img
                    src={p.image && p.image.startsWith('http') ? p.image : (p.image ? `${API_URL}${p.image}` : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800')}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Nombre del Pastor / Líder
                    </label>
                    <input
                      type="text"
                      value={p.name || ''}
                      onChange={(e) => handlePastorChange(p.id, 'name', e.target.value)}
                      placeholder="Ej: Pastores Principales"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Rol / Cargo Ministerial
                    </label>
                    <input
                      type="text"
                      value={p.role || ''}
                      onChange={(e) => handlePastorChange(p.id, 'role', e.target.value)}
                      placeholder="Ej: Liderazgo Pastoral"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Biografía / Reseña Ministerial
                    </label>
                    <textarea
                      rows={3}
                      value={p.bio || ''}
                      onChange={(e) => handlePastorChange(p.id, 'bio', e.target.value)}
                      placeholder="Guiando a la congregación con un corazón dispuesto a servir..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.86rem',
                        fontFamily: 'inherit',
                        lineHeight: 1.5,
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Foto Oficial
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={p.image || ''}
                        onChange={(e) => handlePastorChange(p.id, 'image', e.target.value)}
                        placeholder="URL de foto..."
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
                        backgroundColor: 'rgba(52, 199, 89, 0.15)',
                        border: '1px solid rgba(52, 199, 89, 0.3)',
                        borderRadius: '8px',
                        color: '#34C759',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Upload size={13} />
                        <span>{uploadingPastorImage === p.id ? '...' : 'Subir'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePastorImageUpload(p.id, e)}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
          onClick={handleSaveNosotrosPageApple}
          disabled={saveLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #977DFF 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '0.92rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            cursor: saveLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 12px 32px rgba(59, 130, 246, 0.5), 0 2px 6px rgba(0,0,0,0.4)',
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
              <span>Publicar Cambios de Nosotros</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
