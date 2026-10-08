import React, { useState } from 'react';
import { Heart, Copy, Check, ShieldCheck, CreditCard, Smartphone, Building2, Sparkles, Quote, Calendar } from 'lucide-react';

export default function DonacionesPage({ config = {}, onGoHome }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const bankDetails = {
    sinpePhone: config.sinpe_phone || '6453-1212',
    sinpeHolder: config.sinpe_holder || 'Iglesia Visión Jesús',
    bnColones: config.iban_bn_crc || 'CR05015100010012345678',
    bnDolares: config.iban_bn_usd || 'CR05015100010098765432',
    bacColones: config.iban_bac_crc || 'CR92010200009012345678',
    bacDolares: config.iban_bac_usd || 'CR92010200009098765432',
    holderName: config.bank_holder_name || 'Asociación Centro de Fe Visión Jesús',
    cedulaJuridica: config.cedula_juridica || '3-002-123456'
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  return (
    <div style={{
      backgroundColor: '#030812',
      color: '#FFFFFF',
      minHeight: '100vh',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      overflowX: 'hidden'
    }}>

      {/* APPLE FROSTED NAVBAR */}
      <div className="apple-nav-wrapper">
        <header className="apple-nav-bar">
          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => window.location.href = '/'}
          >
            <img src="/logo_oficial_transparente.png" alt="Visión Jesús Logo" style={{ height: '46px', objectFit: 'contain' }} />
          </div>

          <nav className="apple-nav-links">
            <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="apple-nav-link">Inicio</a>
            <a href="/nosotros" onClick={(e) => { e.preventDefault(); window.location.href = '/nosotros'; }} className="apple-nav-link">Nosotros</a>
            <a href="/modelo" onClick={(e) => { e.preventDefault(); window.location.href = '/modelo'; }} className="apple-nav-link">Modelo de Jesús</a>
            <a href="/grupos-de-amistad" onClick={(e) => { e.preventDefault(); window.location.href = '/grupos-de-amistad'; }} className="apple-nav-link">Grupos de Amistad</a>
            <a href="/eventos" onClick={(e) => { e.preventDefault(); window.location.href = '/eventos'; }} className="apple-nav-link">Eventos</a>
            <a href="/oracion" onClick={(e) => { e.preventDefault(); window.location.href = '/oracion'; }} className="apple-nav-link">Oración</a>
            <a href="/donar" onClick={(e) => { e.preventDefault(); }} className="apple-nav-link" style={{ color: '#FFFFFF' }}>Donar</a>
          </nav>

          <button 
            onClick={() => window.location.href = '/eventos'}
            className="apple-btn apple-btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <Calendar size={14} />
            <span>Eventos</span>
          </button>
        </header>
      </div>

      {/* HERO SECTION */}
      <div style={{
        position: 'relative',
        padding: '120px 20px 60px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 20%, rgba(151, 125, 255, 0.22) 0%, rgba(3, 8, 18, 1) 75%)'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(151, 125, 255, 0.12)',
            border: '1px solid rgba(151, 125, 255, 0.3)',
            color: '#977DFF',
            padding: '6px 20px',
            borderRadius: '50px',
            fontSize: '0.82rem',
            fontWeight: 800,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>
            <Heart size={15} /> GENEROSIDAD & MAYORDOMÍA
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-1px',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Donaciones & Ofrendas
          </h1>

          <p style={{
            color: '#94A3B8',
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 36px'
          }}>
            Cada semilla sembrada impulsa el Reino de Dios, restaura vidas y extiende el mensaje de Jesucristo en nuestra nación.
          </p>

          {/* BIBLE VERSE CARD */}
          <div style={{
            background: 'rgba(0, 3, 61, 0.55)',
            border: '1px solid rgba(151, 125, 255, 0.25)',
            borderRadius: '24px',
            padding: '32px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            textAlign: 'left',
            maxWidth: '780px',
            margin: '0 auto'
          }}>
            <Quote size={40} style={{ position: 'absolute', top: '24px', right: '28px', opacity: 0.15, color: '#977DFF' }} />
            
            <p style={{
              fontSize: '1.15rem',
              fontStyle: 'italic',
              lineHeight: 1.7,
              color: '#FFFFFF',
              marginBottom: '14px',
              fontWeight: 500
            }}>
              «Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre.»
            </p>
            
            <span style={{ color: '#977DFF', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '1px' }}>
              2 CORINTIOS 9:7
            </span>
          </div>

        </div>
      </div>

      {/* DONATION METHODS GRID */}
      <div style={{ padding: '0 20px 100px', maxWidth: '1100px', margin: '0 auto' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>

          {/* METHOD 1: SINPE MÓVIL */}
          <div style={{
            background: 'rgba(0, 3, 61, 0.45)',
            border: '1px solid rgba(151, 125, 255, 0.25)',
            borderRadius: '28px',
            padding: '32px',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '18px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Smartphone size={28} />
              </div>

              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '1px' }}>
                MÉTODO RÁPIDO Y DIRECTO
              </span>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: '6px 0 12px' }}>
                SINPE Móvil
              </h3>

              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Envía tus ofrendas y diezmos directamente mediante SINPE Móvil desde cualquier aplicación bancaria nacional.
              </p>

              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '18px',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Número de SINPE Móvil:</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '1px' }}>
                  {bankDetails.sinpePhone}
                </span>
                <span style={{ fontSize: '0.84rem', color: '#977DFF', display: 'block', marginTop: '4px', fontWeight: 600 }}>
                  Titular: {bankDetails.sinpeHolder}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleCopy(bankDetails.sinpePhone.replace(/[^0-9]/g, ''), 'sinpe')}
              style={{
                width: '100%',
                background: copiedKey === 'sinpe' ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)',
                border: copiedKey === 'sinpe' ? '1px solid #10B981' : 'none',
                color: '#FFFFFF',
                borderRadius: '50px',
                padding: '14px',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(0, 51, 255, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {copiedKey === 'sinpe' ? <Check size={18} style={{ color: '#10B981' }} /> : <Copy size={18} />}
              <span>{copiedKey === 'sinpe' ? '¡Número Copiado!' : 'Copiar Número SINPE'}</span>
            </button>
          </div>

          {/* METHOD 2: CUENTAS BANCARIAS IBAN */}
          <div style={{
            background: 'rgba(0, 3, 61, 0.45)',
            border: '1px solid rgba(151, 125, 255, 0.25)',
            borderRadius: '28px',
            padding: '32px',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '18px',
                background: 'rgba(0, 51, 255, 0.15)',
                border: '1px solid rgba(0, 51, 255, 0.35)',
                color: '#977DFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Building2 size={28} />
              </div>

              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#977DFF', textTransform: 'uppercase', letterSpacing: '1px' }}>
                TRANSFERENCIAS NATIVAS IBAN
              </span>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: '6px 0 12px' }}>
                Cuentas Bancarias
              </h3>

              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Cuentas oficiales a nombre de <strong>{bankDetails.holderName}</strong> (Cédula Jurídica: {bankDetails.cedulaJuridica}).
              </p>

              {/* BNCR Accounts */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFFFFF' }}>Banco Nacional (BNCR)</span>
                  <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 700 }}>Colones & Dólares</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', wordBreak: 'break-all' }}>CRC: {bankDetails.bnColones}</span>
                  <button onClick={() => handleCopy(bankDetails.bnColones, 'bnCrc')} style={{ background: 'none', border: 'none', color: '#977DFF', cursor: 'pointer', padding: '4px' }}>
                    {copiedKey === 'bnCrc' ? <Check size={16} style={{ color: '#10B981' }} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* BAC Credomatic Accounts */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFFFFF' }}>BAC Credomatic</span>
                  <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 700 }}>Colones & Dólares</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', wordBreak: 'break-all' }}>CRC: {bankDetails.bacColones}</span>
                  <button onClick={() => handleCopy(bankDetails.bacColones, 'bacCrc')} style={{ background: 'none', border: 'none', color: '#977DFF', cursor: 'pointer', padding: '4px' }}>
                    {copiedKey === 'bacCrc' ? <Check size={16} style={{ color: '#10B981' }} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* SECURITY FOOTER BADGE */}
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          backgroundColor: 'rgba(0, 3, 61, 0.3)',
          border: '1px solid rgba(151, 125, 255, 0.15)',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <ShieldCheck size={24} style={{ color: '#10B981' }} />
          <span style={{ color: '#94A3B8', fontSize: '0.92rem' }}>
            Todas las contribuciones financieras son administradas bajo estricta transparencia y auditoría legal por la junta directiva de <strong>{bankDetails.holderName}</strong>.
          </span>
        </div>

      </div>

    </div>
  );
}
