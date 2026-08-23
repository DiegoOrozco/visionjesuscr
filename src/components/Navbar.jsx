import React from 'react';
import { QrCode, ShieldCheck, Ticket, Home, Menu, X } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, adminUser, onLogout, onGoHome, navbarConfig = {} }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const handleNavLanding = () => {
    if (adminUser && adminUser.role === 'scanner') return;
    window.history.pushState({}, '', '/');
    if (onGoHome) {
      onGoHome();
    } else {
      setCurrentView('landing');
    }
  };

  const handleNavTickets = () => {
    window.history.pushState({}, '', '/autenticas');
    setCurrentView('autenticas-promo');
  };

  // Parse dynamic navbar links
  let dynamicLinks = [];
  try {
    if (navbarConfig.navbar_links) {
      dynamicLinks = typeof navbarConfig.navbar_links === 'string' 
        ? JSON.parse(navbarConfig.navbar_links) 
        : navbarConfig.navbar_links;
    }
  } catch(e) {}

  const handleDynamicLinkClick = (link) => {
    setMobileMenuOpen(false);
    if (link.url === '/') {
      handleNavLanding();
    } else if (link.url === '/autenticas') {
      handleNavTickets();
    } else if (link.url.startsWith('#')) {
      // Scroll to section
      const el = document.getElementById(link.url.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else {
        // Go home then scroll
        handleNavLanding();
        setTimeout(() => {
          const el2 = document.getElementById(link.url.substring(1));
          if (el2) el2.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    } else if (link.url.startsWith('/')) {
      window.history.pushState({}, '', link.url);
      setCurrentView(link.url.substring(1) + '-promo');
    } else {
      window.open(link.url, '_blank');
    }
  };

  // Use dynamic links for public-facing navbar (when not admin/scanner)
  const showDynamic = dynamicLinks.length > 0 && !adminUser;

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
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          
          {/* Dynamic public links */}
          {showDynamic && (
            <>
              {dynamicLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDynamicLinkClick(link)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '0.82rem', padding: '8px 16px',
                    fontWeight: 700,
                    borderRadius: link.isButton ? '50px' : '8px',
                    border: link.isButton ? 'none' : '1px solid transparent',
                    background: link.isButton 
                      ? 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)' 
                      : 'transparent',
                    color: link.isButton ? '#FFFFFF' : (currentView === 'landing' ? 'rgba(255,255,255,0.85)' : 'var(--accent-coffee)'),
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}
                  onMouseEnter={(e) => {
                    if (!link.isButton) {
                      e.currentTarget.style.color = currentView === 'landing' ? '#FFFFFF' : '#0033FF';
                      e.currentTarget.style.backgroundColor = currentView === 'landing' ? 'rgba(255,255,255,0.08)' : 'rgba(0,51,255,0.06)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!link.isButton) {
                      e.currentTarget.style.color = currentView === 'landing' ? 'rgba(255,255,255,0.85)' : 'var(--accent-coffee)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </button>
              ))}
            </>
          )}

          {/* Static fallback links (when no dynamic links or admin) */}
          {!showDynamic && (!adminUser || adminUser.role !== 'scanner') && (
            <>
              <button 
                className={`btn-secondary ${currentView === 'landing' ? 'active' : ''}`}
                onClick={handleNavLanding}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', padding: '8px 16px' }}
              >
                <Home size={18} />
                <span>Inicio</span>
              </button>

              <button 
                className={`btn-secondary ${currentView === 'home' || currentView === 'attendees' || currentView === 'success' ? 'active' : ''}`}
                onClick={handleNavTickets}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', padding: '8px 16px' }}
              >
                <Ticket size={18} />
                <span>Congreso Mujeres</span>
              </button>
            </>
          )}

          {/* Render admin links ONLY if logged in */}
          {adminUser && (
            <>
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
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
