import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import VenueMap from './components/VenueMap';
import ZoneModal from './components/ZoneModal';
import AttendeeForm from './components/AttendeeForm';
import TicketSuccess from './components/TicketSuccess';
import TicketView from './components/TicketView';
import AdminDashboard from './components/AdminDashboard';
import DoorScanner from './components/DoorScanner';
import ChurchLanding from './components/ChurchLanding';
import AutenticasPromo from './components/AutenticasPromo';
import UnderConstruction from './components/UnderConstruction';
import AcercaDeLaVision from './components/AcercaDeLaVision';

const API_URL = import.meta.env.VITE_API_URL || '';

const getInitialView = () => {
  const path = window.location.pathname;
  if (path.startsWith('/ticket/')) return 'ticket-view';
  if (path === '/admin' || path === '/login' || path === '/portal-admin') {
    const savedUser = localStorage.getItem('admin_user');
    const userObj = savedUser ? JSON.parse(savedUser) : null;
    if (userObj && userObj.role === 'scanner') return 'scanner';
    return 'admin';
  }
  if (path === '/escanear') return 'scanner';
  if (path === '/autenticas') return 'autenticas-promo';
  if (path === '/acerca-de-la-vision') return 'acerca-de-la-vision';
  if (['/sanados', '/modelo', '/move', '/tienda'].includes(path)) return 'under-construction';
  return 'landing';
};

const getInitialConstructionPage = () => {
  const path = window.location.pathname;
  if (['/sanados', '/modelo', '/move', '/tienda'].includes(path)) {
    return path.replace('/', '');
  }
  return '';
};

