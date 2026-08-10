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

const API_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [zones, setZones] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [homepageConfig, setHomepageConfig] = useState({});
  
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
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchZones();
    fetchConfig();

    const path = window.location.pathname;
    if (path.startsWith('/ticket/')) {
      const hash = path.replace('/ticket/', '');
      if (hash) {
        setTicketQrHash(hash);
        setCurrentView('ticket-view');
      }
    } else if (path === '/admin' || path === '/portal-admin') {
      setCurrentView('admin');
    } else if (path === '/escanear') {
      setCurrentView('scanner');
    } else if (path === '/autenticas') {
      setCurrentView('home');
    } else {
      setCurrentView('landing');
    }
  }, []);

  const handleAdminLogin = (user) => {
    setAdminUser(user);
    localStorage.setItem('admin_user', JSON.stringify(user));
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('admin_user');
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
    setCurrentView('home');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        adminUser={adminUser}
        onLogout={handleAdminLogout}
        onGoHome={() => {
          setSelectedZone(null);
          setAttendeeQuantity(1);
          setChosenSeatCodes([]);
          window.history.pushState({}, '', '/');
          setCurrentView('landing');
        }}
      />

      <main style={{ flex: 1, paddingBottom: currentView === 'landing' ? '0px' : '60px' }}>
        
        {/* VIEW 0: CHURCH LANDING PAGE */}
        {currentView === 'landing' && (
          <ChurchLanding 
            config={homepageConfig} 
            onGoToTickets={handleGoToTickets}
          />
        )}

        {/* VIEW 1: HOME (Hero with Official Large Annual Logo + SVG Croquis Map) */}
        {currentView === 'home' && (
          <div className="container" style={{ paddingTop: '20px' }}>
            
            {/* Event Hero Banner with Official Large Annual Logo */}
            <div style={{
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
            onSaveConfig={(updated) => {
              setHomepageConfig(updated);
            }}
          />
        )}

        {/* VIEW 6: DOOR SCANNER */}
        {currentView === 'scanner' && (
          <DoorScanner adminUser={adminUser} />
        )}

      </main>

      {/* Footer */}
      {currentView !== 'landing' && (
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
