import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  Users, 
  Flame, 
  Shield, 
  Gem, 
  Heart, 
  Award, 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Layers, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Grid
} from 'lucide-react';

export default function AppleModeloEditor({
  configFields = {},
  handleConfigChange,
  localModeloNetworks = [],
  handleAddNetwork,
  handleRemoveNetwork,
  handleNetworkChange,
  openMediaLibrary,
  handleSaveModeloPageApple,
  saveLoading = false,
  saveSuccessMsg = '',
  onSelectWebPage,
  API_URL = ''
}) {
  const [activeSubTab, setActiveSubTab] = useState('hero');

  // Preview helper for uploaded image paths
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return `${API_URL}${url}`;
    return `${API_URL}/${url}`;
  };

  return (
    <div className="apple-editor-container" style={{
      backgroundColor: '#0E0E14',
      borderRadius: '32px',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      padding: '36px',
      color: '#FFFFFF',
      fontFamily: 'var(--apple-font, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif)',
      boxShadow: '0 30px 90px rgba(0, 0, 0, 0.7)'
    }}>
      {/* TOP HEADER & ACTION BAR */}
      <div style={{
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
            backgroundColor: 'rgba(236, 72, 153, 0.12)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#F472B6',
            letterSpacing: '0.04em',
            marginBottom: '10px'
          }}>
            <Sparkles size={13} />
            <span>APPLE STUDIO · PÁGINA 9 DE 11</span>
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
            <span>Modelo de Jesús (/modelo)</span>
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
            Gestiona la estructura de redes y ministerios por edades (VJ Kids, PreJuzMOVE, MOVE, MOVE PLUS, FUXION, DIAMANTE), textos principales y fotos del modelo de discipulado.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="/modelo"
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
            <span>Ver Modelo en Vivo</span>
          </a>

          <button
            type="button"
            onClick={handleSaveModeloPageApple}
            disabled={saveLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #EC4899 0%, #977DFF 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              cursor: saveLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 24px rgba(236, 72, 153, 0.35)',
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
                <span>Guardar y Publicar Modelo</span>
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
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F472B6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Inventario de Páginas:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'home', name: '1. Inicio (/)', active: false },
              { id: 'nosotros', name: '2. Nosotros', active: false },
              { id: 'congresos', name: '3. Eventos & Congresos', active: false },
              { id: 'grupos-de-amistad', name: '4. Grupos de Amistad', active: false },
              { id: 'oracion', name: '5. Oración & Testimonios', active: false },
              { id: 'donar', name: '6. Donar', active: false },
              { id: 'modelo', name: '9. Modelo de Jesús', active: true }
            ].map((pg) => (
              <span
                key={pg.id}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: pg.active ? 800 : 500,
                  backgroundColor: pg.active ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: pg.active ? '1.5px solid #F472B6' : '1px solid rgba(255, 255, 255, 0.06)',
                  color: pg.active ? '#FFFFFF' : 'rgba(234, 237, 248, 0.5)',
                  cursor: pg.active ? 'default' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  if (onSelectWebPage && !pg.active) {
                    onSelectWebPage(pg.id);
                  }
                }}
              >
                {pg.name}
              </span>
            ))}
          </div>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'rgba(234, 237, 248, 0.5)' }}>
          Página 9 de 11 activa
        </span>
      </div>

      {/* APPLE SEGMENTED SUBTABS */}
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
          { id: 'hero', label: 'Banner & Título Hero', icon: <Sparkles size={15} /> },
          { id: 'networks', label: 'Redes & Ministerios', icon: <Users size={15} /> }
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

      {/* SUBTAB 1: HERO & MAIN HEADINGS */}
      {activeSubTab === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '28px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 16px 0', color: '#F472B6' }}>
              Encabezado Principal de Modelo de Jesús
            </h3>

            {/* Kicker Badge */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'rgba(234, 237, 248, 0.8)' }}>
                  Kicker / Etiqueta Superior
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.78rem', color: '#F472B6' }}>
                  <input
                    type="checkbox"
                    name="modelo_kicker_hidden"
                    checked={configFields.modelo_kicker_hidden === 'true' || configFields.modelo_kicker_hidden === true}
                    onChange={(e) => {
                      handleConfigChange({
                        target: {
                          name: 'modelo_kicker_hidden',
                          value: e.target.checked
                        }
                      });
                    }}
                  />
                  <span>Ocultar Kicker en la web</span>
                </label>
              </div>
              <input
                type="text"
                name="modelo_kicker"
                value={configFields.modelo_kicker !== undefined ? configFields.modelo_kicker : 'REDES Y MINISTERIOS'}
                onChange={handleConfigChange}
                disabled={configFields.modelo_kicker_hidden === 'true' || configFields.modelo_kicker_hidden === true}
                placeholder="Ej. REDES Y MINISTERIOS (deja vacío u oculta si no deseas mostrarlo)"
                className="apple-input"
                style={{
                  opacity: (configFields.modelo_kicker_hidden === 'true' || configFields.modelo_kicker_hidden === true) ? 0.5 : 1
                }}
              />
            </div>

            {/* Title */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '8px', color: 'rgba(234, 237, 248, 0.8)' }}>
                Título Principal
              </label>
              <input
                type="text"
                name="modelo_title"
                value={configFields.modelo_title !== undefined ? configFields.modelo_title : 'MODELO DE JESÚS'}
                onChange={handleConfigChange}
                placeholder="Ej. MODELO DE JESÚS"
                className="apple-input"
              />
            </div>

            {/* Subtitle */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '8px', color: 'rgba(234, 237, 248, 0.8)' }}>
                Subtítulo Descriptivo
              </label>
              <textarea
                name="modelo_subtitle"
                rows="3"
                value={configFields.modelo_subtitle !== undefined ? configFields.modelo_subtitle : 'Trabajamos con redes y grupos organizados que cuidan de las personas en cada etapa de su vida, formando líderes con carácter y corazón de servicio.'}
                onChange={handleConfigChange}
                placeholder="Descripción del modelo de Jesús..."
                className="apple-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Hero Background Image */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '8px', color: 'rgba(234, 237, 248, 0.8)' }}>
                Imagen de Fondo Hero
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  name="modelo_hero_bg"
                  value={configFields.modelo_hero_bg || ''}
                  onChange={handleConfigChange}
                  placeholder="URL o ruta de la imagen..."
                  className="apple-input"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => openMediaLibrary && openMediaLibrary('modelo_hero_bg')}
                  className="apple-btn apple-btn-secondary"
                  style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}
                >
                  <ImageIcon size={16} />
                  <span>Biblioteca</span>
                </button>
              </div>
              {configFields.modelo_hero_bg && (
                <div style={{ marginTop: '12px', width: '100%', maxHeight: '180px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <img
                    src={getImageUrl(configFields.modelo_hero_bg)}
                    alt="Preview Hero"
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: NETWORKS & MINISTRIES */}
      {activeSubTab === 'networks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#F472B6' }}>
                Redes y Ministerios por Edades ({localModeloNetworks.length})
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'rgba(234, 237, 248, 0.6)', margin: '4px 0 0 0' }}>
                Edita los nombres, etiquetas, rangos de edad, descripciones e imágenes de cada red.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddNetwork}
              className="apple-btn apple-btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <Plus size={16} />
              <span>Agregar Nueva Red</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {localModeloNetworks.map((net, idx) => (
              <div
                key={net.id || idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(236, 72, 153, 0.15)',
                    color: '#F472B6',
                    border: '1px solid rgba(236, 72, 153, 0.3)'
                  }}>
                    RED #{idx + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveNetwork(net.id || idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FF453A',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Eliminar Red"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '4px' }}>
                    Nombre de la Red
                  </label>
                  <input
                    type="text"
                    value={net.name || ''}
                    onChange={(e) => handleNetworkChange(net.id || idx, 'name', e.target.value)}
                    placeholder="Ej. VJ Kids"
                    className="apple-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '4px' }}>
                      Badge / Categ.
                    </label>
                    <input
                      type="text"
                      value={net.badge || ''}
                      onChange={(e) => handleNetworkChange(net.id || idx, 'badge', e.target.value)}
                      placeholder="Ej. Red de Niños"
                      className="apple-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '4px' }}>
                      Rango de Edad
                    </label>
                    <input
                      type="text"
                      value={net.age || ''}
                      onChange={(e) => handleNetworkChange(net.id || idx, 'age', e.target.value)}
                      placeholder="Ej. De 0 a 9 años"
                      className="apple-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '4px' }}>
                    Descripción Corta
                  </label>
                  <textarea
                    rows="3"
                    value={net.description || ''}
                    onChange={(e) => handleNetworkChange(net.id || idx, 'description', e.target.value)}
                    placeholder="Descripción del trabajo con este grupo de edad..."
                    className="apple-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(234, 237, 248, 0.7)', marginBottom: '4px' }}>
                    Imagen de la Red
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={net.image || ''}
                      onChange={(e) => handleNetworkChange(net.id || idx, 'image', e.target.value)}
                      placeholder="URL de la imagen..."
                      className="apple-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => openMediaLibrary && openMediaLibrary(`modelo_network_image_${idx}`)}
                      className="apple-btn apple-btn-secondary"
                      style={{ padding: '8px 12px' }}
                    >
                      <ImageIcon size={14} />
                    </button>
                  </div>

                  {net.image && (
                    <img
                      src={getImageUrl(net.image)}
                      alt={net.name}
                      style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '12px', marginTop: '8px' }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
