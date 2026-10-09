import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Quote, 
  Smartphone, 
  Building2, 
  CreditCard, 
  ExternalLink, 
  Check, 
  CheckCircle2, 
  RefreshCw, 
  Copy,
  DollarSign
} from 'lucide-react';

export default function AppleDonarEditor({
  configFields = {},
  handleConfigChange,
  openMediaLibrary,
  handleSaveDonarPageApple,
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
            <span>APPLE STUDIO · PÁGINA 6 DE 11</span>
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
            <span>Donaciones & Ofrendas (/donar)</span>
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
            Gestiona los canales oficiales de siembra y diezmo: número de SINPE Móvil, titular de la cuenta, pasajes de mayordomía y cuentas bancarias IBAN.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="/donar"
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
            <span>Ver Donar en Vivo</span>
          </a>

          <button
            type="button"
            onClick={handleSaveDonarPageApple}
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
                <span>Guardar y Publicar Donar</span>
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
              { id: 'oracion', name: '5. Oración & Testimonios', active: false },
              { id: 'donar', name: '6. Donar', active: true },
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
                  if ((pg.id === 'home' || pg.id === 'nosotros' || pg.id === 'congresos' || pg.id === 'grupos-de-amistad' || pg.id === 'oracion') && onSelectWebPage) {
                    onSelectWebPage(pg.id);
                  } else if (!pg.active) {
                    alert(`Estamos renovando el sistema página por página. Puedes navegar entre 1. Inicio, 2. Nosotros, 3. Eventos & Congresos, 4. Grupos de Amistad, 5. Oración y 6. Donar. ¡Pronto habilitaremos el editor exclusivo de ${pg.name}!`);
                  }
                }}
              >
                {pg.name}
              </span>
            ))}
          </div>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'rgba(234, 237, 248, 0.5)' }}>
          Página 6 de 11 activa
        </span>
      </div>

      {/* APPLE SEGMENTED SUBTABS FOR PAGE 6 */}
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
          { id: 'hero', label: 'Portada & Versículo Hero', icon: <Sparkles size={15} /> },
          { id: 'sinpe', label: 'SINPE Móvil & Cuentas Bancarias IBAN', icon: <Smartphone size={15} /> }
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

      {/* SUBTAB 1: PORTADA & VERSÍCULO HERO */}
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
                VISTA PREVIA EN TIEMPO REAL · HERO DE DONAR
              </span>
            </div>

            <div style={{
              borderRadius: '20px',
              padding: '40px 24px',
              textAlign: 'center',
              background: 'radial-gradient(circle at 50% 20%, rgba(151, 125, 255, 0.22) 0%, rgba(3, 8, 18, 1) 75%)',
              border: '1px solid rgba(151, 125, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
                {configFields.donar_kicker_hidden !== true && configFields.donar_kicker_hidden !== 'true' && (
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
                    <span>{configFields.donar_kicker || 'GENEROSIDAD & MAYORDOMÍA'}</span>
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
                  {configFields.donar_title || 'Donaciones & Ofrendas'}
                </h1>

                <p style={{
                  fontSize: '0.95rem',
                  color: '#94A3B8',
                  margin: '0 auto',
                  lineHeight: 1.6,
                  maxWidth: '560px'
                }}>
                  {configFields.donar_subtitle || 'Cada semilla sembrada impulsa el Reino de Dios, restaura vidas y extiende el mensaje de Jesucristo en nuestra nación.'}
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
                    name="donar_kicker_hidden"
                    checked={configFields.donar_kicker_hidden === true || configFields.donar_kicker_hidden === 'true'}
                    onChange={(e) => handleConfigChange({ target: { name: 'donar_kicker_hidden', value: e.target.checked } })}
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
                  name="donar_kicker"
                  value={configFields.donar_kicker !== undefined ? configFields.donar_kicker : 'GENEROSIDAD & MAYORDOMÍA'}
                  onChange={handleConfigChange}
                  placeholder="Ej: GENEROSIDAD & MAYORDOMÍA"
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
                  Título & Subtítulo Hero
                </h3>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  Título Principal (H1)
                </label>
                <input
                  type="text"
                  name="donar_title"
                  value={configFields.donar_title || ''}
                  onChange={handleConfigChange}
                  placeholder="Ej: Donaciones & Ofrendas"
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
                  Subtítulo / Bajada de Mayordomía
                </label>
                <textarea
                  name="donar_subtitle"
                  rows={3}
                  value={configFields.donar_subtitle || ''}
                  onChange={handleConfigChange}
                  placeholder="Escribe el mensaje sobre la importancia de la siembra..."
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

      {/* SUBTAB 2: SINPE MÓVIL & CUENTAS BANCARIAS IBAN */}
      {activeSubTab === 'sinpe' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* SINPE MOVIL CARD */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '14px' }}>
              <Smartphone size={20} color="#34C759" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                Datos de SINPE Móvil
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#34C759', marginBottom: '6px' }}>
                  Número SINPE Móvil (Directo para copiar)
                </label>
                <input
                  type="text"
                  name="sinpe_phone"
                  value={configFields.sinpe_phone || '60121225'}
                  onChange={handleConfigChange}
                  placeholder="Ej: 60121225"
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
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#34C759', marginBottom: '6px' }}>
                  Número SINPE Formateado (Visual)
                </label>
                <input
                  type="text"
                  name="sinpe_display"
                  value={configFields.sinpe_display || '6012-1225'}
                  onChange={handleConfigChange}
                  placeholder="Ej: 6012-1225"
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
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#34C759', marginBottom: '6px' }}>
                  Titular de la Cuenta SINPE / Jurídico
                </label>
                <input
                  type="text"
                  name="sinpe_holder"
                  value={configFields.sinpe_holder || 'Iglesia Visión Jesús'}
                  onChange={handleConfigChange}
                  placeholder="Ej: Iglesia Visión Jesús"
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
            </div>
          </div>

          {/* BANK IBAN ACCOUNTS CARD */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '14px' }}>
              <Building2 size={20} color="#60A5FA" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                Cuentas Bancarias e IBAN
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  IBAN Banco Nacional (Colones ₡)
                </label>
                <input
                  type="text"
                  name="iban_bncr_crc"
                  value={configFields.iban_bncr_crc || ''}
                  onChange={handleConfigChange}
                  placeholder="CR05015100000000000000"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  IBAN Banco Nacional (Dólares $)
                </label>
                <input
                  type="text"
                  name="iban_bncr_usd"
                  value={configFields.iban_bncr_usd || ''}
                  onChange={handleConfigChange}
                  placeholder="CR05015100000000000000"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#977DFF', marginBottom: '6px' }}>
                  IBAN BAC Credomatic (Colones ₡)
                </label>
                <input
                  type="text"
                  name="iban_bac_crc"
                  value={configFields.iban_bac_crc || ''}
                  onChange={handleConfigChange}
                  placeholder="CR05010200000000000000"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#977DFF', marginBottom: '6px' }}>
                  IBAN BAC Credomatic (Dólares $)
                </label>
                <input
                  type="text"
                  name="iban_bac_usd"
                  value={configFields.iban_bac_usd || ''}
                  onChange={handleConfigChange}
                  placeholder="CR05010200000000000000"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
