import React from 'react';
import { QrCode, ShieldCheck, Ticket, Home } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, adminUser, onLogout, onGoHome }) {
  
  const handleNavLanding = () => {
    window.history.pushState({}, '', '/');
    if (onGoHome) {
      onGoHome();
    } else {
      setCurrentView('landing');
    }
  };

  const handleNavTickets = () => {
    window.history.pushState({}, '', '/autenticas');
    setCurrentView('home');
  };

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--accent-beige-border)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '75px'
      }}>
        {/* Brand Logo Only (Removed text title & subtitle) */}
        <div 
          onClick={handleNavLanding} 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <img 
            src="/logo.png" 
            alt="Logo Mujeres Auténticas" 
            style={{
              height: '62px',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Navigation Buttons */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
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

          {/* Render admin links ONLY if logged in */}
          {adminUser && (
            <>
              <button 
                className={`btn-secondary ${currentView === 'scanner' ? 'active' : ''}`}
                onClick={() => setCurrentView('scanner')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', padding: '8px 16px', borderColor: 'var(--accent-gold)' }}
              >
                <QrCode size={18} color="var(--accent-coffee)" />
                <span>Escáner Puerta</span>
              </button>

              <button 
                className="btn-primary"
                onClick={() => setCurrentView('admin')}
                style={{ fontSize: '0.9rem', padding: '8px 16px' }}
              >
                <ShieldCheck size={18} />
                <span>Panel Admin ({adminUser.username})</span>
              </button>

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
