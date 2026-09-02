import React from 'react';
import { QrCode, ShieldCheck, Home } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, adminUser, onLogout, onGoHome, navbarConfig = {} }) {
  const handleNavLanding = () => {
    if (adminUser && adminUser.role === 'scanner') return;
    window.location.href = '/';
  };

  const officialNavLinks = [
    { label: 'INICIO', url: '/' },
    { label: 'NOSOTROS', url: '/nosotros' },
    { label: 'MODELO DE JESÚS', url: '/modelo' },
    { label: 'CONGRESOS', url: '/congresos' },
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
      backgroundColor: currentView === 'landing' ? 'rgba(3,8,18,0.95)' : '#FFFFFF',
      backdropFilter: currentView === 'landing' ? 'blur(20px)' : 'none',
      borderBottom: currentView === 'landing' ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--accent-beige-border)',
      boxShadow: currentView === 'landing' ? '0 4px 30px rgba(0,0,0,0.3)' : 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={handleNavLanding} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: (adminUser && adminUser.role === 'scanner') ? 'default' : 'pointer' }}
        >
          <img 
            src={currentView === 'admin' ? '/logo_oficial_transparente.png' : '/logo.png'} 
            alt="Logo" 
            style={{
              height: '52px',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          
          {(!adminUser || adminUser.role !== 'scanner') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {navLinksToRender.map((link, idx) => {
                const isActive = (window.location.pathname === link.url) || (link.url === '/congresos' && window.location.pathname === '/autenticas');
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleLinkClick(link)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isActive ? '#0033FF' : (currentView === 'landing' ? '#EAEDF8' : 'var(--accent-coffee)'),
                      fontSize: '0.83rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      padding: '6px 12px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      transition: 'color 0.2s ease',
                      borderRadius: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = currentView === 'landing' ? '#977DFF' : '#0033FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isActive ? '#0033FF' : (currentView === 'landing' ? '#EAEDF8' : 'var(--accent-coffee)');
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
                  className={`btn-secondary ${currentView === 'scanner' ? 'active' : ''}`}
                  onClick={() => setCurrentView('scanner')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', padding: '8px 16px', borderColor: 'var(--accent-gold)' }}
                >
                  <QrCode size={18} color="var(--accent-coffee)" />
                  <span>Escáner Puerta</span>
                </button>
              )}

              {adminUser.role !== 'scanner' && (
                <button 
                  className="btn-primary"
                  onClick={() => {
                    window.history.pushState({}, '', '/login');
                    setCurrentView('admin');
                  }}
                  style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                >
                  <ShieldCheck size={18} />
                  <span>Panel Admin ({adminUser.username})</span>
                </button>
              )}

              <button 
                onClick={onLogout}
                style={{ fontSize: '0.85rem', color: 'var(--color-red)', background: 'none', textDecoration: 'underline', cursor: 'pointer' }}
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
