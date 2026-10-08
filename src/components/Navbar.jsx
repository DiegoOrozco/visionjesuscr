import React from 'react';
import { QrCode, ShieldCheck } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, adminUser, onLogout, onGoHome, navbarConfig = {} }) {
  const handleNavLanding = () => {
    if (adminUser && adminUser.role === 'scanner') return;
    window.location.href = '/';
  };

  const isAutenticasPage = window.location.pathname === '/autenticas' || currentView === 'autenticas-promo';

  const officialNavLinks = [
    { label: 'INICIO', url: '/' },
    { label: 'NOSOTROS', url: '/nosotros' },
    { label: 'MODELO DE JESÚS', url: '/modelo' },
    { label: 'EVENTOS', url: '/eventos' },
    { label: 'CONTACTO', url: '/#contacto-section' }
  ];

  // Parse dynamic navbar links, ignoring legacy links from old DB state
  let dynamicLinks = [];
  try {
    if (navbarConfig.navbar_links) {
      const parsed = typeof navbarConfig.navbar_links === 'string' 
        ? JSON.parse(navbarConfig.navbar_links) 
        : navbarConfig.navbar_links;
      if (Array.isArray(parsed) && parsed.length > 0 && !parsed.some(l => l.label === 'Congreso Mujeres' || l.label === 'Conocé la Visión' || l.label === 'Experiencias y Horarios' || l.label === 'Inicio')) {
        dynamicLinks = parsed;
      }
    }
  } catch(e) {}

  const navLinksToRender = dynamicLinks.length > 0 ? dynamicLinks : officialNavLinks;

  const handleLinkClick = (link) => {
    if (link.url.startsWith('http')) {
      window.open(link.url, '_blank');
    } else {
      window.location.href = link.url;
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: isAutenticasPage ? 'rgba(255, 255, 255, 0.85)' : 'rgba(8, 8, 12, 0.78)',
      backdropFilter: 'blur(28px) saturate(190%)',
      WebkitBackdropFilter: 'blur(28px) saturate(190%)',
      borderBottom: isAutenticasPage ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: isAutenticasPage ? '0 4px 20px rgba(0, 0, 0, 0.04)' : '0 8px 32px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        padding: '0 24px'
      }}>
        {/* Brand Logo - Apple Clean Proportions */}
        <div 
          onClick={handleNavLanding} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: (adminUser && adminUser.role === 'scanner') ? 'default' : 'pointer',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onMouseEnter={(e) => {
            if (!adminUser || adminUser.role !== 'scanner') {
              e.currentTarget.style.transform = 'scale(1.03)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img 
            src={isAutenticasPage ? '/logo.png' : '/logo_oficial_transparente.png'} 
            alt="Visión Jesús Logo" 
            style={{
              height: '46px',
              objectFit: 'contain',
              filter: isAutenticasPage ? 'none' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
            }}
          />
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          
          {(!adminUser || adminUser.role !== 'scanner') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              {navLinksToRender.map((link, idx) => {
                const isCurrentPath = (window.location.pathname === link.url) || 
                  ((link.url === '/congresos' || link.url === '/eventos') && (window.location.pathname === '/congresos' || window.location.pathname === '/eventos')) ||
                  (link.url === '/' && window.location.pathname === '/');

                return (
                  <button
                    key={idx}
                    onClick={() => handleLinkClick(link)}
                    className="apple-nav-link"
                    style={{
                      color: isAutenticasPage 
                        ? (isCurrentPath ? '#0033FF' : '#5C3D2E')
                        : (isCurrentPath ? '#FFFFFF' : 'var(--apple-text-secondary)'),
                      backgroundColor: isCurrentPath 
                        ? (isAutenticasPage ? 'rgba(0, 51, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)')
                        : 'transparent',
                      fontWeight: isCurrentPath ? 600 : 500,
                      borderRadius: '9999px',
                      padding: '7px 14px',
                      fontSize: '0.84rem',
                      letterSpacing: '-0.01em',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrentPath) {
                        e.currentTarget.style.color = isAutenticasPage ? '#0033FF' : '#FFFFFF';
                        e.currentTarget.style.backgroundColor = isAutenticasPage ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrentPath) {
                        e.currentTarget.style.color = isAutenticasPage ? '#5C3D2E' : 'var(--apple-text-secondary)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Render admin links ONLY if logged in */}
          {adminUser && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
              {(adminUser.role === 'admin' || adminUser.role === 'scanner') && (
                <button 
                  className={`apple-btn apple-btn-secondary ${currentView === 'scanner' ? 'active' : ''}`}
                  onClick={() => setCurrentView('scanner')}
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <QrCode size={16} color={isAutenticasPage ? 'var(--accent-coffee)' : 'var(--apple-purple)'} />
                  <span>Escáner Puerta</span>
                </button>
              )}

              {adminUser.role !== 'scanner' && (
                <button 
                  className="apple-btn apple-btn-primary"
                  onClick={() => {
                    window.history.pushState({}, '', '/login');
                    setCurrentView('admin');
                  }}
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <ShieldCheck size={16} />
                  <span>Panel Admin ({adminUser.username})</span>
                </button>
              )}

              <button 
                onClick={onLogout}
                style={{ 
                  fontSize: '0.82rem', 
                  color: '#FF453A', 
                  background: 'none', 
                  border: 'none',
                  textDecoration: 'none', 
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: '9999px',
                  fontWeight: 500,
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 69, 58, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Salir
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
