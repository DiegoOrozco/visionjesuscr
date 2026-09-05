import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, FileText, Image as ImageIcon, Heart, Send, User, UserCheck, UploadCloud, Ticket, Clock, CreditCard, Landmark } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function AttendeeForm({ zone, quantity, chosenSeatCodes = [], sessionId = '', expiresAt = null, onBack, onSuccess }) {
  // Purchaser info
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [purchaserPhone, setPurchaserPhone] = useState('');

  // Payment Method: 'paypal' or 'sinpe'
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [paypalConfig, setPaypalConfig] = useState({ clientId: '', exchangeRate: 515 });
  const [paypalOrderMeta, setPaypalOrderMeta] = useState(null);

  // Track if user manually modified purchaser fields
  const [purchaserNameEdited, setPurchaserNameEdited] = useState(false);
  const [purchaserPhoneEdited, setPurchaserPhoneEdited] = useState(false);

  // 5-Minute Reservation Countdown Timer state
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (!expiresAt) return 300;
    const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
    return diff > 0 ? diff : 300;
  });
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    const fetchPaypalConfig = async () => {
      const viteClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/api/paypal/config`);
        const data = await res.json();
        const activeClientId = (data.success && data.clientId) ? data.clientId : viteClientId;
        if (activeClientId) {
          setPaypalConfig({
            clientId: activeClientId,
            exchangeRate: data.exchangeRate || 515
          });
        }
      } catch (e) {
        console.error('Error cargando configuración de PayPal desde API:', e);
        if (viteClientId) {
          setPaypalConfig(prev => ({ ...prev, clientId: viteClientId }));
        }
      }
    };
    fetchPaypalConfig();
  }, []);


  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
      if (diff <= 0) {
        setRemainingSeconds(0);
        setTimerExpired(true);
        clearInterval(interval);
      } else {
        setRemainingSeconds(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleReleaseSeats = async () => {
    if (sessionId) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        await fetch(`${API_URL}/api/seats/release`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId })
        });
      } catch (e) {
        console.error('Error releasing seats:', e);
      }
    }
  };

  const handleBackWithRelease = async () => {
    await handleReleaseSeats();
    onBack();
  };

  // Attendees array initialized with complete fields from Google Form
  const [attendees, setAttendees] = useState(() => {
    return Array.from({ length: quantity }, (_, i) => ({
      full_name: '',
      age: '',
      phone: '',
      residence: '',
      civil_status: '',
      is_vision_jesus: 'Sí',
      church_network: 'Red FuXión',
      invited_by: '',
      attended_encounter: 'No',
      assigned_ticket_code: chosenSeatCodes && chosenSeatCodes[i] ? chosenSeatCodes[i] : ''
    }));
  });

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const formatCRC = (val) => `₡${Number(val).toLocaleString('es-CR')}`;
  const baseCrcAmount = quantity * zone.price;
  const totalPrice = formatCRC(baseCrcAmount);

  // PayPal 13% Service Fee calculation
  const paypalFeeCrcAmount = Math.round(baseCrcAmount * 0.13);
  const paypalTotalCrcAmount = baseCrcAmount + paypalFeeCrcAmount;
  const paypalFeePrice = formatCRC(paypalFeeCrcAmount);
  const paypalTotalPrice = formatCRC(paypalTotalCrcAmount);
  const paypalTotalUsdAmount = (paypalTotalCrcAmount / (paypalConfig.exchangeRate || 515)).toFixed(2);


  const handleAttendeeChange = (index, field, value) => {
    const updated = [...attendees];
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 8);
    }
    updated[index][field] = value;
    setAttendees(updated);

    // Sync full name & phone of attendee #1 to purchaser if purchaser hasn't been manually edited
    if (index === 0 && field === 'full_name' && !purchaserNameEdited) {
      setPurchaserName(value);
    }
    if (index === 0 && field === 'phone' && !purchaserPhoneEdited) {
      setPurchaserPhone(value);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      if (selected.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selected));
      } else {
        setFilePreview(null);
      }
    }
  };

  const validateAttendeeForm = () => {
    const phoneRegex = /^[0-9]{8}$/;
    if (!purchaserName.trim() || !purchaserEmail.trim() || !purchaserPhone.trim()) {
      setErrorMsg('Por favor completa los datos de la persona responsable del pago.');
      return false;
    }
    if (!phoneRegex.test(purchaserPhone.trim())) {
      setErrorMsg('El número de teléfono del responsable del pago debe contener exactamente 8 dígitos numéricos.');
      return false;
    }

    for (let i = 0; i < attendees.length; i++) {
      const att = attendees[i];
      if (!att.full_name.trim() || !att.phone.trim() || !att.age || !att.residence.trim()) {
        setErrorMsg(`Por favor completa todos los campos obligatorios de la Persona #${i + 1} (Nombre, Edad, Teléfono y ¿Dónde vive?).`);
        return false;
      }
      if (!phoneRegex.test(att.phone.trim())) {
        setErrorMsg(`El número de teléfono de la Persona #${i + 1} debe contener exactamente 8 dígitos numéricos.`);
        return false;
      }
      if (parseInt(att.age, 10) <= 0) {
        setErrorMsg(`Por favor ingresa una edad válida y positiva para la Persona #${i + 1}.`);
        return false;
      }
    }
    return true;
  };

  const handlePayPalCreateOrder = async () => {
    setErrorMsg('');
    if (!validateAttendeeForm()) {
      throw new Error(errorMsg || 'Por favor completa todos los datos obligatorios del formulario.');
    }

    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/paypal/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zone_id: zone.id,
          purchaser_name: purchaserName,
          purchaser_email: purchaserEmail,
          purchaser_phone: purchaserPhone,
          attendees,
          session_id: sessionId
        })
      });

      const data = await res.json();
      if (!data.success || !data.orderId) {
        setErrorMsg(data.message || 'Error al generar la orden en PayPal.');
        setLoading(false);
        throw new Error(data.message || 'Error al generar orden en PayPal.');
      }

      setPaypalOrderMeta(data);
      setLoading(false);
      return data.orderId;
    } catch (err) {
      setLoading(false);
      console.error('Error creando orden en PayPal:', err);
      throw err;
    }
  };

  const handlePayPalApprove = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/paypal/capture-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.orderID,
          reservationId: paypalOrderMeta?.reservationId
        })
      });

      const captureRes = await res.json();
      if (captureRes.success) {
        onSuccess(captureRes.reservation);
      } else {
        setErrorMsg(captureRes.message || 'Ocurrió un problema al procesar el pago con PayPal.');
      }
    } catch (err) {
      console.error('Error al capturar orden PayPal:', err);
      setErrorMsg('Error de comunicación con el servidor al confirmar el pago de PayPal.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (paymentMethod === 'paypal') {
      // Handled by PayPal Buttons
      return;
    }

    if (!validateAttendeeForm()) return;

    if (!file) {
      setErrorMsg('Es necesario adjuntar la foto o PDF del comprobante de pago para procesar la reserva por SINPE Móvil.');
      return;
    }

    setLoading(true);


    try {
      const formData = new FormData();
      formData.append('zone_id', zone.id);
      formData.append('purchaser_name', purchaserName);
      formData.append('purchaser_email', purchaserEmail);
      formData.append('purchaser_phone', purchaserPhone);
      formData.append('attendees', JSON.stringify(attendees));
      formData.append('comprobante', file);
      if (sessionId) {
        formData.append('session_id', sessionId);
      }

      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/reservations`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(data.reservation);
      } else {
        setErrorMsg(data.message || 'Ocurrió un error al procesar la reserva.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMsg('Error de conexión con el servidor. Revisa tu internet e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 0' }}>
      
      {/* TIMER EXPIRED OVERLAY MODAL */}
      {timerExpired && (
        <div className="modal-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 9999 }}>
          <div className="modal-card" style={{ maxWidth: '480px', textAlign: 'center', padding: '32px', borderRadius: '24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Clock size={36} />
            </div>

            <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-coffee)', marginBottom: '12px' }}>
              ¡Tiempo de Reserva Expirado!
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
              El tiempo límite de 5 minutos para completar la reserva ha finalizado. Los asientos seleccionados han sido liberados automáticamente para que otros usuarios puedan disponer de ellos.
            </p>

            <button
              onClick={handleBackWithRelease}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 800 }}
            >
              Volver a Seleccionar Asientos
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={handleBackWithRelease}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'transparent',
          color: 'var(--accent-coffee)',
          fontWeight: 600,
          marginBottom: '16px',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={18} /> Volver a la selección de zona
      </button>

      {/* 5-MINUTE COUNTDOWN BANNER */}
      <div style={{
        backgroundColor: remainingSeconds <= 60 ? '#FEE2E2' : '#FEF3C7',
        color: remainingSeconds <= 60 ? '#991B1B' : '#92400E',
        border: `2px solid ${remainingSeconds <= 60 ? '#F87171' : '#F59E0B'}`,
        borderRadius: '16px',
        padding: '14px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 700,
        fontSize: '0.92rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.3s ease',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={22} />
          <div>
            {remainingSeconds <= 60 ? (
              <span>¡Queda menos de 1 minuto! Completa los datos antes de que se liberen los asientos.</span>
            ) : (
              <span>Tus asientos están apartados a tu nombre. Completa los datos para finalizar.</span>
            )}
          </div>
        </div>
        <div style={{
          backgroundColor: remainingSeconds <= 60 ? '#DC2626' : 'var(--accent-coffee)',
          color: '#FFFFFF',
          padding: '6px 14px',
          borderRadius: '20px',
          fontFamily: 'monospace',
          fontSize: '1.25rem',
          fontWeight: 900,
          letterSpacing: '1px'
        }}>
          {formatTime(remainingSeconds)}
        </div>
      </div>

      <div className="card-glass" style={{ borderRadius: '24px' }}>
        
        {/* Banner Header with Official Event Logo */}
        <div style={{
          backgroundColor: '#FFF8F2',
          border: '1px solid var(--accent-beige-border)',
          borderRadius: '18px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>

          <h2 style={{ fontSize: '1.9rem', marginTop: '4px', color: 'var(--accent-coffee)', fontFamily: 'var(--font-heading)' }}>
            CONGRESO ANUAL DE MUJERES AUTÉNTICAS 2026
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic', marginTop: '6px' }}>
            "Deja de esconder tus cicatrices. Ha llegado el momento de descubrir la belleza que Dios ha escrito en ellas."
          </p>
          <div style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--accent-coffee)', fontWeight: 700 }}>
            Reservando {quantity} {quantity === 1 ? 'entrada' : 'entradas'} en {zone.name} — Total: {totalPrice}
          </div>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: 'var(--color-red-light)',
            color: 'var(--color-red)',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: 500,
            fontSize: '0.92rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* SECTION 1: ATTENDEE CARDS */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-coffee)' }}>
              <UserCheck size={22} color="var(--accent-coffee)" />
              Información de cada Asistente ({quantity})
            </h3>

            {attendees.map((att, index) => {
              const rawSeatBadge = att.assigned_ticket_code || (chosenSeatCodes && chosenSeatCodes[index]);
              const seatBadge = rawSeatBadge && rawSeatBadge.includes(' - ') && !rawSeatBadge.startsWith('Fila') && !rawSeatBadge.startsWith('Asiento') ? rawSeatBadge.split(' - ').slice(1).join(' - ') : rawSeatBadge;

              return (
                <div key={index} style={{
                  backgroundColor: '#FAF8F5',
                  border: '2px solid var(--accent-beige-border)',
                  borderRadius: '20px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--accent-beige-border)', paddingBottom: '10px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--accent-coffee)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={18} /> Persona #{index + 1}
                    </div>

                    {seatBadge && (
                      <span className="badge" style={{ backgroundColor: 'var(--accent-coffee)', color: '#FFF', fontSize: '0.85rem' }}>
                        <Ticket size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        {seatBadge}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    
                    {/* 1. Nombre Completo */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                        Nombre Completo *
                      </label>
                      <input 
                        type="text" 
                        placeholder="Tu respuesta"
                        value={att.full_name}
                        onChange={(e) => handleAttendeeChange(index, 'full_name', e.target.value)}
                        required
                      />
                    </div>

                    {/* 2. Edad */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                        Edad *
                      </label>
                      <input 
                        type="number" 
                        min="1"
                        placeholder="Tu respuesta"
                        value={att.age}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          handleAttendeeChange(index, 'age', isNaN(val) ? '' : Math.max(1, val));
                        }}
                        required
                      />
                    </div>

                    {/* 3. Número de Teléfono */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                        Número de teléfono *
                      </label>
                      <input 
                        type="tel" 
                        placeholder="Tu respuesta (WhatsApp)"
                        value={att.phone}
                        onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)}
                        required
                      />
                    </div>

                    {/* 4. ¿Dónde vive? */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                        ¿Dónde vive? *
                      </label>
                      <input 
                        type="text" 
                        placeholder="Tu respuesta (ej. Heredia, San José, etc.)"
                        value={att.residence}
                        onChange={(e) => handleAttendeeChange(index, 'residence', e.target.value)}
                        required
                      />
                    </div>

                    {/* 6. ¿Te congregas en Visión Jesús? */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px' }}>
                        ¿Te congregas en Visión Jesús? *
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {['Sí', 'No'].map(ans => (
                          <label key={ans} style={{
                            flex: 1,
                            textAlign: 'center',
                            backgroundColor: att.is_vision_jesus === ans ? 'var(--accent-coffee)' : '#FFFFFF',
                            color: att.is_vision_jesus === ans ? '#FFFFFF' : 'var(--accent-coffee)',
                            border: '1px solid var(--accent-beige-border)',
                            padding: '10px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 700
                          }}>
                            <input 
                              type="radio"
                              name={`is_vision_${index}`}
                              value={ans}
                              checked={att.is_vision_jesus === ans}
                              onChange={(e) => handleAttendeeChange(index, 'is_vision_jesus', e.target.value)}
                              style={{ display: 'none' }}
                            />
                            {ans}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 7. ¿A cuál Red asistes? */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px' }}>
                        ¿A cuál Red asistes? *
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                        {['Red FuXión', 'Red Move', 'Red Diamante', 'Red de emprendedores', 'Ninguna'].map(net => (
                          <label key={net} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: att.church_network === net ? 'var(--accent-coffee)' : '#FFFFFF',
                            color: att.church_network === net ? '#FFFFFF' : 'var(--accent-coffee)',
                            border: '1px solid var(--accent-beige-border)',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.88rem',
                            fontWeight: 600
                          }}>
                            <input 
                              type="radio"
                              name={`network_${index}`}
                              value={net}
                              checked={att.church_network === net}
                              onChange={(e) => handleAttendeeChange(index, 'church_network', e.target.value)}
                              style={{ display: 'none' }}
                            />
                            <span>{att.church_network === net ? '●' : '○'} {net}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 8. ¿Quién te invitó? */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                        ¿Quién te invitó? *
                      </label>
                      <input 
                        type="text" 
                        placeholder="Tu respuesta"
                        value={att.invited_by}
                        onChange={(e) => handleAttendeeChange(index, 'invited_by', e.target.value)}
                        required
                      />
                    </div>

                    {/* 9. ¿Fuiste a Encuentro de mujeres en Visión Jesús? */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px' }}>
                        ¿Fuiste a Encuentro de mujeres en Visión Jesús? *
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {['Sí', 'No'].map(ans => (
                          <label key={ans} style={{
                            flex: 1,
                            textAlign: 'center',
                            backgroundColor: att.attended_encounter === ans ? 'var(--accent-coffee)' : '#FFFFFF',
                            color: att.attended_encounter === ans ? '#FFFFFF' : 'var(--accent-coffee)',
                            border: '1px solid var(--accent-beige-border)',
                            padding: '10px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 700
                          }}>
                            <input 
                              type="radio"
                              name={`encounter_${index}`}
                              value={ans}
                              checked={att.attended_encounter === ans}
                              onChange={(e) => handleAttendeeChange(index, 'attended_encounter', e.target.value)}
                              style={{ display: 'none' }}
                            />
                            {ans}
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* SECTION 2: PURCHASER CONTACT DETAILS */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={22} color="var(--accent-coffee)" />
              Datos de la Persona Responsable del Pago
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Nombre del Comprador *
                </label>
                <input 
                  type="text" 
                  placeholder="Tu nombre completo"
                  value={purchaserName}
                  onChange={(e) => {
                    setPurchaserName(e.target.value);
                    setPurchaserNameEdited(true);
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Correo Electrónico *
                </label>
                <input 
                  type="email" 
                  placeholder="ejemplo@correo.com"
                  value={purchaserEmail}
                  onChange={(e) => setPurchaserEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Teléfono WhatsApp *
                </label>
                <input 
                  type="tel" 
                  placeholder="Ej. +506 8888 9999"
                  value={purchaserPhone}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setPurchaserPhone(clean);
                    setPurchaserPhoneEdited(true);
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: MÉTODO DE PAGO */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-coffee)' }}>
              <CreditCard size={22} color="var(--accent-coffee)" />
              Selecciona tu Método de Pago *
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {/* PAYPAL OPTION */}
              <div 
                onClick={() => setPaymentMethod('paypal')}
                style={{
                  border: `2px solid ${paymentMethod === 'paypal' ? 'var(--accent-coffee)' : 'var(--accent-beige-border)'}`,
                  backgroundColor: paymentMethod === 'paypal' ? '#FFF8F2' : '#FFFFFF',
                  borderRadius: '16px',
                  padding: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <CreditCard size={24} color="var(--accent-coffee)" />
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--accent-coffee)' }}>
                    PayPal / Tarjeta
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  Paga con Tarjeta de Débito, Crédito o Cuenta PayPal. 
                  <strong style={{ display: 'block', color: 'var(--color-green)', marginTop: '4px' }}>Entradas QR y Aprobación Instantánea</strong>

                </p>
              </div>

              {/* SINPE OPTION */}
              <div 
                onClick={() => setPaymentMethod('sinpe')}
                style={{
                  border: `2px solid ${paymentMethod === 'sinpe' ? 'var(--accent-coffee)' : 'var(--accent-beige-border)'}`,
                  backgroundColor: paymentMethod === 'sinpe' ? '#FFF8F2' : '#FFFFFF',
                  borderRadius: '16px',
                  padding: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Landmark size={24} color="var(--accent-coffee)" />
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--accent-coffee)' }}>
                    SINPE Móvil
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  Transferencia en Colones al 60121225. 
                  <span style={{ display: 'block', marginTop: '4px' }}>Sube el comprobante para revisión manual.</span>
                </p>
              </div>
            </div>

            {/* PAYPAL CONTENT */}
            {paymentMethod === 'paypal' ? (
              <div style={{
                backgroundColor: '#FAF8F5',
                border: '2px solid var(--accent-beige-border)',
                borderRadius: '20px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Subtotal entradas: <strong>{totalPrice}</strong> + Cargo por servicio (13%): <strong>{paypalFeePrice}</strong>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-coffee)' }}>
                    Total a pagar: {paypalTotalPrice} (~${paypalTotalUsdAmount} USD)
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Tipo de cambio de referencia: 1 USD = ₡{paypalConfig.exchangeRate || 515} CRC
                  </div>
                </div>


                {paypalConfig.clientId ? (
                  <PayPalScriptProvider 
                    key={paypalConfig.clientId} 
                    options={{ 
                      "client-id": paypalConfig.clientId, 
                      currency: "USD",
                      components: "buttons"
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                      disabled={loading}
                      createOrder={handlePayPalCreateOrder}
                      onApprove={handlePayPalApprove}
                      onError={(err) => {
                        console.error('Error en PayPal Buttons:', err);
                        setErrorMsg('Ocurrió un error al cargar o procesar PayPal. Revisa la consola o intenta refrescar.');
                      }}
                    />
                  </PayPalScriptProvider>
                ) : (
                  <div style={{ padding: '20px', color: 'var(--accent-coffee)', fontWeight: 600 }}>
                    Cargando procesador de pago seguro de PayPal...
                  </div>
                )}

              </div>
            ) : (
              /* SINPE CONTENT */
              <div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.6 }}>
                  Transfiere o deposita por medio de sinpe movil al número <strong style={{ fontSize: '1.2rem', color: 'var(--accent-coffee)' }}>60121225</strong> la cantidad total de <strong>{totalPrice}</strong> y sube la foto o captura del comprobante.
                </p>

                <div style={{
                  border: '2px dashed var(--accent-beige-border)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: '#FAF8F5',
                  cursor: 'pointer',
                  position: 'relative',
                  marginBottom: '24px'
                }}>
                  <input 
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                  />
                  
                  {filePreview ? (
                    <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
                      <img 
                        src={filePreview} 
                        alt="Vista previa del comprobante" 
                        style={{ 
                          width: '100%', 
                          maxWidth: '100%', 
                          maxHeight: '220px', 
                          objectFit: 'contain', 
                          borderRadius: '12px', 
                          boxShadow: 'var(--shadow-sm)', 
                          marginBottom: '10px' 
                        }}
                      />
                      <div style={{ fontWeight: 600, color: 'var(--color-green)' }}>
                        Archivo seleccionado: {file.name}
                      </div>
                    </div>
                  ) : file ? (
                    <div>
                      <FileText size={40} color="var(--accent-coffee)" />
                      <div style={{ fontWeight: 600, color: 'var(--color-green)', marginTop: '8px' }}>
                        Archivo PDF adjunto: {file.name}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon size={40} color="var(--accent-gold)" style={{ marginBottom: '8px' }} />
                      <div style={{ fontWeight: 600, color: 'var(--accent-coffee)' }}>
                        Haz clic aquí o arrastra tu comprobante de pago
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Soporta imágenes (JPG, PNG, WEBP) o documentos PDF
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', padding: '16px', fontSize: '1.1rem', borderRadius: '14px' }}
                >
                  {loading ? (
                    <span>Procesando Reserva ({quantity} {quantity === 1 ? 'Boleto' : 'Boletos'})...</span>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Enviar Comprobante SINPE ({totalPrice})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
