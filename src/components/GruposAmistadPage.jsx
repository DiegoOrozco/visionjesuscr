import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, Users, Send, CheckCircle2, Filter, Heart, Sparkles, Phone, ArrowRight, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function GruposAmistadPage({ config = {}, onGoHome }) {
  const [selectedZone, setSelectedZone] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedModality, setSelectedModality] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal for joining a group
  const [activeGroupModal, setActiveGroupModal] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sample default groups if API is empty
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Grupo de Amistad - Desamparados Central',
      zone: 'Desamparados',
      canton: 'Desamparados Central',
      address_reference: '500m sur del Parque de Desamparados',
      meeting_day: 'Jueves',
      meeting_time: '7:30 PM',
      modality: 'Presencial',
      network_category: 'Mixto',
      leaders: 'Carlos & Ana María',
      phone: '+506 8888-1111'
    },
    {
      id: 2,
      name: 'Grupo de Amistad - San Antonio',
      zone: 'Desamparados',
      canton: 'San Antonio',
      address_reference: 'Cerca de la Plaza de San Antonio',
      meeting_day: 'Viernes',
      meeting_time: '7:00 PM',
      modality: 'Presencial',
      network_category: 'Adultos FUXION',
      leaders: 'Pastor Wagner & Pastora Dayana',
      phone: '+506 8888-2222'
    },
    {
      id: 3,
      name: 'Grupo de Amistad - MOVE Jóvenes',
      zone: 'San José',
      canton: 'Zapote',
      address_reference: 'Frente a la Rotonda de las Garantías',
      meeting_day: 'Sábado',
      meeting_time: '6:00 PM',
      modality: 'Presencial',
      network_category: 'Jóvenes MOVE',
      leaders: 'Equipo de Liderazgo MOVE',
      phone: '+506 8888-3333'
    },
    {
      id: 4,
      name: 'Grupo de Amistad - Gravilias',
      zone: 'Desamparados',
      canton: 'Gravilias',
      address_reference: 'Barrio Gravilias de Desamparados',
      meeting_day: 'Miércoles',
      meeting_time: '7:00 PM',
      modality: 'Presencial',
      network_category: 'Mujeres',
      leaders: 'Elena Morales',
      phone: '+506 8888-4444'
    },
    {
      id: 5,
      name: 'Grupo de Amistad - Curridabat',
      zone: 'Curridabat',
      canton: 'Curridabat Centro',
      address_reference: 'Cerca de la Iglesia de Curridabat',
      meeting_day: 'Jueves',
      meeting_time: '7:30 PM',
      modality: 'Presencial',
      network_category: 'Mixto',
      leaders: 'Roberto & Sofía',
      phone: '+506 8888-5555'
    },
    {
      id: 6,
      name: 'Grupo de Amistad - Virtual / Online',
      zone: 'Virtual',
      canton: 'Nacional & Internacional',
      address_reference: 'Reunión por Zoom / Google Meet',
      meeting_day: 'Martes',
      meeting_time: '8:00 PM',
      modality: 'Online',
      network_category: 'Mixto',
      leaders: 'Equipo de Conexión Virtual',
      phone: '+506 8888-6666'
    }
  ]);

  useEffect(() => {
    fetch(`${API_URL}/api/friendship-groups`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.groups && data.groups.length > 0) {
          setGroups(data.groups);
        }
      })
      .catch(() => {});
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) return;
    setSubmitting(true);

    fetch(`${API_URL}/api/group-contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groupId: activeGroupModal ? activeGroupModal.id : null,
        groupName: activeGroupModal ? activeGroupModal.name : 'Contacto General',
        ...contactForm
      })
    })
      .then(res => res.json())
      .then(data => {
        setSubmitting(false);
        setSubmitSuccess(true);
      })
      .catch(() => {
        setSubmitting(false);
        setSubmitSuccess(true);
      });
  };

  // Filter logic
  const filteredGroups = groups.filter(g => {
    const matchesZone = selectedZone === 'Todas' || g.zone === selectedZone;
    const matchesCategory = selectedCategory === 'Todas' || g.network_category === selectedCategory;
    const matchesModality = selectedModality === 'Todas' || g.modality === selectedModality;
    const matchesSearch = searchTerm === '' || 
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      g.canton.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.leaders && g.leaders.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesZone && matchesCategory && matchesModality && matchesSearch;
  });

  return (
    <div style={{
      backgroundColor: '#030812',
      color: '#FFFFFF',
      minHeight: '100vh',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      overflowX: 'hidden'
    }}>

      {/* APPLE FROSTED NAVBAR */}
      <div className="apple-nav-wrapper">
        <header className="apple-nav-bar">
          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => window.location.href = '/'}
          >
            <img src="/logo_oficial_transparente.png" alt="Visión Jesús Logo" style={{ height: '46px', objectFit: 'contain' }} />
          </div>

          <nav className="apple-nav-links">
            <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="apple-nav-link">Inicio</a>
            <a href="/nosotros" onClick={(e) => { e.preventDefault(); window.location.href = '/nosotros'; }} className="apple-nav-link">Nosotros</a>
            <a href="/modelo" onClick={(e) => { e.preventDefault(); window.location.href = '/modelo'; }} className="apple-nav-link">Modelo de Jesús</a>
            <a href="/grupos-de-amistad" onClick={(e) => { e.preventDefault(); }} className="apple-nav-link" style={{ color: '#FFFFFF' }}>Grupos de Amistad</a>
            <a href="/eventos" onClick={(e) => { e.preventDefault(); window.location.href = '/eventos'; }} className="apple-nav-link">Eventos</a>
            <a href="/oracion" onClick={(e) => { e.preventDefault(); window.location.href = '/oracion'; }} className="apple-nav-link">Oración & Testimonios</a>
            <a href="/donar" onClick={(e) => { e.preventDefault(); window.location.href = '/donar'; }} className="apple-nav-link">Donar</a>
          </nav>

          <button 
            onClick={() => window.location.href = '/eventos'}
            className="apple-btn apple-btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <Calendar size={14} />
            <span>Eventos</span>
          </button>
        </header>
      </div>

      {/* HERO SECTION */}
      <div style={{
        position: 'relative',
        padding: '120px 20px 60px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 20%, rgba(0, 51, 255, 0.22) 0%, rgba(3, 8, 18, 1) 75%)'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(0, 51, 255, 0.15)',
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
            <Users size={15} /> COMUNIDAD EN HOGARES
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-1px',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Grupos de Amistad
          </h1>

          <p style={{
            color: '#94A3B8',
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 40px'
          }}>
            Conéctate con hermanos en la fe en pequeños grupos donde compartimos la palabra, oramos juntos y construimos verdaderas amistades.
          </p>

        </div>
      </div>

      {/* 4 STEPS ONBOARDING (EXACTLY AS SCREENSHOT) */}
      <div style={{ padding: '0 20px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
            ¿Cómo integrarte a un Grupo de Amistad?
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {/* STEP 1: BUSCA */}
          <div style={{
            background: 'rgba(0, 3, 61, 0.45)',
            border: '1px solid rgba(151, 125, 255, 0.2)',
            borderRadius: '24px',
            padding: '28px 24px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: 'rgba(0, 51, 255, 0.2)',
              border: '1px solid rgba(0, 51, 255, 0.4)',
              color: '#977DFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Search size={24} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              1. Busca
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Explora todos nuestros Grupos de Amistad para conocer su ubicación, sus horarios, rangos de edad y líderes.
            </p>
          </div>

          {/* STEP 2: ESCOGE */}
          <div style={{
            background: 'rgba(0, 3, 61, 0.45)',
            border: '1px solid rgba(151, 125, 255, 0.2)',
            borderRadius: '24px',
            padding: '28px 24px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: 'rgba(151, 125, 255, 0.2)',
              border: '1px solid rgba(151, 125, 255, 0.4)',
              color: '#977DFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              2. Escoge
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Selecciona la que más se adapte a tus necesidades antes de rellenar el formulario con tus datos de contacto.
            </p>
          </div>

          {/* STEP 3: ESPERA */}
          <div style={{
            background: 'rgba(0, 3, 61, 0.45)',
            border: '1px solid rgba(151, 125, 255, 0.2)',
            borderRadius: '24px',
            padding: '28px 24px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              3. Espera
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Cuando recibamos tus datos te enviaremos toda la información acerca de la reunión a la mayor brevedad.
            </p>
          </div>

          {/* STEP 4: ÚNETE */}
          <div style={{
            background: 'rgba(0, 3, 61, 0.45)',
            border: '1px solid rgba(151, 125, 255, 0.2)',
            borderRadius: '24px',
            padding: '28px 24px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Heart size={24} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              4. Únete
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
              Tan solo deberás esperar al día y a la hora señalados para seguir creciendo en la fe junto a otros hermanos.
            </p>
          </div>
        </div>
      </div>

      {/* FILTER BAR & SEARCH DIRECTORY */}
      <div style={{ padding: '0 20px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(0, 3, 61, 0.5)',
          border: '1px solid rgba(151, 125, 255, 0.25)',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '40px',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Filter size={18} style={{ color: '#977DFF' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Filtrar Grupos por Zona & Red
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por zona o líder..."
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Zone Filter */}
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: '#070D1D',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            >
              <option value="Todas">📍 Todas las Zonas</option>
              <option value="Desamparados">Desamparados</option>
              <option value="San José">San José</option>
              <option value="Curridabat">Curridabat</option>
              <option value="Virtual">Virtual / Online</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: '#070D1D',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            >
              <option value="Todas">👥 Todas las Redes</option>
              <option value="Mixto">Mixto / Familias</option>
              <option value="Jóvenes MOVE">Jóvenes MOVE</option>
              <option value="Adultos FUXION">Adultos FUXION</option>
              <option value="Mujeres">Mujeres</option>
            </select>

            {/* Modality Filter */}
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                backgroundColor: '#070D1D',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            >
              <option value="Todas">🌐 Todas las Modalidades</option>
              <option value="Presencial">Presencial en Casa</option>
              <option value="Online">Online / Zoom</option>
            </select>
          </div>
        </div>

        {/* GROUPS LIST CARDS GRID */}
        {filteredGroups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
            <p style={{ fontSize: '1.1rem' }}>No encontramos grupos con los filtros seleccionados.</p>
            <button
              onClick={() => { setSelectedZone('Todas'); setSelectedCategory('Todas'); setSelectedModality('Todas'); setSearchTerm(''); }}
              className="apple-btn apple-btn-secondary"
              style={{ marginTop: '10px' }}
            >
              Limpiar Filtros
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {filteredGroups.map(grp => (
              <div
                key={grp.id}
                style={{
                  background: 'rgba(0, 3, 61, 0.45)',
                  border: '1px solid rgba(151, 125, 255, 0.2)',
                  borderRadius: '24px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backdropFilter: 'blur(16px)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{
                      backgroundColor: grp.modality === 'Online' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 51, 255, 0.2)',
                      border: grp.modality === 'Online' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(0, 51, 255, 0.4)',
                      color: grp.modality === 'Online' ? '#F59E0B' : '#977DFF',
                      padding: '4px 12px',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {grp.modality}
                    </span>

                    <span style={{ fontSize: '0.8rem', color: '#CBD5E1', fontWeight: 600 }}>
                      {grp.network_category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px', letterSpacing: '-0.3px' }}>
                    {grp.name}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', color: '#94A3B8', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} style={{ color: '#977DFF', flexShrink: 0 }} />
                      <span>{grp.canton} — {grp.address_reference}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} style={{ color: '#977DFF', flexShrink: 0 }} />
                      <span>Día: {grp.meeting_day} • {grp.meeting_time}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={16} style={{ color: '#977DFF', flexShrink: 0 }} />
                      <span>Anfitriones: {grp.leaders}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveGroupModal(grp);
                    setSubmitSuccess(false);
                    setContactForm({ name: '', phone: '', email: '', notes: '' });
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '12px 24px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(0, 51, 255, 0.3)',
                    marginTop: '12px'
                  }}
                >
                  <span>¡Quiero Unirme!</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JOIN GROUP MODAL */}
      {activeGroupModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#070D1D',
            border: '1px solid rgba(151, 125, 255, 0.3)',
            borderRadius: '28px',
            padding: '36px 32px',
            maxWidth: '540px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
          }}>
            <button
              onClick={() => setActiveGroupModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <X size={20} />
            </button>

            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <CheckCircle2 size={48} style={{ color: '#10B981', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
                  ¡Solicitud Enviada!
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  Te contactaremos a la brevedad para darte todos los detalles de la reunión en <strong>{activeGroupModal.name}</strong>.
                </p>
                <button
                  onClick={() => setActiveGroupModal(null)}
                  className="apple-btn apple-btn-primary"
                  style={{ padding: '12px 28px' }}
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#977DFF', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    UNIRTE A ESTE GRUPO
                  </span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: '4px 0 12px' }}>
                    {activeGroupModal.name}
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: 0 }}>
                    📍 {activeGroupModal.canton} • 📅 {activeGroupModal.meeting_day} {activeGroupModal.meeting_time}
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#EAEDF8', marginBottom: '6px' }}>Tu Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Escribe tu nombre"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#EAEDF8', marginBottom: '6px' }}>Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="Ej: +506 8888-8888"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#EAEDF8', marginBottom: '6px' }}>Correo Electrónico (Opcional)</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', boxSizing: 'border-box' }}
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
                    padding: '14px 24px',
                    fontWeight: 800,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '10px'
                  }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Enviando...' : 'Enviar mi Solicitud'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
