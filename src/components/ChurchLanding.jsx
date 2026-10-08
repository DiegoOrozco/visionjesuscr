import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Heart, MapPin, Mail, Phone, ExternalLink, MessageCircle, Compass, Users, Flame, ArrowRight, ArrowLeft, Music, PlayCircle, Ticket, ChevronLeft, ChevronRight, ShieldCheck, Instagram, Facebook, Menu, X, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function ChurchLanding({ config = {}, sections = [], onGoToTickets, adminUser }) {
  const [modalType, setModalType] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', question: '' });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    : '';

  const scheduleBg = config.schedule_bg
    ? (config.schedule_bg.startsWith('http') ? config.schedule_bg : `${API_URL}${config.schedule_bg}`)
    : '';

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

  // Listen to window scroll for Apple floating frosted navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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

  const renderDynamicSection = (sec) => {
    let content = sec.content;
    while (typeof content === 'string') {
      try { content = JSON.parse(content); } catch (e) { break; }
    }
    content = content || {};

    let styles = sec.styles;
    while (typeof styles === 'string') {
      try { styles = JSON.parse(styles); } catch (e) { break; }
    }
    styles = styles || {};

    const bgStyle = {
      backgroundColor: styles.backgroundColor || '#030812',
      color: styles.textColor || '#EAEDF8',
      position: 'relative'
    };

    const accentColor = styles.accentColor || '#0033FF';

    switch (sec.type) {
      case 'hero': {
        let bgUrl = content.bgUrl || '';
        bgUrl = bgUrl ? (bgUrl.startsWith('http') || bgUrl.startsWith('/') ? (bgUrl.startsWith('/') ? `${API_URL}${bgUrl}` : bgUrl) : `${API_URL}/${bgUrl}`) : '';
        const isVideo = !!bgUrl.match(/\.(mp4|webm|mov|ogg)($|\?)/i);
        const heroTitle = content.title !== undefined ? content.title : 'Bienvenido a TU CASA';
        const heroSubtitle = content.subtitle !== undefined ? content.subtitle : 'Iglesia Visión Jesús — Un lugar de fe, amor y restauración';
        const heroButtons = content.buttons && content.buttons.length > 0 
          ? content.buttons 
          : [{ id: '1', label: '¿Eres nuevo en la Visión?', url: '#vision', style: 'primary' }];

        return (
          <div 
            id="inicio" 
            key={sec.id}
            className="hero-container"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              overflow: 'hidden',
              paddingTop: 'clamp(100px, 14vh, 160px)',
              paddingBottom: 'clamp(60px, 10vh, 120px)',
              boxSizing: 'border-box',
              backgroundColor: '#000000',
              ...bgStyle
            }}
          >
            {/* Apple Ambient Cinematic Glow */}
            <div 
              className="apple-ambient-glow"
              style={{
                top: '25%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'radial-gradient(circle, rgba(151, 125, 255, 0.22) 0%, rgba(0, 113, 227, 0.12) 50%, transparent 80%)'
              }}
            />

            {isVideo ? (
              <video 
                src={bgUrl} 
                autoPlay 
                loop 
                muted 
                playsInline 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.32 }} 
              />
            ) : (
              <div 
                className="hero-bg-image"
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: bgUrl ? `url("${bgUrl}")` : 'none',
                  zIndex: 0,
                  opacity: 0.85
                }} 
              />
            )}

            {/* Apple Cinematic Bottom Vignette Gradient */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '240px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }} />
            
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              {/* Apple Kicker Pill */}
              <div className="apple-kicker">
                <span className="apple-kicker-dot"></span>
                <span>Comunidad de Fe & Esperanza</span>
              </div>

              {heroTitle && (
                <h1 className="apple-hero-headline apple-gradient-text" style={{ maxWidth: '880px' }}>
                  {heroTitle}
                </h1>
              )}

              {heroSubtitle && (
                <p className="apple-hero-subtitle">
                  {heroSubtitle}
                </p>
              )}

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {heroButtons.map((btn, bIdx) => {
                  const isPrimary = btn.style === 'primary' || bIdx === 0;
                  return (
                    <button
                      key={btn.id}
                      onClick={() => handleButtonClick(btn)}
                      className={`apple-btn ${isPrimary ? 'apple-btn-primary' : 'apple-btn-secondary'}`}
                      style={{
                        padding: '14px 28px',
                        fontSize: '0.94rem'
                      }}
                    >
                      <span>{btn.label}</span>
                      {isPrimary && <ArrowRight size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
      
      case 'news': {
        let items = content.newsItems;
        if (!items || items.length === 0) {
          try {
            items = config.news_items ? (typeof config.news_items === 'string' ? JSON.parse(config.news_items) : config.news_items) : [];
          } catch (e) {
            items = [];
          }
        }
        if (items.length === 0) return null;

        return (
          <div key={sec.id} style={{ padding: '100px 20px', backgroundColor: 'var(--apple-bg-base)', ...bgStyle }}>
            <div className="container" style={{ maxWidth: '1180px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <div className="apple-kicker">
                  <span className="apple-kicker-dot"></span>
                  <span>{content.title || 'NOTICIAS & EVENTOS'}</span>
                </div>
                <h2 className="apple-hero-headline apple-gradient-text" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', marginBottom: '12px' }}>
                  Lo que viene en la Casa
                </h2>
                <p className="apple-hero-subtitle" style={{ marginBottom: '0', maxWidth: '600px' }}>
                  Conéctate, participa y sé parte de cada experiencia y actividad especial.
                </p>
              </div>

              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <div 
                  ref={galleryRef}
                  style={{ display: 'flex', transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)', transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {items.map((item, idx) => {
                    const targetUrl = item.link || item.url || item.buttonUrl || item.targetUrl || '/autenticas';
                    return (
                      <div key={idx} style={{ minWidth: '100%', boxSizing: 'border-box', padding: '0 8px' }}>
                        <div 
                          onClick={() => {
                            if (targetUrl.startsWith('http')) {
                              window.open(targetUrl, '_blank');
                            } else {
                              window.location.href = targetUrl;
                            }
                          }}
                          className="apple-bento-card"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            padding: 0,
                            cursor: 'pointer',
                            minHeight: '380px'
                          }}
                        >
                          {item.image && (
                            <div style={{ minHeight: '320px', position: 'relative', overflow: 'hidden' }}>
                              <img 
                                src={item.image.startsWith('http') || item.image.startsWith('/') ? (item.image.startsWith('/') ? `${API_URL}${item.image}` : item.image) : `${API_URL}/${item.image}`} 
                                alt={item.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              />
                              <div style={{ 
                                position: 'absolute', 
                                top: '20px', 
                                left: '20px', 
                                background: 'rgba(0, 0, 0, 0.65)', 
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                color: '#FFFFFF', 
                                padding: '6px 14px', 
                                borderRadius: '9999px', 
                                fontSize: '0.76rem', 
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                border: '1px solid rgba(255, 255, 255, 0.15)'
                              }}>
                                {item.badge || 'DESTACADO'}
                              </div>
                            </div>
                          )}
                          <div style={{ padding: '44px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                              {item.title}
                            </h3>
                            <p style={{ color: 'var(--apple-text-secondary)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '28px' }}>
                              {item.description}
                            </p>
                            <button 
                              className="apple-btn apple-btn-primary"
                              style={{ alignSelf: 'flex-start', padding: '12px 24px' }}
                            >
                              <span>{item.buttonText || 'Ver Detalles'}</span>
                              <ArrowRight size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {items.length > 1 && (
                  <>
                    <button 
                      onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
                      style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(14, 14, 20, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={() => setCurrentSlide(prev => Math.min(prev + 1, items.length - 1))}
                      style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(14, 14, 20, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'pillars': {
        const pillars = content.pillars || [
          { id: '1', title: 'Nuestra Visión', text: 'Ser una iglesia viva que inspira a miles de personas a experimentar una relación personal con Dios, transformando vidas y formando discípulos apasionados por la verdad.', icon: 'Compass' },
          { id: '2', title: 'Nuestra Misión', text: 'Evangelizar, consolidar, edificar y enviar a cada creyente a vivir su propósito divino, restaurando familias y equipando líderes para impactar nuestra sociedad.', icon: 'Flame' },
          { id: '3', title: 'Nuestros Valores', text: 'Amor incondicional, adoración genuina, excelencia en el servicio, integridad moral, restauración familiar y fe firme en las promesas de Dios.', icon: 'Users' }
        ];
        return (
          <div id="vision-section" key={sec.id} style={{ padding: '100px 20px', backgroundColor: 'var(--apple-bg-base)', ...bgStyle }}>
            <div className="container" style={{ maxWidth: '1180px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                <div className="apple-kicker">
                  <span className="apple-kicker-dot"></span>
                  <span>{content.title || 'CONOCÉ LA VISIÓN'}</span>
                </div>
                <h2 className="apple-hero-headline apple-gradient-text" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginBottom: '14px' }}>
                  Nuestra Iglesia
                </h2>
                <p className="apple-hero-subtitle" style={{ maxWidth: '640px', marginBottom: '0' }}>
                  {content.subtitle || 'Una iglesia viva, apasionada y comprometida con revelar el amor transformador de Jesucristo.'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '24px' }}>
                {pillars.map((pil, idx) => (
                  <div 
                    key={pil.id || idx}
                    className="apple-bento-card"
                    style={{
                      padding: '36px 32px',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'var(--apple-purple)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '24px'
                    }}>
                      {pil.icon === 'Compass' && <Compass size={26} />}
                      {pil.icon === 'Flame' && <Flame size={26} />}
                      {pil.icon === 'Users' && <Users size={26} />}
                    </div>
                    <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                      {pil.title}
                    </h3>
                    <p style={{ color: 'var(--apple-text-secondary)', fontSize: '0.98rem', lineHeight: 1.65 }}>
                      {pil.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'schedules': {
        const schedBgRaw = content.bgUrl || '';
        const schedBg = schedBgRaw
          ? (schedBgRaw.startsWith('http') || schedBgRaw.startsWith('/') ? (schedBgRaw.startsWith('/') ? `${API_URL}${schedBgRaw}` : schedBgRaw) : `${API_URL}/${schedBgRaw}`)
          : '';
        const list = content.schedules && content.schedules.length > 0 ? content.schedules : (schedBg ? [] : schedules);
        const displayTitle = content.title !== undefined ? content.title : (schedBg ? '' : 'HORARIOS DE SERVICIOS');
        return (
          <div 
            id="horarios-section" 
            key={sec.id}
            style={{
              backgroundColor: 'var(--apple-bg-base)',
              padding: (displayTitle || list.length > 0) ? '100px 20px' : '40px 20px', 
              textAlign: 'center',
              borderTop: '1px solid var(--apple-border)',
              borderBottom: '1px solid var(--apple-border)',
              position: 'relative',
              overflow: 'hidden',
              ...bgStyle
            }}
          >
            {/* Apple Ambient Center Light */}
            <div 
              className="apple-ambient-glow"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(151, 125, 255, 0.12) 0%, transparent 70%)'
              }}
            />

            {!(displayTitle || list.length > 0) && schedBg && (
              <img src={schedBg} alt="Horarios" style={{ width: '100%', maxWidth: '1200px', height: 'auto', display: 'block', objectFit: 'contain', margin: '0 auto', borderRadius: '24px' }} />
            )}

            {(displayTitle || list.length > 0) && (
              <div className="container" style={{ maxWidth: '780px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div className="apple-kicker" style={{ marginBottom: '16px' }}>
                  <span className="apple-kicker-dot"></span>
                  <span>Servicios Semanales</span>
                </div>

                {displayTitle && (
                  <h2 className="apple-hero-headline apple-gradient-text" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginBottom: '40px' }}>
                    {displayTitle}
                  </h2>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {list.map((s, sIdx) => (
                    <div 
                      key={s.id || sIdx} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '18px 28px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '9999px',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: s.isVirtual ? 'rgba(151, 125, 255, 0.15)' : 'rgba(0, 113, 227, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: s.isVirtual ? 'var(--apple-purple)' : 'var(--apple-blue)'
                        }}>
                          {s.isVirtual ? <Music size={18} /> : <PlayCircle size={18} />}
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                          {s.text}
                        </span>
                      </div>

                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        backgroundColor: s.isVirtual ? 'rgba(151, 125, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
                        color: s.isVirtual ? 'var(--apple-purple)' : 'var(--apple-text-secondary)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase'
                      }}>
                        {s.isVirtual ? 'En Línea' : 'Presencial'}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '44px' }}>
                  <button 
                    onClick={() => setModalType('pregunta')}
                    className="apple-btn apple-btn-secondary"
                    style={{ padding: '14px 32px', fontSize: '0.94rem' }}
                  >
                    <span>¿Tenés alguna pregunta?</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'custom_text': {
        return (
          <div key={sec.id} style={{ padding: '80px 20px', textAlign: 'center', ...bgStyle }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '24px', textTransform: 'uppercase' }}>{content.title}</h2>
              <div style={{ height: '3px', width: '60px', backgroundColor: accentColor, margin: '0 auto 24px' }} />
              <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: '#EAEDF8', opacity: 0.9 }}>{content.text}</p>
            </div>
          </div>
        );
      }

      case 'cta': {
        const bgUrlRaw = content.bgUrl || '';
        const bgUrl = bgUrlRaw
          ? (bgUrlRaw.startsWith('http') || bgUrlRaw.startsWith('/') ? (bgUrlRaw.startsWith('/') ? `${API_URL}${bgUrlRaw}` : bgUrlRaw) : `${API_URL}/${bgUrlRaw}`)
          : '';
        return (
          <div 
            key={sec.id}
            style={{
              padding: '100px 20px',
              backgroundImage: bgUrl ? `linear-gradient(180deg, rgba(3, 8, 18, 0.7) 0%, rgba(3, 8, 18, 0.9) 100%), url(${bgUrl})` : `linear-gradient(135deg, ${accentColor} 0%, #977DFF 100%)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              textAlign: 'center',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              color: '#FFFFFF'
            }}
          >
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '24px', textTransform: 'uppercase' }}>{content.title}</h2>
              {content.buttonText && (
                <button 
                  onClick={() => content.buttonUrl && (content.buttonUrl.startsWith('http') ? window.open(content.buttonUrl, '_blank') : window.location.href = content.buttonUrl)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#030812',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '16px 40px',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {content.buttonText}
                </button>
              )}
            </div>
          </div>
        );
      }

      case 'image_text': {
        const isLeft = content.imagePosition === 'left';
        const imgUrlRaw = content.bgUrl || '';
        const imgUrl = imgUrlRaw
          ? (imgUrlRaw.startsWith('http') || imgUrlRaw.startsWith('/') ? (imgUrlRaw.startsWith('/') ? `${API_URL}${imgUrlRaw}` : imgUrlRaw) : `${API_URL}/${imgUrlRaw}`)
          : '';
        return (
          <div key={sec.id} style={{ padding: '100px 20px', ...bgStyle }}>
            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
                {isLeft && imgUrl && (
                  <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.5)', height: '400px' }}>
                    <img src={imgUrl} alt={content.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '20px', textTransform: 'uppercase' }}>{content.title}</h2>
                  <div style={{ height: '3px', width: '60px', backgroundColor: accentColor, marginBottom: '24px' }} />
                  <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#EAEDF8', opacity: 0.85 }}>{content.text}</p>
                </div>
                {!isLeft && imgUrl && (
                  <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.5)', height: '400px' }}>
                    <img src={imgUrl} alt={content.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'grid': {
        const cols = content.columns || 4;
        const cells = content.cells || [];
        const gridClass = `grid-bento-${sec.id}`;
        
        return (
          <div key={sec.id} style={{ padding: '100px 20px', ...bgStyle }}>
            <style>
              {`
                .${gridClass} {
                  display: grid;
                  grid-template-columns: repeat(${cols}, 1fr);
                  grid-auto-rows: minmax(220px, auto);
                  gap: 30px;
                }
                @media (max-width: 768px) {
                  .${gridClass} {
                    grid-template-columns: 1fr !important;
                    grid-auto-rows: auto !important;
                  }
                  .${gridClass} > div {
                    grid-column: span 1 !important;
                    grid-row: span 1 !important;
                  }
                }
              `}
            </style>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {content.title && (
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <div className="apple-kicker">
                    <span className="apple-kicker-dot"></span>
                    <span>Destacados</span>
                  </div>
                  <h2 className="apple-hero-headline apple-gradient-text" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginBottom: '14px' }}>
                    {content.title}
                  </h2>
                </div>
              )}
              <div className={gridClass}>
                {cells.map((cell, idx) => {
                  const imgUrlRaw = cell.imageUrl || '';
                  const imgUrl = imgUrlRaw
                    ? (imgUrlRaw.startsWith('http') || imgUrlRaw.startsWith('/') ? (imgUrlRaw.startsWith('/') ? `${API_URL}${imgUrlRaw}` : imgUrlRaw) : `${API_URL}/${imgUrlRaw}`)
                    : '';
                  
                  return (
                    <div 
                      key={idx} 
                      className="apple-bento-card"
                      style={{ 
                        gridColumn: `span ${cell.colSpan || 1}`,
                        gridRow: `span ${cell.rowSpan || 1}`,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {imgUrl && (
                        <div style={{ height: '230px', width: '100%', overflow: 'hidden' }}>
                          <img 
                            src={imgUrl} 
                            alt={cell.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        </div>
                      )}
                      <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {cell.iconName && LucideIcons[cell.iconName] && (
                          <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '14px', 
                            backgroundColor: 'rgba(255, 255, 255, 0.06)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            marginBottom: '20px', 
                            color: 'var(--apple-purple)' 
                          }}>
                            {React.createElement(LucideIcons[cell.iconName], { size: 24 })}
                          </div>
                        )}
                        {cell.title && (
                          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                            {cell.title}
                          </h3>
                        )}
                        {cell.text && (
                          <p style={{ fontSize: '0.98rem', color: 'var(--apple-text-secondary)', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                            {cell.text}
                          </p>
                        )}
                        {cell.buttonText && cell.buttonUrl && (
                          <div style={{ marginTop: 'auto' }}>
                            <a 
                              href={cell.buttonUrl} 
                              target={cell.buttonUrl.startsWith('http') ? '_blank' : '_self'} 
                              rel="noreferrer"
                              className="apple-btn apple-btn-primary"
                              style={{ padding: '10px 22px', fontSize: '0.86rem' }}
                            >
                              <span>{cell.buttonText}</span>
                              <ArrowRight size={14} />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      case 'pastors_profile': {
        const pastors = content.pastors || [];
        return (
          <div key={sec.id} style={{ padding: '100px 20px', ...bgStyle }}>
            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>{content.title}</h2>
                {content.subtitle && <p style={{ fontSize: '1.2rem', color: '#BAC2DE', maxWidth: '600px', margin: '0 auto' }}>{content.subtitle}</p>}
                <div style={{ height: '4px', width: '80px', backgroundColor: accentColor, margin: '24px auto 0', borderRadius: '4px' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                {pastors.map((pastor, idx) => {
                  const isEven = idx % 2 === 0;
                  const imgUrlRaw = pastor.imageUrl || '';
                  const imgUrl = imgUrlRaw ? (imgUrlRaw.startsWith('http') || imgUrlRaw.startsWith('/') ? (imgUrlRaw.startsWith('/') ? `${API_URL}${imgUrlRaw}` : imgUrlRaw) : `${API_URL}/${imgUrlRaw}`) : '';
                  
                  return (
                    <div key={idx} style={{ display: 'flex', flexWrap: isEven ? 'wrap' : 'wrap-reverse', gap: '50px', alignItems: 'center' }}>
                      {!isEven && imgUrl && (
                        <div style={{ flex: '1 1 400px' }}>
                          <img src={imgUrl} alt={pastor.name} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
                        </div>
                      )}
                      <div style={{ flex: '1 1 400px' }}>
                        {pastor.role && <p style={{ fontSize: '0.9rem', letterSpacing: '2px', color: accentColor, textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>{pastor.role}</p>}
                        <h3 style={{ fontSize: '2.5rem', color: '#FFFFFF', marginBottom: '20px', fontWeight: 800 }}>{pastor.name}</h3>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: accentColor }}></div>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: accentColor }}></div>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: accentColor }}></div>
                        </div>
                        
                        {pastor.description && pastor.description.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx} style={{ color: '#EAEDF8', opacity: 0.85, lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '20px' }}>
                            {paragraph}
                          </p>
                        ))}
                        
                        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                          {pastor.instagramUrl && (
                            <a href={pastor.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#E1306C', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                              <Instagram size={32} />
                            </a>
                          )}
                          {pastor.facebookUrl && (
                            <a href={pastor.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4267B2', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                              <Facebook size={32} />
                            </a>
                          )}
                        </div>
                      </div>
                      {isEven && imgUrl && (
                        <div style={{ flex: '1 1 400px' }}>
                          <img src={imgUrl} alt={pastor.name} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
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
    ),
    tiktok: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31 0 2.568.27 3.685.744.07.258.197.805.372 1.64.175.836.263 1.293.263 1.373a9.914 9.914 0 01-3.685-1.157v11.982a7.195 7.195 0 01-2.106 5.109c-1.405 1.4-3.11 2.1-5.114 2.1a7.18 7.18 0 01-5.108-2.1A7.19 7.19 0 01.73 14.607c0-2.003.7-3.708 2.1-5.112A7.18 7.18 0 017.94 7.39c.35 0 .762.053 1.233.158V11.23c-.35-.14-.722-.21-1.116-.21a3.528 3.528 0 00-2.524 1.049 3.528 3.528 0 00-1.05 2.538 3.53 3.53 0 001.05 2.53 3.528 3.528 0 002.524 1.05 3.533 3.533 0 002.53-1.05 3.532 3.532 0 001.05-2.53V0h1.883z"/></svg>
    ),
    twitter: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    ),
    web: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    )
  };

  return (
    <div style={{ 
      backgroundColor: '#030812', 
      color: '#EAEDF8', 
      minHeight: '100vh', 
      fontFamily: "'Outfit', 'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* 0. APPLE FLOATING FROSTED NAVBAR */}
      <div className="apple-nav-wrapper" style={{
        top: isScrolled ? '12px' : '20px'
      }}>
        <header 
          className={`apple-nav-bar ${isScrolled ? 'apple-nav-scrolled' : ''}`}
          style={{
            maxWidth: isScrolled ? '1060px' : '1140px'
          }}
        >
          {/* LOGO */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img 
              src="/logo_oficial_transparente.png" 
              alt="Visión Jesús Logo" 
              style={{ 
                height: isScrolled ? '38px' : '44px', 
                objectFit: 'contain',
                transition: 'height 0.3s ease',
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))'
              }} 
            />
          </div>

          {/* DESKTOP MENU LINKS */}
          <nav className="apple-nav-links">
            <a 
              href="/" 
              className={`apple-nav-link ${window.location.pathname === '/' ? 'active' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Inicio
            </a>
            <a 
              href="/nosotros" 
              className={`apple-nav-link ${window.location.pathname === '/nosotros' ? 'active' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                window.location.href = '/nosotros';
              }}
            >
              Nosotros
            </a>
            <a 
              href="/modelo" 
              className={`apple-nav-link ${window.location.pathname === '/modelo' ? 'active' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                window.location.href = '/modelo';
              }}
            >
              Modelo de Jesús
            </a>
            <a 
              href="/grupos-de-amistad" 
              className={`apple-nav-link ${window.location.pathname === '/grupos-de-amistad' ? 'active' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                window.location.href = '/grupos-de-amistad';
              }}
            >
              Grupos de Amistad
            </a>
            <a 
              href="/eventos" 
              className={`apple-nav-link ${window.location.pathname === '/eventos' || window.location.pathname === '/congresos' ? 'active' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                window.location.href = '/eventos';
              }}
            >
              Eventos
            </a>
            <a 
              href="/oracion" 
              className={`apple-nav-link ${window.location.pathname === '/oracion' ? 'active' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                window.location.href = '/oracion';
              }}
            >
              Oración & Testimonios
            </a>
            <a 
              href="/donar" 
              className={`apple-nav-link ${window.location.pathname === '/donar' ? 'active' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                window.location.href = '/donar';
              }}
            >
              Donar
            </a>
            <button 
              onClick={() => {
                const contactEl = document.getElementById('contacto-section');
                if (contactEl) {
                  contactEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setModalType('pregunta');
                }
              }}
              className="apple-nav-link"
            >
              Contacto
            </button>
          </nav>

          {/* RIGHT ACTIONS: ADMIN + MOBILE TOGGLE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

            {/* Admin Profile Controls */}
            {(() => {
              const currentAdmin = adminUser || (localStorage.getItem('admin_user') ? JSON.parse(localStorage.getItem('admin_user')) : null);
              if (!currentAdmin) return null;
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
                  {(currentAdmin.role === 'admin' || currentAdmin.role === 'scanner') && (
                    <button 
                      onClick={() => window.location.href = '/escanear'}
                      className="apple-btn apple-btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      <span>Escáner</span>
                    </button>
                  )}

                  {currentAdmin.role !== 'scanner' && (
                    <button 
                      onClick={() => window.location.href = '/admin'}
                      className="apple-btn apple-btn-primary"
                      style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                    >
                      <ShieldCheck size={14} />
                      <span>{currentAdmin.username}</span>
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      localStorage.removeItem('admin_user');
                      window.location.href = '/';
                    }}
                    style={{
                      fontSize: '0.78rem', 
                      color: '#FF453A', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontWeight: 600, 
                      padding: '4px 6px'
                    }}
                  >
                    Salir
                  </button>
                </div>
              );
            })()}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="apple-mobile-menu-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '9999px',
                padding: '8px',
                color: '#FFFFFF',
                cursor: 'pointer'
              }}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        {/* Apple iOS Mobile Sheet Drawer */}
        {mobileMenuOpen && (
          <div className="apple-mobile-sheet">
            <a 
              href="/" 
              className="apple-nav-link"
              style={{ fontSize: '1rem', padding: '10px 14px', textAlign: 'left' }}
              onClick={(e) => { 
                e.preventDefault(); 
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Inicio
            </a>
            <a 
              href="/nosotros" 
              className="apple-nav-link"
              style={{ fontSize: '1rem', padding: '10px 14px', textAlign: 'left' }}
              onClick={(e) => { 
                e.preventDefault(); 
                setMobileMenuOpen(false);
                window.location.href = '/nosotros';
              }}
            >
              Nosotros
            </a>
            <a 
              href="/modelo" 
              className="apple-nav-link"
              style={{ fontSize: '1rem', padding: '10px 14px', textAlign: 'left' }}
              onClick={(e) => { 
                e.preventDefault(); 
                setMobileMenuOpen(false);
                window.location.href = '/modelo';
              }}
            >
              Modelo de Jesús
            </a>
            <a 
              href="/grupos-de-amistad" 
              className="apple-nav-link"
              style={{ fontSize: '1rem', padding: '10px 14px', textAlign: 'left' }}
              onClick={(e) => { 
                e.preventDefault(); 
                setMobileMenuOpen(false);
                window.location.href = '/grupos-de-amistad';
              }}
            >
              Grupos de Amistad
            </a>
            <a 
              href="/eventos" 
              className="apple-nav-link"
              style={{ fontSize: '1rem', padding: '10px 14px', textAlign: 'left' }}
              onClick={(e) => { 
                e.preventDefault(); 
                setMobileMenuOpen(false);
                window.location.href = '/eventos';
              }}
            >
              Eventos
            </a>
            <a 
              href="/oracion" 
              className="apple-nav-link"
              style={{ fontSize: '1rem', padding: '10px 14px', textAlign: 'left' }}
              onClick={(e) => { 
                e.preventDefault(); 
                setMobileMenuOpen(false);
                window.location.href = '/oracion';
              }}
            >
              Oración & Testimonios
            </a>
            <a 
              href="/donar" 
              className="apple-nav-link"
              style={{ fontSize: '1rem', padding: '10px 14px', textAlign: 'left' }}
              onClick={(e) => { 
                e.preventDefault(); 
                setMobileMenuOpen(false);
                window.location.href = '/donar';
              }}
            >
              Donar
            </a>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                const contactEl = document.getElementById('contacto-section');
                if (contactEl) {
                  contactEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setModalType('pregunta');
                }
              }}
              className="apple-nav-link"
              style={{ fontSize: '1rem', padding: '10px 14px', textAlign: 'left' }}
            >
              Contacto
            </button>
          </div>
        )}
      </div>

      {sections && sections.length > 0 ? (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {sections.map(sec => renderDynamicSection(sec))}
        </div>
      ) : (
        <>
          {/* GLOW EFFECT OVERLAYS */}
          <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 51, 255, 0.2) 0%, rgba(0, 51, 255, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '-15%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(151, 125, 255, 0.15) 0%, rgba(151, 125, 255, 0) 75%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* 1. HERO SECTION (Fallback) */}
      <div 
        id="inicio"
        className="hero-container"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#000000',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: 'clamp(100px, 14vh, 160px)',
          paddingBottom: 'clamp(60px, 10vh, 120px)',
          boxSizing: 'border-box'
        }}
      >
        {/* Apple Ambient Cinematic Glow */}
        <div 
          className="apple-ambient-glow"
          style={{
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(151, 125, 255, 0.22) 0%, rgba(0, 113, 227, 0.12) 50%, transparent 80%)'
          }}
        />

        {(() => {
          let bgUrl = heroBg || '';
          bgUrl = bgUrl ? (bgUrl.startsWith('http') || bgUrl.startsWith('/') ? (bgUrl.startsWith('/') ? `${API_URL}${bgUrl}` : bgUrl) : `${API_URL}/${bgUrl}`) : '';
          
          return isVideoBg ? (
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
              zIndex: 0,
              opacity: 0.32
            }}
          >
            <source src={heroVideoUrl.startsWith('http') || heroVideoUrl.startsWith('/') ? (heroVideoUrl.startsWith('/') ? `${API_URL}${heroVideoUrl}` : heroVideoUrl) : `${API_URL}/${heroVideoUrl}`} type="video/mp4" />
          </video>
        ) : (
          <div 
            className="hero-bg-image"
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: bgUrl ? `url("${bgUrl}")` : 'none',
              zIndex: 0,
              opacity: 0.85
            }} 
          />
        )
        })()}

        {/* Apple Cinematic Bottom Vignette Gradient */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Apple Kicker Pill */}
          <div className="apple-kicker">
            <span className="apple-kicker-dot"></span>
            <span>Comunidad de Fe & Esperanza</span>
          </div>

          {(config.hero_title !== undefined ? config.hero_title : '') && (
            <h1 className="apple-hero-headline apple-gradient-text" style={{ maxWidth: '880px' }}>
              {config.hero_title !== undefined ? config.hero_title : ''}
            </h1>
          )}

          {(config.hero_subtitle !== undefined ? config.hero_subtitle : '') && (
            <p className="apple-hero-subtitle">
              {config.hero_subtitle !== undefined ? config.hero_subtitle : ''}
            </p>
          )}

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {(heroButtons.length > 0 ? heroButtons : [{ id: '1', label: '¿Eres nuevo en la Visión?', url: '#vision', style: 'primary' }]).map((btn, bIdx) => {
              const isPrimary = btn.style === 'primary' || bIdx === 0;
              return (
                <button
                  key={btn.id}
                  onClick={() => handleButtonClick(btn)}
                  className={`apple-btn ${isPrimary ? 'apple-btn-primary' : 'apple-btn-secondary'}`}
                  style={{
                    padding: '14px 28px',
                    fontSize: '0.94rem'
                  }}
                >
                  <span>{btn.label}</span>
                  {isPrimary && <ArrowRight size={16} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. NEWS / EVENTS GALLERY CAROUSEL */}
      {newsItems.length > 0 && (
        <div style={{
          padding: '100px 20px',
          position: 'relative',
          backgroundColor: 'var(--apple-bg-base)',
          zIndex: 1
        }}>
          <div className="container" style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <div className="apple-kicker">
                <span className="apple-kicker-dot"></span>
                <span>Actualidad & Comunidad</span>
              </div>
              <h2 className="apple-hero-headline apple-gradient-text" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginBottom: '14px' }}>
                Noticias y Eventos
              </h2>
            </div>

            {/* Gallery Cards */}
            <div style={{ position: 'relative' }}>
              <div 
                ref={galleryRef}
                style={{
                  display: 'grid',
                  gridTemplateColumns: newsItems.length === 1 ? '1fr' : newsItems.length === 2 ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '24px'
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
                        const target = item.link || item.url || item.buttonUrl || item.targetUrl || '/autenticas';
                        if (target.startsWith('http')) {
                          window.open(target, '_blank');
                        } else {
                          window.location.href = target;
                        }
                      }}
                      className="apple-bento-card"
                      style={{
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {imageUrl ? (
                        <div style={{
                          width: '100%',
                          height: '240px',
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
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                          />
                          {item.badge && (
                            <span style={{
                              position: 'absolute',
                              top: '16px',
                              left: '16px',
                              background: 'rgba(0, 0, 0, 0.65)',
                              backdropFilter: 'blur(16px)',
                              WebkitBackdropFilter: 'blur(16px)',
                              color: '#FFF',
                              padding: '5px 14px',
                              borderRadius: '9999px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              letterSpacing: '0.04em',
                              border: '1px solid rgba(255, 255, 255, 0.15)'
                            }}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '160px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <Calendar size={40} color="var(--apple-text-tertiary)" />
                        </div>
                      )}
                      <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{
                          fontSize: '1.3rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          letterSpacing: '-0.02em',
                          marginBottom: '10px',
                          lineHeight: 1.3
                        }}>
                          {item.title}
                        </h3>
                        {item.description && (
                          <p style={{
                            color: 'var(--apple-text-secondary)',
                            fontSize: '0.94rem',
                            lineHeight: 1.6,
                            marginBottom: item.link ? '20px' : '0'
                          }}>
                            {item.description}
                          </p>
                        )}
                        {item.link && (
                          <span style={{
                            marginTop: 'auto',
                            color: 'var(--apple-text-primary)',
                            fontSize: '0.86rem',
                            fontWeight: 600,
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
      <div id="vision-section" style={{ padding: '100px 20px', position: 'relative', backgroundColor: 'var(--apple-bg-base)', zIndex: 1 }}>
        <div className="container" style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="apple-kicker">
              <span className="apple-kicker-dot"></span>
              <span>Acerca de Nosotros</span>
            </div>

            <h2 className="apple-hero-headline apple-gradient-text" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginBottom: '14px' }}>
              Conocé la Visión
            </h2>

            <p className="apple-hero-subtitle" style={{ maxWidth: '680px', marginBottom: '0' }}>
              {config.about_text || 'Una iglesia viva, apasionada y comprometida con revelar el amor transformador de Jesucristo en cada corazón, hogar y comunidad.'}
            </p>
          </div>

          {/* 3 PILLARS BENTO CARDS: VISIÓN, MISIÓN, VALORES */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '24px'
          }}>
            {/* CARD 1: VISIÓN */}
            <div className="apple-bento-card" style={{ padding: '36px 32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--apple-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '22px'
              }}>
                <Compass size={26} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                {config.vision_title || 'Nuestra Visión'}
              </h3>
              <p style={{ color: 'var(--apple-text-secondary)', fontSize: '0.98rem', lineHeight: 1.65 }}>
                {config.vision_text || 'Ser una iglesia viva que inspira a miles de personas a experimentar una relación personal con Dios, transformando vidas y formando discípulos apasionados por la verdad.'}
              </p>
            </div>

            {/* CARD 2: MISIÓN */}
            <div className="apple-bento-card" style={{ padding: '36px 32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--apple-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '22px'
              }}>
                <Flame size={26} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                {config.mision_title || 'Nuestra Misión'}
              </h3>
              <p style={{ color: 'var(--apple-text-secondary)', fontSize: '0.98rem', lineHeight: 1.65 }}>
                {config.mision_text || 'Evangelizar, consolidar, edificar y enviar a cada creyente a vivir su propósito divino, restaurando familias y equipando líderes para impactar nuestra sociedad.'}
              </p>
            </div>

            {/* CARD 3: VALORES */}
            <div className="apple-bento-card" style={{ padding: '36px 32px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--apple-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '22px'
              }}>
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                {config.valores_title || 'Nuestros Valores'}
              </h3>
              <p style={{ color: 'var(--apple-text-secondary)', fontSize: '0.98rem', lineHeight: 1.65 }}>
                {config.valores_text || 'Amor incondicional, adoración genuina, excelencia en el servicio, integridad moral, restauración familiar y fe firme en las promesas de Dios.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SCHEDULES SECTION */}
      {schedules && schedules.length > 0 ? (
        <div id="horarios-section" style={{
          backgroundColor: 'var(--apple-bg-base)',
          padding: '100px 20px',
          color: '#FFFFFF',
          textAlign: 'center',
          borderTop: '1px solid var(--apple-border)',
          borderBottom: '1px solid var(--apple-border)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Apple Ambient Center Light */}
          <div 
            className="apple-ambient-glow"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(151, 125, 255, 0.12) 0%, transparent 70%)'
            }}
          />

          <div className="container" style={{ maxWidth: '780px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div className="apple-kicker" style={{ marginBottom: '16px' }}>
              <span className="apple-kicker-dot"></span>
              <span>Reuniones Semanales</span>
            </div>
            
            <h2 className="apple-hero-headline apple-gradient-text" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginBottom: '40px' }}>
              Horarios de Servicios
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {schedules.map((s, idx) => (
                <div 
                  key={s.id || idx} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '18px 28px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '9999px',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: s.isVirtual ? 'rgba(151, 125, 255, 0.15)' : 'rgba(0, 113, 227, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: s.isVirtual ? 'var(--apple-purple)' : 'var(--apple-blue)'
                    }}>
                      {s.isVirtual ? <Music size={18} /> : <PlayCircle size={18} />}
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                      {s.text}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    backgroundColor: s.isVirtual ? 'rgba(151, 125, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
                    color: s.isVirtual ? 'var(--apple-purple)' : 'var(--apple-text-secondary)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    {s.isVirtual ? 'En Línea' : 'Presencial'}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '44px' }}>
              <button 
                onClick={() => setModalType('pregunta')}
                className="apple-btn apple-btn-secondary"
                style={{ padding: '14px 32px', fontSize: '0.94rem' }}
              >
                <span>¿Tenés alguna pregunta?</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      ) : scheduleBg ? (
        <div id="horarios-section" style={{
          width: '100%',
          backgroundColor: '#030812',
          padding: '40px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          borderTop: '1px solid rgba(0, 51, 255, 0.15)',
          borderBottom: '1px solid rgba(0, 51, 255, 0.15)',
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

        </>
      )}

      {/* 5. FOOTER & CONTACT */}
      <footer id="contacto-section" style={{
        backgroundColor: '#030812',
        color: '#EAEDF8',
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
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#EAEDF8', opacity: 0.8, lineHeight: 1.6 }}>
              <MapPin size={22} color="#977DFF" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{config.contact_address || '50 norte y 50 oeste de la Cruz Roja de Desamparados. Auditorio Principal.'}</span>
            </div>

            {/* Waze & Google Maps Buttons */}
            {(config.maps_google_url || config.maps_waze_url) && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                {config.maps_google_url && (
                  <a 
                    href={config.maps_google_url} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '10px 18px', borderRadius: '50px',
                      backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFFFFF', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700,
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(66,133,244,0.2)'; e.currentTarget.style.borderColor = '#4285F4'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  >
                    <svg width="20" height="20" viewBox="0 0 92.3 132.3" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#1a73e8" d="M60.2 2.2C55.8.8 51 0 46.1 0 32 0 19.3 6.4 10.8 16.5l21.8 18.3L60.2 2.2z"/>
                      <path fill="#ea4335" d="M10.8 16.5C4.1 24.5 0 34.9 0 46.1c0 8.7 1.7 15.7 4.6 22l28-33.3-21.8-18.3z"/>
                      <path fill="#4285f4" d="M46.2 28.5c9.8 0 17.7 7.9 17.7 17.7 0 4.3-1.6 8.3-4.2 11.4 0 0 13.9-16.6 27.5-32.7-5.6-10.8-15.3-19-27-22.7L32.6 34.8c3.3-3.8 8.1-6.3 13.6-6.3"/>
                      <path fill="#fbbc04" d="M46.2 63.8c-9.8 0-17.7-7.9-17.7-17.7 0-4.3 1.5-8.3 4.1-11.3l-28 33.3c4.8 10.6 12.8 19.2 21 29.9l34.1-40.5c-3.3 3.9-8.1 6.3-13.5 6.3"/>
                      <path fill="#34a853" d="M59.1 109.2c15.4-24.1 33.3-35 33.3-63 0-7.7-1.9-14.9-5.2-21.3L25.6 98c2.6 3.4 5.3 7.3 7.9 11.3 9.4 14.5 6.8 23.1 12.8 23.1s3.4-8.7 12.8-23.2"/>
                    </svg>
                    Google Maps
                  </a>
                )}
                {config.maps_waze_url && (
                  <a 
                    href={config.maps_waze_url.match(/^https?:\/\//) || config.maps_waze_url.startsWith('waze://') ? config.maps_waze_url : `https://${config.maps_waze_url}`} 

                    target="_blank" 
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '10px 18px', borderRadius: '50px',
                      backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      color: '#FFFFFF', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700,
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(51,204,255,0.2)'; e.currentTarget.style.borderColor = '#33CCFF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.62 7.85 6.32 9.32-.04-.78-.07-1.97.01-2.82.08-.76.52-4.84.52-4.84s-.13-.27-.13-.67c0-.62.36-1.09.81-1.09.38 0 .57.29.57.63 0 .38-.24.96-.37 1.49-.11.45.22.81.67.81.8 0 1.42-.84 1.42-2.07 0-1.08-.78-1.84-1.89-1.84-1.29 0-2.04.96-2.04 1.96 0 .39.15.8.33 1.03.04.05.04.09.03.14-.03.14-.11.45-.13.51-.02.09-.07.11-.17.07-.63-.29-1.02-1.22-1.02-1.96 0-1.59 1.16-3.06 3.34-3.06 1.75 0 3.11 1.25 3.11 2.92 0 1.74-1.1 3.14-2.62 3.14-.51 0-.99-.27-1.16-.58l-.31 1.2c-.11.44-.42 1-.63 1.33A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z" fill="#33CCFF"/>
                    </svg>
                    Waze
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '20px' }}>
              Contacto Directo
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#EAEDF8', opacity: 0.8 }}>
              {(() => {
                let contacts = [];
                try {
                  if (config.footer_contacts) {
                    contacts = JSON.parse(config.footer_contacts);
                  }
                } catch(e) {}

                if (contacts.length > 0) {
                  return contacts.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {c.type === 'email' ? <Mail size={18} color="#0033FF" /> : <Phone size={18} color="#0033FF" />}
                      <span><strong>{c.label}:</strong> {c.value}</span>
                    </div>
                  ));
                }

                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Mail size={18} color="#0033FF" />
                      <span>{config.contact_email || 'info@somosimpact.com'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Phone size={18} color="#0033FF" />
                      <span>{config.contact_phone_1 || '+506 4115 1212'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Phone size={18} color="#0033FF" />
                      <span>{config.contact_phone_2 || '+506 6453 1212'}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '20px' }}>
              Legal
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: '#EAEDF8', opacity: 0.9 }}>
              <a href="/politicas" style={{ color: '#EAEDF8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#977DFF'} onMouseLeave={(e) => e.currentTarget.style.color = '#EAEDF8'}>Términos y Políticas</a>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#FFFFFF', fontWeight: 800, marginBottom: '20px' }}>
              Síguenos en
            </h3>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {(() => {
                let socials = [];
                try {
                  if (config.footer_socials) {
                    socials = JSON.parse(config.footer_socials);
                  }
                } catch(e) {}

                const getSocialColor = (plat) => {
                  switch (plat) {
                    case 'facebook': return '#3b5998';
                    case 'instagram': return '#E1306C';
                    case 'youtube': return '#FF0000';
                    case 'spotify': return '#1DB954';
                    case 'tiktok': return '#00f2fe';
                    case 'twitter': return '#FFFFFF';
                    default: return '#977DFF';
                  }
                };

                if (socials.length > 0) {
                  return socials.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: getSocialColor(s.platform), transition: 'all 0.2s ease', textDecoration: 'none'
                    }}>
                      {socialIcons[s.platform] || socialIcons.web}
                    </a>
                  ));
                }

                return (
                  <>
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
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1F2937', marginTop: '60px', paddingTop: '24px', textAlign: 'center', color: '#4B5563', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Iglesia Visión Jesús. Todos los derechos reservados.
        </div>
      </footer>

      {/* QUESTION MODAL ONLY - APPLE FROSTED SHEET */}
      {modalType === 'pregunta' && (
        <div className="modal-overlay" onClick={() => setModalType(null)} style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '28px', backgroundColor: 'rgba(18, 18, 24, 0.94)', border: '1px solid rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(32px)', color: '#FFF', boxShadow: '0 24px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '36px 32px' }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>Enviar Pregunta</h3>
              <p style={{ color: 'var(--apple-text-secondary)', fontSize: '0.94rem', lineHeight: 1.5, marginBottom: '24px' }}>
                ¿Tienes alguna duda sobre nuestros horarios, ministerios o actividades? Escríbenos directamente aquí.
              </p>

              {formSubmitted ? (
                <div style={{ textAlign: 'center', color: '#34C759', fontWeight: 600, padding: '24px', backgroundColor: 'rgba(52, 199, 89, 0.1)', borderRadius: '16px', border: '1px solid rgba(52, 199, 89, 0.2)' }}>
                  ¡Mensaje recibido! Te responderemos muy pronto.
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--apple-text-secondary)', marginBottom: '8px' }}>Tu Nombre</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FFF', padding: '12px 16px' }} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--apple-text-secondary)', marginBottom: '8px' }}>Correo de contacto</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FFF', padding: '12px 16px' }} />
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--apple-text-secondary)', marginBottom: '8px' }}>Pregunta o comentario</label>
                    <textarea name="question" rows="3" value={formData.question} onChange={handleInputChange} required style={{ width: '100%', borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF', padding: '12px 16px', boxSizing: 'border-box' }}></textarea>
                  </div>
                  <button type="submit" className="apple-btn apple-btn-primary" style={{ width: '100%', padding: '14px', fontSize: '0.94rem' }}>Enviar Mensaje</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STICKY MOBILE CTA BAR - APPLE FLOATING PILL */}
      <div className="mobile-sticky-cta-bar">
        <button 
          onClick={onGoToTickets || (() => {
            window.history.pushState({}, '', '/autenticas');
            window.location.reload();
          })} 
          className="mobile-sticky-cta-btn"
        >
          <Ticket size={18} />
          <span>Congreso 2026 • Entradas Disponibles</span>
        </button>
      </div>

      <style>{`
        .mobile-sticky-cta-bar {
          display: none;
          position: fixed;
          bottom: 20px;
          left: 16px;
          right: 16px;
          z-index: 999;
          pointer-events: none;
        }
        @media (max-width: 768px) {
          .mobile-sticky-cta-bar {
            display: flex;
            justify-content: center;
          }
        }
        .mobile-sticky-cta-btn {
          pointer-events: auto;
          width: 100%;
          max-width: 440px;
          padding: 14px 20px;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          background: #FFFFFF;
          color: #000000;
          font-family: var(--apple-font);
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: -0.01em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7);
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .mobile-sticky-cta-btn:active {
          transform: scale(0.96);
        }
      `}</style>

    </div>
  );
}
