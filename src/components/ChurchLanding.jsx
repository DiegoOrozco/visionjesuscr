import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Heart, MapPin, Mail, Phone, ExternalLink, MessageCircle, Compass, Users, Flame, ArrowRight, ArrowLeft, Music, PlayCircle, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function ChurchLanding({ config, onGoToTickets }) {
  const [modalType, setModalType] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', question: '' });
  const [currentSlide, setCurrentSlide] = useState(0);
  const galleryRef = useRef(null);

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

  const heroBgRaw = config.hero_bg || '';
  const isVideoBg = !!heroBgRaw.match(/\.(mp4|webm|mov|ogg)($|\?)/i) || !!config.hero_video;
  const heroVideoUrl = config.hero_video || (isVideoBg ? heroBgRaw : '');
  
  const heroBg = heroBgRaw 
    ? (heroBgRaw.startsWith('http') ? heroBgRaw : `${API_URL}${heroBgRaw}`)
    : 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600';

  const scheduleBg = config.schedule_bg
    ? (config.schedule_bg.startsWith('http') ? config.schedule_bg : `${API_URL}${config.schedule_bg}`)
    : 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600';

  // Parse schedules
  let schedules = [];
  if (config.schedules !== undefined && config.schedules !== null) {
    try {
      schedules = typeof config.schedules === 'string' ? JSON.parse(config.schedules) : config.schedules;
    } catch (e) {
      console.error('Failed to parse schedules:', e);
      schedules = [];
    }
  } else {
    schedules = [
      { id: '1', text: config.schedule_thursday || 'JUEVES 7:30PM', isVirtual: false },
      { id: '2', text: config.schedule_saturday || 'SÁBADOS 5:30PM', isVirtual: false },
      { id: '3', text: config.schedule_sunday_1 || 'DOMINGOS 9:00AM', isVirtual: false },
      { id: '4', text: config.schedule_sunday_2 || 'DOMINGOS 11:00AM', isVirtual: false },
      { id: '5', text: config.schedule_sunday_virtual || 'DOMINGOS (VIRTUAL) 5:30PM', isVirtual: true }
    ];
  }

  // Parse dynamic hero buttons
  let heroButtons = [];
  try {
    if (config.hero_buttons) {
      heroButtons = typeof config.hero_buttons === 'string' ? JSON.parse(config.hero_buttons) : config.hero_buttons;
    }
  } catch (e) {
    console.error('Failed to parse hero_buttons:', e);
  }

  // Parse news items
  let newsItems = [];
  try {
    if (config.news_items) {
      newsItems = typeof config.news_items === 'string' ? JSON.parse(config.news_items) : config.news_items;
    }
  } catch (e) {
    console.error('Failed to parse news_items:', e);
  }

  // Auto-scroll gallery
  useEffect(() => {
    if (newsItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  const handleButtonClick = (btn) => {
    if (btn.url === '/autenticas') {
      onGoToTickets();
    } else if (btn.url) {
      if (btn.url.startsWith('http')) {
        window.open(btn.url, '_blank');
      } else {
        window.location.href = btn.url;
      }
    }
  };

  const socialIcons = {
    facebook: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    ),
    instagram: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    ),
    youtube: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    ),
    spotify: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
    )
  };

  return (
    <div style={{ 
      backgroundColor: '#0A0B10', 
      color: '#F3F4F6', 
      minHeight: '100vh', 
      fontFamily: "'Outfit', 'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* 0. HERO TOP HEADER / NAVBAR */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '18px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(10, 11, 16, 0.9) 0%, rgba(10, 11, 16, 0) 100%)',
        backdropFilter: 'blur(8px)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* LOGO */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src="/logo_oficial_transparente.png" alt="Visión Jesús Logo" style={{ height: '62px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px', color: '#FFFFFF', textTransform: 'uppercase' }}>
            VISIÓN JESÚS
          </span>
        </div>

        {/* MENU LINKS */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <a 
            href="#inicio" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            style={{ color: '#F3F4F6', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none', cursor: 'pointer' }}
          >
            INICIO
          </a>
          <a 
            href="#vision-section" 
            onClick={(e) => { e.preventDefault(); document.getElementById('vision-section')?.scrollIntoView({ behavior: 'smooth' }); }} 
            style={{ color: '#FFD6D6', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none', cursor: 'pointer' }}
          >
            CONOCÉ LA VISIÓN
          </a>
          <a 
            href="#horarios-section" 
            onClick={(e) => { e.preventDefault(); document.getElementById('horarios-section')?.scrollIntoView({ behavior: 'smooth' }); }} 
            style={{ color: '#F3F4F6', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none', cursor: 'pointer' }}
          >
            PRÉDICAS Y HORARIOS
          </a>
          <a 
            href="#contacto-section" 
            onClick={(e) => { e.preventDefault(); document.getElementById('contacto-section')?.scrollIntoView({ behavior: 'smooth' }); }} 
            style={{ color: '#F3F4F6', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none', cursor: 'pointer' }}
          >
            CONTACTO
          </a>
          <button 
            onClick={onGoToTickets}
            style={{
              backgroundColor: '#B91C1C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50px',
              padding: '9px 20px',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(185,28,28,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Ticket size={16} />
            <span>CONGRESO 2026</span>
          </button>
        </nav>
      </header>

      {/* GLOW EFFECT OVERLAYS */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(185, 28, 28, 0.25) 0%, rgba(185, 28, 28, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '-15%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(185, 28, 28, 0.18) 0%, rgba(185, 28, 28, 0) 75%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* 1. HERO SECTION */}
      <div id="inicio" style={{
        position: 'relative',
        backgroundImage: !isVideoBg ? `url(${heroBg})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: (config.hero_title || (heroButtons && heroButtons.length > 0)) ? '90vh' : '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: (config.hero_title || (heroButtons && heroButtons.length > 0)) ? '120px 20px 80px' : '40px 20px',
        overflow: 'hidden'
      }}>
        
        {/* BACKGROUND VIDEO (IF CONFIG HAS A VIDEO) */}
        {isVideoBg && (
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0
            }}
          >
            <source src={heroVideoUrl.startsWith('http') || heroVideoUrl.startsWith('/') ? (heroVideoUrl.startsWith('/') ? `${API_URL}${heroVideoUrl}` : heroVideoUrl) : `${API_URL}/${heroVideoUrl}`} type="video/mp4" />
          </video>
        )}

        {/* Bottom gradient line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #B91C1C 0%, #DC2626 50%, #F59E0B 100%)',
          zIndex: 3
        }} />

        {(config.hero_title || config.hero_subtitle || (heroButtons && heroButtons.length > 0)) && (
          <div style={{ maxWidth: '1000px', margin: '0 auto', zIndex: 2, textAlign: 'center' }}>
            
            {config.hero_badge && (
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                backgroundColor: 'rgba(185, 28, 28, 0.4)', 
                border: '1px solid rgba(185, 28, 28, 0.7)', 
                color: '#FFD6D6', 
                padding: '8px 20px', 
                borderRadius: '50px', 
                fontSize: '0.9rem', 
                fontWeight: 800, 
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '28px',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(8px)'
              }}>
                <Flame size={16} />
                <span>{config.hero_badge}</span>
              </div>
            )}

            {config.hero_title && (
              <h1 style={{
                fontSize: '4.5rem',
                fontWeight: 900,
                marginBottom: '20px',
                lineHeight: 1.05,
                textTransform: 'uppercase',
                letterSpacing: '-1.5px',
                background: 'linear-gradient(to bottom, #FFFFFF 60%, #FFD6D6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 16px rgba(0,0,0,0.8)'
              }}>
                {config.hero_title}
              </h1>
            )}

            {config.hero_subtitle && (
              <p style={{
                fontSize: '1.6rem',
                color: '#FFFFFF',
                maxWidth: '800px',
                margin: '0 auto 48px',
                fontWeight: 600,
                lineHeight: 1.4,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                letterSpacing: '0.5px'
              }}>
                {config.hero_subtitle}
              </p>
            )}

            {/* DYNAMIC BUTTONS from config */}
            {heroButtons.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                {heroButtons.map((btn, idx) => (
                  <button
                    key={btn.id || idx}
                    onClick={() => handleButtonClick(btn)}
                    style={{
                      backgroundColor: btn.style === 'primary' ? '#B91C1C' : 'rgba(0,0,0,0.6)',
                      color: '#FFFFFF',
                      border: btn.style === 'primary' ? '2px solid #EF4444' : '1px solid rgba(255,255,255,0.4)',
                      borderRadius: '50px',
                      padding: '16px 36px',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: btn.style === 'primary' ? '0 8px 24px rgba(185,28,28,0.5)' : '0 4px 12px rgba(0,0,0,0.4)',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      if (btn.style === 'primary') e.currentTarget.style.backgroundColor = '#DC2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      if (btn.style === 'primary') e.currentTarget.style.backgroundColor = '#B91C1C';
                    }}
                  >
                    <span>{btn.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. NEWS / EVENTS GALLERY CAROUSEL */}
      {newsItems.length > 0 && (
        <div style={{
          padding: '80px 20px',
          position: 'relative',
          zIndex: 1
        }}>
          <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                NOTICIAS Y EVENTOS
              </h2>
              <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #B91C1C, #F59E0B)', borderRadius: '4px', margin: '0 auto' }} />
            </div>

            {/* Gallery Cards */}
            <div style={{ position: 'relative' }}>
              <div 
                ref={galleryRef}
                style={{
                  display: 'grid',
                  gridTemplateColumns: newsItems.length === 1 ? '1fr' : newsItems.length === 2 ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '28px'
                }}
              >
                {newsItems.map((item, idx) => {
                  const imageUrl = item.image 
                    ? (item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`)
                    : null;

                  return (
                    <div 
                      key={item.id || idx}
                      onClick={() => {
                        if (item.link) {
                          if (item.link.startsWith('http')) {
                            window.open(item.link, '_blank');
                          } else {
                            window.location.href = item.link;
                          }
                        }
                      }}
                      style={{
                        backgroundColor: '#11131E',
                        border: '1px solid rgba(185, 28, 28, 0.2)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        cursor: item.link ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        transform: 'translateY(0)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = '0 16px 48px rgba(185,28,28,0.25)';
                        e.currentTarget.style.borderColor = 'rgba(185, 28, 28, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
                        e.currentTarget.style.borderColor = 'rgba(185, 28, 28, 0.2)';
                      }}
                    >
                      {imageUrl ? (
                        <div style={{
                          width: '100%',
                          height: '260px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          <img 
                            src={imageUrl} 
                            alt={item.title || 'Noticia'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.4s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                          />
                          {item.badge && (
                            <span style={{
                              position: 'absolute',
                              top: '14px',
                              left: '14px',
                              backgroundColor: '#B91C1C',
                              color: '#FFF',
                              padding: '5px 14px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                            }}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '180px',
                          background: 'linear-gradient(135deg, #1A1025 0%, #2D1B3D 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <Calendar size={48} color="rgba(185,28,28,0.4)" />
                          {item.badge && (
                            <span style={{
                              position: 'absolute',
                              top: '14px',
                              left: '14px',
                              backgroundColor: '#B91C1C',
                              color: '#FFF',
                              padding: '5px 14px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '1px'
                            }}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                      <div style={{ padding: '20px' }}>
                        <h3 style={{
                          fontSize: '1.15rem',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          marginBottom: '8px',
                          lineHeight: 1.3
                        }}>
                          {item.title}
                        </h3>
                        {item.description && (
                          <p style={{
                            color: '#9CA3AF',
                            fontSize: '0.88rem',
                            lineHeight: 1.5,
                            marginBottom: item.link ? '12px' : '0'
                          }}>
                            {item.description}
                          </p>
                        )}
                        {item.link && (
                          <span style={{
                            color: '#EF4444',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            Ver más <ArrowRight size={14} />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONOCÉ LA VISIÓN SECTION */}
      <div id="vision-section" style={{ padding: '90px 20px', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '54px' }}>
            <span style={{
              backgroundColor: 'rgba(185, 28, 28, 0.2)',
              border: '1px solid rgba(185, 28, 28, 0.5)',
              color: '#FF8A8A',
              padding: '6px 18px',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              ACERCA DE NOSOTROS
            </span>

            <h2 style={{
              fontSize: '3.2rem',
              fontWeight: 900,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
              marginTop: '16px',
              marginBottom: '14px'
            }}>
              CONOCÉ LA VISIÓN
            </h2>

            <p style={{
              color: '#9CA3AF',
              fontSize: '1.2rem',
              maxWidth: '780px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              {config.about_text || 'Una iglesia viva, apasionada y comprometida con revelar el amor transformador de Jesucristo en cada corazón, hogar y comunidad.'}
            </p>
          </div>

          {/* 3 PILLARS CARDS: VISIÓN, MISIÓN, VALORES */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px'
          }}>
            {/* CARD 1: VISIÓN */}
            <div style={{
              backgroundColor: '#11131E',
              border: '1px solid rgba(185, 28, 28, 0.3)',
              borderRadius: '24px',
              padding: '36px 28px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(185, 28, 28, 0.2)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Compass size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', marginBottom: '12px' }}>
                {config.vision_title || 'NUESTRA VISIÓN'}
              </h3>
              <p style={{ color: '#D1D5DB', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {config.vision_text || 'Ser una iglesia viva que inspira a miles de personas a experimentar una relación personal con Dios, transformando vidas y formando discípulos apasionados por la verdad.'}
              </p>
            </div>

            {/* CARD 2: MISIÓN */}
            <div style={{
              backgroundColor: '#11131E',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '24px',
              padding: '36px 28px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                color: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Flame size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', marginBottom: '12px' }}>
                {config.mision_title || 'NUESTRA MISIÓN'}
              </h3>
              <p style={{ color: '#D1D5DB', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {config.mision_text || 'Evangelizar, consolidar, edificar y enviar a cada creyente a vivir su propósito divino, restaurando familias y equipando líderes para impactar nuestra sociedad.'}
              </p>
            </div>

            {/* CARD 3: VALORES */}
            <div style={{
              backgroundColor: '#11131E',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '24px',
              padding: '36px 28px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', textTransform: 'uppercase', marginBottom: '12px' }}>
                {config.valores_title || 'NUESTROS VALORES'}
              </h3>
              <p style={{ color: '#D1D5DB', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {config.valores_text || 'Amor incondicional, adoración genuina, excelencia en el servicio, integridad moral, restauración familiar y fe firme en las promesas de Dios.'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. SCHEDULES SECTION */}
      {schedules && schedules.length > 0 ? (
        <div id="horarios-section" style={{
          backgroundImage: `linear-gradient(180deg, rgba(10, 11, 16, 0.8) 0%, rgba(10, 11, 16, 0.95) 100%), url(${scheduleBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '100px 20px',
          color: '#FFFFFF',
          textAlign: 'center',
          borderTop: '1px solid rgba(185, 28, 28, 0.2)',
          borderBottom: '1px solid rgba(185, 28, 28, 0.2)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(185, 28, 28, 0.3) 0%, rgba(185, 28, 28, 0) 70%)',
            pointerEvents: 'none'
          }} />

          <div className="container" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <Flame size={48} color="#B91C1C" style={{ marginBottom: '20px', filter: 'drop-shadow(0 0 10px rgba(185,28,28,0.5))' }} />
            
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 900,
              marginBottom: '48px',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              HORARIOS DE SERVICIOS
            </h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}>
              {schedules.map((s, idx) => (
                <div 
                  key={s.id || idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '16px',
                    color: s.isVirtual ? 'var(--accent-gold)' : '#FFFFFF'
                  }}
                >
                  {s.isVirtual ? <Music size={28} color="var(--accent-gold)" /> : <PlayCircle size={28} color="#B91C1C" />}
                  <span>{s.text}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setModalType('pregunta')}
              style={{
                backgroundColor: '#B91C1C',
                color: '#FFF',
                border: '2px solid #EF4444',
                borderRadius: '12px',
                marginTop: '48px',
                padding: '16px 36px',
                fontSize: '1.1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(185,28,28,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              ¿TENÉS ALGUNA PREGUNTA?
            </button>
          </div>
        </div>
      ) : scheduleBg ? (
        <div id="horarios-section" style={{
          width: '100%',
          backgroundColor: '#090A0F',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          borderTop: '1px solid rgba(185, 28, 28, 0.2)',
          borderBottom: '1px solid rgba(185, 28, 28, 0.2)',
          position: 'relative'
        }}>
          <img 
            src={scheduleBg} 
            alt="Horarios de Servicios" 
            style={{ 
              width: '100%', 
              maxWidth: '1200px', 
              height: 'auto', 
              display: 'block', 
              objectFit: 'contain'
            }} 
          />
        </div>
      ) : null}

      {/* 5. FOOTER & CONTACT */}
      <footer id="contacto-section" style={{
        backgroundColor: '#090A0F',
        color: '#9CA3AF',
        padding: '80px 20px',
        fontSize: '0.95rem'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '48px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 900, marginBottom: '20px', letterSpacing: '0.5px' }}>
              VISIÓN JESÚS
            </h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#9CA3AF', lineHeight: 1.6 }}>
              <MapPin size={22} color="#B91C1C" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{config.contact_address || '50 norte y 50 oeste de la Cruz Roja de Desamparados. Auditorio Principal.'}</span>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '20px' }}>
              Contacto Directo
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#9CA3AF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#B91C1C" />
                <span>{config.contact_email || 'info@somosimpact.com'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#B91C1C" />
                <span>{config.contact_phone_1 || '+506 4115 1212'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#B91C1C" />
                <span>{config.contact_phone_2 || '+506 6453 1212'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '20px' }}>
              Síguenos en
            </h3>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {config.social_fb && (
                <a href={config.social_fb} target="_blank" rel="noreferrer" style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#3b5998', transition: 'all 0.2s ease', textDecoration: 'none'
                }}>
                  {socialIcons.facebook}
                </a>
              )}
              {config.social_ig && (
                <a href={config.social_ig} target="_blank" rel="noreferrer" style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#E1306C', transition: 'all 0.2s ease', textDecoration: 'none'
                }}>
                  {socialIcons.instagram}
                </a>
              )}
              {config.social_yt && (
                <a href={config.social_yt} target="_blank" rel="noreferrer" style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#FF0000', transition: 'all 0.2s ease', textDecoration: 'none'
                }}>
                  {socialIcons.youtube}
                </a>
              )}
              {config.social_spotify && (
                <a href={config.social_spotify} target="_blank" rel="noreferrer" style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#1DB954', transition: 'all 0.2s ease', textDecoration: 'none'
                }}>
                  {socialIcons.spotify}
                </a>
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1F2937', marginTop: '60px', paddingTop: '24px', textAlign: 'center', color: '#4B5563', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Iglesia Visión Jesús. Todos los derechos reservados.
        </div>
      </footer>

      {/* QUESTION MODAL ONLY */}
      {modalType === 'pregunta' && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '24px', backgroundColor: '#11131E', border: '1px solid rgba(185, 28, 28, 0.3)', color: '#FFF' }}>
            <div style={{ padding: '28px' }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', marginBottom: '8px' }}>Enviar Pregunta</h3>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '20px' }}>
                ¿Tienes alguna duda sobre nuestros horarios, ministerios o actividades? Escríbenos directamente aquí.
              </p>

              {formSubmitted ? (
                <div style={{ textAlign: 'center', color: '#34D399', fontWeight: 700, padding: '20px' }}>
                  ¡Mensaje recibido! Te responderemos por correo o WhatsApp.
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Tu Nombre</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Correo de contacto</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF' }} />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Pregunta / Comentario</label>
                    <textarea name="question" rows="3" value={formData.question} onChange={handleInputChange} required style={{ width: '100%', borderRadius: '10px', backgroundColor: '#1F2937', border: '1px solid #374151', color: '#FFF', padding: '10px' }}></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', backgroundColor: '#B91C1C', borderColor: '#EF4444' }}>Enviar Mensaje</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
