import React, { useState } from 'react';
import { Heart, Copy, Check, ShieldCheck, CreditCard, Smartphone, Building2, Sparkles, Quote, Calendar } from 'lucide-react';

export default function DonacionesPage({ config = {}, onGoHome }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const bankDetails = {
    sinpePhone: config.sinpe_phone || '60121225',
    sinpeDisplay: config.sinpe_display || '6012-1225',
    sinpeHolder: config.sinpe_holder || 'Iglesia Visión Jesús',
    bncrCrc: config.iban_bncr_crc || '',
    bncrUsd: config.iban_bncr_usd || '',
    bacCrc: config.iban_bac_crc || '',
    bacUsd: config.iban_bac_usd || '',
    holderName: config.sinpe_holder || 'Iglesia Visión Jesús'
  };

  const handleCopy = (text, key) => {
    if (!text) return;
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
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Número de SINPE Móvil Oficial:</span>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '2px' }}>
                  {bankDetails.sinpeDisplay}
                </span>
                <span style={{ fontSize: '0.88rem', color: '#977DFF', display: 'block', marginTop: '6px', fontWeight: 700 }}>
                  Titular: {bankDetails.sinpeHolder}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleCopy(bankDetails.sinpePhone, 'sinpe')}
              style={{
                width: '100%',
                background: copiedKey === 'sinpe' ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)',
                border: copiedKey === 'sinpe' ? '1px solid #10B981' : 'none',
                color: '#FFFFFF',
                borderRadius: '50px',
                padding: '16px',
                fontWeight: 800,
                fontSize: '0.98rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(0, 51, 255, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              {copiedKey === 'sinpe' ? <Check size={20} style={{ color: '#10B981' }} /> : <Copy size={20} />}
              <span>{copiedKey === 'sinpe' ? '¡Número Copiado!' : `Copiar Número SINPE (${bankDetails.sinpeDisplay})`}</span>
            </button>
          </div>

          {/* METHOD 2: PRÓXIMAMENTE TRANSFERENCIAS IBAN */}
          <div style={{
            background: 'rgba(0, 3, 61, 0.35)',
            border: '1px dashed rgba(151, 125, 255, 0.3)',
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
                background: 'rgba(151, 125, 255, 0.12)',
                border: '1px solid rgba(151, 125, 255, 0.3)',
                color: '#977DFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Building2 size={28} />
              </div>

              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#977DFF', textTransform: 'uppercase', letterSpacing: '1px' }}>
                TRANSFERENCIAS BANCARIAS
              </span>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', margin: '6px 0 12px' }}>
                Cuentas IBAN
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {bankDetails.bncrCrc && (
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#60A5FA' }}>Banco Nacional (BNCR) • Colones</span>
                      <button onClick={() => handleCopy(bankDetails.bncrCrc, 'bncr_crc')} style={{ background: 'none', border: 'none', color: copiedKey === 'bncr_crc' ? '#10B981' : '#977DFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>
                        {copiedKey === 'bncr_crc' ? '✓ Copiado' : 'Copiar IBAN'}
                      </button>
                    </div>
                    <code style={{ display: 'block', fontSize: '0.85rem', color: '#FFF', marginTop: '4px', wordBreak: 'break-all' }}>{bankDetails.bncrCrc}</code>
                  </div>
                )}

                {bankDetails.bncrUsd && (
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#60A5FA' }}>Banco Nacional (BNCR) • Dólares ($)</span>
                      <button onClick={() => handleCopy(bankDetails.bncrUsd, 'bncr_usd')} style={{ background: 'none', border: 'none', color: copiedKey === 'bncr_usd' ? '#10B981' : '#977DFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>
                        {copiedKey === 'bncr_usd' ? '✓ Copiado' : 'Copiar IBAN'}
                      </button>
                    </div>
                    <code style={{ display: 'block', fontSize: '0.85rem', color: '#FFF', marginTop: '4px', wordBreak: 'break-all' }}>{bankDetails.bncrUsd}</code>
                  </div>
                )}

                {bankDetails.bacCrc && (
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EF4444' }}>BAC Credomatic • Colones</span>
                      <button onClick={() => handleCopy(bankDetails.bacCrc, 'bac_crc')} style={{ background: 'none', border: 'none', color: copiedKey === 'bac_crc' ? '#10B981' : '#977DFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>
                        {copiedKey === 'bac_crc' ? '✓ Copiado' : 'Copiar IBAN'}
                      </button>
                    </div>
                    <code style={{ display: 'block', fontSize: '0.85rem', color: '#FFF', marginTop: '4px', wordBreak: 'break-all' }}>{bankDetails.bacCrc}</code>
                  </div>
                )}

                {bankDetails.bacUsd && (
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EF4444' }}>BAC Credomatic • Dólares ($)</span>
                      <button onClick={() => handleCopy(bankDetails.bacUsd, 'bac_usd')} style={{ background: 'none', border: 'none', color: copiedKey === 'bac_usd' ? '#10B981' : '#977DFF', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>
                        {copiedKey === 'bac_usd' ? '✓ Copiado' : 'Copiar IBAN'}
                      </button>
                    </div>
                    <code style={{ display: 'block', fontSize: '0.85rem', color: '#FFF', marginTop: '4px', wordBreak: 'break-all' }}>{bankDetails.bacUsd}</code>
                  </div>
                )}

                {!bankDetails.bncrCrc && !bankDetails.bncrUsd && !bankDetails.bacCrc && !bankDetails.bacUsd && (
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.88rem', color: '#EAEDF8', fontWeight: 600, display: 'block', lineHeight: 1.6 }}>
                      ℹ️ Por el momento, todas las ofrendas y diezmos se reciben mediante <strong>SINPE Móvil al {bankDetails.sinpeDisplay}</strong>.
                    </span>
                  </div>
                )}
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
