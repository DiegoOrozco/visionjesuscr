import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, Download, Eye, Filter, Lock, LogOut, Plus, RefreshCw, Search, ShieldCheck, Ticket, Trash2, UserCheck, UserPlus, Users, X, XCircle, LayoutGrid, Globe, Tag } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function AdminDashboard({ adminUser, onLogin, onLogout, homepageConfig = {}, onSaveConfig }) {
  // 1. ALL HOOKS MUST BE DECLARED AT THE VERY TOP
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('reservations'); // 'reservations' | 'church_web' | 'pricing' | 'users'

  // Pricing & Presale Editing State
  const [pricingFields, setPricingFields] = useState({
    presale_cutoff_date: '2026-08-15',
    vip_presale_price: '12000',
    vip_regular_price: '15000',
    general_presale_price: '7500',
    general_regular_price: '10000'
  });
  const [savingPricing, setSavingPricing] = useState(false);
  const [pricingSuccessMsg, setPricingSuccessMsg] = useState('');

  // Config editing state
  const [configFields, setConfigFields] = useState({
    hero_bg: '',
    hero_title: '',
    hero_subtitle: '',
    about_text: '',
    schedule_bg: '',
    social_fb: '',
    social_ig: '',
    social_yt: '',
    social_spotify: '',
    contact_address: '',
    contact_email: '',
    contact_phone_1: '',
    contact_phone_2: ''
  });

  // User management state
  const [adminUsers, setAdminUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', full_name: '', role: 'tickets' });
  const [uploadingScheduleBg, setUploadingScheduleBg] = useState(false);

  const [localSchedules, setLocalSchedules] = useState([]);
  const [localButtons, setLocalButtons] = useState([]);
  const [localNewsItems, setLocalNewsItems] = useState([]);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingNewsImage, setUploadingNewsImage] = useState(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

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
      const res = await fetch(`${API_URL}/api/admin/reservations`);
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

  // Sync configFields with incoming homepageConfig prop
  useEffect(() => {
    if (homepageConfig && Object.keys(homepageConfig).length > 0) {
      let parsedSchedules = [];
      try {
        if (homepageConfig.schedules) {
          parsedSchedules = typeof homepageConfig.schedules === 'string' ? JSON.parse(homepageConfig.schedules) : homepageConfig.schedules;
        }
      } catch (e) {
        console.error('Error parsing schedules:', e);
      }
      if (!parsedSchedules || parsedSchedules.length === 0) {
        parsedSchedules = [
          { id: '1', text: homepageConfig.schedule_thursday || 'JUEVES 7:30PM', isVirtual: false },
          { id: '2', text: homepageConfig.schedule_saturday || 'SÁBADOS 5:30PM', isVirtual: false },
          { id: '3', text: homepageConfig.schedule_sunday_1 || 'DOMINGOS 9:00AM', isVirtual: false },
          { id: '4', text: homepageConfig.schedule_sunday_2 || 'DOMINGOS 11:00AM', isVirtual: false },
          { id: '5', text: homepageConfig.schedule_sunday_virtual || 'DOMINGOS (VIRTUAL) 5:30PM', isVirtual: true }
        ];
      }
      setLocalSchedules(parsedSchedules);

      // Parse buttons
      let parsedButtons = [];
      try {
        if (homepageConfig.hero_buttons) {
          parsedButtons = typeof homepageConfig.hero_buttons === 'string' ? JSON.parse(homepageConfig.hero_buttons) : homepageConfig.hero_buttons;
        }
      } catch (e) { console.error('Error parsing hero_buttons:', e); }
      setLocalButtons(parsedButtons || []);

      // Parse news items
      let parsedNews = [];
      try {
        if (homepageConfig.news_items) {
          parsedNews = typeof homepageConfig.news_items === 'string' ? JSON.parse(homepageConfig.news_items) : homepageConfig.news_items;
        }
      } catch (e) { console.error('Error parsing news_items:', e); }
      setLocalNewsItems(parsedNews || []);

      setConfigFields({
        hero_bg: homepageConfig.hero_bg || '',
        hero_title: homepageConfig.hero_title || '',
        hero_subtitle: homepageConfig.hero_subtitle || '',
        about_text: homepageConfig.about_text || '',
        schedule_bg: homepageConfig.schedule_bg || '',
        social_fb: homepageConfig.social_fb || '',
        social_ig: homepageConfig.social_ig || '',
        social_yt: homepageConfig.social_yt || '',
        social_spotify: homepageConfig.social_spotify || '',
        contact_address: homepageConfig.contact_address || '',
        contact_email: homepageConfig.contact_email || '',
        contact_phone_1: homepageConfig.contact_phone_1 || '',
        contact_phone_2: homepageConfig.contact_phone_2 || ''
      });

      setPricingFields({
        presale_cutoff_date: homepageConfig.presale_cutoff_date || '2026-08-15',
        vip_presale_price: homepageConfig.vip_presale_price || '12000',
        vip_regular_price: homepageConfig.vip_regular_price || '15000',
        general_presale_price: homepageConfig.general_presale_price || '7500',
        general_regular_price: homepageConfig.general_regular_price || '10000'
      });
    }
  }, [homepageConfig]);

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setPricingFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePricingSubmit = async (e) => {
    e.preventDefault();
    setSavingPricing(true);
    setPricingSuccessMsg('');
    try {
      const res = await fetch(`${API_URL}/api/admin/pricing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricingFields)
      });
      const data = await res.json();
      if (data.success) {
        setPricingSuccessMsg('¡Precios y fecha de preventa guardados con éxito!');
        if (onSaveConfig) onSaveConfig();
      } else {
        alert(data.message || 'Error al guardar configuración de precios.');
      }
    } catch (err) {
      alert('Error de red al guardar precios.');
    } finally {
      setSavingPricing(false);
    }
  };

  const handleAddSchedule = () => {
    setLocalSchedules([...localSchedules, { id: Date.now().toString(), text: 'NUEVO HORARIO 7:00 PM', isVirtual: false }]);
  };

  const handleRemoveSchedule = (id) => {
    setLocalSchedules(localSchedules.filter(s => s.id !== id));
  };

  const handleScheduleTextChange = (id, text) => {
    setLocalSchedules(localSchedules.map(s => s.id === id ? { ...s, text } : s));
  };

  const handleScheduleVirtualToggle = (id) => {
    setLocalSchedules(localSchedules.map(s => s.id === id ? { ...s, isVirtual: !s.isVirtual } : s));
  };

  // --- BUTTON HANDLERS ---
  const handleAddButton = () => {
    setLocalButtons([...localButtons, { id: Date.now().toString(), label: 'Nuevo Botón', emoji: '', url: '', style: 'secondary' }]);
  };
  const handleRemoveButton = (id) => {
    setLocalButtons(localButtons.filter(b => b.id !== id));
  };
  const handleButtonChange = (id, field, value) => {
    setLocalButtons(localButtons.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  // --- NEWS HANDLERS ---
  const handleAddNews = () => {
    setLocalNewsItems([...localNewsItems, { id: Date.now().toString(), title: '', description: '', image: '', link: '', badge: '' }]);
  };
  const handleRemoveNews = (id) => {
    setLocalNewsItems(localNewsItems.filter(n => n.id !== id));
  };
  const handleNewsChange = (id, field, value) => {
    setLocalNewsItems(localNewsItems.map(n => n.id === id ? { ...n, [field]: value } : n));
  };
  const handleNewsImageUpload = async (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingNewsImage(id);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_URL}/api/admin/homepage/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        handleNewsChange(id, 'image', data.url);
      } else {
        alert(data.message || 'Error al subir imagen.');
      }
    } catch (err) {
      alert('Error de red al subir la imagen.');
    } finally {
      setUploadingNewsImage(null);
    }
  };

  // --- SCHEDULE BG UPLOAD ---
  const handleScheduleBgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingScheduleBg(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_URL}/api/admin/homepage/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setConfigFields(prev => ({ ...prev, schedule_bg: data.url }));
        alert('¡Imagen de fondo de horarios actualizada!');
      } else {
        alert(data.message || 'Error al subir imagen.');
      }
    } catch (err) {
      alert('Error de red al subir la imagen.');
    } finally {
      setUploadingScheduleBg(false);
    }
  };

  // --- USER MANAGEMENT ---
  const fetchAdminUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`);
      const data = await res.json();
      if (data.success) setAdminUsers(data.users);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setNewUser({ username: '', password: '', full_name: '', role: 'tickets' });
        fetchAdminUsers();
      } else {
        alert(data.message || 'Error al crear usuario.');
      }
    } catch (err) {
      alert('Error de red al crear usuario.');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario "${username}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchAdminUsers();
      } else {
        alert(data.message || 'Error al eliminar usuario.');
      }
    } catch (err) {
      alert('Error de red al eliminar usuario.');
    }
  };

  // --- CSV EXPORT ---
  const handleExportCSV = () => {
    window.open(`${API_URL}/api/admin/export/csv`, '_blank');
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingHero(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/api/admin/homepage/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setConfigFields(prev => ({ ...prev, hero_bg: data.url }));
        alert('¡Imagen de la iglesia subida y actualizada con éxito!');
      } else {
        alert(data.message || 'Error al subir imagen.');
      }
    } catch (err) {
      alert('Error de red al subir la imagen.');
    } finally {
      setUploadingHero(false);
    }
  };

  // 2. CONDITIONAL LOGIN FORM (AFTER ALL HOOKS DECLARED)
  if (!adminUser) {
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      setLoginError('');
      try {
        const res = await fetch(`${API_URL}/api/admin/login`, {
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
              {loginError}
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
      const res = await fetch(`${API_URL}/api/admin/reservations/${reservationId}/status`, {
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
    if (!window.confirm(`¡ATENCIÓN! ¿Estás seguro de que deseas ELIMINAR PERMANENTEMENTE la reserva de "${purchaserName}"?\n\nEsta acción borrará la reserva por completo de la base de datos y liberará sus asientos.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/reservations/${reservationId}`, {
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

  const handleSaveConfigSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccessMsg('');
    try {
      const res = await fetch(`${API_URL}/api/admin/homepage/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          config: {
            ...configFields,
            schedules: JSON.stringify(localSchedules),
            hero_buttons: JSON.stringify(localButtons),
            news_items: JSON.stringify(localNewsItems)
          } 
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('¡Configuración guardada y publicada exitosamente en la portada!');
        if (onSaveConfig) {
          onSaveConfig({
            ...configFields,
            schedules: JSON.stringify(localSchedules),
            hero_buttons: JSON.stringify(localButtons),
            news_items: JSON.stringify(localNewsItems)
          });
        }
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      } else {
        alert(data.message || 'Error al guardar la configuración.');
      }
    } catch (err) {
      alert('Error de red al intentar guardar la configuración.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleConfigChange = (e) => {
    setConfigFields({ ...configFields, [e.target.name]: e.target.value });
  };

  const filteredList = reservations.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = r.purchaser_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.purchaser_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.purchaser_phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalRevenue = reservations.reduce((acc, r) => r.status === 'aprobado' || r.status === 'usado' ? acc + r.total_amount : acc, 0);
  const totalAllTickets = reservations.reduce((acc, r) => acc + r.quantity, 0);
  const pendingCount = reservations.filter(r => r.status === 'pendiente').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--accent-coffee)' }}>Panel de Administración & Configuración</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sesión iniciada como: <strong>{adminUser.full_name} ({adminUser.role})</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {activeTab === 'reservations' && (
            <>
              <button onClick={fetchReservations} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={16} /> Actualizar
              </button>
              <button onClick={handleExportCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#10B981', color: '#FFF', borderColor: '#10B981' }}>
                <Download size={16} /> Exportar CSV
              </button>
            </>
          )}
          <button onClick={onLogout} className="btn-secondary" style={{ color: 'var(--color-red)', borderColor: 'var(--color-red)' }}>
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid var(--accent-beige-border)',
        marginBottom: '24px',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('reservations')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'reservations' ? '3px solid var(--accent-coffee)' : '3px solid transparent',
            color: activeTab === 'reservations' ? 'var(--accent-coffee)' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: '1rem',
            padding: '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <LayoutGrid size={18} />
          Reservaciones Congreso
        </button>

        {/* Only admin role can edit website */}
        {adminUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('church_web')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'church_web' ? '3px solid var(--accent-coffee)' : '3px solid transparent',
              color: activeTab === 'church_web' ? 'var(--accent-coffee)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '10px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Globe size={18} />
            Diseño Web Iglesia
          </button>
        )}

        {/* Only admin role can edit pricing & presale */}
        {adminUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('pricing')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'pricing' ? '3px solid var(--accent-coffee)' : '3px solid transparent',
              color: activeTab === 'pricing' ? 'var(--accent-coffee)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '10px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Tag size={18} />
            Precios y Preventa
          </button>
        )}

        {/* Only admin role can manage users */}
        {adminUser.role === 'admin' && (
          <button
            onClick={() => { setActiveTab('users'); fetchAdminUsers(); }}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'users' ? '3px solid var(--accent-coffee)' : '3px solid transparent',
              color: activeTab === 'users' ? 'var(--accent-coffee)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '10px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Users size={18} />
            Gestión de Usuarios
          </button>
        )}
      </div>

      {/* TAB 1: RESERVATIONS MANAGER */}
      {activeTab === 'reservations' && (
        <>
          {/* STAT CARDS INCL. TOTAL PERSONAS / ENTRADAS VENDIDAS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px'
          }}>
            <div className="card-glass" style={{ padding: '20px', borderLeft: '4px solid var(--accent-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '4px' }}>
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
              {['all', 'pendiente', 'aprobado', 'usado', 'rechazado'].map(st => (
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
                  {st === 'all' ? 'Todas' : st === 'usado' ? 'usado' : st}
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
                            {resv.quantity} {resv.quantity === 1 ? 'Persona' : 'Personas'}
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
                              🪑 Asientos: {resv.attendees.map(a => {
                                const t = a.assigned_ticket_code || '';
                                return t.includes(' - ') && !t.startsWith('Fila') && !t.startsWith('Asiento') 
                                  ? t.split(' - ').slice(1).join(' - ') 
                                  : t;
                              }).filter(Boolean).join(', ')}
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

                            {(resv.status === 'aprobado' || resv.status === 'usado') && resv.qr_code_hash && (
                              <a
                                href={`/ticket/${resv.qr_code_hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  backgroundColor: '#FEF3C7',
                                  color: '#92400E',
                                  border: '1px solid #FCD34D',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  textDecoration: 'none',
                                  justifyContent: 'center'
                                }}
                              >
                                <Ticket size={14} /> Ver / Bajar Cupón
                              </a>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '14px 16px' }}>
                          {resv.status === 'aprobado' && <span className="badge badge-approved">Aprobado</span>}
                          {resv.status === 'pendiente' && <span className="badge badge-pending">Pendiente</span>}
                          {resv.status === 'rechazado' && <span className="badge badge-rejected">Rechazado</span>}
                          {resv.status === 'usado' && <span className="badge badge-used" style={{ backgroundColor: '#D97706', color: '#FFF' }}>Usado</span>}
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
        </>
      )}

      {/* TAB 2: CHURCH HOME WEB CONFIGURATION EDITOR */}
      {activeTab === 'church_web' && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', marginBottom: '10px' }}>
            Editar Portada e Información de la Iglesia
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Modifica en tiempo real el fondo de la portada, títulos, horarios semanales y redes de contacto.
          </p>

          {saveSuccessMsg && (
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 700 }}>
              {saveSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSaveConfigSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* SECTION: HERO BANNER */}
              <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #EEE', paddingBottom: '10px', marginTop: '10px' }}>
                <h4 style={{ color: 'var(--accent-gold)', margin: 0 }}>Banner de Bienvenida (Hero)</h4>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Título Principal de Portada</label>
                <input type="text" name="hero_title" value={configFields.hero_title} onChange={handleConfigChange} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Subtítulo / Lema</label>
                <input type="text" name="hero_subtitle" value={configFields.hero_subtitle} onChange={handleConfigChange} required />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Fondo de Portada (Imagen o Video MP4/WebM)
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    name="hero_bg" 
                    value={configFields.hero_bg} 
                    onChange={handleConfigChange} 
                    placeholder="URL de imagen/video (o subir archivo mp4/jpg)" 
                    style={{ flex: 1 }}
                  />
                  <label style={{
                    backgroundColor: 'var(--accent-coffee)',
                    color: '#FFFFFF',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    display: 'inline-block',
                    textAlign: 'center'
                  }}>
                    {uploadingHero ? 'Subiendo...' : 'Subir Fondo (Foto / Video)'}
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      onChange={handleHeroUpload} 
                      style={{ display: 'none' }} 
                      disabled={uploadingHero}
                    />
                  </label>
                </div>
                {configFields.hero_bg && (
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Vista previa:</span>
                    {configFields.hero_bg.match(/\.(mp4|webm|mov|ogg)($|\?)/i) ? (
                      <video 
                        src={configFields.hero_bg.startsWith('http') || configFields.hero_bg.startsWith('/') ? (configFields.hero_bg.startsWith('/') ? `${API_URL}${configFields.hero_bg}` : configFields.hero_bg) : `${API_URL}/${configFields.hero_bg}`} 
                        controls
                        muted
                        style={{ display: 'block', maxHeight: '140px', borderRadius: '12px', marginTop: '4px', border: '1px solid #DDD' }} 
                      />
                    ) : (
                      <img 
                        src={configFields.hero_bg.startsWith('http') || configFields.hero_bg.startsWith('/') ? (configFields.hero_bg.startsWith('/') ? `${API_URL}${configFields.hero_bg}` : configFields.hero_bg) : `${API_URL}/${configFields.hero_bg}`} 
                        alt="Vista previa fondo" 
                        style={{ display: 'block', maxHeight: '120px', borderRadius: '12px', marginTop: '4px', border: '1px solid #DDD' }} 
                      />
                    )}
                  </div>
                )}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Texto Sobre Nosotros / Breve Introducción</label>
                <textarea name="about_text" rows="3" value={configFields.about_text} onChange={handleConfigChange} required style={{ width: '100%', borderRadius: '10px', border: '1px solid #CCC', padding: '10px' }}></textarea>
              </div>

              {/* SCHEDULE BG IMAGE */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Imagen de Fondo — Sección Horarios</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    name="schedule_bg" 
                    value={configFields.schedule_bg} 
                    onChange={handleConfigChange} 
                    placeholder="URL de la imagen o ruta del archivo" 
                    style={{ flex: 1 }}
                  />
                  <label style={{
                    backgroundColor: 'var(--accent-coffee)',
                    color: '#FFFFFF',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    display: 'inline-block',
                    textAlign: 'center'
                  }}>
                    {uploadingScheduleBg ? 'Subiendo...' : 'Subir Fondo Horarios'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleScheduleBgUpload} 
                      style={{ display: 'none' }} 
                      disabled={uploadingScheduleBg}
                    />
                  </label>
                </div>
                {configFields.schedule_bg && (
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Vista previa:</span>
                    <img 
                      src={configFields.schedule_bg.startsWith('http') || configFields.schedule_bg.startsWith('/') ? (configFields.schedule_bg.startsWith('/') ? `${API_URL}${configFields.schedule_bg}` : configFields.schedule_bg) : `${API_URL}/${configFields.schedule_bg}`} 
                      alt="Vista previa fondo horarios" 
                      style={{ display: 'block', maxHeight: '100px', borderRadius: '12px', marginTop: '4px', border: '1px solid #DDD' }} 
                    />
                  </div>
                )}
              </div>

              {/* SECTION: WEEKLY SCHEDULES */}
              <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #EEE', paddingBottom: '10px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: 'var(--accent-gold)', margin: 0 }}>Horarios de Servicios Semanales</h4>
                  <button 
                    type="button" 
                    onClick={handleAddSchedule}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    Agregar Culto / Servicio
                  </button>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {localSchedules.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed #CCC', borderRadius: '12px' }}>
                    No hay horarios creados. Presiona "Agregar Culto" para registrar uno.
                  </div>
                ) : (
                  localSchedules.map((s, idx) => (
                    <div key={s.id || idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#FAF8F5', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--accent-beige-border)', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, color: 'var(--accent-coffee)', minWidth: '24px' }}>#{idx + 1}</span>
                      <input 
                        type="text" 
                        value={s.text} 
                        onChange={(e) => handleScheduleTextChange(s.id, e.target.value)} 
                        placeholder="Ej. DOMINGOS 9:00 AM" 
                        required 
                        style={{ flex: 1, padding: '8px' }}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                        <input 
                          type="checkbox" 
                          checked={!!s.isVirtual} 
                          onChange={() => handleScheduleVirtualToggle(s.id)}
                        />
                        ¿Virtual? (Adoración/Spotify)
                      </label>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSchedule(s.id)}
                        style={{
                          backgroundColor: 'var(--color-red-light)',
                          color: 'var(--color-red)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* SECTION: DYNAMIC HERO BUTTONS */}
              <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #EEE', paddingBottom: '10px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: 'var(--accent-gold)', margin: 0 }}>Botones de Acción (Hero)</h4>
                  <button 
                    type="button" 
                    onClick={handleAddButton}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    Agregar Botón
                  </button>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {localButtons.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed #CCC', borderRadius: '12px' }}>
                    No hay botones creados. Presiona "Agregar Botón" para añadir uno.
                  </div>
                ) : (
                  localButtons.map((btn, idx) => (
                    <div key={btn.id || idx} style={{ backgroundColor: '#FAF8F5', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--accent-beige-border)' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, color: 'var(--accent-coffee)', minWidth: '60px' }}>Botón #{idx + 1}</span>
                        <select 
                          value={btn.style || 'secondary'} 
                          onChange={(e) => handleButtonChange(btn.id, 'style', e.target.value)}
                          style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '0.85rem' }}
                        >
                          <option value="primary">Principal (Rojo)</option>
                          <option value="secondary">Secundario (Oscuro)</option>
                        </select>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveButton(btn.id)}
                          style={{
                            backgroundColor: 'var(--color-red-light)',
                            color: 'var(--color-red)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            marginLeft: 'auto'
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Icono (opcional)</label>
                          <input 
                            type="text" 
                            value={btn.emoji || ''} 
                            onChange={(e) => handleButtonChange(btn.id, 'emoji', e.target.value)} 
                            placeholder="Texto de icono" 
                            style={{ padding: '6px 10px' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Texto del Botón</label>
                          <input 
                            type="text" 
                            value={btn.label || ''} 
                            onChange={(e) => handleButtonChange(btn.id, 'label', e.target.value)} 
                            placeholder="Congreso de Mujeres" 
                            required
                            style={{ padding: '6px 10px' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>URL / Enlace</label>
                          <input 
                            type="text" 
                            value={btn.url || ''} 
                            onChange={(e) => handleButtonChange(btn.id, 'url', e.target.value)} 
                            placeholder="/autenticas o https://..." 
                            style={{ padding: '6px 10px' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* SECTION: NEWS / EVENTS GALLERY */}
              <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #EEE', paddingBottom: '10px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: 'var(--accent-gold)', margin: 0 }}>Galería de Noticias / Eventos</h4>
                  <button 
                    type="button" 
                    onClick={handleAddNews}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    Agregar Noticia / Evento
                  </button>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {localNewsItems.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed #CCC', borderRadius: '12px' }}>
                    No hay noticias/eventos creados. Presiona "Agregar Noticia" para crear uno nuevo.
                  </div>
                ) : (
                  localNewsItems.map((item, idx) => (
                    <div key={item.id || idx} style={{ backgroundColor: '#FAF8F5', padding: '16px', borderRadius: '14px', border: '1px solid var(--accent-beige-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 800, color: 'var(--accent-coffee)' }}>Noticia #{idx + 1}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveNews(item.id)}
                          style={{
                            backgroundColor: 'var(--color-red-light)',
                            color: 'var(--color-red)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.85rem'
                          }}
                        >
                          Eliminar
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Título</label>
                          <input 
                            type="text" 
                            value={item.title || ''} 
                            onChange={(e) => handleNewsChange(item.id, 'title', e.target.value)} 
                            placeholder="Congreso Anual de Mujeres" 
                            required
                            style={{ padding: '6px 10px' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Etiqueta / Badge (opcional)</label>
                          <input 
                            type="text" 
                            value={item.badge || ''} 
                            onChange={(e) => handleNewsChange(item.id, 'badge', e.target.value)} 
                            placeholder="NUEVO, PRÓXIMO, EVENTO..." 
                            style={{ padding: '6px 10px' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: '10px' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Descripción Breve</label>
                        <textarea 
                          rows="2" 
                          value={item.description || ''} 
                          onChange={(e) => handleNewsChange(item.id, 'description', e.target.value)} 
                          placeholder="Breve descripción de la noticia o evento..."
                          style={{ width: '100%', borderRadius: '8px', border: '1px solid #CCC', padding: '8px' }}
                        ></textarea>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Enlace (al hacer click)</label>
                          <input 
                            type="text" 
                            value={item.link || ''} 
                            onChange={(e) => handleNewsChange(item.id, 'link', e.target.value)} 
                            placeholder="https://... o /ruta" 
                            style={{ padding: '6px 10px' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Imagen</label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              type="text" 
                              value={item.image || ''} 
                              onChange={(e) => handleNewsChange(item.id, 'image', e.target.value)} 
                              placeholder="URL o subir abajo" 
                              style={{ flex: 1, padding: '6px 10px' }}
                            />
                            <label style={{
                              backgroundColor: 'var(--accent-coffee)',
                              color: '#FFFFFF',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              whiteSpace: 'nowrap'
                            }}>
                              {uploadingNewsImage === item.id ? 'Subiendo...' : 'Subir'}
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleNewsImageUpload(item.id, e)} 
                                style={{ display: 'none' }} 
                                disabled={uploadingNewsImage === item.id}
                              />
                            </label>
                          </div>
                          {item.image && (
                            <img 
                              src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`} 
                              alt="Vista previa" 
                              style={{ display: 'block', maxHeight: '80px', borderRadius: '8px', marginTop: '6px', border: '1px solid #DDD' }} 
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* SECTION: CONTACT & SOCIAL MEDIA */}
              <div style={{ gridColumn: '1 / -1', borderBottom: '1px solid #EEE', paddingBottom: '10px', marginTop: '20px' }}>
                <h4 style={{ color: 'var(--accent-gold)', margin: 0 }}>Contacto y Enlaces Sociales</h4>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Dirección Física Auditorio</label>
                <textarea name="contact_address" rows="2" value={configFields.contact_address} onChange={handleConfigChange} required style={{ width: '100%', borderRadius: '10px', border: '1px solid #CCC', padding: '10px' }}></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Correo de Contacto</label>
                <input type="email" name="contact_email" value={configFields.contact_email} onChange={handleConfigChange} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Teléfono de Contacto 1</label>
                <input type="text" name="contact_phone_1" value={configFields.contact_phone_1} onChange={handleConfigChange} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Teléfono de Contacto 2 (WhatsApp)</label>
                <input type="text" name="contact_phone_2" value={configFields.contact_phone_2} onChange={handleConfigChange} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Enlace de Facebook</label>
                <input type="text" name="social_fb" value={configFields.social_fb} onChange={handleConfigChange} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Enlace de Instagram</label>
                <input type="text" name="social_ig" value={configFields.social_ig} onChange={handleConfigChange} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Enlace de YouTube</label>
                <input type="text" name="social_yt" value={configFields.social_yt} onChange={handleConfigChange} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Enlace de Spotify</label>
                <input type="text" name="social_spotify" value={configFields.social_spotify} onChange={handleConfigChange} />
              </div>

            </div>

            <button type="submit" disabled={saveLoading} className="btn-primary" style={{ marginTop: '30px', width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800 }}>
              {saveLoading ? 'Guardando...' : 'Guardar Cambios Web Portada'}
            </button>
          </form>
        </div>
      )}

      {/* TAB: PRICING & PRESALE CONFIGURATION (admin only) */}
      {activeTab === 'pricing' && adminUser.role === 'admin' && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', marginBottom: '10px' }}>
            Configuración de Precios y Fecha Límite de Preventa
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Define la fecha límite de preventa y los precios por zona (Preventa y Regular). El sistema cambiará automáticamente los precios en el mapa una vez alcanzada la fecha límite.
          </p>

          {pricingSuccessMsg && (
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 700 }}>
              {pricingSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSavePricingSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* FECHA LIMITE PREVENTA */}
              <div style={{ gridColumn: '1 / -1', backgroundColor: '#FAF8F5', padding: '20px', borderRadius: '16px', border: '1px solid var(--accent-beige-border)' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '8px' }}>
                  Fecha Límite de Preventa (Hasta las 23:59:59 de este día)
                </label>
                <input 
                  type="date" 
                  name="presale_cutoff_date" 
                  value={pricingFields.presale_cutoff_date} 
                  onChange={handlePricingChange} 
                  required 
                  style={{ width: '100%', maxWidth: '300px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CCC', fontWeight: 700 }}
                />
              </div>

              {/* TARIFAS GOLD */}
              <div style={{ backgroundColor: '#FAF8F5', padding: '20px', borderRadius: '16px', border: '1px solid var(--accent-beige-border)' }}>
                <h4 style={{ color: '#DB2777', marginTop: 0, marginBottom: '14px' }}>Zonas Gold (Central, Izquierda, Derecha)</h4>
                
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Precio Preventa (₡)</label>
                  <input 
                    type="number" 
                    name="vip_presale_price" 
                    value={pricingFields.vip_presale_price} 
                    onChange={handlePricingChange} 
                    required 
                    style={{ padding: '8px 12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Precio Regular / Normal (₡)</label>
                  <input 
                    type="number" 
                    name="vip_regular_price" 
                    value={pricingFields.vip_regular_price} 
                    onChange={handlePricingChange} 
                    required 
                    style={{ padding: '8px 12px' }}
                  />
                </div>
              </div>

              {/* TARIFAS GENERAL */}
              <div style={{ backgroundColor: '#FAF8F5', padding: '20px', borderRadius: '16px', border: '1px solid var(--accent-beige-border)' }}>
                <h4 style={{ color: '#10B981', marginTop: 0, marginBottom: '14px' }}>Zonas General (Central, Izquierda, Derecha)</h4>
                
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Precio Preventa (₡)</label>
                  <input 
                    type="number" 
                    name="general_presale_price" 
                    value={pricingFields.general_presale_price} 
                    onChange={handlePricingChange} 
                    required 
                    style={{ padding: '8px 12px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Precio Regular / Normal (₡)</label>
                  <input 
                    type="number" 
                    name="general_regular_price" 
                    value={pricingFields.general_regular_price} 
                    onChange={handlePricingChange} 
                    required 
                    style={{ padding: '8px 12px' }}
                  />
                </div>
              </div>

            </div>

            <button type="submit" disabled={savingPricing} className="btn-primary" style={{ marginTop: '30px', width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800 }}>
              {savingPricing ? 'Guardando...' : 'Guardar Configuración de Precios'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT (admin only) */}
      {activeTab === 'users' && adminUser.role === 'admin' && (
        <div className="card-glass" style={{ padding: '32px', borderRadius: '20px' }}>
          <h3 style={{ color: 'var(--accent-coffee)', marginBottom: '24px', fontSize: '1.4rem' }}>
            <UserPlus size={22} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            Gestión de Usuarios del Panel
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Los usuarios con rol <strong>"tickets"</strong> solo pueden ver, aprobar y rechazar reservaciones del congreso. 
            Los usuarios con rol <strong>"admin"</strong> tienen acceso completo (reservaciones + diseño web + usuarios). 
            Los usuarios con rol <strong>"scanner"</strong> solo pueden escanear boletos en la puerta.
          </p>

          {/* CREATE NEW USER FORM */}
          <form onSubmit={handleCreateUser} style={{
            backgroundColor: '#FAF8F5',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--accent-beige-border)',
            marginBottom: '28px'
          }}>
            <h4 style={{ color: 'var(--accent-gold)', margin: '0 0 16px 0' }}>Crear Nuevo Usuario</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Nombre Completo</label>
                <input 
                  type="text" 
                  value={newUser.full_name} 
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} 
                  placeholder="Ej. María García" 
                  required 
                  style={{ padding: '8px 12px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Usuario</label>
                <input 
                  type="text" 
                  value={newUser.username} 
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} 
                  placeholder="Ej. maria" 
                  required 
                  style={{ padding: '8px 12px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Contraseña</label>
                <input 
                  type="text" 
                  value={newUser.password} 
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                  placeholder="Contraseña segura" 
                  required 
                  style={{ padding: '8px 12px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Rol / Permisos</label>
                <select 
                  value={newUser.role} 
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CCC', width: '100%' }}
                >
                  <option value="tickets">Solo Tickets (ver/aprobar/rechazar)</option>
                  <option value="scanner">Solo Escáner (puerta)</option>
                  <option value="admin">Administrador Total</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '16px', padding: '10px 24px' }}>
              <UserPlus size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Crear Usuario
            </button>
          </form>

          {/* EXISTING USERS LIST */}
          <h4 style={{ color: 'var(--accent-coffee)', marginBottom: '12px' }}>Usuarios Registrados</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {adminUsers.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed #CCC', borderRadius: '12px' }}>
                Cargando usuarios...
              </div>
            ) : (
              adminUsers.map(u => (
                <div key={u.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#FAF8F5',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: '1px solid var(--accent-beige-border)',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--accent-coffee)' }}>{u.full_name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      @{u.username} · Rol: <span style={{ 
                        backgroundColor: u.role === 'admin' ? '#F59E0B' : u.role === 'tickets' ? '#3B82F6' : '#10B981',
                        color: '#FFF',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>{u.role === 'admin' ? 'Admin' : u.role === 'tickets' ? 'Tickets' : 'Scanner'}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteUser(u.id, u.username)}
                    style={{
                      backgroundColor: 'var(--color-red-light)',
                      color: 'var(--color-red)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  >
                    <Trash2 size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ATTENDEE RESPONSES MODAL */}
      {selectedAttendeesModal && (
        <div className="modal-overlay" onClick={() => setSelectedAttendeesModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--accent-beige-border)', display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
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
                    Persona #{i + 1}: {att.full_name} ({att.assigned_ticket_code && att.assigned_ticket_code.includes(' - ') && !att.assigned_ticket_code.startsWith('Fila') && !att.assigned_ticket_code.startsWith('Asiento') ? att.assigned_ticket_code.split(' - ').slice(1).join(' - ') : att.assigned_ticket_code})
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
            <div style={{ padding: '20px', borderBottom: '1px solid var(--accent-beige-border)', display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
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
                src={`${API_URL}${selectedReceipt.comprobante_url}`} 
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
