import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { Users, Coffee, Car, MapPin } from 'lucide-react';

export default function AcercaDeLaVision({ 
  currentView, 
  setCurrentView, 
  homepageConfig, 
  adminUser, 
  handleLogout, 
  handleGoHome 
}) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const team = [
    { name: "Pastor Edo Vargas", role: "Pastor General de la iglesia desde 2018.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600" },
    { name: "Pastora Andre Carballo", role: "Pastora general de la iglesia desde 2018.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600" },
    { name: "Apóstol Raúl Vargas", role: "Pastor Fundador, desde 1975.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600" },
    { name: "Pastora Dinorah Beita", role: "Pastora Fundadora desde 1975.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600" }
  ];

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', paddingBottom: '80px', fontFamily: 'Inter, sans-serif' }}>
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        navbarConfig={homepageConfig} 
        adminUser={adminUser} 
        onLogout={handleLogout} 
        onGoHome={handleGoHome} 
      />

      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '120px 20px', 
        backgroundColor: 'var(--accent-coffee)', 
        color: '#FFFFFF',
        textAlign: 'center',
        backgroundImage: 'linear-gradient(rgba(3,8,18,0.7), rgba(3,8,18,0.7)), url("https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px' }}>¿Eres nuevo en Visión Jesús?</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto' }}>
          ¡Hola! ¡Qué lindo tenerte en casa! Queremos que te sientas a gusto y puedas conocer a Jesús con nosotros.
        </p>
      </section>

      <div className="container" style={{ marginTop: '60px' }}>
        
        {/* Intro Section */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '80px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-coffee)', marginBottom: '20px', fontWeight: 900 }}>Bienvenidos a Visión Jesús</h2>
            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.8, marginBottom: '16px' }}>
              Reunirnos y adorar a Dios es un regalo. Visión Jesús fue fundada en 1975, hemos sido testigos de grandes momentos y vidas transformadas por medio del amor de Jesús.
            </p>
            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.8 }}>
              Y nos gustaría poder ser parte de tu historia. Estamos para servirte y atenderte, ¡Bienvenidos!
            </p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000" alt="Bienvenidos" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </div>
        </section>

        {/* Espacio para ti */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-coffee)', marginBottom: '40px', textAlign: 'center', fontWeight: 900 }}>Visión Jesús es un espacio para ti:</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            
            <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <Users size={32} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--accent-coffee)' }}>Visión Kids</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>Hay servicios apropiados según la edad disponibles para niños desde 1 a 12 años.</p>
            </div>

            <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <Car size={32} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--accent-coffee)' }}>Parqueo</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>Nuestro equipo de estacionamiento te ayudará a encontrar un espacio.</p>
            </div>

            <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <Coffee size={32} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--accent-coffee)' }}>Cafetería</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>Café preparado de cortesía disponible en el lobby.</p>
            </div>

            <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <Users size={32} color="var(--accent-gold)" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--accent-coffee)' }}>Grupos Conexión</h3>
              <p style={{ color: '#666', lineHeight: 1.6 }}>Hay grupos para todas las edades e intereses. Encontrarás un espacio seguro, lleno de propósito y amistad.</p>
            </div>

          </div>
        </section>

        {/* Sedes */}
        <section style={{ backgroundColor: 'var(--accent-coffee)', color: '#FFF', padding: '60px', borderRadius: '24px', marginBottom: '80px', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 900 }}>Tenemos dos sedes:</h2>
            <h3 style={{ fontSize: '2rem', color: 'var(--accent-gold)', marginBottom: '20px' }}>Desamparados y Cartago</h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6 }}>
              Cada una te ofrece una comunidad llena de amor. Y un lugar donde puedes conectar y sentirte en casa.
            </p>
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
             <img src="https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1000" alt="Sedes" style={{ width: '100%', borderRadius: '16px' }} />
          </div>
        </section>

        {/* Horarios */}
        <section style={{ marginBottom: '80px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-coffee)', marginBottom: '10px', fontWeight: 900 }}>Únete a nosotros</h2>
          <h3 style={{ fontSize: '2rem', marginBottom: '40px', color: '#555' }}>Estamos listos para recibirte</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', textAlign: 'left' }}>
            
            <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '16px', border: '1px solid #EEE' }}>
              <h4 style={{ fontSize: '1.3rem', color: 'var(--accent-coffee)', marginBottom: '16px' }}>Miércoles:</h4>
              <p style={{ fontWeight: 700, marginBottom: '8px' }}>Noches con el Espíritu Santo</p>
              <p style={{ color: '#666' }}>Desamparados - 7:00 p.m.</p>
            </div>

            <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '16px', border: '1px solid #EEE' }}>
              <h4 style={{ fontSize: '1.3rem', color: 'var(--accent-coffee)', marginBottom: '16px' }}>Viernes:</h4>
              <p style={{ fontWeight: 700, marginBottom: '8px' }}>Mix Pre juveniles</p>
              <p style={{ color: '#666' }}>Desamparados - 6:30 p.m.</p>
            </div>

            <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '16px', border: '1px solid #EEE' }}>
              <h4 style={{ fontSize: '1.3rem', color: 'var(--accent-coffee)', marginBottom: '16px' }}>Sábados:</h4>
              <p style={{ fontWeight: 700, marginBottom: '8px' }}>Servicio Regular</p>
              <p style={{ color: '#666' }}>Desamparados - 5:30 p.m.</p>
            </div>

            <div style={{ backgroundColor: '#FFF', padding: '30px', borderRadius: '16px', border: '1px solid #EEE' }}>
              <h4 style={{ fontSize: '1.3rem', color: 'var(--accent-coffee)', marginBottom: '16px' }}>Domingos:</h4>
              <p style={{ fontWeight: 700, marginBottom: '8px' }}>Servicio Regular</p>
              <p style={{ color: '#666' }}>Desamparados - 9:00 a.m. / 11:00 a.m.</p>
            </div>

          </div>
        </section>

        {/* Pastores */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-coffee)', marginBottom: '10px', textAlign: 'center', fontWeight: 900 }}>Nuestros pastores</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px', fontSize: '1.1rem' }}>Conocé a nuestros pastores</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
            {team.map((person, idx) => (
              <div key={idx} style={{ backgroundColor: '#FFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                <img src={person.img} alt={person.name} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--accent-coffee)', marginBottom: '8px' }}>{person.name}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.5 }}>{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
