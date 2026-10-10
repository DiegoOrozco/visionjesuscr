import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Send, CheckCircle2, MessageCircle, Quote, Shield, Calendar, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function OracionPage({ config = {}, onGoHome }) {
  const [activeTab, setActiveTab] = useState('peticion'); // 'peticion' | 'testimonios'
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form state for prayer request
  const [prayerForm, setPrayerForm] = useState({
    name: '',
    phone: '',
    requestType: 'Sanidad',
    requestText: ''
  });

  // Form state for testimony
  const [testimonyForm, setTestimonyForm] = useState({
    name: '',
    title: '',
    story: ''
  });
  const [testimonySuccess, setTestimonySuccess] = useState(false);

  // Public approved testimonies list loaded from backend
  const [testimoniesList, setTestimoniesList] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/testimonies`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.testimonies) {
          setTestimoniesList(data.testimonies);
        }
      })
      .catch(() => {});
  }, []);

  const handlePrayerSubmit = (e) => {
    e.preventDefault();
    if (!prayerForm.name || !prayerForm.requestText) return;
    setSubmitting(true);

    fetch(`${API_URL}/api/prayers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prayerForm)
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.success) {
          setSubmittedSuccess(true);
          setPrayerForm({ name: '', phone: '', requestType: 'Sanidad', requestText: '' });
        } else {
          setSubmittedSuccess(true);
        }
      })
      .catch(() => {
        setSubmitting(false);
        setSubmittedSuccess(true);
      });
  };

  const handleTestimonySubmit = (e) => {
    e.preventDefault();
    if (!testimonyForm.name || !testimonyForm.story) return;
    setSubmitting(true);

    fetch(`${API_URL}/api/testimonies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonyForm)
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        if (data.success) {
          setTestimonySuccess(true);
          setTestimonyForm({ name: '', title: '', story: '' });
        } else {
          setTestimonySuccess(true);
        }
      })
      .catch(() => {
        setSubmitting(false);
        setTestimonySuccess(true);
      });
  };

  return (
    <div style={{
      backgroundColor: '#030812',
      color: '#FFFFFF',
      minHeight: '100vh',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      overflowX: 'hidden'
    }}>

      {/* HERO SECTION WITH BIBLE VERSE */}
      <div style={{
        position: 'relative',
        padding: '120px 20px 60px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 20%, rgba(0, 51, 255, 0.18) 0%, rgba(3, 8, 18, 1) 75%)'
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          
          {config.oracion_kicker_hidden !== true && config.oracion_kicker_hidden !== 'true' && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(151, 125, 255, 0.12)',
              border: '1px solid rgba(151, 125, 255, 0.3)',
              color: '#977DFF',
              padding: '6px 20px',
              borderRadius: '50px',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              <Heart size={15} /> {config.oracion_kicker || 'CENTRO DE FE Y INTERCESIÓN'}
            </div>
          )}

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-1px',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {config.oracion_title || 'Peticiones de Oración & Testimonios'}
          </h1>

          <p style={{
            color: '#94A3B8',
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 36px'
          }}>
            {config.oracion_subtitle || 'Creemos que no hay imposible para Dios, por tanto, cualquiera que sea tu problema, ¡tiene solución!'}
          </p>

          {/* BIBLE VERSE CARD */}
          {config.oracion_verse_hidden !== true && config.oracion_verse_hidden !== 'true' && (
            <div style={{
              background: 'rgba(0, 3, 61, 0.55)',
              border: '1px solid rgba(151, 125, 255, 0.25)',
              borderRadius: '24px',
              padding: '32px',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              textAlign: 'left',
              maxWidth: '780px',
              margin: '0 auto'
            }}>
              <Quote size={40} style={{ position: 'absolute', top: '24px', right: '28px', opacity: 0.15, color: '#977DFF' }} />
              
              <p style={{
                fontSize: '1.15rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
                color: '#FFFFFF',
                marginBottom: '14px',
                fontWeight: 500
              }}>
                {config.oracion_verse_text !== undefined ? config.oracion_verse_text : '«Si dos de vosotros se pusieren de acuerdo en la tierra acerca de cualquiera cosa que pidieren, les será hecho por mi Padre que está en los cielos.»'}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ color: '#977DFF', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '1px' }}>
                  {config.oracion_verse_ref !== undefined ? config.oracion_verse_ref : 'MATEO 18:19'}
                </span>
                
                <span style={{ fontSize: '0.84rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} style={{ color: '#F59E0B' }} /> {config.oracion_altar_note !== undefined ? config.oracion_altar_note : 'Impresas y colocadas en el altar durante los días de servicio'}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* TABS SELECTOR */}
      <div style={{ padding: '0 20px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '40px'
        }}>
          <button
            onClick={() => setActiveTab('peticion')}
            style={{
              padding: '12px 28px',
              borderRadius: '50px',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: activeTab === 'peticion' ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
              background: activeTab === 'peticion' ? 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)' : 'rgba(255, 255, 255, 0.05)',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: activeTab === 'peticion' ? '0 8px 24px rgba(0, 51, 255, 0.35)' : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Heart size={16} /> Enviar Petición de Oración
          </button>

          <button
            onClick={() => setActiveTab('testimonios')}
            style={{
              padding: '12px 28px',
              borderRadius: '50px',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: activeTab === 'testimonios' ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
              background: activeTab === 'testimonios' ? 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)' : 'rgba(255, 255, 255, 0.05)',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: activeTab === 'testimonios' ? '0 8px 24px rgba(0, 51, 255, 0.35)' : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} /> Testimonios de Fe
          </button>
        </div>

        {/* TAB 1: PRAYER REQUEST FORM */}
        {activeTab === 'peticion' && (
          <div style={{
            background: 'rgba(0, 3, 61, 0.4)',
            border: '1px solid rgba(151, 125, 255, 0.2)',
            borderRadius: '28px',
            padding: '40px 32px',
            maxWidth: '680px',
            margin: '0 auto',
            backdropFilter: 'blur(20px)'
          }}>
            {submittedSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
                  ¡Petición Recibida con Fe!
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Nuestros guerreros de oración estarán intercediendo por ti. Tu petición será impresa y colocada en el altar ante el Señor durante nuestros días de servicio.
                </p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="apple-btn apple-btn-secondary"
                  style={{ padding: '10px 24px' }}
                >
                  Enviar otra petición
                </button>
              </div>
            ) : (
              <form onSubmit={handlePrayerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                    Formulario de Intercesión
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                    Tus datos se manejan con total confidencialidad por el equipo pastoral.
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#EAEDF8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={prayerForm.name}
                    onChange={(e) => setPrayerForm({ ...prayerForm, name: e.target.value })}
                    placeholder="Escribe tu nombre"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#EAEDF8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Teléfono / WhatsApp (Opcional)
                  </label>
                  <input
                    type="tel"
                    maxLength={8}
                    value={prayerForm.phone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setPrayerForm({ ...prayerForm, phone: digitsOnly });
                    }}
                    placeholder="Ej: 88888888 (8 dígitos)"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#EAEDF8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Tipo de Petición *
                  </label>
                  <select
                    value={prayerForm.requestType}
                    onChange={(e) => setPrayerForm({ ...prayerForm, requestType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      backgroundColor: '#070D1D',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Sanidad">Sanidad Física / Salud</option>
                    <option value="Familia">Familia & Matrimonio</option>
                    <option value="Finanzas">Finanzas & Trabajo</option>
                    <option value="Salvacion">Salvación & Crecimiento Espiritual</option>
                    <option value="Paz">Paz Emocional & Salud Mental</option>
                    <option value="Restauracion">Restauración & Liberación</option>
                    <option value="Otro">Otro Motivo</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#EAEDF8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Petición de Oración *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={prayerForm.requestText}
                    onChange={(e) => setPrayerForm({ ...prayerForm, requestText: e.target.value })}
                    placeholder="Describe tu petición de oración con confianza..."
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '16px 28px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 25px rgba(0, 51, 255, 0.4)',
                    marginTop: '10px'
                  }}
                >
                  <Send size={18} />
                  <span>{submitting ? 'Enviando petición...' : 'Enviar Petición de Oración'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: TESTIMONIES WALL & FORM */}
        {activeTab === 'testimonios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Form to submit a new testimony */}
            <div style={{
              background: 'rgba(0, 3, 61, 0.4)',
              border: '1px solid rgba(151, 125, 255, 0.2)',
              borderRadius: '28px',
              padding: '36px 32px',
              maxWidth: '680px',
              margin: '0 auto',
              width: '100%',
              boxSizing: 'border-box',
              backdropFilter: 'blur(20px)'
            }}>
              {testimonySuccess ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <CheckCircle2 size={40} style={{ color: '#10B981', margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>¡Gracias por compartir tu testimonio!</h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '16px', lineHeight: 1.6 }}>
                    Tu testimonio ha sido recibido con éxito. Será revisado y aprobado por nuestro equipo pastoral antes de ser publicado en el muro de fe.
                  </p>
                  <button onClick={() => setTestimonySuccess(false)} className="apple-btn apple-btn-secondary">
                    Compartir otro testimonio
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTestimonySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: 0, textAlign: 'center' }}>
                    ¡Comparte lo que Dios ha hecho en ti!
                  </h3>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#EAEDF8', marginBottom: '6px' }}>Tu Nombre *</label>
                    <input
                      type="text"
                      required
                      value={testimonyForm.name}
                      onChange={(e) => setTestimonyForm({ ...testimonyForm, name: e.target.value })}
                      placeholder="Nombre y Apellidos"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#EAEDF8', marginBottom: '6px' }}>Título del Testimonio</label>
                    <input
                      type="text"
                      value={testimonyForm.title}
                      onChange={(e) => setTestimonyForm({ ...testimonyForm, title: e.target.value })}
                      placeholder="Ej: Milagro de Sanidad / Dios me respondió"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#EAEDF8', marginBottom: '6px' }}>Tu Historia / Testimonio *</label>
                    <textarea
                      required
                      rows={3}
                      value={testimonyForm.story}
                      onChange={(e) => setTestimonyForm({ ...testimonyForm, story: e.target.value })}
                      placeholder="Cuéntanos brevemente cómo Dios se manifestó..."
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '50px',
                      padding: '12px 24px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Sparkles size={16} /> Publicar Testimonio
                  </button>
                </form>
              )}
            </div>

            {/* Testimonies Grid Wall */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {testimoniesList.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'rgba(0, 3, 61, 0.4)',
                    border: '1px solid rgba(151, 125, 255, 0.2)',
                    borderRadius: '24px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#977DFF', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        TESTIMONIO DE FE
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{item.date}</span>
                    </div>

                    <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
                      {item.title}
                    </h4>

                    <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '20px' }}>
                      "{item.story}"
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #0033FF, #977DFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#FFF' }}>
                      {item.name ? item.name.charAt(0).toUpperCase() : 'V'}
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF' }}>{item.name}</h5>
                      <span style={{ fontSize: '0.76rem', color: '#94A3B8' }}>Iglesia Visión Jesús</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
