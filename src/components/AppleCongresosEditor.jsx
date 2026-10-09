import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Tag, 
  ExternalLink, 
  Check, 
  CheckCircle2, 
  RefreshCw, 
  Image, 
  Upload, 
  Download, 
  Plus, 
  Trash2, 
  Ticket,
  ArrowRight,
  Filter,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function AppleCongresosEditor({
  configFields = {},
  handleConfigChange,
  localEventsList = [],
  handleAddEvent,
  handleRemoveEvent,
  handleEventChange,
  handleEventImageUpload,
  uploadingEventImage,
  openMediaLibrary,
  handleSaveCongresosPageApple,
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
            <span>APPLE STUDIO · PÁGINA 3 DE 8</span>
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
            <span>Congresos & Eventos Cartelera (/eventos)</span>
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
            Administra toda la agenda de actividades de la iglesia: títulos, banners de portada, estados de entradas, fechas y enlaces de inscripción.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="/eventos"
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
            <span>Ver Congresos en Vivo</span>
          </a>

          <button
            type="button"
            onClick={handleSaveCongresosPageApple}
            disabled={saveLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #977DFF 0%, #3B82F6 100%)',
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
                <span>Guardar y Publicar Congresos</span>
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
              { id: 'congresos', name: '3. Congresos', active: true },
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
                  backgroundColor: pg.active ? 'rgba(151, 125, 255, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: pg.active ? '1.5px solid #977DFF' : '1px solid rgba(255, 255, 255, 0.06)',
                  color: pg.active ? '#FFFFFF' : 'rgba(234, 237, 248, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  if ((pg.id === 'home' || pg.id === 'nosotros') && onSelectWebPage) {
                    onSelectWebPage(pg.id);
                  } else if (!pg.active) {
                    alert(`Estamos renovando la edición del sitio página por página. ¡Estamos en Página 3: Congresos & Eventos! Pronto continuaremos con ${pg.name}.`);
                  }
                }}
              >
                {pg.name}
              </span>
            ))}
          </div>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'rgba(234, 237, 248, 0.5)' }}>
          Paso 3 de 8 en progreso
        </span>
      </div>

      {/* APPLE SEGMENTED SUBTABS FOR PAGE 3 */}
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
          { id: 'hero', label: 'Portada & Filtros', icon: <Sparkles size={15} /> },
          { id: 'grid', label: 'Cartelera de Eventos', icon: <Calendar size={15} /> }
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
          SUBTAB 1: PORTADA & FILTROS DE CONGRESOS
         ========================================================================= */}
      {activeSubTab === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* LIVE HERO PREVIEW BOX */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Vista Previa de la Portada en /eventos
              </label>
              <span style={{ fontSize: '0.75rem', color: 'rgba(234, 237, 248, 0.5)' }}>
                Reflejo en vivo de la cabecera de la cartelera
              </span>
            </div>

            <div style={{
              position: 'relative',
              width: '100%',
              minHeight: '260px',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#030812',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '40px 20px',
              boxSizing: 'border-box',
              background: 'radial-gradient(circle at 50% 20%, rgba(151, 125, 255, 0.2) 0%, rgba(3, 8, 18, 1) 75%)'
            }}>
              <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
                {configFields.events_kicker_hidden !== true && configFields.events_kicker_hidden !== 'true' && (
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
                    color: '#C4B5FD',
                    marginBottom: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    <Sparkles size={14} color="#977DFF" />
                    <span>{configFields.events_kicker !== undefined ? configFields.events_kicker : 'CARTELERA & AGENDA INSTITUCIONAL'}</span>
                  </div>
                )}

                <h1 style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  fontWeight: 850,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  margin: '0 0 10px 0',
                  lineHeight: 1.15,
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #C4B5FD 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {configFields.events_title || 'Eventos Visión Jesús'}
                </h1>

                <p style={{
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.82)',
                  margin: '0 auto 20px auto',
                  lineHeight: 1.5,
                  maxWidth: '540px'
                }}>
                  {configFields.events_subtitle || 'Descubre nuestras actividades especiales para el cierre del 2026 y la proyección del año 2027.'}
                </p>

                {configFields.events_filters_hidden !== true && configFields.events_filters_hidden !== 'true' && (
                  <div style={{
                    display: 'inline-flex',
                    gap: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    padding: '4px',
                    borderRadius: '50px'
                  }}>
                    <span style={{ padding: '6px 14px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 800, background: 'linear-gradient(135deg, #977DFF 0%, #3B82F6 100%)', color: '#FFF' }}>⚡ Todos</span>
                    <span style={{ padding: '6px 14px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)' }}>📅 2026</span>
                    <span style={{ padding: '6px 14px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)' }}>🚀 2027</span>
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
                  <Sparkles size={16} color="#977DFF" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Etiqueta Superior (Kicker)
                  </h3>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#977DFF', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="events_kicker_hidden"
                    checked={configFields.events_kicker_hidden === true || configFields.events_kicker_hidden === 'true'}
                    onChange={(e) => handleConfigChange({ target: { name: 'events_kicker_hidden', value: e.target.checked } })}
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
                  name="events_kicker"
                  value={configFields.events_kicker !== undefined ? configFields.events_kicker : 'CARTELERA & AGENDA INSTITUCIONAL'}
                  onChange={handleConfigChange}
                  disabled={configFields.events_kicker_hidden === true || configFields.events_kicker_hidden === 'true'}
                  placeholder="Ej: CARTELERA & AGENDA INSTITUCIONAL"
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
                    opacity: (configFields.events_kicker_hidden === true || configFields.events_kicker_hidden === 'true') ? 0.4 : 1
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
                <Calendar size={16} color="#60A5FA" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                  Textos de la Cartelera
                </h3>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  Título Principal de la Sección
                </label>
                <input
                  type="text"
                  name="events_title"
                  value={configFields.events_title !== undefined ? configFields.events_title : 'Eventos Visión Jesús'}
                  onChange={handleConfigChange}
                  placeholder="Ej: Eventos Visión Jesús"
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
                  Subtítulo Explicativo
                </label>
                <textarea
                  rows={3}
                  name="events_subtitle"
                  value={configFields.events_subtitle !== undefined ? configFields.events_subtitle : 'Descubre nuestras actividades especiales para el cierre del 2026 y la proyección del año 2027.'}
                  onChange={handleConfigChange}
                  placeholder="Ej: Descubre nuestras actividades especiales..."
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

            {/* 3. FILTERS VISIBILITY CARD */}
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
                  <Filter size={16} color="#60A5FA" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Filtros por Año (Pills)
                  </h3>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#F87171', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    name="events_filters_hidden"
                    checked={configFields.events_filters_hidden === true || configFields.events_filters_hidden === 'true'}
                    onChange={(e) => handleConfigChange({ target: { name: 'events_filters_hidden', value: e.target.checked } })}
                    style={{ accentColor: '#F87171', width: '16px', height: '16px' }}
                  />
                  <span>Ocultar Filtros</span>
                </label>
              </div>

              <p style={{ margin: 0, fontSize: '0.86rem', color: 'rgba(234, 237, 248, 0.65)', lineHeight: 1.5 }}>
                Los botones de filtro permiten a los visitantes filtrar rápidamente entre "Todos los Eventos", "Cierre 2026" y "Proyección 2027". Si desactivas esta opción, se mostrarán todos los eventos en una sola cuadrícula continua.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: GESTOR DE EVENTOS & CARTELERA
         ========================================================================= */}
      {activeSubTab === 'grid' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                Cartelera de Eventos ({localEventsList.length} Eventos)
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(234, 237, 248, 0.65)' }}>
                Agrega, modifica o elimina los congresos y actividades públicas que se muestran en /eventos.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddEvent}
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
              <span>Agregar Nuevo Evento</span>
            </button>
          </div>

          {localEventsList.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              color: 'rgba(234, 237, 248, 0.5)'
            }}>
              No hay eventos configurados en la cartelera. Haz clic en "Agregar Nuevo Evento" para empezar.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {localEventsList.map((evt, idx) => (
                <div key={evt.id || idx} style={{
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
                        EVENTO #{idx + 1}
                      </span>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                        {evt.title || 'Nuevo Evento'}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(evt.id || idx)}
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
                      <span>Eliminar Evento</span>
                    </button>
                  </div>

                  {/* Form Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                    
                    {/* Title */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                        Título del Evento
                      </label>
                      <input
                        type="text"
                        value={evt.title || ''}
                        onChange={(e) => handleEventChange(evt.id || idx, 'title', e.target.value)}
                        placeholder="Ej: Congreso Mujeres Auténticas 2026"
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

                    {/* Subtitle */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                        Subtítulo / Lema
                      </label>
                      <input
                        type="text"
                        value={evt.subtitle || ''}
                        onChange={(e) => handleEventChange(evt.id || idx, 'subtitle', e.target.value)}
                        placeholder="Ej: Edición Especial • Sanidad & Dignidad"
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

                    {/* Year & Category */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                          Año
                        </label>
                        <select
                          value={evt.year || '2026'}
                          onChange={(e) => handleEventChange(evt.id || idx, 'year', e.target.value)}
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
                          <option value="2026" style={{ background: '#0D1117' }}>2026</option>
                          <option value="2027" style={{ background: '#0D1117' }}>2027</option>
                        </select>
                      </div>

                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#C4B5FD', marginBottom: '6px' }}>
                          Categoría
                        </label>
                        <select
                          value={evt.category || 'Congresos'}
                          onChange={(e) => handleEventChange(evt.id || idx, 'category', e.target.value)}
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
                          <option value="Congresos" style={{ background: '#0D1117' }}>Congresos</option>
                          <option value="Adoración" style={{ background: '#0D1117' }}>Adoración</option>
                          <option value="Jóvenes" style={{ background: '#0D1117' }}>Jóvenes</option>
                          <option value="Congregacional" style={{ background: '#0D1117' }}>Congregacional</option>
                        </select>
                      </div>
                    </div>

                    {/* Status Badge Text & Color */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#34C759', marginBottom: '6px' }}>
                          Estado (Badge)
                        </label>
                        <input
                          type="text"
                          value={evt.status || 'Entradas Disponibles'}
                          onChange={(e) => handleEventChange(evt.id || idx, 'status', e.target.value)}
                          placeholder="Ej: Entradas Disponibles"
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
                          Color Badge
                        </label>
                        <input
                          type="color"
                          value={evt.statusColor || '#10B981'}
                          onChange={(e) => handleEventChange(evt.id || idx, 'statusColor', e.target.value)}
                          style={{
                            width: '100%',
                            height: '42px',
                            padding: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                        Fecha y Hora
                      </label>
                      <input
                        type="text"
                        value={evt.date || ''}
                        onChange={(e) => handleEventChange(evt.id || idx, 'date', e.target.value)}
                        placeholder="Ej: Viernes 18 y Sábado 19 de Noviembre, 2026"
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

                    {/* Location */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                        Lugar / Ubicación
                      </label>
                      <input
                        type="text"
                        value={evt.location || ''}
                        onChange={(e) => handleEventChange(evt.id || idx, 'location', e.target.value)}
                        placeholder="Ej: Auditorio Visión Jesús, Desamparados, CR"
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

                    {/* Price Info */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#10B981', marginBottom: '6px' }}>
                        Información de Precios
                      </label>
                      <input
                        type="text"
                        value={evt.priceInfo || ''}
                        onChange={(e) => handleEventChange(evt.id || idx, 'priceInfo', e.target.value)}
                        placeholder="Ej: Gold: ₡12.000 / General: ₡7.500"
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

                    {/* Destination URL */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#977DFF', marginBottom: '6px' }}>
                        Enlace al Hacer Clic
                      </label>
                      <input
                        type="text"
                        value={evt.url || '/autenticas'}
                        onChange={(e) => handleEventChange(evt.id || idx, 'url', e.target.value)}
                        placeholder="Ej: /autenticas, /sanados, etc."
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

                    {/* Image Banner */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                        Imagen de Banner / Portada
                      </label>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          value={evt.image || ''}
                          onChange={(e) => handleEventChange(evt.id || idx, 'image', e.target.value)}
                          placeholder="https://images.unsplash.com/... o /uploads/..."
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '0.88rem',
                            boxSizing: 'border-box'
                          }}
                        />

                        <label style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '10px 16px',
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '10px',
                          color: '#60A5FA',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          cursor: uploadingEventImage === (evt.id || idx) ? 'not-allowed' : 'pointer'
                        }}>
                          <Upload size={14} />
                          <span>{uploadingEventImage === (evt.id || idx) ? 'Subiendo...' : 'Subir'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleEventImageUpload && handleEventImageUpload(evt.id || idx, e)}
                            disabled={uploadingEventImage === (evt.id || idx)}
                            style={{ display: 'none' }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => openMediaLibrary(['events_list', idx, 'image'])}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 16px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '10px',
                            color: '#EAEDF8',
                            fontSize: '0.84rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Download size={14} />
                          <span>Medios</span>
                        </button>
                      </div>
                    </div>

                    {/* Full Description */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '6px' }}>
                        Descripción Completa del Evento
                      </label>
                      <textarea
                        rows={3}
                        value={evt.description || ''}
                        onChange={(e) => handleEventChange(evt.id || idx, 'description', e.target.value)}
                        placeholder="Descripción detallada de las actividades..."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '0.88rem',
                          lineHeight: 1.5,
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                      />
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
