import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, Eye, Filter, Lock, LogOut, RefreshCw, Search, ShieldCheck, Ticket, Trash2, UserCheck, Users, X, XCircle } from 'lucide-react';

export default function AdminDashboard({ adminUser, onLogin, onLogout }) {
  // 1. ALL HOOKS MUST BE DECLARED AT THE VERY TOP (RULES OF HOOKS)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedAttendeesModal, setSelectedAttendeesModal] = useState(null);

  const formatCRC = (val) => `₡${Number(val).toLocaleString('es-CR')}`;

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reservations');
      const data = await res.json();
      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      fetchReservations();
    }
  }, [adminUser]);

  // 2. CONDITIONAL LOGIN FORM (AFTER ALL HOOKS DECLARED)
  if (!adminUser) {
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      setLoginError('');
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
          onLogin(data.user);
        } else {
          setLoginError(data.message || 'Credenciales inválidas.');
        }
      } catch (err) {
        setLoginError('Error de red al intentar iniciar sesión.');
      }
    };

    return (
      <div style={{ maxWidth: '420px', margin: '60px auto', padding: '0 20px' }}>
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--accent-coffee)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <ShieldCheck size={32} />
            </div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--accent-coffee)' }}>Acceso Administrativo</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Ingresa tus credenciales autorizadas</p>
          </div>

          {loginError && (
            <div style={{ backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Usuario</label>
              <input 
                type="text" 
                placeholder="Ej. admin" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = async (reservationId, newStatus) => {
    const confirmMsg = newStatus === 'aprobado' 
      ? '¿Confirmas que el comprobante de pago es CORRECTO y deseas APROBAR esta reserva?' 
      : '¿Deseas RECHAZAR esta reserva? (Nota: los asientos seguirán bloqueados según la regla actual).';

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/reservations/${reservationId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchReservations();
        setSelectedReceipt(null);
      } else {
        alert(data.message || 'Error al actualizar estado.');
      }
    } catch (err) {
      alert('Error de conexión con el servidor.');
    }
  };

  const handleDeleteReservation = async (reservationId, purchaserName) => {
    if (!window.confirm(`⚠️ ¿ATENCIÓN! ¿Estás seguro de que deseas ELIMINAR PERMANENTEMENTE la reserva de "${purchaserName}"?\n\nEsta acción borrará la reserva por completo de la base de datos y liberará sus asientos.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/reservations/${reservationId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchReservations();
      } else {
        alert(data.message || 'Error al eliminar reserva.');
      }
    } catch (err) {
      alert('Error de conexión con el servidor.');
    }
  };

  const filteredList = reservations.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = r.purchaser_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.purchaser_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.purchaser_phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalRevenue = reservations.reduce((acc, r) => r.status === 'aprobado' || r.status === 'ingresado' ? acc + r.total_amount : acc, 0);
  const totalAllTickets = reservations.reduce((acc, r) => acc + r.quantity, 0);
  const pendingCount = reservations.filter(r => r.status === 'pendiente').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-coffee)' }}>Panel de Administración & Reservaciones</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sesión iniciada como: <strong>{adminUser.full_name} ({adminUser.role})</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchReservations} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={16} /> Actualizar Lista
          </button>
          <button onClick={onLogout} className="btn-secondary" style={{ color: 'var(--color-red)', borderColor: 'var(--color-red)' }}>
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      {/* STAT CARDS INCL. TOTAL PERSONAS / ENTRADAS VENDIDAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div className="card-glass" style={{ padding: '20px', borderLeft: '4px solid var(--accent-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Total Entradas Reservadas
            </span>
            <Users size={20} color="var(--accent-gold)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-coffee)' }}>
            {totalAllTickets} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>personas</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            (Acumulado total de entradas registradas)
          </div>
        </div>

        <div className="card-glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Compras / Reservas
            </span>
            <Ticket size={20} color="var(--accent-coffee)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-coffee)' }}>
            {reservations.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Transacciones de compra
          </div>
        </div>

        <div className="card-glass" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Ingresos Aprobados
            </span>
            <CheckCircle2 size={20} color="var(--color-green)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-green)' }}>
            {formatCRC(totalRevenue)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Pagos verificados en ₡
          </div>
        </div>

        <div className="card-glass" style={{ padding: '20px', borderLeft: '4px solid var(--color-orange)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Pendientes de Pago
            </span>
            <Search size={20} color="var(--color-orange)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-orange)' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Por validar comprobante
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--accent-beige-border)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pendiente', 'aprobado', 'ingresado', 'rechazado'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className="badge"
              style={{
                backgroundColor: filterStatus === st ? 'var(--accent-coffee)' : 'var(--bg-secondary)',
                color: filterStatus === st ? '#FFFFFF' : 'var(--accent-coffee)',
                padding: '8px 14px',
                borderRadius: '12px',
                cursor: 'pointer',
                border: 'none',
                textTransform: 'capitalize'
              }}
            >
              {st === 'all' ? 'Todas' : st}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '300px', width: '100%' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Buscar comprador..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="card-glass" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-coffee)', borderBottom: '1px solid var(--accent-beige-border)' }}>
                <th style={{ padding: '14px 16px' }}>Comprador / Contacto</th>
                <th style={{ padding: '14px 16px' }}>Zona & Asistentes</th>
                <th style={{ padding: '14px 16px' }}>Monto Total</th>
                <th style={{ padding: '14px 16px' }}>Formulario & Comprobante</th>
                <th style={{ padding: '14px 16px' }}>Estado</th>
                <th style={{ padding: '14px 16px', textAlign: 'center' }}>Acción Validar / Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No se encontraron reservas registradas con estos filtros.
                  </td>
                </tr>
              ) : (
                filteredList.map(resv => (
                  <tr key={resv.id} style={{ borderBottom: '1px solid #EEE' }}>
                    
                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ color: 'var(--accent-coffee)' }}>{resv.purchaser_name}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{resv.purchaser_email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{resv.purchaser_phone}</div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge" style={{ backgroundColor: '#EFE3D3', color: 'var(--accent-coffee)', fontWeight: 800 }}>
                        {resv.zone_name}
                      </span>
                      <div style={{ marginTop: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                        👥 {resv.quantity} {resv.quantity === 1 ? 'Persona' : 'Personas'}
                      </div>
                      
                      {/* Visualización de los asientos específicos reservados */}
                      {resv.attendees && resv.attendees.length > 0 && (
                        <div style={{
                          fontSize: '0.8rem',
                          color: 'var(--accent-coffee)',
                          fontWeight: 700,
                          marginTop: '6px',
                          backgroundColor: '#FAF8F5',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          border: '1px solid var(--accent-beige-border)',
                          display: 'inline-block'
                        }}>
                          🪑 Asientos: {resv.attendees.map(a => a.assigned_ticket_code).filter(Boolean).join(', ')}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--accent-coffee)' }}>
                      {formatCRC(resv.total_amount)}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button
                          onClick={() => setSelectedAttendeesModal(resv)}
                          style={{
                            backgroundColor: '#EFE3D3',
                            color: 'var(--accent-coffee)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <UserCheck size={14} /> Ver Respuestas ({resv.attendees ? resv.attendees.length : 0})
                        </button>

                        {resv.comprobante_url && (
                          <button
                            onClick={() => setSelectedReceipt(resv)}
                            style={{
                              backgroundColor: 'var(--bg-secondary)',
                              color: 'var(--accent-coffee)',
                              border: '1px solid var(--accent-beige-border)',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Eye size={14} /> Ver Comprobante
                          </button>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      {resv.status === 'aprobado' && <span className="badge badge-approved">Aprobado</span>}
                      {resv.status === 'pendiente' && <span className="badge badge-pending">Pendiente</span>}
                      {resv.status === 'rechazado' && <span className="badge badge-rejected">Rechazado</span>}
                      {resv.status === 'ingresado' && <span className="badge badge-used">Ingresado</span>}
                    </td>

                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleUpdateStatus(resv.id, 'aprobado')}
                          className="btn-success"
                          style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                        >
                          <CheckCircle2 size={14} /> Aprobar
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(resv.id, 'rechazado')}
                          className="btn-danger"
                          style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                        >
                          <XCircle size={14} /> Rechazar
                        </button>

                        <button
                          onClick={() => handleDeleteReservation(resv.id, resv.purchaser_name)}
                          style={{
                            backgroundColor: '#7F1D1D',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            fontWeight: 700
                          }}
                          title="Eliminar permanentemente esta reserva"
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ATTENDEE RESPONSES MODAL */}
      {selectedAttendeesModal && (
        <div className="modal-overlay" onClick={() => setSelectedAttendeesModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--accent-beige-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--accent-coffee)' }}>
                Respuestas del Formulario - {selectedAttendeesModal.purchaser_name}
              </h3>
              <button onClick={() => setSelectedAttendeesModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '20px', maxHeight: '75vh', overflowY: 'auto' }}>
              {selectedAttendeesModal.attendees && selectedAttendeesModal.attendees.map((att, i) => (
                <div key={i} style={{
                  backgroundColor: '#FAF8F5',
                  border: '1px solid var(--accent-beige-border)',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '14px'
                }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '10px', fontSize: '1rem', borderBottom: '1px solid #EEE', paddingBottom: '6px' }}>
                    👤 Asistente #{i + 1}: {att.full_name} ({att.assigned_ticket_code})
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.88rem' }}>
                    <div><strong>Edad:</strong> {att.age || 'N/A'} años</div>
                    <div><strong>Teléfono:</strong> {att.phone}</div>
                    <div><strong>¿Dónde vive?:</strong> {att.residence || 'N/A'}</div>
                    <div><strong>Estado Civil:</strong> {att.civil_status || 'N/A'}</div>
                    <div><strong>¿Congrega en Visión Jesús?:</strong> {att.is_vision_jesus || 'N/A'}</div>
                    <div><strong>Red:</strong> {att.church_network || 'N/A'}</div>
                    <div><strong>¿Quién invitó?:</strong> {att.invited_by || 'N/A'}</div>
                    <div><strong>¿Fue a Encuentro?:</strong> {att.attended_encounter || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Receipts Inspection Modal */}
      {selectedReceipt && (
        <div className="modal-overlay" onClick={() => setSelectedReceipt(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--accent-beige-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Comprobante de Pago - {selectedReceipt.purchaser_name}</h3>
              <button onClick={() => setSelectedReceipt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Monto reportado: <strong>{formatCRC(selectedReceipt.total_amount)}</strong> | Zona: {selectedReceipt.zone_name}
              </div>
              
              <img 
                src={selectedReceipt.comprobante_url} 
                alt="Comprobante de pago" 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: '12px', border: '1px solid #DDD' }}
              />

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  onClick={() => handleUpdateStatus(selectedReceipt.id, 'aprobado')}
                  className="btn-success"
                  style={{ flex: 1, padding: '12px' }}
                >
                  <CheckCircle2 size={18} /> Confirmar & Aprobar Pago
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedReceipt.id, 'rechazado')}
                  className="btn-danger"
                  style={{ flex: 1, padding: '12px' }}
                >
                  <XCircle size={18} /> Rechazar Reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
