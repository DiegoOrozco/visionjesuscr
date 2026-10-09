import React, { useState } from 'react';
import { 
  Sparkles, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  ExternalLink, 
  Check, 
  CheckCircle2, 
  RefreshCw, 
  Image, 
  Upload, 
  Plus, 
  Trash2, 
  Heart,
  MessageCircle,
  HelpCircle,
  Search,
  Filter
} from 'lucide-react';

export default function AppleGruposEditor({
  configFields = {},
  handleConfigChange,
  adminGroupsList = [],
  handleAddGroup,
  handleRemoveGroup,
  handleGroupChange,
  openMediaLibrary,
  handleSaveGruposPageApple,
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
            <span>APPLE STUDIO · PÁGINA 4 DE 11</span>
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
            <span>Grupos de Amistad (/grupos-de-amistad)</span>
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
            Edición visual y gestión directa de los Grupos de Amistad en hogares: personaliza el título hero, los pasos para integrarse, zonas y fichas de grupos activos.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="/grupos-de-amistad"
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
            <span>Ver Grupos en Vivo</span>
          </a>

          <button
            type="button"
            onClick={handleSaveGruposPageApple}
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
                <span>Guardar y Publicar Grupos</span>
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
              { id: 'grupos-de-amistad', name: '4. Grupos de Amistad', active: true },
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
                  backgroundColor: pg.active ? 'rgba(151, 125, 255, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: pg.active ? '1.5px solid #977DFF' : '1px solid rgba(255, 255, 255, 0.06)',
                  color: pg.active ? '#FFFFFF' : 'rgba(234, 237, 248, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  if ((pg.id === 'home' || pg.id === 'nosotros' || pg.id === 'congresos') && onSelectWebPage) {
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
          Página 4 de 11 activa
        </span>
      </div>

      {/* APPLE SEGMENTED SUBTABS FOR PAGE 4 */}
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
          { id: 'hero', label: 'Portada & Textos Hero', icon: <Sparkles size={15} /> },
          { id: 'steps', label: 'Pasos de Integración (4 Fases)', icon: <HelpCircle size={15} /> },
          { id: 'groups', label: 'Gestión Fichas de Grupos', icon: <Users size={15} /> }
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

      {/* SUBTAB 1: HERO PORTADA & TEXTOS */}
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
                VISTA PREVIA EN TIEMPO REAL · HERO DE GRUPOS
              </span>
            </div>

            <div style={{
              borderRadius: '20px',
              padding: '40px 24px',
              textAlign: 'center',
              background: 'radial-gradient(circle at 50% 20%, rgba(0, 51, 255, 0.22) 0%, rgba(3, 8, 18, 1) 75%)',
              border: '1px solid rgba(151, 125, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
                {configFields.grupos_kicker_hidden !== true && configFields.grupos_kicker_hidden !== 'true' && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 14px',
                    backgroundColor: 'rgba(0, 51, 255, 0.15)',
                    border: '1px solid rgba(151, 125, 255, 0.3)',
                    borderRadius: '50px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#977DFF',
                    marginBottom: '16px',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase'
                  }}>
                    <Users size={14} />
                    <span>{configFields.grupos_kicker || 'COMUNIDAD EN HOGARES'}</span>
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
                  {configFields.grupos_title || 'Grupos de Amistad'}
                </h1>

                <p style={{
                  fontSize: '0.95rem',
                  color: '#94A3B8',
                  margin: '0 auto',
                  lineHeight: 1.6,
                  maxWidth: '560px'
                }}>
                  {configFields.grupos_subtitle || 'Conéctate con hermanos en la fe en pequeños grupos donde compartimos la palabra, oramos juntos y construimos verdaderas amistades.'}
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
                    name="grupos_kicker_hidden"
                    checked={configFields.grupos_kicker_hidden === true || configFields.grupos_kicker_hidden === 'true'}
                    onChange={(e) => handleConfigChange({ target: { name: 'grupos_kicker_hidden', value: e.target.checked } })}
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
                  name="grupos_kicker"
                  value={configFields.grupos_kicker !== undefined ? configFields.grupos_kicker : 'COMUNIDAD EN HOGARES'}
                  onChange={handleConfigChange}
                  placeholder="Ej: COMUNIDAD EN HOGARES"
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
                <Users size={16} color="#60A5FA" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Título & Descripción Hero
                </h3>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  Título Principal (H1)
                </label>
                <input
                  type="text"
                  name="grupos_title"
                  value={configFields.grupos_title || ''}
                  onChange={handleConfigChange}
                  placeholder="Ej: Grupos de Amistad"
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
                  Subtítulo / Bajada Inspiradora
                </label>
                <textarea
                  name="grupos_subtitle"
                  rows={3}
                  value={configFields.grupos_subtitle || ''}
                  onChange={handleConfigChange}
                  placeholder="Escribe la descripción inspiradora sobre la comunidad y vida en pequeños grupos..."
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

      {/* SUBTAB 2: STEPS ONBOARDING (4 PASOS) */}
      {activeSubTab === 'steps' && (
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
                  Pasos de Integración a Grupos de Amistad
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'rgba(234, 237, 248, 0.6)' }}>
                  Personaliza los 4 pasos explicativos que guían a la congregación sobre cómo unirse a un grupo.
                </p>
              </div>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#977DFF', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  name="grupos_steps_hidden"
                  checked={configFields.grupos_steps_hidden === true || configFields.grupos_steps_hidden === 'true'}
                  onChange={(e) => handleConfigChange({ target: { name: 'grupos_steps_hidden', value: e.target.checked } })}
                  style={{ accentColor: '#977DFF', width: '16px', height: '16px' }}
                />
                <span>Ocultar Sección de Pasos</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {[
                { num: '1', keyTitle: 'grupos_step1_title', keyDesc: 'grupos_step1_desc', defaultTitle: 'Busca tu Zona o Red', defaultDesc: 'Explora nuestra lista por cantón, día de reunión o red (Jóvenes, Mujeres, Matrimonios, Mixto).' },
                { num: '2', keyTitle: 'grupos_step2_title', keyDesc: 'grupos_step2_desc', defaultTitle: 'Elige tu Grupo Ideal', defaultDesc: 'Encuentra el grupo que mejor se adapte a tu ubicación geográfica y horario disponible.' },
                { num: '3', keyTitle: 'grupos_step3_title', keyDesc: 'grupos_step3_desc', defaultTitle: 'Completa tu Solicitud', defaultDesc: 'Haz clic en "¡Quiero Unirme!" y completa el breve formulario de contacto con tu nombre y teléfono.' },
                { num: '4', keyTitle: 'grupos_step4_title', keyDesc: 'grupos_step4_desc', defaultTitle: 'Recibe la Bienvenida', defaultDesc: 'El anfitrión o líder del grupo se pondrá en contacto contigo para darte la dirección y darte la bienvenida.' }
              ].map((step) => (
                <div key={step.num} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(151, 125, 255, 0.2)',
                      border: '1.5px solid #977DFF',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}>
                      {step.num}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF' }}>
                      Paso #{step.num}
                    </h4>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '4px' }}>
                      Título del Paso
                    </label>
                    <input
                      type="text"
                      name={step.keyTitle}
                      value={configFields[step.keyTitle] !== undefined ? configFields[step.keyTitle] : step.defaultTitle}
                      onChange={handleConfigChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.6)', marginBottom: '4px' }}>
                      Descripción
                    </label>
                    <textarea
                      name={step.keyDesc}
                      rows={3}
                      value={configFields[step.keyDesc] !== undefined ? configFields[step.keyDesc] : step.defaultDesc}
                      onChange={handleConfigChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '0.82rem',
                        lineHeight: 1.4,
                        boxSizing: 'border-box',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 3: GESTIÓN DE FICHAS DE GRUPOS */}
      {activeSubTab === 'groups' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                Fichas de Grupos de Amistad ({adminGroupsList.length})
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'rgba(234, 237, 248, 0.6)' }}>
                Agrega y administra la información de cada grupo en hogares, horario, zona, líderes y teléfono.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddGroup}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                backgroundColor: 'rgba(151, 125, 255, 0.2)',
                border: '1px solid rgba(151, 125, 255, 0.4)',
                borderRadius: '9999px',
                color: '#C4B5FD',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={16} />
              <span>Agregar Nuevo Grupo</span>
            </button>
          </div>

          {adminGroupsList.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              color: 'rgba(234, 237, 248, 0.5)'
            }}>
              No hay grupos registrados actualmente. Haz clic en "Agregar Nuevo Grupo" para añadir la primera ficha.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {adminGroupsList.map((grp, idx) => (
                <div key={grp.id || idx} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  {/* Card Header & Delete Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        backgroundColor: 'rgba(151, 125, 255, 0.2)',
                        color: '#C4B5FD',
                        border: '1px solid rgba(151, 125, 255, 0.3)'
                      }}>
                        GRUPO #{idx + 1}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                        {grp.name || 'Nuevo Grupo de Amistad'}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveGroup(grp.id || idx)}
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
                      <span>Eliminar Grupo</span>
                    </button>
                  </div>

                  {/* Form Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                    
                    {/* Name */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                        Nombre del Grupo
                      </label>
                      <input
                        type="text"
                        value={grp.name || ''}
                        onChange={(e) => handleGroupChange(grp.id || idx, 'name', e.target.value)}
                        placeholder="Ej: Grupo de Amistad - Desamparados Central"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Zone & Modality */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                          Zona / Cantón
                        </label>
                        <input
                          type="text"
                          value={grp.zone || ''}
                          onChange={(e) => handleGroupChange(grp.id || idx, 'zone', e.target.value)}
                          placeholder="Ej: Desamparados"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '0.88rem',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                          Modalidad
                        </label>
                        <select
                          value={grp.modality || 'Presencial'}
                          onChange={(e) => handleGroupChange(grp.id || idx, 'modality', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '0.88rem',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="Presencial" style={{ background: '#0D1117' }}>Presencial</option>
                          <option value="Online" style={{ background: '#0D1117' }}>Online / Virtual</option>
                        </select>
                      </div>
                    </div>

                    {/* Network Category & Leaders */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#34C759', marginBottom: '6px' }}>
                          Red / Categoría
                        </label>
                        <input
                          type="text"
                          value={grp.network_category || 'Mixto'}
                          onChange={(e) => handleGroupChange(grp.id || idx, 'network_category', e.target.value)}
                          placeholder="Ej: Mixto, Mujeres, MOVE Jóvenes"
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

                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#34C759', marginBottom: '6px' }}>
                          Anfitriones / Líderes
                        </label>
                        <input
                          type="text"
                          value={grp.leaders || ''}
                          onChange={(e) => handleGroupChange(grp.id || idx, 'leaders', e.target.value)}
                          placeholder="Ej: Carlos & Ana María"
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

                    {/* Meeting Day & Time */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                          Día de Reunión
                        </label>
                        <input
                          type="text"
                          value={grp.meeting_day || ''}
                          onChange={(e) => handleGroupChange(grp.id || idx, 'meeting_day', e.target.value)}
                          placeholder="Ej: Jueves"
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

                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                          Hora
                        </label>
                        <input
                          type="text"
                          value={grp.meeting_time || ''}
                          onChange={(e) => handleGroupChange(grp.id || idx, 'meeting_time', e.target.value)}
                          placeholder="Ej: 7:30 PM"
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

                    {/* Address Reference & Phone */}
                    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#F59E0B', marginBottom: '6px' }}>
                          Referencia de Dirección / Ubicación
                        </label>
                        <input
                          type="text"
                          value={grp.address_reference || ''}
                          onChange={(e) => handleGroupChange(grp.id || idx, 'address_reference', e.target.value)}
                          placeholder="Ej: 500m sur del Parque de Desamparados"
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
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#F59E0B', marginBottom: '6px' }}>
                          Teléfono de Contacto / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={grp.phone || ''}
                          onChange={(e) => handleGroupChange(grp.id || idx, 'phone', e.target.value)}
                          placeholder="Ej: +506 8888-1111"
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
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
