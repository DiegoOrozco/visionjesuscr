import React, { useState, useEffect } from 'react';
import { ShieldCheck, QrCode, Menu, X } from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  adminUser, 
  onLogout, 
  onGoHome, 
  navbarConfig = {} 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll for subtle pill resize & contrast enhancement
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile sheet on escape key or resize > 900px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Current admin session
  const currentAdmin = adminUser || (() => {
    try {
      const saved = localStorage.getItem('admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const handleLogout = () => {
    setMobileMenuOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
      window.location.href = '/';
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (currentAdmin && currentAdmin.role === 'scanner') return;

    if (onGoHome) {
      onGoHome();
    } else if (setCurrentView) {
      window.history.pushState({}, '', '/');
      setCurrentView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/';
    }
  };

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Nosotros', path: '/nosotros' },
    { label: 'Modelo de Jesús', path: '/modelo' },
    { label: 'Grupos de Amistad', path: '/grupos-de-amistad' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Oración & Testimonios', path: '/oracion' },
    { label: 'Donar', path: '/donar' },
    { label: 'Contacto', path: '/#contacto-section', isAnchor: true }
  ];

  const isLinkActive = (link) => {
    const currentPath = window.location.pathname;
    if (link.isAnchor) return false;
    if (link.path === '/') {
      return currentPath === '/' && (!currentView || currentView === 'landing');
    }
    if (link.path === '/nosotros') {
      return currentPath === '/nosotros' || currentView === 'nosotros';
    }
    if (link.path === '/modelo') {
      return currentPath === '/modelo' || currentView === 'modelo-promo';
    }
    if (link.path === '/grupos-de-amistad') {
      return currentPath === '/grupos-de-amistad' || currentPath === '/casas-de-paz' || currentView === 'grupos-amistad';
    }
    if (link.path === '/eventos') {
      return currentPath === '/eventos' || currentPath === '/congresos' || currentView === 'congresos';
    }
    if (link.path === '/oracion') {
      return currentPath === '/oracion' || currentPath === '/peticiones' || currentView === 'oracion';
    }
    if (link.path === '/donar') {
      return currentPath === '/donar' || currentPath === '/ofrendas' || currentView === 'donaciones';
    }
    return currentPath === link.path;
  };

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (link.isAnchor) {
      const contactEl = document.getElementById('contacto-section');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        if (setCurrentView) {
          window.history.pushState({}, '', '/#contacto-section');
          setCurrentView('landing');
          setTimeout(() => {
            const el = document.getElementById('contacto-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } else {
          window.location.href = '/#contacto-section';
        }
      }
      return;
    }

    const currentPath = window.location.pathname;
    if (currentPath === link.path && link.path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (setCurrentView) {
      if (link.path === '/') {
        window.history.pushState({}, '', '/');
        setCurrentView('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (link.path === '/nosotros') {
        window.history.pushState({}, '', '/nosotros');
        setCurrentView('nosotros');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (link.path === '/modelo') {
        window.history.pushState({}, '', '/modelo');
        setCurrentView('modelo-promo');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (link.path === '/grupos-de-amistad') {
        window.history.pushState({}, '', '/grupos-de-amistad');
        setCurrentView('grupos-amistad');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (link.path === '/eventos') {
        window.history.pushState({}, '', '/eventos');
        setCurrentView('congresos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (link.path === '/oracion') {
        window.history.pushState({}, '', '/oracion');
        setCurrentView('oracion');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (link.path === '/donar') {
        window.history.pushState({}, '', '/donar');
        setCurrentView('donaciones');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    window.location.href = link.path;
  };

  return (
    <div className="apple-nav-wrapper" style={{ top: isScrolled ? '12px' : '20px' }}>
      <header 
        className={`apple-nav-bar ${isScrolled ? 'apple-nav-scrolled' : ''}`}
        style={{ maxWidth: isScrolled ? '1060px' : '1140px' }}
      >
        {/* BRAND LOGO */}
        <div 
          onClick={handleLogoClick}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: (currentAdmin && currentAdmin.role === 'scanner') ? 'default' : 'pointer',
            transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onMouseEnter={(e) => {
            if (!currentAdmin || currentAdmin.role !== 'scanner') {
              e.currentTarget.style.transform = 'scale(1.03)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
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

        {/* DESKTOP LINKS */}
        <nav className="apple-nav-links">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <a 
                key={link.path}
                href={link.path}
                className={`apple-nav-link ${active ? 'active' : ''}`}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS: ADMIN PROFILE + MOBILE MENU TOGGLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
              {(currentAdmin.role === 'admin' || currentAdmin.role === 'scanner') && (
                <button 
                  onClick={() => {
                    if (setCurrentView) setCurrentView('scanner');
                    else window.location.href = '/escanear';
                  }}
                  className="apple-btn apple-btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  title="Escáner Puerta"
                >
                  <QrCode size={14} color="var(--apple-purple, #977DFF)" />
                  <span>Escáner</span>
                </button>
              )}

              {currentAdmin.role !== 'scanner' && (
                <button 
                  onClick={() => {
                    window.history.pushState({}, '', '/login');
                    if (setCurrentView) setCurrentView('admin');
                    else window.location.href = '/admin';
                  }}
                  className="apple-btn apple-btn-primary"
                  style={{ fontSize: '0.78rem', padding: '6px 14px' }}
                  title="Panel de Administración"
                >
                  <ShieldCheck size={14} />
                  <span>{currentAdmin.username || 'admin'}</span>
                </button>
              )}

              <button 
                onClick={handleLogout}
                style={{
                  fontSize: '0.78rem',
                  color: '#FF453A',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: '9999px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 69, 58, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          )}

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
            aria-label="Menú de Navegación"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Apple iOS Mobile Sheet Drawer */}
      {mobileMenuOpen && (
        <div className="apple-mobile-sheet">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <a 
                key={link.path}
                href={link.path}
                className={`apple-nav-link ${active ? 'active' : ''}`}
                style={{ fontSize: '1rem', padding: '10px 14px', textAlign: 'left' }}
                onClick={(e) => handleLinkClick(e, link)}
              >
                {link.label}
              </a>
            );
          })}

          {currentAdmin && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(currentAdmin.role === 'admin' || currentAdmin.role === 'scanner') && (
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (setCurrentView) setCurrentView('scanner');
                    else window.location.href = '/escanear';
                  }}
                  className="apple-btn apple-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <QrCode size={16} />
                  <span>Escáner Puerta</span>
                </button>
              )}

              {currentAdmin.role !== 'scanner' && (
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.history.pushState({}, '', '/login');
                    if (setCurrentView) setCurrentView('admin');
                    else window.location.href = '/admin';
                  }}
                  className="apple-btn apple-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <ShieldCheck size={16} />
                  <span>Panel Admin ({currentAdmin.username})</span>
                </button>
              )}

              <button 
                onClick={handleLogout}
                style={{
                  fontSize: '0.9rem',
                  color: '#FF453A',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: '8px',
                  textAlign: 'center'
                }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
