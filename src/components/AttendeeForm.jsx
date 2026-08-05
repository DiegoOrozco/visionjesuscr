import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, FileText, Image as ImageIcon, Heart, Send, User, UserCheck, UploadCloud, Ticket } from 'lucide-react';

export default function AttendeeForm({ zone, quantity, chosenSeatCodes = [], onBack, onSuccess }) {
  // Purchaser info
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [purchaserPhone, setPurchaserPhone] = useState('');

  // Track if user manually modified purchaser fields
  const [purchaserNameEdited, setPurchaserNameEdited] = useState(false);
  const [purchaserPhoneEdited, setPurchaserPhoneEdited] = useState(false);

  // Attendees array initialized with complete fields from Google Form
  const [attendees, setAttendees] = useState(() => {
    return Array.from({ length: quantity }, (_, i) => ({
      full_name: '',
      age: '',
      phone: '',
      residence: '',
      civil_status: 'Soltera',
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
  const totalPrice = formatCRC(quantity * zone.price);

  const handleAttendeeChange = (index, field, value) => {
    const updated = [...attendees];
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!purchaserName.trim() || !purchaserEmail.trim() || !purchaserPhone.trim()) {
      setErrorMsg('Por favor completa todos los datos de contacto de la persona responsable del pago.');
      return;
    }

    for (let i = 0; i < attendees.length; i++) {
      const att = attendees[i];
      if (!att.full_name.trim() || !att.phone.trim() || !att.age || !att.residence.trim()) {
        setErrorMsg(`Por favor completa todos los campos obligatorios del Asistente #${i + 1} (Nombre, Edad, Teléfono y ¿Dónde vive?).`);
        return;
      }
    }

    if (!file) {
      setErrorMsg('Es necesario adjuntar la foto o PDF del comprobante de pago para procesar la reserva.');
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

      const res = await fetch('/api/reservations', {
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
      <button 
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'transparent',
          color: 'var(--accent-coffee)',
          fontWeight: 600,
          marginBottom: '16px'
        }}
      >
        <ArrowLeft size={18} /> Volver a la selección de zona
      </button>

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
          <div style={{ marginBottom: '16px' }}>
            <img 
              src="/logo-anual.png" 
              alt="Logo Mujeres Auténticas 2026" 
              style={{
                height: '130px',
                maxHeight: '160px',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          <h2 style={{ fontSize: '1.9rem', marginTop: '4px', color: 'var(--accent-coffee)', fontFamily: 'var(--font-heading)' }}>
            CONGRESO ANUAL DE MUJERES AUTÉNTICAS 2026
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic', marginTop: '6px' }}>
            "Deja de esconder tus cicatrices. Ha llegado el momento de descubrir la belleza que Dios ha escrito en ellas. ❤️🦋"
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
            ⚠️ {errorMsg}
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
              const seatBadge = att.assigned_ticket_code || (chosenSeatCodes && chosenSeatCodes[index]);

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
                    <div style={{ fontWeight: 800, color: 'var(--accent-coffee)', fontSize: '1.1rem' }}>
                      👤 Asistente #{index + 1}
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
                        placeholder="Tu respuesta"
                        value={att.age}
                        onChange={(e) => handleAttendeeChange(index, 'age', e.target.value)}
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

                    {/* 5. Estado Civil */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px' }}>
                        Estado Civil *
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                        {['Soltera', 'Casada', 'Divorciada', 'Viuda', 'Unión Libre', 'Separada'].map(st => (
                          <label key={st} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: att.civil_status === st ? 'var(--accent-coffee)' : '#FFFFFF',
                            color: att.civil_status === st ? '#FFFFFF' : 'var(--accent-coffee)',
                            border: '1px solid var(--accent-beige-border)',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.88rem',
                            fontWeight: 600
                          }}>
                            <input 
                              type="radio"
                              name={`civil_status_${index}`}
                              value={st}
                              checked={att.civil_status === st}
                              onChange={(e) => handleAttendeeChange(index, 'civil_status', e.target.value)}
                              style={{ display: 'none' }}
                            />
                            <span>{att.civil_status === st ? '●' : '○'} {st}</span>
                          </label>
                        ))}
                      </div>
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
                        {['Red FuXión', 'Red Move', 'Obra Social', 'Modelo', 'Ninguna'].map(net => (
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
                    setPurchaserPhone(e.target.value);
                    setPurchaserPhoneEdited(true);
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: COMPROBANTE DE PAGO */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={22} color="var(--accent-coffee)" />
              Adjuntar Comprobante de Pago *
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Transfiere o deposita la cantidad total de <strong>{totalPrice}</strong> y sube la foto o captura del comprobante.
            </p>

            <div style={{
              border: '2px dashed var(--accent-beige-border)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#FAF8F5',
              cursor: 'pointer',
              position: 'relative'
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
                    ✓ Archivo seleccionado: {file.name}
                  </div>
                </div>
              ) : file ? (
                <div>
                  <FileText size={40} color="var(--accent-coffee)" />
                  <div style={{ fontWeight: 600, color: 'var(--color-green)', marginTop: '8px' }}>
                    ✓ Archivo PDF adjunto: {file.name}
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
                <span>Enviar Registro y Generar Código QR ({totalPrice})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