export default function App() {
  const [currentView, setCurrentView] = useState(getInitialView);
  const [zones, setZones] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [homepageConfig, setHomepageConfig] = useState({});
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [landingSections, setLandingSections] = useState([]);
  const [constructionPage, setConstructionPage] = useState(getInitialConstructionPage);
  
  // Modal & Reservation state
  const [selectedZone, setSelectedZone] = useState(null);
  const [attendeeQuantity, setAttendeeQuantity] = useState(1);
  const [chosenSeatCodes, setChosenSeatCodes] = useState([]);
  const [activeReservation, setActiveReservation] = useState(null);

  // Admin user auth state
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // URL Hash state for /ticket/:qrHash
  const [ticketQrHash, setTicketQrHash] = useState('');

  // Zone Highlight state
  const [highlightedZone, setHighlightedZone] = useState(null);

  // Fetch zones & occupied seats on mount
  const fetchZones = () => {
    fetch(`${API_URL}/api/zones`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setZones(data.zones);
          if (data.occupiedSeats) {
            setOccupiedSeats(data.occupiedSeats);
          }
        }
      })
      .catch(console.error);
  };

  const fetchConfig = () => {
    fetch(`${API_URL}/api/homepage/config`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHomepageConfig(data.config);
        }
        setIsConfigLoaded(true);
      })
      .catch((e) => {
        console.error(e);
        setIsConfigLoaded(true);
      });
  };

  const fetchLandingSections = (path = window.location.pathname) => {
    fetch(`${API_URL}/api/landing/sections?path=${encodeURIComponent(path)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLandingSections(data.sections || []);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchZones();
    fetchConfig();

    const path = window.location.pathname;
    fetchLandingSections(path);

    if (path.startsWith('/ticket/')) {
      const hash = path.replace('/ticket/', '');
      if (hash) {
        setTicketQrHash(hash);
        setCurrentView('ticket-view');
      }
    } else if (path === '/admin' || path === '/login' || path === '/portal-admin') {
      if (path === '/admin') {
        window.history.replaceState({}, '', '/login');
      }
      const savedUser = localStorage.getItem('admin_user');
      const userObj = savedUser ? JSON.parse(savedUser) : null;
      if (userObj && userObj.role === 'scanner') {
        setCurrentView('scanner');
      } else {
        setCurrentView('admin');
      }
    } else if (path === '/escanear') {
      setCurrentView('scanner');
    } else if (path === '/autenticas') {
      setCurrentView('autenticas-promo');
    } else if (['/sanados', '/modelo', '/move', '/tienda', '/acerca-de-la-vision'].includes(path)) {
      setConstructionPage(path.replace('/', ''));
      setCurrentView('under-construction');
    } else {
      setCurrentView('landing');
    }
  }, []);

  const handleAdminLogin = (user, token) => {
    setAdminUser(user);
    localStorage.setItem('admin_user', JSON.stringify(user));
    if (token) {
      localStorage.setItem('admin_token', token);
    }
    window.history.pushState({}, '', '/login');
    if (user.role === 'scanner') {
      setCurrentView('scanner');
    } else {
      setCurrentView('admin');
    }
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    setCurrentView('landing');
  };

  // Seat hold state
  const [seatSessionId, setSeatSessionId] = useState('');
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);

  const handleSelectZone = (zone, qty = 1, seatCodes = [], sessionId = '', expiresAt = null) => {
    setSelectedZone(zone);
    const validQty = qty && qty > 0 ? qty : 1;
    setAttendeeQuantity(validQty);
    setChosenSeatCodes(seatCodes || []);
    if (sessionId) setSeatSessionId(sessionId);
    if (expiresAt) setHoldExpiresAt(expiresAt);

    if (validQty > 0) {
      setCurrentView('attendees');
    }
  };

  const handleModalContinue = (qty) => {
    setAttendeeQuantity(qty);
    setCurrentView('attendees');
  };

  const handleReservationSuccess = (resvData) => {
    setActiveReservation(resvData);
    fetchZones();
    setCurrentView('success');
  };

  const handleGoToTickets = () => {
    window.history.pushState({}, '', '/autenticas');
    setCurrentView('autenticas-promo');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!['landing', 'under-construction'].includes(currentView) && (
        <Navbar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          adminUser={adminUser}
          onLogout={handleAdminLogout}
          navbarConfig={homepageConfig}
          onGoHome={() => {
            setSelectedZone(null);
            setAttendeeQuantity(1);
            setChosenSeatCodes([]);
            window.history.pushState({}, '', '/');
            setCurrentView('landing');
          }}
        />
      )}

      <main style={{ flex: 1, paddingBottom: currentView === 'landing' ? '0px' : '60px' }}>
        
        {!isConfigLoaded ? (
          <div style={{ height: '100vh', backgroundColor: '#FDFBF7' }}></div>
        ) : (
          <>
            {/* VIEW 0: CHURCH LANDING PAGE */}
        {currentView === 'landing' && (
          <ChurchLanding 
            config={homepageConfig} 
            sections={landingSections}
            onGoToTickets={handleGoToTickets}
          />
        )}

        {/* VIEW 1A: AUTÉNTICAS PROMO PAGE */}
        {currentView === 'autenticas-promo' && (
          <div className="container" style={{ paddingTop: '20px' }}>
            <AutenticasPromo 
              config={homepageConfig} 
              onScrollToMap={(type) => {
                setHighlightedZone(type); // 'general' or 'gold'
                setCurrentView('home');
              }}
            />
          </div>
        )}

        {/* VIEW 1: HOME (Hero with Official Large Annual Logo + SVG Croquis Map) */}
        {currentView === 'home' && (
          <div className="container" style={{ paddingTop: '20px' }}>
            
            {/* Event Hero Banner with Official Large Annual Logo */}
            <div id="map-selection-section" style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--accent-beige-border)',
              borderRadius: '24px',
              padding: '40px 24px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '24px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF5EF 100%)'
            }}>

              <span className="badge badge-approved" style={{ backgroundColor: 'var(--accent-gold)', color: '#FFFFFF', marginBottom: '12px', fontSize: '0.9rem', padding: '6px 18px' }}>
                PREVENTA ABIERTA • CONGRESO ANUAL 2026
              </span>

              <h1 style={{ fontSize: '2.5rem', marginTop: '8px', color: 'var(--accent-coffee)', fontFamily: 'var(--font-heading)' }}>
                CONGRESO ANUAL DE MUJERES AUTÉNTICAS 2026
              </h1>

              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontStyle: 'italic', maxWidth: '780px', margin: '10px auto 0' }}>
                "Deja de esconder tus cicatrices. Ha llegado el momento de descubrir la belleza que Dios ha escrito en ellas."
              </p>
            </div>

            {/* Interactive Venue Map */}
            <VenueMap 
              zones={zones} 
              occupiedSeats={occupiedSeats} 
              onSelectZone={handleSelectZone} 
              onRefresh={fetchZones}
              highlightedZone={highlightedZone}
            />

            {/* Zone Modal Popup (if needed) */}
            {selectedZone && currentView === 'home' && (
              <ZoneModal 
                zone={selectedZone} 
                initialQuantity={attendeeQuantity}
                onClose={() => setSelectedZone(null)}
                onContinue={handleModalContinue}
              />
            )}
          </div>
        )}

        {/* VIEW 2: ATTENDEE FORM & COMPROBANTE UPLOAD */}
        {currentView === 'attendees' && selectedZone && (
          <div className="container">
            <AttendeeForm 
              zone={selectedZone}
              quantity={attendeeQuantity}
              chosenSeatCodes={chosenSeatCodes}
              sessionId={seatSessionId}
              expiresAt={holdExpiresAt}
              onBack={() => {
                setSelectedZone(null);
                setAttendeeQuantity(1);
                setChosenSeatCodes([]);
                setSeatSessionId('');
                setHoldExpiresAt(null);
                fetchZones();
                window.history.pushState({}, '', '/autenticas');
                setCurrentView('home');
              }}
              onSuccess={handleReservationSuccess}
            />
          </div>
        )}

        {/* VIEW 3: SUCCESS & QR CODE GENERATOR */}
        {currentView === 'success' && activeReservation && (
          <div className="container">
            <TicketSuccess 
              reservation={activeReservation}
              onReset={() => {
                window.history.pushState({}, '', '/autenticas');
                setCurrentView('home');
              }}
            />
          </div>
        )}

        {/* VIEW 4: PUBLIC PERSISTENT TICKET VIEW (/ticket/:id) */}
        {currentView === 'ticket-view' && ticketQrHash && (
          <TicketView 
            qrHash={ticketQrHash}
            onGoHome={() => {
              window.history.pushState({}, '', '/');
              setCurrentView('landing');
            }}
          />
        )}

        {/* VIEW 5: ADMIN DASHBOARD */}
        {(currentView === 'admin' || currentView === 'admin-login') && (
          <AdminDashboard 
            adminUser={adminUser}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            homepageConfig={homepageConfig}
            sections={landingSections}
            onSaveSections={fetchLandingSections}
            onSaveConfig={(updated) => {
              if (updated) {
                setHomepageConfig(prev => ({ ...prev, ...updated }));
              } else {
                fetchConfig();
              }
            }}
          />
        )}

        {/* VIEW 6: DOOR SCANNER */}
        {currentView === 'scanner' && (
          <DoorScanner adminUser={adminUser} />
        )}

        {/* VIEW 7: UNDER CONSTRUCTION */}
        {currentView === 'under-construction' && (
          landingSections.length > 0 ? (
            <ChurchLanding 
              config={homepageConfig} 
              sections={landingSections}
              onGoToTickets={() => {
                window.history.pushState({}, '', '/autenticas');
                setCurrentView('autenticas-promo');
                fetchLandingSections('/autenticas');
              }}
            />
          ) : (
            <UnderConstruction 
              pageName={constructionPage} 
              config={homepageConfig}
              onGoHome={() => {
                window.history.pushState({}, '', '/');
                setCurrentView('landing');
                fetchLandingSections('/');
              }} 
            />
          )
        )}
          </>
        )}

      </main>

      {/* Footer */}
      {!['landing', 'under-construction', 'scanner'].includes(currentView) && (
        <footer style={{
          backgroundColor: 'var(--bg-dark)',
          color: '#FAF8F5',
          textAlign: 'center',
          padding: '24px 20px',
          fontSize: '0.88rem',
          marginTop: 'auto'
        }}>
          <div className="container">
            <p style={{ margin: 0 }}>© 2026 Conferencia de Mujeres Auténticas</p>
          </div>
        </footer>
      )}
    </div>
  );
}
