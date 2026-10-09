import React, { useEffect, useState, useMemo } from 'react';
import { Check, CheckCircle2, Download, Eye, Filter, Lock, LogOut, Plus, RefreshCw, Search, ShieldCheck, Ticket, Trash2, UserCheck, UserPlus, Users, X, XCircle, LayoutGrid, Globe, Tag, Heart, History, ArrowUp, ArrowDown, Settings, Layers, Armchair, CreditCard, Calendar, MessageCircle, Sparkles, Clock, Compass, Flame, ExternalLink, Image, Video, Upload, MapPin, Phone, Mail, Instagram, Facebook, Youtube, Radio } from 'lucide-react';
import AutenticasPromo from './AutenticasPromo';
import ModeloDeJesus from './ModeloDeJesus';
import CongresosPage from './CongresosPage';
import AppleHomeEditor from './AppleHomeEditor';
import AppleNosotrosEditor from './AppleNosotrosEditor';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function AdminDashboard({ adminUser, onLogin, onLogout, homepageConfig = {}, onSaveConfig, sections = [], onSaveSections }) {
  // 1. ALL HOOKS MUST BE DECLARED AT THE VERY TOP
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('admin_token');
    const headers = {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401 && !url.includes('/api/admin/login')) {
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
      if (onLogout) onLogout();
    }
    return response;
  };

  const [activeTab, setActiveTab] = useState(() => {
    if (adminUser) {
      if (adminUser.role === 'editor_autenticas') return 'autenticas';
      if (adminUser.role === 'editor_sanados') return 'sanados';
      if (adminUser.role === 'editor_modelo') return 'modelo';
      if (adminUser.role === 'editor_move') return 'move';
      if (adminUser.role === 'editor_tienda') return 'tienda';
      if (adminUser.role === 'scanner') return 'escanear';
    }
    return 'reservations';
  });

  const [activeSuite, setActiveSuite] = useState(() => {
    if (['church_web', 'oracion_admin', 'grupos_admin', 'events_admin', 'donaciones_admin', 'autenticas', 'sanados', 'modelo', 'move', 'tienda'].includes(activeTab)) return 'web';
    if (['users', 'activity_log'].includes(activeTab)) return 'system';
    return 'tickets';
  });

  const [activeEventId, setActiveEventId] = useState('autenticas-2026');

  const availableEvents = [
    {
      id: 'autenticas-2026',
      name: 'Congreso Mujeres Auténticas 2026',
      date: '18-19 Nov 2026',
      status: 'Activo',
      badgeColor: '#10B981'
    },
    {
      id: 'sanados-2026',
      name: 'Noche de Milagros - Sanados para Sanar 2026',
      date: '28 Nov 2026',
      status: 'Próximo',
      badgeColor: '#0071E3'
    },
    {
      id: 'liderazgo-2027',
      name: 'Congreso Internacional de Liderazgo 2027',
      date: 'Feb 2027',
      status: 'Proyección 2027',
      badgeColor: '#977DFF'
    }
  ];

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

  const [footerContacts, setFooterContacts] = useState([]);
  const [footerSocials, setFooterSocials] = useState([]);
  const [navbarLinks, setNavbarLinks] = useState([]);

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
    contact_phone_2: '',
    maps_google_url: '',
    maps_waze_url: '',
    navbar_links: '[]',
    autenticas_hero_bg: '',
    autenticas_title: '',
    autenticas_subtitle: '',
    autenticas_description: '',
    autenticas_date_info: '',
    autenticas_place_info: '',
    autenticas_price_info: '',
    autenticas_waze_url: '',
    autenticas_maps_url: '',
    autenticas_presale_end: '',
    autenticas_date_countdown: '',
    autenticas_price_general_presale: '',
    autenticas_price_general_regular: '',
    autenticas_price_gold_presale: '',
    autenticas_price_gold_regular: '',
    autenticas_features_general: '',
    autenticas_features_gold: '',
    autenticas_gallery: '[]',
    vision_title: '',
    vision_text: '',
    mision_title: '',
    mision_text: '',
    valores_title: '',
    valores_text: '',
    sanados_hero_bg: '',
    sanados_title: '',
    sanados_subtitle: '',
    modelo_hero_bg: '',
    modelo_title: '',
    modelo_subtitle: '',
    move_hero_bg: '',
    move_title: '',
    move_subtitle: '',
    tienda_hero_bg: '',
    tienda_title: '',
    tienda_subtitle: ''
  });

  // User management state
  const [adminUsers, setAdminUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', full_name: '', role: 'tickets' });
  const [editingUser, setEditingUser] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [uploadingScheduleBg, setUploadingScheduleBg] = useState(false);

  const [localSchedules, setLocalSchedules] = useState([]);
  const [localButtons, setLocalButtons] = useState([]);
  const [localNewsItems, setLocalNewsItems] = useState([]);
  const [localAutenticasGallery, setLocalAutenticasGallery] = useState([]);
  const [localAutenticasSpeakers, setLocalAutenticasSpeakers] = useState([]);
  const [localModeloNetworks, setLocalModeloNetworks] = useState([]);
  const [localEventsList, setLocalEventsList] = useState([]);
  const [uploadingSpeakerImage, setUploadingSpeakerImage] = useState(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingAutenticasHero, setUploadingAutenticasHero] = useState(false);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  const [uploadingNewsImage, setUploadingNewsImage] = useState(null);
  const [uploadingBgName, setUploadingBgName] = useState('');

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [autenticasSuccessMsg, setAutenticasSuccessMsg] = useState('');
  const [constructionSuccessMsg, setConstructionSuccessMsg] = useState('');

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedAttendeesModal, setSelectedAttendeesModal] = useState(null);
  const [editingAmountId, setEditingAmountId] = useState(null);
  const [editingAmountValue, setEditingAmountValue] = useState(0);
  const [reassigningAttendeeId, setReassigningAttendeeId] = useState(null);
  const [freeSeatsForReassign, setFreeSeatsForReassign] = useState([]);
  const [selectedNewSeat, setSelectedNewSeat] = useState('');
  const [reassigningLoading, setReassigningLoading] = useState(false);

  const [localSections, setLocalSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [builderPagePath, setBuilderPagePath] = useState('/nosotros');
  const [activeWebPage, setActiveWebPage] = useState('nosotros');
  const [localNosotrosCards, setLocalNosotrosCards] = useState([]);
  const [localPastoresProfiles, setLocalPastoresProfiles] = useState([]);
  const [uploadingNosotrosHero, setUploadingNosotrosHero] = useState(false);
  const [uploadingNosotrosCardImage, setUploadingNosotrosCardImage] = useState(null);
  const [uploadingPastorImage, setUploadingPastorImage] = useState(null);
  const [builderSuccessMsg, setBuilderSuccessMsg] = useState('');
  const [savingBuilder, setSavingBuilder] = useState(false);
  const [showAddComponentModal, setShowAddComponentModal] = useState(false);

  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaTarget, setMediaTarget] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [mediaSearch, setMediaSearch] = useState('');
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Zone & Seating Layout Management State
  const [zoneAnalytics, setZoneAnalytics] = useState(null);
  const [loadingZoneAnalytics, setLoadingZoneAnalytics] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [zoneRowsDraft, setZoneRowsDraft] = useState([]);
  const [zoneQuickRows, setZoneQuickRows] = useState(10);
  const [zoneQuickSeats, setZoneQuickSeats] = useState(10);
  const [zoneSuccessMsg, setZoneSuccessMsg] = useState('');
  const [zoneSaving, setZoneSaving] = useState(false);

  // Prayers & Testimonies State
  const [prayersList, setPrayersList] = useState([]);
  const [testimoniesList, setTestimoniesList] = useState([]);
  const [loadingPrayers, setLoadingPrayers] = useState(false);
  const [loadingTestimonies, setLoadingTestimonies] = useState(false);
  const [prayerFilterType, setPrayerFilterType] = useState('all');
  const [prayerFilterStatus, setPrayerFilterStatus] = useState('all');
  const [testimonyFilterApproved, setTestimonyFilterApproved] = useState('all');

  const fetchAdminPrayers = async () => {
    setLoadingPrayers(true);
    try {
      const res = await authFetch(`${API_URL}/api/admin/prayers`);
      const data = await res.json();
      if (data.success) setPrayersList(data.prayers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPrayers(false);
    }
  };

  const fetchAdminTestimonies = async () => {
    setLoadingTestimonies(true);
    try {
      const res = await authFetch(`${API_URL}/api/admin/testimonies`);
      const data = await res.json();
      if (data.success) setTestimoniesList(data.testimonies || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTestimonies(false);
    }
  };

  const handleUpdatePrayerStatus = async (id, status) => {
    try {
      const res = await authFetch(`${API_URL}/api/admin/prayers/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setPrayersList(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePrayer = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta petición de oración?')) return;
    try {
      const res = await authFetch(`${API_URL}/api/admin/prayers/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPrayersList(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTestimonyApproval = async (id, currentApproved) => {
    const nextVal = currentApproved ? 0 : 1;
    try {
      const res = await authFetch(`${API_URL}/api/admin/testimonies/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: nextVal })
      });
      const data = await res.json();
      if (data.success) {
        setTestimoniesList(prev => prev.map(t => t.id === id ? { ...t, is_approved: nextVal } : t));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTestimony = async (id) => {
    if (!window.confirm('¿Deseas eliminar este testimonio?')) return;
    try {
      const res = await authFetch(`${API_URL}/api/admin/testimonies/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setTestimoniesList(prev => prev.filter(t => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Grupos de Amistad & Lead Requests State
  const [adminGroupsList, setAdminGroupsList] = useState([]);
  const [adminGroupContactsList, setAdminGroupContactsList] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingGroupContacts, setLoadingGroupContacts] = useState(false);
  const [groupFilterZone, setGroupFilterZone] = useState('all');
  const [contactFilterStatus, setContactFilterStatus] = useState('all');
  const [editingGroupModal, setEditingGroupModal] = useState(null); // null or group object

  const fetchAdminGroups = async () => {
    setLoadingGroups(true);
    try {
      const res = await authFetch(`${API_URL}/api/admin/friendship-groups`);
      const data = await res.json();
      if (data.success) setAdminGroupsList(data.groups || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchAdminGroupContacts = async () => {
    setLoadingGroupContacts(true);
    try {
      const res = await authFetch(`${API_URL}/api/admin/group-contacts`);
      const data = await res.json();
      if (data.success) setAdminGroupContactsList(data.contacts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGroupContacts(false);
    }
  };

  const handleSaveGroupSubmit = async (e) => {
    e.preventDefault();
    if (!editingGroupModal) return;
    const isNew = !editingGroupModal.id;
    const url = isNew ? `${API_URL}/api/admin/friendship-groups` : `${API_URL}/api/admin/friendship-groups/${editingGroupModal.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGroupModal)
      });
      const data = await res.json();
      if (data.success) {
        setEditingGroupModal(null);
        fetchAdminGroups();
      } else {
        alert(data.message || 'Error guardando el grupo.');
      }
    } catch (err) {
      alert('Error de red guardando el grupo.');
    }
  };

  const handleDeleteGroup = async (id) => {
    if (!window.confirm('¿Deseas eliminar este Grupo de Amistad?')) return;
    try {
      const res = await authFetch(`${API_URL}/api/admin/friendship-groups/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAdminGroupsList(prev => prev.filter(g => g.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateGroupContactStatus = async (id, status) => {
    try {
      const res = await authFetch(`${API_URL}/api/admin/group-contacts/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setAdminGroupContactsList(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteGroupContact = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta solicitud de contacto?')) return;
    try {
      const res = await authFetch(`${API_URL}/api/admin/group-contacts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAdminGroupContactsList(prev => prev.filter(c => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const initializeDefaultSectionsForPath = (path) => {
    if (path === '/modelo') {
      return [
        {
          id: 'sec_hero_modelo',
          type: 'hero',
          content: {
            title: 'MODELO DE JESÚS',
            subtitle: 'MODELO DE DISCIPULADO Y MULTIPLICACIÓN',
            bgUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600',
            buttons: [{ id: '1', label: 'Conocer los 4 Pilares', url: '#pilares', style: 'primary' }]
          },
          styles: { backgroundColor: '#030812', textColor: '#FFFFFF', accentColor: '#977DFF' }
        },
        {
          id: 'sec_pilares_modelo',
          type: 'grid_cells',
          content: {
            title: 'LOS 4 PILARES DEL MODELO DE JESÚS',
            cells: [
              { title: '1. GANAR', text: 'Evangelizar a las personas con el mensaje del Evangelio de Jesucristo.' },
              { title: '2. CONSOLIDAR', text: 'Cuidar y afirmar la fe de cada nuevo creyente en la familia de Dios.' },
              { title: '3. DISCIPULAR', text: 'Equipar y capacitar espiritualmente a través de nuestras Escuelas de Liderazgo.' },
              { title: '4. ENVIAR', text: 'Enviar líderes capacitados a abrir nuevos grupos de amistad y multiplicar la visión.' }
            ]
          },
          styles: { backgroundColor: 'rgba(0, 3, 61, 0.45)', textColor: '#FFFFFF', accentColor: '#977DFF' }
        },
        {
          id: 'sec_pastores_modelo',
          type: 'pastors',
          content: {
            title: 'NUESTROS PASTORES Y LÍDERES',
            subtitle: 'EQUIPO DE COBERTURA ESPIRITUAL'
          },
          styles: { backgroundColor: '#030812', textColor: '#FFFFFF', accentColor: '#977DFF' }
        }
      ];
    }

    if (path === '/congresos') {
      return [
        {
          id: 'sec_hero_congresos',
          type: 'hero',
          content: {
            title: 'ADQUIERE ACCESOS A',
            subtitle: 'NUESTROS EVENTOS Y CONGRESOS',
            description: 'Descubre nuestras conferencias, congresos y actividades especiales. Selecciona el evento para ver detalles y reservar tu lugar.',
            bgUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600',
            buttons: [{ id: '1', label: 'Ver Eventos Disponibles', url: '#eventos-grid', style: 'primary' }]
          },
          styles: { backgroundColor: '#030812', textColor: '#FFFFFF', accentColor: '#977DFF' }
        },
        {
          id: 'sec_news_congresos',
          type: 'news',
          content: {
            title: 'CATÁLOGO DE EVENTOS',
            newsItems: [
              {
                id: 'autenticas',
                title: 'Congreso Mujeres Auténticas 2026',
                subtitle: 'EDICIÓN ESPECIAL • MUJER VALIENTE',
                badge: 'ENTRADAS DISPONIBLES',
                link: '/autenticas',
                description: 'El congreso anual de mujeres que marcará un antes y un después.',
                image: '/logo.png'
              },
              {
                id: 'sanados',
                title: 'SANADOS PARA SANAR',
                subtitle: 'MILAGROS Y RESTAURACIÓN',
                badge: 'PRÓXIMAMENTE',
                link: '/sanados',
                description: 'Un tiempo consagrado para recibir sanidad divina y restauración integral.',
                image: '/logo_oficial_transparente.png'
              }
            ]
          },
          styles: { backgroundColor: '#030812', textColor: '#FFFFFF', accentColor: '#977DFF' }
        }
      ];
    }

    if (path === '/nosotros') {
      return [
        {
          id: 'sec_hero_nosotros',
          type: 'hero',
          content: {
            title: 'NOSOTROS - VISIÓN JESÚS',
            subtitle: 'CONOCÉ NUESTRA HISTORIA Y VISIÓN',
            bgUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600'
          },
          styles: { backgroundColor: '#030812', textColor: '#FFFFFF', accentColor: '#977DFF' }
        },
        {
          id: 'sec_historia_nosotros',
          type: 'image_text',
          content: {
            title: 'Nuestra Historia',
            text: 'Somos una iglesia comprometida con la palabra de Dios y la transformación de las vidas...'
          },
          styles: { backgroundColor: '#030812', textColor: '#FFFFFF', accentColor: '#977DFF' }
        },
        {
          id: 'sec_pastores_nosotros',
          type: 'pastors',
          content: {
            title: 'NUESTROS PASTORES PRINCIPALES'
          },
          styles: { backgroundColor: '#030812', textColor: '#FFFFFF', accentColor: '#977DFF' }
        }
      ];
    }

    if (path === '/autenticas') {
      return [
        {
          id: 'sec_hero_autenticas',
          type: 'hero',
          content: {
            title: homepageConfig.autenticas_title || 'AUTÉNTICAS',
            subtitle: homepageConfig.autenticas_subtitle || 'CONGRESO DE MUJERES',
            bgUrl: homepageConfig.autenticas_hero_bg || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600',
            buttons: [{ id: '1', label: 'Comprar Entradas', url: '#map-selection-section', style: 'primary' }]
          },
          styles: { backgroundColor: '#2C1A0E', textColor: '#FFFFFF', accentColor: '#FAF5EF' }
        },
        {
          id: 'sec_desc_autenticas',
          type: 'image_text',
          content: {
            title: 'Acerca del Congreso',
            text: homepageConfig.autenticas_description || 'Un congreso especial diseñado para empoderar, sanar y restaurar la vida de cada mujer...',
            bgUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000',
            imagePosition: 'left'
          },
          styles: { backgroundColor: '#FFFFFF', textColor: '#2C1A0E', accentColor: '#2C1A0E' }
        }
      ];
    }

    const pageName = path.replace('/', '').toUpperCase() || 'INICIO';
    return [
      {
        id: `sec_hero_${pageName}`,
        type: 'hero',
        content: {
          title: `PÁGINA ${pageName}`,
          subtitle: 'Bienvenido a Visión Jesús',
          bgUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600'
        },
        styles: { backgroundColor: '#030812', textColor: '#FFFFFF', accentColor: '#977DFF' }
      }
    ];
  };

  const fetchSectionsForPath = async (path) => {
    try {
      const res = await fetch(`${API_URL}/api/landing/sections?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (data.success) {
        if (data.sections && data.sections.length > 0) {
          setLocalSections(data.sections);
        } else {
          setLocalSections(initializeDefaultSectionsForPath(path));
        }
      }
    } catch (e) {
      console.error('Error fetching sections for path:', e);
    }
  };

  useEffect(() => {
    fetchSectionsForPath(builderPagePath);
  }, [builderPagePath]);

  const formatCRC = (val) => `₡${Number(val).toLocaleString('es-CR')}`;

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_URL}/api/admin/reservations`);
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

  const handleUpdateAmount = async (id, amount) => {
    try {
      const res = await authFetch(`${API_URL}/api/admin/reservations/${id}/amount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      const data = await res.json();
      if (data.success) {
        setEditingAmountId(null);
        fetchReservations();
      } else {
        alert(data.message || 'Error al actualizar el monto.');
      }
    } catch (err) {
      alert('Error de red al intentar actualizar el monto.');
    }
  };

  const handleOpenReassignSeat = async (attendee, reservation) => {
    setReassigningAttendeeId(attendee.id);
    setSelectedNewSeat('');
    setFreeSeatsForReassign([]);
    try {
      const res = await authFetch(`${API_URL}/api/admin/zones/${reservation.zone_id}/free-seats`);
      const data = await res.json();
      if (data.success) {
        setFreeSeatsForReassign(data.freeSeats || []);
      }
    } catch (err) {
      console.error('Error fetching free seats:', err);
    }
  };

  const handleReassignSeat = async (attendeeId) => {
    if (!selectedNewSeat) {
      alert('Por favor selecciona un asiento nuevo.');
      return;
    }
    setReassigningLoading(true);
    try {
      const res = await authFetch(`${API_URL}/api/admin/attendees/${attendeeId}/reassign-seat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_ticket_code: selectedNewSeat })
      });
      const data = await res.json();
      if (data.success) {
        setReassigningAttendeeId(null);
        fetchReservations(); // Refresh to show new seat
      } else {
        alert(data.message || 'Error al reasignar el asiento.');
      }
    } catch (err) {
      alert('Error de red al intentar reasignar el asiento.');
    } finally {
      setReassigningLoading(false);
    }
  };

  const parseTicketCode = (ticketCode) => {
    const match = ticketCode.match(/^([A-Z\-]+)-(\d+)$/);
    if (!match) return { rowLabel: 'Otro', seatNum: ticketCode };
    const prefix = match[1];
    const queueIndex = parseInt(match[2], 10);
    const getRowSeat = (qIndex, seatsPerRow, offsetRows = 0) => {
      const zeroBased = qIndex - 1;
      const rowIndex = Math.floor(zeroBased / seatsPerRow) - offsetRows;
      const seatNumber = (zeroBased % seatsPerRow) + 1;
      return { rowIndex, seatNumber };
    };
    let rowLabel = "", seatNum = 0;
    if (prefix === 'VIP-CTR') {
      const r = getRowSeat(queueIndex, 9, 2);
      rowLabel = `Fila ${r.rowIndex + 3}`; seatNum = r.seatNumber;
    } else if (prefix === 'VIP-IZQ' || prefix === 'VIP-DER') {
      const r = getRowSeat(queueIndex, 8, 0);
      rowLabel = `Fila ${r.rowIndex + 1}`; seatNum = r.seatNumber;
    } else if (prefix === 'GEN-CTR') {
      const r = getRowSeat(queueIndex, 15, 0);
      const labels = ["Fila A", "Fila B", "Fila C", "Fila D", "Fila E", "Fila F", "Fila G", "Fila H", "Fila I", "Fila J"];
      rowLabel = labels[r.rowIndex] || `Fila ${r.rowIndex + 1}`; seatNum = r.seatNumber;
    } else if (prefix === 'GEN-IZQ' || prefix === 'GEN-DER') {
      const r = getRowSeat(queueIndex, 10, 0);
      const labels = ["Fila A", "Fila B", "Fila C", "Fila D", "Fila E", "Fila F", "Fila G", "Fila H", "Fila I", "Fila J"];
      rowLabel = labels[r.rowIndex] || `Fila ${r.rowIndex + 1}`; seatNum = r.seatNumber;
    } else {
      return { rowLabel: 'Otro', seatNum: ticketCode };
    }
    return { rowLabel, seatNum };
  };

  const fetchMediaList = async () => {
    setLoadingMedia(true);
    try {
      const res = await authFetch(`${API_URL}/api/admin/media`);
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media || []);
      }
    } catch (e) {
      console.error('Error fetching media:', e);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await authFetch(`${API_URL}/api/admin/landing/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        fetchMediaList();
      } else {
        alert(data.message || 'Error al subir el archivo.');
      }
    } catch (err) {
      alert('Error de red al subir el archivo.');
    }
  };

  const handleMediaDelete = async (filename) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este archivo de forma permanente de tu servidor?')) return;
    try {
      const res = await authFetch(`${API_URL}/api/admin/media/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchMediaList();
      } else {
        alert(data.message || 'Error al eliminar el archivo.');
      }
    } catch (err) {
      alert('Error de red.');
    }
  };

  const openMediaLibrary = (target) => {
    setMediaTarget(target);
    setShowMediaLibrary(true);
    fetchMediaList();
  };

  const selectMediaItem = (url) => {
    if (mediaTarget) {
      const [type, secId, field, subField] = mediaTarget;
      if (type === 'section') {
        setLocalSections(prev => prev.map(s => {
          if (s.id === secId) {
            return {
              ...s,
              content: {
                ...s.content,
                [field]: url
              }
            };
          }
          return s;
        }));
      } else if (type === 'section_news') {
        setLocalSections(prev => prev.map(s => {
          if (s.id === secId) {
            const list = [...(s.content.newsItems || [])];
            list[field] = { ...list[field], [subField]: url };
            return {
              ...s,
              content: {
                ...s.content,
                newsItems: list
              }
            };
          }
          return s;
        }));
      } else if (type === 'section_pastor') {
        setLocalSections(prev => prev.map(s => {
          if (s.id === secId) {
            const list = [...(s.content.pastors || [])];
            if (list[field]) {
              list[field] = { ...list[field], imageUrl: url };
            }
            return {
              ...s,
              content: {
                ...s.content,
                pastors: list
              }
            };
          }
          return s;
        }));
      } else if (type === 'section_grid') {
        setLocalSections(prev => prev.map(s => {
          if (s.id === secId) {
            const list = [...(s.content.cells || [])];
            if (list[field]) {
              list[field] = { ...list[field], imageUrl: url };
            }
            return {
              ...s,
              content: {
                ...s.content,
                cells: list
              }
            };
          }
          return s;
        }));
      }
    }
    setShowMediaLibrary(false);
    setMediaTarget(null);
  };

  const handleMoveSection = (index, direction) => {
    const newSections = [...localSections];
    if (direction === 'up' && index > 0) {
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;
    } else if (direction === 'down' && index < newSections.length - 1) {
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;
    }
    setLocalSections(newSections);
  };

  const handleDeleteSection = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta sección de la página principal?')) {
      const newSections = localSections.filter(s => s.id !== id);
      setLocalSections(newSections);
      if (selectedSectionId === id) setSelectedSectionId(null);
    }
  };

  const handleAddSection = (type) => {
    let newSec = {
      id: `sec_${type}_${Date.now()}`,
      type: type,
      content: {},
      styles: {
        backgroundColor: '#030812',
        textColor: '#FFFFFF',
        accentColor: '#0033FF'
      }
    };

    if (type === 'hero') {
      newSec.content = {
        title: 'Nueva Portada',
        subtitle: 'Descripción o lema de la portada',
        bgUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600',
        buttons: []
      };
    } else if (type === 'news') {
      newSec.content = { title: 'Noticias y Eventos' };
    } else if (type === 'pillars') {
      newSec.content = {
        title: 'Nuestros Valores',
        subtitle: 'Subtítulo del pilar',
        pillars: [
          { id: '1', title: 'Ejemplo 1', text: 'Descripción de ejemplo...', icon: 'Compass' }
        ]
      };
    } else if (type === 'schedules') {
      newSec.content = {
        title: 'Horarios',
        bgUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600',
        schedules: []
      };
    } else if (type === 'custom_text') {
      newSec.content = {
        title: 'Bloque de Texto',
        text: 'Escribe aquí tu contenido personalizado para la página principal.'
      };
    } else if (type === 'cta') {
      newSec.content = {
        title: '¡Llamado a la Acción!',
        bgUrl: '',
        buttonText: 'Hacer clic aquí',
        buttonUrl: '/autenticas'
      };
    } else if (type === 'image_text') {
      newSec.content = {
        title: 'Sección de Imagen y Texto',
        text: 'Contenido explicativo...',
        bgUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1000',
        imagePosition: 'left'
      };
    } else if (type === 'grid') {
      newSec.content = {
        title: 'Cuadrícula',
        columns: 4,
        cells: [
          { title: 'Principal', text: 'Elemento destacado', imageUrl: '', iconName: '', buttonText: '', buttonUrl: '', colSpan: 2, rowSpan: 2 },
          { title: 'Secundario 1', text: 'Descripción breve', imageUrl: '', iconName: '', buttonText: '', buttonUrl: '', colSpan: 2, rowSpan: 1 },
          { title: 'Secundario 2', text: 'Descripción breve', imageUrl: '', iconName: '', buttonText: '', buttonUrl: '', colSpan: 2, rowSpan: 1 }
        ]
      };
    } else if (type === 'pastors_profile') {
      newSec.content = {
        title: 'Pastores Principales',
        subtitle: 'Conoce a nuestros pastores',
        pastors: [
          {
            name: 'Pastor',
            role: 'Pastor Principal',
            description: 'Biografía del pastor...',
            imageUrl: '',
            instagramUrl: '',
            facebookUrl: ''
          }
        ]
      };
    }

    setLocalSections([...localSections, newSec]);
    setSelectedSectionId(newSec.id);
  };

  const handleUpdateSectionContent = (key, value) => {
    setLocalSections(prev => prev.map(s => {
      if (s.id === selectedSectionId) {
        return {
          ...s,
          content: {
            ...s.content,
            [key]: value
          }
        };
      }
      return s;
    }));
  };

  const handleUpdateSectionStyles = (key, value) => {
    setLocalSections(prev => prev.map(s => {
      if (s.id === selectedSectionId) {
        return {
          ...s,
          styles: {
            ...s.styles,
            [key]: value
          }
        };
      }
      return s;
    }));
  };

  const handleSavePageLayout = async () => {
    setSavingBuilder(true);
    setBuilderSuccessMsg('');
    try {
      const res = await authFetch(`${API_URL}/api/admin/landing/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: localSections, page_path: builderPagePath })
      });
      const data = await res.json();
      if (data.success) {
        setBuilderSuccessMsg('¡Estructura y diseño de la página guardados con éxito!');
        if (onSaveSections) onSaveSections();
      } else {
        alert(data.message || 'Error al guardar el diseño de la página.');
      }
    } catch (err) {
      alert('Error de red al guardar el diseño.');
    } finally {
      setSavingBuilder(false);
    }
  };

  const handleSectionImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await authFetch(`${API_URL}/api/admin/landing/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        handleUpdateSectionContent('bgUrl', data.url);
      } else {
        alert('Error al subir imagen.');
      }
    } catch (err) {
      alert('Error de red al subir imagen.');
    }
  };

  const fetchActivityLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await authFetch(`${API_URL}/api/admin/logs`);
      const data = await res.json();
      if (data.success) {
        setActivityLogs(data.logs);
      }
    } catch (err) {
      console.error('Error fetching activity logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchZoneAnalytics = async () => {
    setLoadingZoneAnalytics(true);
    try {
      const res = await authFetch(`${API_URL}/api/admin/zones/analytics`);
      const data = await res.json();
      if (data.success) {
        setZoneAnalytics(data);
      }
    } catch (e) {
      console.error('Error fetching zone analytics:', e);
    } finally {
      setLoadingZoneAnalytics(false);
    }
  };

  const handleStartEditZone = (zone) => {
    setEditingZoneId(zone.id);
    setZoneSuccessMsg('');
    const rows = zone.layout_config?.rows || [];
    setZoneRowsDraft(rows.map(r => ({ ...r })));
    setZoneQuickRows(rows.length > 0 ? rows.length : 10);
    const avgSeats = rows.length > 0 ? Math.round(rows.reduce((s, r) => s + (parseInt(r.seatsCount) || 0), 0) / rows.length) : 10;
    setZoneQuickSeats(avgSeats);
  };

  const handleApplyUniformRows = (numRows, seatsPerRow) => {
    const nRows = Math.max(1, parseInt(numRows) || 1);
    const nSeats = Math.max(1, parseInt(seatsPerRow) || 1);
    const newRows = [];
    const isGeneral = editingZoneId?.startsWith('lateral_') || editingZoneId === 'central_atras';
    const rowLetters = ["Fila A", "Fila B", "Fila C", "Fila D", "Fila E", "Fila F", "Fila G", "Fila H", "Fila I", "Fila J", "Fila K", "Fila L", "Fila M", "Fila N", "Fila O"];

    for (let i = 0; i < nRows; i++) {
      const label = isGeneral 
        ? (rowLetters[i] || `Fila ${i + 1}`) 
        : `Fila ${i + 1}`;
      
      const isReserved = editingZoneId === 'vip_central' && i === 0;
      newRows.push({
        rowLabel: label,
        seatsCount: nSeats,
        isReserved
      });
    }
    setZoneRowsDraft(newRows);
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...zoneRowsDraft];
    updated[index] = { ...updated[index], [field]: value };
    setZoneRowsDraft(updated);
  };

  const handleAddRow = () => {
    const nextIdx = zoneRowsDraft.length + 1;
    const isGeneral = editingZoneId?.startsWith('lateral_') || editingZoneId === 'central_atras';
    const rowLetters = ["Fila A", "Fila B", "Fila C", "Fila D", "Fila E", "Fila F", "Fila G", "Fila H", "Fila I", "Fila J", "Fila K", "Fila L", "Fila M", "Fila N", "Fila O"];
    const label = isGeneral ? (rowLetters[zoneRowsDraft.length] || `Fila ${nextIdx}`) : `Fila ${nextIdx}`;
    setZoneRowsDraft([...zoneRowsDraft, { rowLabel: label, seatsCount: 10, isReserved: false }]);
  };

  const handleRemoveRow = (index) => {
    if (zoneRowsDraft.length <= 1) {
      alert('La zona debe tener al menos 1 fila.');
      return;
    }
    const updated = zoneRowsDraft.filter((_, i) => i !== index);
    setZoneRowsDraft(updated);
  };

  const handleSaveZoneLayout = async (zoneId) => {
    setZoneSaving(true);
    setZoneSuccessMsg('');
    try {
      const res = await authFetch(`${API_URL}/api/admin/zones/layout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneId,
          rows: zoneRowsDraft,
          username: adminUser?.full_name || adminUser?.username || 'Admin'
        })
      });
      const data = await res.json();
      if (data.success) {
        setZoneSuccessMsg(data.message);
        setEditingZoneId(null);
        fetchZoneAnalytics();
        if (onSaveConfig) onSaveConfig();
      } else {
        alert(data.message || 'Error al guardar la configuración.');
      }
    } catch (e) {
      alert('Error de red al guardar la configuración de la zona.');
    } finally {
      setZoneSaving(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      fetchReservations();
    }
  }, [adminUser]);

  useEffect(() => {
    if (adminUser && activeTab === 'activity_log') {
      fetchActivityLogs();
    }
    if (adminUser && activeTab === 'zones_seating') {
      fetchZoneAnalytics();
    }
    if (adminUser && activeTab === 'oracion_admin') {
      fetchAdminPrayers();
      fetchAdminTestimonies();
    }
    if (adminUser && activeTab === 'grupos_admin') {
      fetchAdminGroups();
      fetchAdminGroupContacts();
    }
  }, [adminUser, activeTab]);

  // Sync configFields with incoming homepageConfig prop
  useEffect(() => {
    if (homepageConfig && Object.keys(homepageConfig).length > 0) {
      let parsedSchedules = [];
      if (homepageConfig.schedules !== undefined && homepageConfig.schedules !== null) {
        try {
          parsedSchedules = typeof homepageConfig.schedules === 'string' ? JSON.parse(homepageConfig.schedules) : homepageConfig.schedules;
        } catch (e) {
          console.error('Error parsing schedules:', e);
          parsedSchedules = [];
        }
      } else {
        parsedSchedules = [
          { id: '1', text: homepageConfig.schedule_thursday || 'JUEVES 7:30PM', isVirtual: false },
          { id: '2', text: homepageConfig.schedule_saturday || 'SÁBADOS 5:30PM', isVirtual: false },
          { id: '3', text: homepageConfig.schedule_sunday_1 || 'DOMINGOS 9:00AM', isVirtual: false },
          { id: '4', text: homepageConfig.schedule_sunday_2 || 'DOMINGOS 11:00AM', isVirtual: false },
          { id: '5', text: homepageConfig.schedule_sunday_virtual || 'DOMINGOS (VIRTUAL) 5:30PM', isVirtual: true }
        ];
      }
      setLocalSchedules(Array.isArray(parsedSchedules) ? parsedSchedules : []);

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

      // Parse Autenticas Gallery
      let parsedAutenticasGallery = [];
      try {
        if (homepageConfig.autenticas_gallery) {
          parsedAutenticasGallery = typeof homepageConfig.autenticas_gallery === 'string' ? JSON.parse(homepageConfig.autenticas_gallery) : homepageConfig.autenticas_gallery;
        }
      } catch (e) {
        console.error('Error parsing Autenticas gallery:', e);
      }
      setLocalAutenticasGallery(parsedAutenticasGallery || []);

      let parsedAutenticasSpeakers = [];
      try {
        if (homepageConfig.autenticas_speakers) {
          parsedAutenticasSpeakers = typeof homepageConfig.autenticas_speakers === 'string' ? JSON.parse(homepageConfig.autenticas_speakers) : homepageConfig.autenticas_speakers;
        }
      } catch (e) {
        console.error('Error parsing Autenticas speakers:', e);
      }
      setLocalAutenticasSpeakers(parsedAutenticasSpeakers || []);

      let parsedContacts = [];
      try {
        if (homepageConfig.footer_contacts) {
          parsedContacts = JSON.parse(homepageConfig.footer_contacts);
        }
      } catch(e) {}
      if (parsedContacts.length === 0) {
        parsedContacts = [
          { label: 'Correo', value: homepageConfig.contact_email || 'info@somosimpact.com', type: 'email' },
          { label: 'Teléfono', value: homepageConfig.contact_phone_1 || '+506 4115 1212', type: 'phone' },
          { label: 'WhatsApp', value: homepageConfig.contact_phone_2 || '+506 6453 1212', type: 'phone' }
        ];
      }
      setFooterContacts(parsedContacts);

      let parsedSocials = [];
      try {
        if (homepageConfig.footer_socials) {
          parsedSocials = JSON.parse(homepageConfig.footer_socials);
        }
      } catch(e) {}
      if (parsedSocials.length === 0) {
        parsedSocials = [
          { platform: 'facebook', url: homepageConfig.social_fb || 'https://facebook.com/visionjesus' },
          { platform: 'instagram', url: homepageConfig.social_ig || 'https://instagram.com/visionjesus' },
          { platform: 'youtube', url: homepageConfig.social_yt || 'https://youtube.com/visionjesus' },
          { platform: 'spotify', url: homepageConfig.social_spotify || 'https://spotify.com/visionjesus' }
        ];
      }
      setFooterSocials(parsedSocials);

      let parsedNavLinks = [];
      try {
        if (homepageConfig.navbar_links) {
          parsedNavLinks = JSON.parse(homepageConfig.navbar_links);
        }
      } catch(e) {}
      if (parsedNavLinks.length === 0) {
        parsedNavLinks = [
          { label: 'Inicio', url: '/', isButton: false },
          { label: 'Congreso Mujeres', url: '/autenticas', isButton: false },
          { label: 'Conocé la Visión', url: '#vision', isButton: false },
          { label: 'Prédicas y Horarios', url: '#schedules', isButton: false },
          { label: 'Contacto', url: '#footer', isButton: false }
        ];
      }
      setNavbarLinks(parsedNavLinks);

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
        contact_phone_2: homepageConfig.contact_phone_2 || '',
        maps_google_url: homepageConfig.maps_google_url || '',
        maps_waze_url: homepageConfig.maps_waze_url || '',
        navbar_links: homepageConfig.navbar_links || '[]',
        autenticas_hero_bg: homepageConfig.autenticas_hero_bg || '',
        autenticas_title: homepageConfig.autenticas_title || '',
        autenticas_subtitle: homepageConfig.autenticas_subtitle || '',
        autenticas_description: homepageConfig.autenticas_description || '',
        autenticas_date_info: homepageConfig.autenticas_date_info || '',
        autenticas_place_info: homepageConfig.autenticas_place_info || '',
        autenticas_price_info: homepageConfig.autenticas_price_info || '',
        autenticas_waze_url: homepageConfig.autenticas_waze_url || '',
        autenticas_maps_url: homepageConfig.autenticas_maps_url || '',
        autenticas_presale_end: homepageConfig.autenticas_presale_end || '',
        autenticas_date_countdown: homepageConfig.autenticas_date_countdown || '',
        autenticas_price_general_presale: homepageConfig.autenticas_price_general_presale || '',
        autenticas_price_general_regular: homepageConfig.autenticas_price_general_regular || '',
        autenticas_price_gold_presale: homepageConfig.autenticas_price_gold_presale || '',
        autenticas_price_gold_regular: homepageConfig.autenticas_price_gold_regular || '',
        autenticas_features_general: homepageConfig.autenticas_features_general || '',
        autenticas_features_gold: homepageConfig.autenticas_features_gold || '',
        autenticas_gallery: homepageConfig.autenticas_gallery || '[]',
        vision_title: homepageConfig.vision_title || '',
        vision_text: homepageConfig.vision_text || '',
        mision_title: homepageConfig.mision_title || '',
        mision_text: homepageConfig.mision_text || '',
        valores_title: homepageConfig.valores_title || '',
        valores_text: homepageConfig.valores_text || '',
        sanados_hero_bg: homepageConfig.sanados_hero_bg || '',
        sanados_title: homepageConfig.sanados_title || '',
        sanados_subtitle: homepageConfig.sanados_subtitle || '',
        modelo_hero_bg: homepageConfig.modelo_hero_bg || '',
        modelo_title: homepageConfig.modelo_title || '',
        modelo_subtitle: homepageConfig.modelo_subtitle || '',
        move_hero_bg: homepageConfig.move_hero_bg || '',
        move_title: homepageConfig.move_title || '',
        move_subtitle: homepageConfig.move_subtitle || '',
        tienda_hero_bg: homepageConfig.tienda_hero_bg || '',
        tienda_title: homepageConfig.tienda_title || '',
        tienda_subtitle: homepageConfig.tienda_subtitle || '',
        donar_title: homepageConfig.donar_title || 'DONACIONES Y OFRENDAS',
        donar_subtitle: homepageConfig.donar_subtitle || 'Generosidad que transforma vidas y expande el Reino de Dios',
        donar_verse: homepageConfig.donar_verse || 'Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre.',
        donar_verse_ref: homepageConfig.donar_verse_ref || '2 Corintios 9:7',
        sinpe_phone: homepageConfig.sinpe_phone || '8888-8888',
        sinpe_display: homepageConfig.sinpe_display || '8888-8888',
        sinpe_holder: homepageConfig.sinpe_holder || 'Iglesia Visión Jesús',
        iban_bncr_crc: homepageConfig.iban_bncr_crc || 'CR05015100010012345678',
        iban_bncr_usd: homepageConfig.iban_bncr_usd || 'CR05015100010087654321',
        iban_bac_crc: homepageConfig.iban_bac_crc || 'CR05010200009876543210',
        iban_bac_usd: homepageConfig.iban_bac_usd || 'CR05010200001234567890',
        legal_transparency_note: homepageConfig.legal_transparency_note || 'Iglesia Visión Jesús es una entidad legalmente constituida en Costa Rica. Todas las ofrendas y diezmos son administrados con transparencia para la obra del Evangelio.',
        nosotros_title: homepageConfig.nosotros_title || 'NOSOTROS • VISIÓN JESÚS',
        nosotros_subtitle: homepageConfig.nosotros_subtitle || 'Una iglesia apasionada por la presencia de Dios, la familia y el discipulado.',
        nosotros_hero_bg: homepageConfig.nosotros_hero_bg || ''
      });

      setPricingFields({
        presale_cutoff_date: homepageConfig.presale_cutoff_date || '2026-08-15',
        vip_presale_price: homepageConfig.vip_presale_price || '12000',
        vip_regular_price: homepageConfig.vip_regular_price || '15000',
        general_presale_price: homepageConfig.general_presale_price || '7500',
        general_regular_price: homepageConfig.general_regular_price || '10000'
      });

      // Parse Modelo Networks
      let parsedModelo = [];
      try {
        if (homepageConfig.modelo_networks) {
          parsedModelo = typeof homepageConfig.modelo_networks === 'string' ? JSON.parse(homepageConfig.modelo_networks) : homepageConfig.modelo_networks;
        }
      } catch (e) {
        console.error('Error parsing modelo_networks in admin:', e);
      }
      if (!parsedModelo || parsedModelo.length === 0) {
        parsedModelo = [
          { id: 'vj-kids', name: 'VJ Kids', badge: 'Red de Niños', age: 'De 0 a 9 años', iconName: 'Heart', logo: '', description: 'Trabajamos con niños en grupos de acuerdo a sus edades. Nuestras enseñanzas para los más pequeños están basadas en Principios y Valores del Reino.', image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=1000' },
          { id: 'prejuz-move', name: 'PreJuzMOVE', badge: 'Red de Preadolescentes', age: 'De 10 a 12 años', iconName: 'Flame', logo: '', description: 'Un espacio dinámico e interactivo diseñado especialmente para preadolescentes. Guiamos a los chicos en la transición clave hacia la juventud.', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000' },
          { id: 'move-teens', name: 'MOVE', badge: 'Red de Adolescentes', age: 'De 13 a 17 años', iconName: 'Sparkles', logo: '', description: 'Somos el espacio donde los adolescentes encuentran propósito, pertenencia y una relación sana con Dios.', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000' },
          { id: 'move-plus', name: 'MOVE PLUS', badge: 'Red de Jóvenes Adultos', age: 'De 18 en adelante', iconName: 'Award', logo: '', description: 'Una generación determinada a dejar huella en nuestro país y fronteras. Formamos jóvenes con identidad, carácter y crecimiento integral.', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000' },
          { id: 'fuxion', name: 'FUXION', badge: 'Red de Adultos', age: 'Adultos y Familias', iconName: 'Shield', logo: '', description: 'Unidos en fe, familia y propósito. Nos enfocamos en consolidar la unidad familiar, matrimonios fuertes y el crecimiento espiritual.', image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000' },
          { id: 'diamante', name: 'DIAMANTE', badge: 'Red de Adultos Mayores', age: 'Adultos Mayores / Plenitud', iconName: 'Gem', logo: '', description: 'Un espacio de honra, fraternidad y legado. Promovemos una plenitud activa en fe, compartiendo la sabiduría acumulada y el gozo.', image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000' }
        ];
      }
      setLocalModeloNetworks(parsedModelo);

      // Parse Events List
      let parsedEvents = [];
      try {
        if (homepageConfig.events_list) {
          parsedEvents = typeof homepageConfig.events_list === 'string' ? JSON.parse(homepageConfig.events_list) : homepageConfig.events_list;
        }
      } catch (e) {
        console.error('Error parsing events_list in admin:', e);
      }
      if (!parsedEvents || parsedEvents.length === 0) {
        parsedEvents = [
          { id: 'autenticas', year: '2026', category: 'Congresos', title: 'Congreso Mujeres Auténticas 2026', subtitle: 'Edición Especial • Sanidad & Dignidad', status: 'Entradas Disponibles', date: 'Viernes 18 y Sábado 19 de Noviembre, 2026', time: '7:00 PM', location: 'Auditorio Visión Jesús, Desamparados, CR', image: homepageConfig.autenticas_hero_bg || '/logo_oficial_transparente.png', description: 'El congreso anual para mujeres que deciden sanar sus heridas.', url: '/autenticas', priceInfo: 'Gold: ₡12.000 / General: ₡7.500' },
          { id: 'sanados', year: '2026', category: 'Adoración', title: 'Noche de Milagros - Sanados para Sanar 2026', subtitle: 'Unción, Sanidad Interior y Restauración', status: 'Entrada Libre', date: 'Sábado 28 de Noviembre, 2026', time: '6:30 PM', location: 'Auditorio Principal Visión Jesús', image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1000', description: 'Un tiempo especial consagrado para la intercesión.', url: '/oracion', priceInfo: 'Entrada Gratuita' },
          { id: 'liderazgo2027', year: '2027', category: 'Congresos', title: 'Congreso Internacional de Liderazgo 2027', subtitle: 'Equipamiento & Visión del Reino', status: 'Proyección 2027', date: 'Febrero 2027', time: 'Por Confirmar', location: 'Auditorio Principal Visión Jesús', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000', description: 'Capacitación intensiva para pastores y servidores.', url: '/modelo', priceInfo: 'Inscripciones en Enero 2027' }
        ];
      }
      setLocalEventsList(parsedEvents);

      // Parse Nosotros Cards
      let parsedNosotrosCards = [];
      try {
        if (homepageConfig.nosotros_cards) {
          parsedNosotrosCards = typeof homepageConfig.nosotros_cards === 'string' ? JSON.parse(homepageConfig.nosotros_cards) : homepageConfig.nosotros_cards;
        }
      } catch (e) {
        console.error('Error parsing nosotros_cards in admin:', e);
      }
      if (!parsedNosotrosCards || parsedNosotrosCards.length === 0) {
        parsedNosotrosCards = [
          {
            id: 'vj-kids',
            title: 'VJ KIDS',
            tagline: 'FE Y DIVERSIÓN PARA LOS PEQUEÑOS',
            description: 'Un espacio especialmente preparado para que niños y niñas aprendan de la Palabra de Dios a través de dinámicas, alabanzas y enseñanzas interactivas.',
            badge: 'CADA SERVICIO',
            icon: 'Sparkles',
            image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=800'
          },
          {
            id: 'cafeteria',
            title: 'CAFETERÍA VISIÓN',
            tagline: 'COMPAÑERISMO Y CAFÉ DE ESPECIALIDAD',
            description: 'El lugar perfecto para conectar en comunidad, disfrutar de deliciosas bebidas y bocadillos, y compartir momentos especiales en familia antes y después del servicio.',
            badge: 'ABIERTO EN SERVICIOS',
            icon: 'Coffee',
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800'
          },
          {
            id: 'grupos-amistad',
            title: 'GRUPOS DE AMISTAD',
            tagline: 'CRECER EN FAMILIA Y COMUNIDAD',
            description: 'Nuestra red de grupos pequeños y Casas de Paz distribuidas por cantones y zonas. Un ambiente cálido para edificar la fe, orar unos por otros y hacer verdaderos amigos.',
            badge: 'SEMANAL',
            icon: 'Users',
            image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800',
            link: '/grupos-de-amistad'
          }
        ];
      }
      setLocalNosotrosCards(parsedNosotrosCards);

      // Parse Pastores Profiles
      let parsedPastores = [];
      try {
        if (homepageConfig.pastores_profiles) {
          parsedPastores = typeof homepageConfig.pastores_profiles === 'string' ? JSON.parse(homepageConfig.pastores_profiles) : homepageConfig.pastores_profiles;
        }
      } catch (e) {
        console.error('Error parsing pastores_profiles in admin:', e);
      }
      if (!parsedPastores || parsedPastores.length === 0) {
        parsedPastores = [
          {
            id: 'pastores-principales',
            name: 'Pastores Principales',
            role: 'Liderazgo Pastoral',
            bio: 'Guiando a la congregación con un corazón dispuesto a servir, predicar la verdad del Evangelio y formar discípulos de Jesucristo.',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800'
          }
        ];
      }
      setLocalPastoresProfiles(parsedPastores);
    }
  }, [homepageConfig]);

  // Sincronizar precios específicos del evento activo seleccionado
  useEffect(() => {
    const prefix = activeEventId === 'autenticas-2026' ? '' : `${activeEventId}_`;
    const defaultCutoff = activeEventId === 'autenticas-2026' ? '2026-08-15' : activeEventId === 'sanados-2026' ? '2026-11-15' : '2027-01-20';
    const defaultVipPre = activeEventId === 'autenticas-2026' ? '12000' : activeEventId === 'sanados-2026' ? '10000' : '20000';
    const defaultVipReg = activeEventId === 'autenticas-2026' ? '15000' : activeEventId === 'sanados-2026' ? '12000' : '25000';
    const defaultGenPre = activeEventId === 'autenticas-2026' ? '7500' : activeEventId === 'sanados-2026' ? '5000' : '12000';
    const defaultGenReg = activeEventId === 'autenticas-2026' ? '10000' : activeEventId === 'sanados-2026' ? '7000' : '15000';

    setPricingFields({
      presale_cutoff_date: configFields[`${prefix}presale_cutoff_date`] || homepageConfig[`${prefix}presale_cutoff_date`] || defaultCutoff,
      vip_presale_price: configFields[`${prefix}vip_presale_price`] || homepageConfig[`${prefix}vip_presale_price`] || defaultVipPre,
      vip_regular_price: configFields[`${prefix}vip_regular_price`] || homepageConfig[`${prefix}vip_regular_price`] || defaultVipReg,
      general_presale_price: configFields[`${prefix}general_presale_price`] || homepageConfig[`${prefix}general_presale_price`] || defaultGenPre,
      general_regular_price: configFields[`${prefix}general_regular_price`] || homepageConfig[`${prefix}general_regular_price`] || defaultGenReg
    });
  }, [activeEventId]);

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setPricingFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePricingSubmit = async (e) => {
    e.preventDefault();
    setSavingPricing(true);
    setPricingSuccessMsg('');
    try {
      const prefix = activeEventId === 'autenticas-2026' ? '' : `${activeEventId}_`;
      const updatedConfig = {
        ...configFields,
        [`${prefix}presale_cutoff_date`]: pricingFields.presale_cutoff_date,
        [`${prefix}vip_presale_price`]: pricingFields.vip_presale_price,
        [`${prefix}vip_regular_price`]: pricingFields.vip_regular_price,
        [`${prefix}general_presale_price`]: pricingFields.general_presale_price,
        [`${prefix}general_regular_price`]: pricingFields.general_regular_price
      };
      setConfigFields(updatedConfig);

      if (activeEventId === 'autenticas-2026') {
        const res = await authFetch(`${API_URL}/api/admin/pricing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pricingFields)
        });
        const data = await res.json();
        if (!data.success) {
          alert(data.message || 'Error al guardar configuración de precios.');
          return;
        }
      } else {
        await authFetch(`${API_URL}/api/admin/homepage/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedConfig)
        });
      }

      const eventName = availableEvents.find(ev => ev.id === activeEventId)?.name || activeEventId;
      setPricingSuccessMsg(`¡Precios de "${eventName}" guardados con éxito!`);
      if (onSaveConfig) onSaveConfig(updatedConfig);
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
      const res = await authFetch(`${API_URL}/api/admin/homepage/upload`, {
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
      const res = await authFetch(`${API_URL}/api/admin/homepage/upload`, {
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

  // --- NOSOTROS CARDS & PASTORS HANDLERS ---
  const handleAddNosotrosCard = () => {
    setLocalNosotrosCards([
      ...localNosotrosCards,
      {
        id: Date.now().toString(),
        title: 'NUEVO ESPACIO',
        tagline: 'DESCRIPCIÓN BREVE',
        description: 'Escribe aquí la información sobre este espacio o ministerio...',
        badge: 'ACTIVO',
        image: 'https://images.unsplash.com/photo-1511649475669-e288648b2339?q=80&w=800',
        link: ''
      }
    ]);
  };

  const handleRemoveNosotrosCard = (id) => {
    setLocalNosotrosCards(localNosotrosCards.filter(c => c.id !== id));
  };

  const handleNosotrosCardChange = (id, field, value) => {
    setLocalNosotrosCards(localNosotrosCards.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleNosotrosCardImageUpload = async (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingNosotrosCardImage(id);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await authFetch(`${API_URL}/api/admin/homepage/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        handleNosotrosCardChange(id, 'image', data.url);
      } else {
        alert(data.message || 'Error al subir imagen.');
      }
    } catch (err) {
      alert('Error de red al subir la imagen.');
    } finally {
      setUploadingNosotrosCardImage(null);
    }
  };

  const handleAddPastor = () => {
    setLocalPastoresProfiles([
      ...localPastoresProfiles,
      {
        id: Date.now().toString(),
        name: 'Nuevo Pastor / Líder',
        role: 'Ministerio Pastoral',
        bio: 'Biografía o reseña de servicio ministerial...',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800'
      }
    ]);
  };

  const handleRemovePastor = (id) => {
    setLocalPastoresProfiles(localPastoresProfiles.filter(p => p.id !== id));
  };

  const handlePastorChange = (id, field, value) => {
    setLocalPastoresProfiles(localPastoresProfiles.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handlePastorImageUpload = async (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPastorImage(id);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await authFetch(`${API_URL}/api/admin/homepage/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        handlePastorChange(id, 'image', data.url);
      } else {
        alert(data.message || 'Error al subir foto.');
      }
    } catch (err) {
      alert('Error de red al subir foto.');
    } finally {
      setUploadingPastorImage(null);
    }
  };

  const handleNosotrosHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingNosotrosHero(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await authFetch(`${API_URL}/api/admin/homepage/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setConfigFields(prev => ({ ...prev, nosotros_hero_bg: data.url }));
        alert('¡Foto de portada de Nosotros actualizada!');
      } else {
        alert(data.message || 'Error al subir imagen.');
      }
    } catch (err) {
      alert('Error de red al subir la imagen.');
    } finally {
      setUploadingNosotrosHero(false);
    }
  };

  const handleSaveNosotrosPageApple = async () => {
    setSaveLoading(true);
    setSaveSuccessMsg('');
    try {
      const updatedConfig = {
        ...configFields,
        nosotros_title: configFields.nosotros_title || 'NOSOTROS • VISIÓN JESÚS',
        nosotros_subtitle: configFields.nosotros_subtitle || 'Una iglesia apasionada por la presencia de Dios, la familia y el discipulado.',
        nosotros_hero_bg: configFields.nosotros_hero_bg || '',
        vision_title: configFields.vision_title || 'NUESTRA VISIÓN',
        vision_text: configFields.vision_text || '',
        mision_title: configFields.mision_title || 'NUESTRA MISIÓN',
        mision_text: configFields.mision_text || '',
        valores_title: configFields.valores_title || 'NUESTROS VALORES',
        valores_text: configFields.valores_text || '',
        nosotros_cards: JSON.stringify(localNosotrosCards),
        pastores_profiles: JSON.stringify(localPastoresProfiles)
      };

      const updatedSectionsForNosotros = [
        {
          id: 'sec_nosotros_hero',
          type: 'image_text',
          sequence_order: 1,
          content: {
            title: configFields.nosotros_title || 'NOSOTROS • VISIÓN JESÚS',
            text: configFields.nosotros_subtitle || 'Una iglesia apasionada por la presencia de Dios, la familia y el discipulado.',
            bgUrl: configFields.nosotros_hero_bg || configFields.hero_bg || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600',
            imagePosition: 'right'
          },
          styles: { backgroundColor: '#07070B', textColor: '#FFFFFF', accentColor: '#3B82F6' }
        },
        {
          id: 'sec_nosotros_pillars',
          type: 'pillars',
          sequence_order: 2,
          content: {
            title: 'FUNDAMENTOS CONGREGACIONALES',
            subtitle: 'Identidad y Propósito Divino',
            pillars: [
              { id: '1', title: configFields.vision_title || 'NUESTRA VISIÓN', text: configFields.vision_text || 'Evangelizar, Afirmar, Discipular y Enviar...', icon: 'Compass' },
              { id: '2', title: configFields.mision_title || 'NUESTRA MISIÓN', text: configFields.mision_text || 'Llevar el evangelio de Jesucristo con poder y amor...', icon: 'Heart' },
              { id: '3', title: configFields.valores_title || 'NUESTROS VALORES', text: configFields.valores_text || 'Amor Incondicional, Excelencia, Integridad...', icon: 'ShieldCheck' }
            ]
          },
          styles: { backgroundColor: '#0B0C10', textColor: '#FFFFFF', accentColor: '#977DFF' }
        },
        {
          id: 'sec_nosotros_grid',
          type: 'grid',
          sequence_order: 3,
          content: {
            title: 'Espacios Diseñados para Ti y Tu Familia',
            columns: 3,
            cells: localNosotrosCards.map(c => ({
              title: c.title,
              text: c.description,
              imageUrl: c.image,
              tagline: c.tagline,
              badge: c.badge
            }))
          },
          styles: { backgroundColor: '#07070B', textColor: '#FFFFFF', accentColor: '#3B82F6' }
        },
        {
          id: 'sec_nosotros_pastors',
          type: 'pastors_profile',
          sequence_order: 4,
          content: {
            title: 'Pastores Principales',
            pastores: localPastoresProfiles
          },
          styles: { backgroundColor: '#0B0C10', textColor: '#FFFFFF', accentColor: '#10B981' }
        }
      ];

      const [resConfig, resSections] = await Promise.all([
        authFetch(`${API_URL}/api/admin/homepage/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: updatedConfig })
        }),
        authFetch(`${API_URL}/api/admin/landing/sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sections: updatedSectionsForNosotros, page_path: '/nosotros' })
        })
      ]);

      const dataConfig = await resConfig.json();
      const dataSections = await resSections.json();

      if (dataConfig.success && dataSections.success) {
        setSaveSuccessMsg('¡Página Nosotros (/nosotros) publicada exitosamente en vivo!');
        if (onSaveConfig) onSaveConfig(updatedConfig);
        if (onSaveSections) onSaveSections();
        setTimeout(() => setSaveSuccessMsg(''), 5000);
      } else {
        alert((dataConfig.message || dataSections.message) || 'Error al guardar.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al guardar la página de Nosotros.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAutenticasHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingAutenticasHero(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await authFetch(`${API_URL}/api/admin/autenticas/gallery-upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setConfigFields(prev => ({ ...prev, autenticas_hero_bg: data.url }));
        alert('¡Imagen de fondo de Auténticas subida con éxito!');
      } else {
        alert(data.message || 'Error al subir imagen.');
      }
    } catch (err) {
      alert('Error de red al subir la imagen.');
    } finally {
      setUploadingAutenticasHero(false);
    }
  };

  const handleAutenticasGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingGalleryImage(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await authFetch(`${API_URL}/api/admin/autenticas/gallery-upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setLocalAutenticasGallery(prev => [...prev, data.url]);
        alert('¡Foto agregada a la galería!');
      } else {
        alert(data.message || 'Error al subir foto.');
      }
    } catch (err) {
      alert('Error de red al subir la foto.');
    } finally {
      setUploadingGalleryImage(false);
    }
  };

  const handleSpeakerImageUpload = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingSpeakerImage(idx);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await authFetch(`${API_URL}/api/admin/autenticas/gallery-upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setLocalAutenticasSpeakers(prev => {
          const arr = [...prev];
          arr[idx].img = data.url;
          return arr;
        });
      }
    } catch(err) {
      alert('Error subiendo foto de invitada.');
    } finally {
      setUploadingSpeakerImage(null);
    }
  };

  const handleRemoveGalleryImage = (imageUrl) => {
    setLocalAutenticasGallery(prev => prev.filter(img => img !== imageUrl));
  };

  const handleSectionBgUpload = async (sectionName, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBgName(sectionName);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await authFetch(`${API_URL}/api/admin/autenticas/gallery-upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setConfigFields(prev => ({ ...prev, [`${sectionName}_hero_bg`]: data.url }));
        alert(`¡Imagen de fondo de ${sectionName} cargada con éxito!`);
      } else {
        alert(data.message || 'Error al subir imagen.');
      }
    } catch (err) {
      alert('Error de red al subir la imagen.');
    } finally {
      setUploadingBgName('');
    }
  };

  const handleSaveAutenticasSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setAutenticasSuccessMsg('');
    try {
      const updatedConfig = {
        ...configFields,
        autenticas_gallery: JSON.stringify(localAutenticasGallery),
        autenticas_speakers: JSON.stringify(localAutenticasSpeakers)
      };
      
      const res = await authFetch(`${API_URL}/api/admin/homepage/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: updatedConfig })
      });
      const data = await res.json();
      if (data.success) {
        setAutenticasSuccessMsg('¡Configuración del Congreso Auténticas guardada con éxito!');
        if (onSaveConfig) onSaveConfig();
      } else {
        alert(data.message || 'Error al guardar la configuración.');
      }
    } catch (err) {
      alert('Error de red al guardar la configuración.');
    } finally {
      setSaveLoading(false);
    }
  };
  const handleSaveConstructionSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setConstructionSuccessMsg('');
    const updatedConfig = {
      ...configFields,
      modelo_networks: JSON.stringify(localModeloNetworks),
      events_list: JSON.stringify(localEventsList)
    };
    try {
      const res = await authFetch(`${API_URL}/api/admin/homepage/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: updatedConfig })
      });
      const data = await res.json();
      if (data.success) {
        setConstructionSuccessMsg('¡Configuración guardada con éxito!');
        if (onSaveConfig) onSaveConfig(updatedConfig);
      } else {
        alert(data.message || 'Error al guardar la configuración.');
      }
    } catch (err) {
      alert('Error de red al guardar la configuración.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveFooterConfig = async () => {
    const updatedConfig = {
      ...configFields,
      footer_contacts: JSON.stringify(footerContacts),
      footer_socials: JSON.stringify(footerSocials),
      navbar_links: JSON.stringify(navbarLinks)
    };
    try {
      const res = await authFetch(`${API_URL}/api/admin/homepage/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: updatedConfig })
      });
      const data = await res.json();
      if (data.success) {
        alert('¡Configuración de contacto y pie de página guardada con éxito!');
        if (onSaveConfig) onSaveConfig(updatedConfig);
      } else {
        alert(data.message || 'Error al guardar la configuración.');
      }
    } catch (err) {
      alert('Error de red al guardar la configuración.');
    }
  };

  // --- USER MANAGEMENT ---
  const fetchAdminUsers = async () => {
    try {
      const res = await authFetch(`${API_URL}/api/admin/users`);
      const data = await res.json();
      if (data.success) setAdminUsers(data.users);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${API_URL}/api/admin/users`, {
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

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setEditingUser(null);
        fetchAdminUsers();
      } else {
        alert(data.message || 'Error al actualizar usuario.');
      }
    } catch (err) {
      alert('Error de red al actualizar usuario.');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario "${username}"?`)) return;
    try {
      const res = await authFetch(`${API_URL}/api/admin/users/${userId}`, { method: 'DELETE' });
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
  const handleExportCSV = async () => {
    try {
      const res = await authFetch(`${API_URL}/api/admin/export/csv?event_id=${encodeURIComponent(activeEventId)}`);
      if (!res.ok) {
        alert('Error al descargar el reporte CSV. Asegúrate de tener permisos.');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservaciones_${activeEventId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Error de red al descargar el reporte CSV.');
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await authFetch(`${API_URL}/api/admin/backup/download`);
      if (!res.ok) {
        alert('Error al descargar la copia de seguridad.');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'event_ticketing_backup.db';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Error de red al descargar copia de seguridad.');
    }
  };

  const handleHeroUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingHero(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await authFetch(`${API_URL}/api/admin/homepage/upload`, {
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
        const res = await authFetch(`${API_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
          if (data.token) {
            localStorage.setItem('admin_token', data.token);
          }
          onLogin(data.user, data.token);
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
      const res = await authFetch(`${API_URL}/api/admin/reservations/${reservationId}/status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-User': adminUser ? adminUser.username : 'desconocido'
        },
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
      const res = await authFetch(`${API_URL}/api/admin/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-User': adminUser ? adminUser.username : 'desconocido'
        }
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
      const res = await authFetch(`${API_URL}/api/admin/homepage/config`, {
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

  const handleSaveHomePageApple = async () => {
    setSaveLoading(true);
    setSaveSuccessMsg('');
    try {
      const updatedConfig = {
        ...configFields,
        schedules: JSON.stringify(localSchedules),
        hero_buttons: JSON.stringify(localButtons),
        news_items: JSON.stringify(localNewsItems)
      };

      const updatedSectionsForHome = [
        {
          id: 'sec_hero',
          type: 'hero',
          sequence_order: 1,
          content: {
            title: configFields.hero_title || 'Bienvenido a TU CASA',
            subtitle: configFields.hero_subtitle || 'Iglesia Visión Jesús — Un lugar de fe, amor y restauración',
            bgUrl: configFields.hero_bg || '',
            buttons: localButtons && localButtons.length > 0 ? localButtons : [
              { id: '1', label: 'Conocé la Visión', emoji: '✨', url: '/nosotros', style: 'primary' },
              { id: '2', label: 'Horarios de Servicios', emoji: '⏰', url: '#horarios-section', style: 'secondary' }
            ]
          },
          styles: { backgroundColor: '#000000', textColor: '#EAEDF8', accentColor: '#977DFF' }
        },
        {
          id: 'sec_news',
          type: 'news',
          sequence_order: 2,
          content: {
            title: 'NOTICIAS Y EVENTOS',
            newsItems: localNewsItems,
            items: localNewsItems
          },
          styles: { backgroundColor: '#030812', textColor: '#EAEDF8', accentColor: '#0033FF' }
        },
        {
          id: 'sec_pillars',
          type: 'pillars',
          sequence_order: 3,
          content: {
            title: 'CONOCÉ LA VISIÓN',
            subtitle: 'Una iglesia viva, apasionada y comprometida con revelar el amor transformador de Jesucristo.',
            pillars: [
              { id: '1', title: configFields.vision_title || 'NUESTRA VISIÓN', text: configFields.vision_text || 'Ser una iglesia viva que inspira a miles de personas a experimentar una relación personal con Dios, transformando vidas y formando discípulos apasionados por la verdad.', icon: 'Compass' },
              { id: '2', title: configFields.mision_title || 'NUESTRA MISIÓN', text: configFields.mision_text || 'Evangelizar, consolidar, edificar y enviar a cada creyente a vivir su propósito divino, restaurando familias y equipando líderes para impactar nuestra sociedad.', icon: 'Flame' },
              { id: '3', title: configFields.valores_title || 'NUESTROS VALORES', text: configFields.valores_text || 'Amor incondicional, adoración genuina, excelencia en el servicio, integridad moral, restauración familiar y fe firme en las promesas de Dios.', icon: 'Users' }
            ]
          },
          styles: { backgroundColor: '#030812', textColor: '#EAEDF8', accentColor: '#977DFF' }
        },
        {
          id: 'sec_schedules',
          type: 'schedules',
          sequence_order: 4,
          content: {
            title: 'HORARIOS DE SERVICIOS',
            bgUrl: configFields.schedule_bg || '',
            schedules: localSchedules
          },
          styles: { backgroundColor: '#030812', textColor: '#EAEDF8', accentColor: '#0033FF' }
        }
      ];

      const [resConfig, resSections] = await Promise.all([
        authFetch(`${API_URL}/api/admin/homepage/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: updatedConfig })
        }),
        authFetch(`${API_URL}/api/admin/landing/sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sections: updatedSectionsForHome, page_path: '/' })
        })
      ]);

      const dataConfig = await resConfig.json();
      const dataSections = await resSections.json();

      if (dataConfig.success && dataSections.success) {
        setSaveSuccessMsg('¡Página de Inicio (/) publicada exitosamente en vivo!');
        setLocalSections(updatedSectionsForHome);
        if (onSaveConfig) onSaveConfig(updatedConfig);
        if (onSaveSections) onSaveSections();
        setTimeout(() => setSaveSuccessMsg(''), 5000);
      } else {
        alert((dataConfig.message || dataSections.message) || 'Error al guardar los cambios de inicio.');
      }
    } catch (err) {
      console.error('Error saving home page:', err);
      alert('Error de red al guardar los cambios de inicio.');
    } finally {
      setSaveLoading(false);
    }
  };

  // 1. Filtrar las reservas estrictamente por el evento activo seleccionado
  const eventReservations = useMemo(() => {
    return reservations.filter(r => (r.event_id || 'autenticas-2026') === activeEventId);
  }, [reservations, activeEventId]);

  // 2. Filtrar por término de búsqueda y estado dentro del evento activo
  const filteredList = useMemo(() => {
    return eventReservations.filter(r => {
      const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchesSearch = (r.purchaser_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (r.purchaser_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (r.purchaser_phone || '').includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [eventReservations, filterStatus, searchTerm]);

  // 3. Métricas calculadas EXCLUSIVAMENTE para el evento activo
  const totalRevenue = useMemo(() => {
    return eventReservations.reduce((acc, r) => r.status === 'aprobado' || r.status === 'usado' ? acc + r.total_amount : acc, 0);
  }, [eventReservations]);

  const totalAllTickets = useMemo(() => {
    return eventReservations.reduce((acc, r) => acc + (r.quantity || 0), 0);
  }, [eventReservations]);

  const pendingCount = useMemo(() => {
    return eventReservations.filter(r => r.status === 'pendiente').length;
  }, [eventReservations]);

  const neoCard = {
    backgroundColor: '#FAF8F5',
    borderRadius: '24px',
    boxShadow: '9px 9px 20px rgba(163, 140, 110, 0.15), -9px -9px 20px rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.6)'
  };

  const neoInput = {
    backgroundColor: '#FAF8F5',
    borderRadius: '12px',
    boxShadow: 'inset 3px 3px 6px rgba(163, 140, 110, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    outline: 'none'
  };

  const neoButton = {
    backgroundColor: '#FAF8F5',
    borderRadius: '12px',
    boxShadow: '4px 4px 10px rgba(163, 140, 110, 0.12), -4px -4px 10px rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    cursor: 'pointer'
  };

  return (
    <div style={{ maxWidth: activeTab === 'church_web' ? '100%' : '1200px', margin: '20px auto', padding: '0 20px', transition: 'max-width 0.3s ease' }}>
      
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
              {adminUser && adminUser.role === 'admin' && (
                <button onClick={handleDownloadBackup} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#4B5563', color: '#FFF', borderColor: '#4B5563' }}>
                  <Download size={16} /> Respaldar BD (.db)
                </button>
              )}
            </>
          )}
          <button onClick={onLogout} className="btn-secondary" style={{ color: 'var(--color-red)', borderColor: 'var(--color-red)' }}>
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      {/* MODULE SUITE SWITCHER (NIVEL 1: AGRUPACIÓN PRINCIPAL) */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        padding: '8px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <button
          onClick={() => {
            setActiveSuite('tickets');
            if (!['reservations', 'pricing', 'zones_seating'].includes(activeTab)) {
              setActiveTab('reservations');
            }
          }}
          style={{
            flex: '1 1 auto',
            minWidth: '200px',
            padding: '12px 20px',
            borderRadius: '12px',
            border: activeSuite === 'tickets' ? '2px solid #0071E3' : '1px solid transparent',
            backgroundColor: activeSuite === 'tickets' ? 'rgba(0, 113, 227, 0.2)' : 'transparent',
            color: activeSuite === 'tickets' ? '#FFFFFF' : 'var(--text-muted)',
            fontWeight: 800,
            fontSize: '0.96rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.2s ease',
            boxShadow: activeSuite === 'tickets' ? '0 4px 16px rgba(0, 113, 227, 0.3)' : 'none'
          }}
        >
          <Ticket size={20} color={activeSuite === 'tickets' ? '#60A5FA' : 'currentColor'} />
          <span>🎟️ Tiquetera & Eventos</span>
        </button>

        {adminUser.role === 'admin' && (
          <button
            onClick={() => {
              setActiveSuite('web');
              if (!['church_web', 'oracion_admin', 'grupos_admin', 'events_admin', 'donaciones_admin'].includes(activeTab)) {
                setActiveTab('church_web');
              }
            }}
            style={{
              flex: '1 1 auto',
              minWidth: '200px',
              padding: '12px 20px',
              borderRadius: '12px',
              border: activeSuite === 'web' ? '2px solid #977DFF' : '1px solid transparent',
              backgroundColor: activeSuite === 'web' ? 'rgba(151, 125, 255, 0.2)' : 'transparent',
              color: activeSuite === 'web' ? '#FFFFFF' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.96rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              boxShadow: activeSuite === 'web' ? '0 4px 16px rgba(151, 125, 255, 0.3)' : 'none'
            }}
          >
            <Globe size={20} color={activeSuite === 'web' ? '#C4B5FD' : 'currentColor'} />
            <span>🌐 Web & Ministerio</span>
          </button>
        )}

        {adminUser.role === 'admin' && (
          <button
            onClick={() => {
              setActiveSuite('system');
              if (!['users', 'activity_log'].includes(activeTab)) {
                setActiveTab('users');
                fetchAdminUsers();
              }
            }}
            style={{
              flex: '1 1 auto',
              minWidth: '200px',
              padding: '12px 20px',
              borderRadius: '12px',
              border: activeSuite === 'system' ? '2px solid #10B981' : '1px solid transparent',
              backgroundColor: activeSuite === 'system' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeSuite === 'system' ? '#FFFFFF' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.96rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              boxShadow: activeSuite === 'system' ? '0 4px 16px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            <ShieldCheck size={20} color={activeSuite === 'system' ? '#6EE7B7' : 'currentColor'} />
            <span>⚙️ Sistema & Usuarios</span>
          </button>
        )}
      </div>

      {/* NIVEL 2: HERRAMIENTAS ESPECÍFICAS SEGÚN LA SUITE SELECCIONADA */}
      {activeSuite === 'tickets' && (
        <div style={{
          backgroundColor: '#121624',
          border: '1.5px solid rgba(0, 113, 227, 0.35)',
          borderRadius: '20px',
          padding: '18px 22px',
          marginBottom: '26px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
        }}>
          {/* SELECTOR DE EVENTO ACTIVO (PREPARADO PARA MULTI-EVENTO SIMULTÁNEO) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '16px',
            paddingBottom: '14px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ticket size={16} /> EVENTO ACTIVO:
              </span>
              <select
                value={activeEventId}
                onChange={(e) => setActiveEventId(e.target.value)}
                style={{
                  backgroundColor: '#1C2237',
                  border: '2px solid #3B82F6',
                  color: '#FFFFFF',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0, 113, 227, 0.25)'
                }}
              >
                {availableEvents.map(evt => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name} — [{evt.status}]
                  </option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
              Configuración y taquilla asignada a: <strong style={{ color: '#38BDF8' }}>{availableEvents.find(e => e.id === activeEventId)?.name}</strong>
            </div>
          </div>

          {/* SUB-BOTONES DE LA TIQUETERA PARA EL EVENTO SELECCIONADO */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('reservations')}
              style={{
                backgroundColor: activeTab === 'reservations' ? '#0071E3' : 'rgba(255, 255, 255, 0.06)',
                color: '#FFFFFF',
                border: activeTab === 'reservations' ? '1.5px solid #60A5FA' : '1px solid rgba(255, 255, 255, 0.12)',
                padding: '10px 18px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeTab === 'reservations' ? '0 4px 14px rgba(0, 113, 227, 0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <LayoutGrid size={16} />
              <span>Reservaciones & Asistentes</span>
            </button>

            {adminUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('pricing')}
                style={{
                  backgroundColor: activeTab === 'pricing' ? '#0071E3' : 'rgba(255, 255, 255, 0.06)',
                  color: '#FFFFFF',
                  border: activeTab === 'pricing' ? '1.5px solid #60A5FA' : '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: activeTab === 'pricing' ? '0 4px 14px rgba(0, 113, 227, 0.4)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Tag size={16} />
                <span>Precios y Preventa</span>
              </button>
            )}

            {adminUser.role === 'admin' && (
              <button
                onClick={() => { setActiveTab('zones_seating'); fetchZoneAnalytics(); }}
                style={{
                  backgroundColor: activeTab === 'zones_seating' ? '#0071E3' : 'rgba(255, 255, 255, 0.06)',
                  color: '#FFFFFF',
                  border: activeTab === 'zones_seating' ? '1.5px solid #60A5FA' : '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: activeTab === 'zones_seating' ? '0 4px 14px rgba(0, 113, 227, 0.4)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Armchair size={16} />
                <span>Zonas y Croquis de Asientos</span>
              </button>
            )}
          </div>
        </div>
      )}

      {activeSuite === 'web' && (
        <div style={{
          backgroundColor: '#181424',
          border: '1.5px solid rgba(151, 125, 255, 0.35)',
          borderRadius: '20px',
          padding: '18px 22px',
          marginBottom: '26px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('church_web')}
            style={{
              backgroundColor: activeTab === 'church_web' ? '#977DFF' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              border: activeTab === 'church_web' ? '1.5px solid #C4B5FD' : '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'church_web' ? '0 4px 14px rgba(151, 125, 255, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Globe size={16} />
            <span>Diseño Web Iglesia</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('oracion_admin');
              fetchAdminPrayers();
              fetchAdminTestimonies();
            }}
            style={{
              backgroundColor: activeTab === 'oracion_admin' ? '#977DFF' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              border: activeTab === 'oracion_admin' ? '1.5px solid #C4B5FD' : '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'oracion_admin' ? '0 4px 14px rgba(151, 125, 255, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Heart size={16} />
            <span>Oración & Testimonios</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('grupos_admin');
              fetchAdminGroups();
              fetchAdminGroupContacts();
            }}
            style={{
              backgroundColor: activeTab === 'grupos_admin' ? '#977DFF' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              border: activeTab === 'grupos_admin' ? '1.5px solid #C4B5FD' : '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'grupos_admin' ? '0 4px 14px rgba(151, 125, 255, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={16} />
            <span>Grupos de Amistad</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('events_admin');
            }}
            style={{
              backgroundColor: activeTab === 'events_admin' ? '#977DFF' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              border: activeTab === 'events_admin' ? '1.5px solid #C4B5FD' : '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'events_admin' ? '0 4px 14px rgba(151, 125, 255, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Calendar size={16} />
            <span>Cartelera de Eventos</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('donaciones_admin');
            }}
            style={{
              backgroundColor: activeTab === 'donaciones_admin' ? '#977DFF' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              border: activeTab === 'donaciones_admin' ? '1.5px solid #C4B5FD' : '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'donaciones_admin' ? '0 4px 14px rgba(151, 125, 255, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <CreditCard size={16} />
            <span>Donaciones & SINPE</span>
          </button>
        </div>
      )}

      {activeSuite === 'system' && (
        <div style={{
          backgroundColor: '#121F1B',
          border: '1.5px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '20px',
          padding: '18px 22px',
          marginBottom: '26px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => { setActiveTab('users'); fetchAdminUsers(); }}
            style={{
              backgroundColor: activeTab === 'users' ? '#10B981' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              border: activeTab === 'users' ? '1.5px solid #6EE7B7' : '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'users' ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={16} />
            <span>Gestión de Usuarios</span>
          </button>

          <button
            onClick={() => setActiveTab('activity_log')}
            style={{
              backgroundColor: activeTab === 'activity_log' ? '#10B981' : 'rgba(255, 255, 255, 0.06)',
              color: '#FFFFFF',
              border: activeTab === 'activity_log' ? '1.5px solid #6EE7B7' : '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === 'activity_log' ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <History size={16} />
            <span>Bitácora de Actividad</span>
          </button>
        </div>
      )}

      {/* TAB 1: RESERVATIONS MANAGER */}
      {activeTab === 'reservations' && (
        <>
          {/* BANNER IDENTIFICADOR DEL EVENTO SELECCIONADO */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            backgroundColor: activeEventId === 'autenticas-2026' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0, 113, 227, 0.08)',
            border: `1.5px solid ${activeEventId === 'autenticas-2026' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(0, 113, 227, 0.3)'}`,
            borderRadius: '16px',
            padding: '12px 18px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.25rem' }}>
                {activeEventId === 'autenticas-2026' ? '👑' : '🎟️'}
              </span>
              <div>
                <span style={{ fontWeight: 800, color: activeEventId === 'autenticas-2026' ? '#10B981' : '#38BDF8', fontSize: '0.94rem' }}>
                  Taquilla asignada: {availableEvents.find(e => e.id === activeEventId)?.name}
                </span>
                <span style={{ marginLeft: '10px', fontSize: '0.78rem', padding: '2px 10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#CBD5E1', fontWeight: 700 }}>
                  {eventReservations.length} {eventReservations.length === 1 ? 'reserva registrada' : 'reservas registradas'}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
              Estado: <strong style={{ color: '#FFFFFF' }}>{availableEvents.find(e => e.id === activeEventId)?.status}</strong>
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
                (Acumulado de entradas en este evento)
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
                {eventReservations.length}
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
                      <td colSpan="6" style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎟️</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '6px' }}>
                          No hay reservaciones registradas para "{availableEvents.find(e => e.id === activeEventId)?.name || 'este evento'}"
                        </div>
                        <div style={{ fontSize: '0.85rem', maxWidth: '500px', margin: '0 auto', color: '#64748B' }}>
                          La taquilla de cada evento es completamente independiente. Las reservas de otros eventos (como Auténticas) se mantienen protegidas en su propia vista.
                        </div>
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
                          {adminUser && adminUser.role === 'admin' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '0.85rem' }}>₡</span>
                              <input 
                                type="number"
                                value={editingAmountId === resv.id ? editingAmountValue : resv.total_amount}
                                onFocus={() => {
                                  setEditingAmountId(resv.id);
                                  setEditingAmountValue(resv.total_amount);
                                }}
                                onChange={(e) => setEditingAmountValue(e.target.value)}
                                style={{ width: '80px', padding: '6px', fontSize: '0.88rem', fontWeight: 700, borderRadius: '6px', border: '1px solid #CCC', textAlign: 'right' }}
                              />
                              {editingAmountId === resv.id && (
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  <button 
                                    onClick={() => handleUpdateAmount(resv.id, editingAmountValue)}
                                    style={{ padding: '4px 8px', backgroundColor: 'var(--color-green)', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                                    title="Guardar"
                                  >
                                    ✓
                                  </button>
                                  <button 
                                    onClick={() => setEditingAmountId(null)}
                                    style={{ padding: '4px 8px', backgroundColor: '#9CA3AF', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                                    title="Cancelar"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            formatCRC(resv.total_amount)
                          )}
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

                            {resv.payment_method === 'paypal' ? (
                              <div style={{
                                backgroundColor: '#EFF6FF',
                                color: '#1D4ED8',
                                border: '1px solid #BFDBFE',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                width: 'fit-content'
                              }}>
                                💳 Pago con Tarjeta / PayPal {resv.amount_usd ? `($${resv.amount_usd} USD)` : ''}
                              </div>
                            ) : resv.comprobante_url ? (
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
                                <Eye size={14} /> Ver Comprobante SINPE
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                🏦 SINPE Móvil
                              </span>
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
                          {adminUser.role !== 'tickets_readonly' ? (
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
                          ) : (
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Sólo lectura</span>
                          )}
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

      {/* =========================================================================
          APPLE STUDIO: EDITOR MODERNO DE CONTENIDO (PÁGINAS)
         ========================================================================= */}
      {activeTab === 'church_web' && (
        <>
          {activeWebPage === 'home' && (
            <AppleHomeEditor
              configFields={configFields}
              handleConfigChange={handleConfigChange}
              localSchedules={localSchedules}
              handleAddSchedule={handleAddSchedule}
              handleRemoveSchedule={handleRemoveSchedule}
              handleScheduleTextChange={handleScheduleTextChange}
              handleScheduleVirtualToggle={handleScheduleVirtualToggle}
              localButtons={localButtons}
              handleAddButton={handleAddButton}
              handleRemoveButton={handleRemoveButton}
              handleButtonChange={handleButtonChange}
              localNewsItems={localNewsItems}
              handleAddNews={handleAddNews}
              handleRemoveNews={handleRemoveNews}
              handleNewsChange={handleNewsChange}
              handleNewsImageUpload={handleNewsImageUpload}
              uploadingNewsImage={uploadingNewsImage}
              handleHeroUpload={handleHeroUpload}
              uploadingHero={uploadingHero}
              openMediaLibrary={openMediaLibrary}
              handleSaveHomePageApple={handleSaveHomePageApple}
              saveLoading={saveLoading}
              saveSuccessMsg={saveSuccessMsg}
              onSelectWebPage={setActiveWebPage}
              API_URL={API_URL}
            />
          )}

          {activeWebPage === 'nosotros' && (
            <AppleNosotrosEditor
              configFields={configFields}
              handleConfigChange={handleConfigChange}
              localNosotrosCards={localNosotrosCards}
              handleAddNosotrosCard={handleAddNosotrosCard}
              handleRemoveNosotrosCard={handleRemoveNosotrosCard}
              handleNosotrosCardChange={handleNosotrosCardChange}
              handleNosotrosCardImageUpload={handleNosotrosCardImageUpload}
              uploadingNosotrosCardImage={uploadingNosotrosCardImage}
              localPastoresProfiles={localPastoresProfiles}
              handleAddPastor={handleAddPastor}
              handleRemovePastor={handleRemovePastor}
              handlePastorChange={handlePastorChange}
              handlePastorImageUpload={handlePastorImageUpload}
              uploadingPastorImage={uploadingPastorImage}
              handleNosotrosHeroUpload={handleNosotrosHeroUpload}
              uploadingNosotrosHero={uploadingNosotrosHero}
              openMediaLibrary={openMediaLibrary}
              handleSaveNosotrosPageApple={handleSaveNosotrosPageApple}
              saveLoading={saveLoading}
              saveSuccessMsg={saveSuccessMsg}
              onSelectWebPage={setActiveWebPage}
              API_URL={API_URL}
            />
          )}
        </>
      )}

      {/* TAB: UNIVERSAL PAGE CONFIGURATION FORM FOR ALL ROUTES */}
      {activeTab === 'autenticas' && (adminUser.role === 'admin' || adminUser.role === 'editor_autenticas') && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px', marginTop: '24px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', marginBottom: '10px' }}>
            Configuración de la Página ({builderPagePath})
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Personaliza directamente el banner de cabecera, títulos, descripción promocional, imágenes de fondo, fechas, ubicación y mapas de la ruta activa.
          </p>

          {autenticasSuccessMsg && (
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 700 }}>
              {autenticasSuccessMsg}
            </div>
          )}

          {(() => {
            const activeKeyPrefix = builderPagePath === '/' ? 'hero' : builderPagePath.replace('/', '').toLowerCase();
            const titleFieldName = `${activeKeyPrefix}_title`;
            const subtitleFieldName = `${activeKeyPrefix}_subtitle`;
            const descFieldName = `${activeKeyPrefix}_description`;
            const bgFieldName = `${activeKeyPrefix}_hero_bg`;
            const dateFieldName = `${activeKeyPrefix}_date_info`;
            const placeFieldName = `${activeKeyPrefix}_place_info`;
            const wazeFieldName = `${activeKeyPrefix}_waze`;
            const mapsFieldName = `${activeKeyPrefix}_maps`;

            return (
              <form onSubmit={handleSaveAutenticasSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  
                  {/* TITLE */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Título del Banner (Ej: {builderPagePath === '/modelo' ? 'MODELO DE JESÚS' : 'AUTÉNTICAS'})</label>
                    <input 
                      type="text" 
                      name={titleFieldName} 
                      value={configFields[titleFieldName] || ''} 
                      onChange={handleConfigChange} 
                      placeholder="Escribe el título principal..."
                    />
                  </div>

                  {/* SUBTITLE */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Subtítulo del Banner</label>
                    <input 
                      type="text" 
                      name={subtitleFieldName} 
                      value={configFields[subtitleFieldName] || ''} 
                      onChange={handleConfigChange} 
                      placeholder="Escribe el subtítulo promocional..."
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Descripción de la Sección / Página</label>
                    <textarea 
                      name={descFieldName} 
                      rows="3" 
                      value={configFields[descFieldName] || ''} 
                      onChange={handleConfigChange} 
                      style={{ width: '100%', borderRadius: '10px', border: '1px solid #CCC', padding: '10px' }}
                      placeholder="Escribe la descripción o historia..."
                    />
                  </div>

                  {/* HERO BACKGROUND IMAGE */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Imagen de Fondo (Cabecera)</label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input 
                        type="text" 
                        name={bgFieldName} 
                        value={configFields[bgFieldName] || ''} 
                        onChange={handleConfigChange} 
                        placeholder="URL de la imagen o sube un archivo" 
                        style={{ flex: 1 }}
                      />
                      <label style={{
                        backgroundColor: 'var(--accent-coffee)',
                        color: '#FFFFFF',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 800,
                        fontSize: '0.88rem'
                      }}>
                        {uploadingAutenticasHero ? 'Subiendo...' : 'Subir Fondo'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            // Custom uploader targeting bgFieldName
                            const file = e.target.files[0];
                            if (!file) return;
                            setUploadingAutenticasHero(true);
                            const formData = new FormData();
                            formData.append('image', file);
                            authFetch(`${API_URL}/api/admin/upload-hero`, { method: 'POST', body: formData })
                              .then(r => r.json())
                              .then(data => {
                                setUploadingAutenticasHero(false);
                                if (data.success) {
                                  setConfigFields(prev => ({ ...prev, [bgFieldName]: data.imageUrl }));
                                }
                              })
                              .catch(() => setUploadingAutenticasHero(false));
                          }} 
                          style={{ display: 'none' }} 
                          disabled={uploadingAutenticasHero}
                        />
                      </label>
                    </div>
                  </div>

                  {/* DATE INFO */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Fecha / Horario (Texto libre)</label>
                    <input 
                      type="text" 
                      name={dateFieldName} 
                      value={configFields[dateFieldName] || ''} 
                      onChange={handleConfigChange} 
                      placeholder="Ej: Sábado 15 de Noviembre - 5:00 PM"
                    />
                  </div>

                  {/* PLACE INFO */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Lugar / Ubicación (Texto libre)</label>
                    <input 
                      type="text" 
                      name={placeFieldName} 
                      value={configFields[placeFieldName] || ''} 
                      onChange={handleConfigChange} 
                      placeholder="Ej: Auditorio Principal - Desamparados"
                    />
                  </div>

                  {/* WAZE LINK */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Enlace de Waze (Cómo Llegar)</label>
                    <input 
                      type="text" 
                      name={wazeFieldName} 
                      value={configFields[wazeFieldName] || ''} 
                      onChange={handleConfigChange} 
                      placeholder="https://waze.com/ul/..."
                    />
                  </div>

                  {/* GOOGLE MAPS LINK */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Enlace de Google Maps (Cómo Llegar)</label>
                    <input 
                      type="text" 
                      name={mapsFieldName} 
                      value={configFields[mapsFieldName] || ''} 
                      onChange={handleConfigChange} 
                      placeholder="https://maps.app.goo.gl/..."
                    />
                  </div>

                </div>

                <div style={{ marginTop: '28px', textAlign: 'right' }}>
                  <button 
                    type="submit" 
                    disabled={savingBuilder}
                    className="btn-primary" 
                    style={{ padding: '12px 32px', borderRadius: '50px', fontSize: '0.95rem', fontWeight: 800, background: 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)' }}
                  >
                    {savingBuilder ? 'Guardando Cambios...' : `Guardar Datos de ${builderPagePath}`}
                  </button>
                </div>
              </form>
            );
          })()}

        </div>
      )}
      {/* TAB: SANADOS CONFIGURATION */}
      {activeTab === 'sanados' && (adminUser.role === 'admin' || adminUser.role === 'editor_sanados') && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', marginBottom: '10px' }}>
            Configuración de la Sección Sanados
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Personaliza el título principal, el subtítulo descriptivo y la imagen de fondo para la sección de Sanados.
          </p>
          {constructionSuccessMsg && (
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 700 }}>
              {constructionSuccessMsg}
            </div>
          )}
          <form onSubmit={handleSaveConstructionSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Título Principal</label>
                <input type="text" name="sanados_title" value={configFields.sanados_title} onChange={handleConfigChange} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Subtítulo / Descripción</label>
                <input type="text" name="sanados_subtitle" value={configFields.sanados_subtitle} onChange={handleConfigChange} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Imagen de Fondo</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="text" name="sanados_hero_bg" value={configFields.sanados_hero_bg} onChange={handleConfigChange} required style={{ flex: 1 }} />
                  <label style={{ backgroundColor: 'var(--accent-coffee)', color: '#FFFFFF', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '0.88rem' }}>
                    {uploadingBgName === 'sanados' ? 'Subiendo...' : 'Subir Fondo'}
                    <input type="file" accept="image/*" onChange={(e) => handleSectionBgUpload('sanados', e)} style={{ display: 'none' }} disabled={uploadingBgName === 'sanados'} />
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" disabled={saveLoading} className="btn-primary" style={{ marginTop: '30px', width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800 }}>
              {saveLoading ? 'Guardando...' : 'Guardar Configuración Sanados'}
            </button>
          </form>
        </div>
      )}

      {/* TAB: MODELO CONFIGURATION */}
      {activeTab === 'modelo' && (adminUser.role === 'admin' || adminUser.role === 'editor_modelo') && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', marginBottom: '10px' }}>
            Configuración de la Sección Modelo
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Personaliza el título principal, el subtítulo descriptivo y la imagen de fondo para la sección de Modelo.
          </p>
          {constructionSuccessMsg && (
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 700 }}>
              {constructionSuccessMsg}
            </div>
          )}
          <form onSubmit={handleSaveConstructionSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Título Principal</label>
                <input type="text" name="modelo_title" value={configFields.modelo_title} onChange={handleConfigChange} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Subtítulo / Descripción</label>
                <input type="text" name="modelo_subtitle" value={configFields.modelo_subtitle} onChange={handleConfigChange} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Imagen de Fondo</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="text" name="modelo_hero_bg" value={configFields.modelo_hero_bg} onChange={handleConfigChange} required style={{ flex: 1 }} />
                  <label style={{ backgroundColor: 'var(--accent-coffee)', color: '#FFFFFF', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '0.88rem' }}>
                    {uploadingBgName === 'modelo' ? 'Subiendo...' : 'Subir Fondo'}
                    <input type="file" accept="image/*" onChange={(e) => handleSectionBgUpload('modelo', e)} style={{ display: 'none' }} disabled={uploadingBgName === 'modelo'} />
                  </label>
                </div>
              </div>
            </div>
            {/* GESTOR DE REDES OFICIALES DE MODELO DE JESÚS */}
            <div style={{ marginTop: '40px', borderTop: '2px dashed var(--accent-beige-border)', paddingTop: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--accent-coffee)', margin: 0, fontWeight: 800 }}>
                    Redes Oficiales del Modelo de Jesús (6 Redes + Plenitud)
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                    Edita el nombre, insignias, logotipos oficiales, imágenes de portada y descripciones de cada red.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newId = `net_${Date.now()}`;
                    setLocalModeloNetworks([
                      ...localModeloNetworks,
                      { id: newId, name: 'Nueva Red', badge: 'Categoría', age: 'Todas las edades', iconName: 'Sparkles', logo: '', description: 'Descripción de la nueva red.', image: '' }
                    ]);
                  }}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: 800, borderRadius: '20px' }}
                >
                  + Agregar Nueva Red
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {localModeloNetworks.map((net, idx) => (
                  <div key={net.id || idx} style={{
                    backgroundColor: '#FAF8F5',
                    border: '1px solid var(--accent-beige-border)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 850, color: 'var(--accent-coffee)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Red #{idx + 1}: {net.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = localModeloNetworks.filter((_, i) => i !== idx);
                          setLocalModeloNetworks(updated);
                        }}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                        title="Eliminar Red"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Nombre</label>
                        <input
                          type="text"
                          value={net.name || ''}
                          onChange={(e) => {
                            const updated = [...localModeloNetworks];
                            updated[idx].name = e.target.value;
                            setLocalModeloNetworks(updated);
                          }}
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Insignia / Badge</label>
                        <input
                          type="text"
                          value={net.badge || ''}
                          onChange={(e) => {
                            const updated = [...localModeloNetworks];
                            updated[idx].badge = e.target.value;
                            setLocalModeloNetworks(updated);
                          }}
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Rango de Edades</label>
                        <input
                          type="text"
                          value={net.age || ''}
                          onChange={(e) => {
                            const updated = [...localModeloNetworks];
                            updated[idx].age = e.target.value;
                            setLocalModeloNetworks(updated);
                          }}
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Icono Lucide</label>
                        <select
                          value={net.iconName || 'Sparkles'}
                          onChange={(e) => {
                            const updated = [...localModeloNetworks];
                            updated[idx].iconName = e.target.value;
                            setLocalModeloNetworks(updated);
                          }}
                          style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                        >
                          <option value="Heart">Heart (Niños)</option>
                          <option value="Flame">Flame (PreJuz / Fuego)</option>
                          <option value="Sparkles">Sparkles (MOVE / Jóvenes)</option>
                          <option value="Award">Award (Jóvenes Adultos)</option>
                          <option value="Shield">Shield (Familias / Adultos)</option>
                          <option value="Gem">Gem (Diamante / Adulto Mayor)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Descripción & Propósito</label>
                      <textarea
                        rows={3}
                        value={net.description || ''}
                        onChange={(e) => {
                          const updated = [...localModeloNetworks];
                          updated[idx].description = e.target.value;
                          setLocalModeloNetworks(updated);
                        }}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Imagen de Portada (URL)</label>
                      <input
                        type="text"
                        value={net.image || ''}
                        onChange={(e) => {
                          const updated = [...localModeloNetworks];
                          updated[idx].image = e.target.value;
                          setLocalModeloNetworks(updated);
                        }}
                        placeholder="https://... o sube archivo"
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Insignia de Logotipo Oficial (Drive / PNG)</label>
                      <input
                        type="text"
                        value={net.logo || ''}
                        onChange={(e) => {
                          const updated = [...localModeloNetworks];
                          updated[idx].logo = e.target.value;
                          setLocalModeloNetworks(updated);
                        }}
                        placeholder="URL de insignia de logo oficial"
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={saveLoading} className="btn-primary" style={{ marginTop: '30px', width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800 }}>
              {saveLoading ? 'Guardando Redes...' : 'Guardar Toda la Configuración de Modelo'}
            </button>
          </form>
        </div>
      )}

      {/* TAB: MOVE CONFIGURATION */}
      {activeTab === 'move' && (adminUser.role === 'admin' || adminUser.role === 'editor_move') && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', marginBottom: '10px' }}>
            Configuración de la Sección Move
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Personaliza el título principal, el subtítulo descriptivo y la imagen de fondo para la sección de Move.
          </p>
          {constructionSuccessMsg && (
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 700 }}>
              {constructionSuccessMsg}
            </div>
          )}
          <form onSubmit={handleSaveConstructionSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Título Principal</label>
                <input type="text" name="move_title" value={configFields.move_title} onChange={handleConfigChange} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Subtítulo / Descripción</label>
                <input type="text" name="move_subtitle" value={configFields.move_subtitle} onChange={handleConfigChange} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Imagen de Fondo</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="text" name="move_hero_bg" value={configFields.move_hero_bg} onChange={handleConfigChange} required style={{ flex: 1 }} />
                  <label style={{ backgroundColor: 'var(--accent-coffee)', color: '#FFFFFF', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '0.88rem' }}>
                    {uploadingBgName === 'move' ? 'Subiendo...' : 'Subir Fondo'}
                    <input type="file" accept="image/*" onChange={(e) => handleSectionBgUpload('move', e)} style={{ display: 'none' }} disabled={uploadingBgName === 'move'} />
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" disabled={saveLoading} className="btn-primary" style={{ marginTop: '30px', width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800 }}>
              {saveLoading ? 'Guardando...' : 'Guardar Configuración Move'}
            </button>
          </form>
        </div>
      )}

      {/* TAB: TIENDA CONFIGURATION */}
      {activeTab === 'tienda' && (adminUser.role === 'admin' || adminUser.role === 'editor_tienda') && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', marginBottom: '10px' }}>
            Configuración de la Sección Tienda
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Personaliza el título principal, el subtítulo descriptivo y la imagen de fondo para la sección de Tienda.
          </p>
          {constructionSuccessMsg && (
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 700 }}>
              {constructionSuccessMsg}
            </div>
          )}
          <form onSubmit={handleSaveConstructionSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Título Principal</label>
                <input type="text" name="tienda_title" value={configFields.tienda_title} onChange={handleConfigChange} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Subtítulo / Descripción</label>
                <input type="text" name="tienda_subtitle" value={configFields.tienda_subtitle} onChange={handleConfigChange} required />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Imagen de Fondo</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="text" name="tienda_hero_bg" value={configFields.tienda_hero_bg} onChange={handleConfigChange} required style={{ flex: 1 }} />
                  <label style={{ backgroundColor: 'var(--accent-coffee)', color: '#FFFFFF', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '0.88rem' }}>
                    {uploadingBgName === 'tienda' ? 'Subiendo...' : 'Subir Fondo'}
                    <input type="file" accept="image/*" onChange={(e) => handleSectionBgUpload('tienda', e)} style={{ display: 'none' }} disabled={uploadingBgName === 'tienda'} />
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" disabled={saveLoading} className="btn-primary" style={{ marginTop: '30px', width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800 }}>
              {saveLoading ? 'Guardando...' : 'Guardar Configuración Tienda'}
            </button>
          </form>
        </div>
      )}
      {/* TAB: PRICING & PRESALE CONFIGURATION (admin only) */}
      {activeTab === 'pricing' && adminUser.role === 'admin' && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', marginBottom: '10px' }}>
            Configuración de Precios y Preventa — {availableEvents.find(e => e.id === activeEventId)?.name}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Ajusta las tarifas independientes para <strong>{availableEvents.find(e => e.id === activeEventId)?.name}</strong>. Cada evento tiene su propia estructura de precios y fecha de preventa sin afectar a los demás.
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
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>
                      Fecha Límite de Preventa (Hasta las 23:59:59 de este día)
                    </label>
                    <small style={{ color: 'var(--text-muted)' }}>
                      Si la fecha actual supera este día, el sistema pasará automáticamente a los <strong>Precios Regulares</strong> en mapas y tarjetas.
                    </small>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      type="button"
                      onClick={() => setPricingFields(prev => ({ ...prev, presale_cutoff_date: '2026-08-30' }))}
                      style={{ padding: '8px 14px', backgroundColor: '#DC2626', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      ⚡ Activar Precios Regulares Ya
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPricingFields(prev => ({ ...prev, presale_cutoff_date: '2026-09-15' }))}
                      style={{ padding: '8px 14px', backgroundColor: '#059669', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      🏷️ Re-activar Preventa
                    </button>
                  </div>
                </div>
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

      {/* TAB: ZONE & SEATING LAYOUT MANAGEMENT (admin only) */}
      {activeTab === 'zones_seating' && adminUser.role === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header Card */}
          <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-coffee)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Armchair size={26} />
                  Zonas y Asientos — {availableEvents.find(e => e.id === activeEventId)?.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0, maxWidth: '750px' }}>
                  Aforo y mapa de asientos configurado para <strong>{availableEvents.find(e => e.id === activeEventId)?.name}</strong>. Cada evento gestiona su disponibilidad de manera independiente.
                </p>
              </div>

              <button
                onClick={fetchZoneAnalytics}
                disabled={loadingZoneAnalytics}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: 700 }}
              >
                <RefreshCw size={16} className={loadingZoneAnalytics ? 'spin' : ''} />
                {loadingZoneAnalytics ? 'Actualizando...' : 'Actualizar Métricas'}
              </button>
            </div>

            {zoneSuccessMsg && (
              <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px 20px', borderRadius: '12px', marginTop: '20px', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                ✓ {zoneSuccessMsg}
              </div>
            )}

            {/* Global Auditorio KPIs */}
            {zoneAnalytics && zoneAnalytics.global && (() => {
              const totalCap = zoneAnalytics.global.total_capacity;
              const occCount = activeEventId === 'autenticas-2026' ? zoneAnalytics.global.occupied_count : totalAllTickets;
              const availCap = Math.max(0, totalCap - occCount);
              const occPct = totalCap > 0 ? Math.round((occCount / totalCap) * 100) : 0;

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
                  <div style={{ backgroundColor: '#FAF8F5', padding: '20px', borderRadius: '16px', border: '1px solid var(--accent-beige-border)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Capacidad Total Auditorio</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-coffee)' }}>{totalCap}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Asientos totales configurados</div>
                  </div>

                  <div style={{ backgroundColor: '#FEF2F2', padding: '20px', borderRadius: '16px', border: '1px solid #FECACA' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', marginBottom: '6px' }}>🔴 Asientos Ocupados</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#DC2626' }}>{occCount}</div>
                    <div style={{ fontSize: '0.78rem', color: '#991B1B' }}>Reservas en este evento</div>
                  </div>

                  <div style={{ backgroundColor: '#F0FDF4', padding: '20px', borderRadius: '16px', border: '1px solid #BBF7D0' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '6px' }}>🟢 Asientos Disponibles</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16A34A' }}>{availCap}</div>
                    <div style={{ fontSize: '0.78rem', color: '#166534' }}>Libres para reservar</div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>📊 Ocupación Evento</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>{occPct}%</div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '6px', marginTop: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${occPct}%`, height: '100%', backgroundColor: 'var(--accent-coffee)' }} />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Zone Grid Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            {zoneAnalytics && zoneAnalytics.zones && zoneAnalytics.zones.map((zone) => {
              const isEditing = editingZoneId === zone.id;
              const draftTotal = isEditing ? zoneRowsDraft.reduce((s, r) => s + (parseInt(r.seatsCount) || 0), 0) : zone.total_capacity;

              return (
                <div
                  key={zone.id}
                  className="card-glass"
                  style={{
                    borderRadius: '20px',
                    padding: '24px',
                    border: isEditing ? '2px solid var(--accent-coffee)' : '1px solid var(--accent-beige-border)',
                    boxShadow: isEditing ? '0 12px 30px rgba(0,0,0,0.1)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Zone Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: zone.color_code }} />
                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent-coffee)', fontWeight: 800 }}>{zone.name}</h4>
                      </div>
                      <span style={{
                        backgroundColor: zone.id.startsWith('vip') ? '#FDF2F8' : '#F0FDF4',
                        color: zone.id.startsWith('vip') ? '#DB2777' : '#10B981',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}>
                        {zone.id.startsWith('vip') ? 'Sector Gold' : 'Sector General'}
                      </span>
                    </div>

                    {/* Progress Bar & Key Numbers */}
                    <div style={{ backgroundColor: '#FAF8F5', padding: '16px', borderRadius: '14px', marginBottom: '18px', border: '1px solid #EFECE6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 700 }}>
                        <span style={{ color: '#16A34A' }}>🟢 Libres: {zone.available_capacity}</span>
                        <span style={{ color: '#DC2626' }}>🔴 Ocupados: {zone.occupied_count}</span>
                        <span style={{ color: 'var(--accent-coffee)' }}>Total: {zone.total_capacity}</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${zone.occupancy_pct}%`, height: '100%', backgroundColor: zone.color_code }} />
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {zone.occupancy_pct}% de ocupación
                      </div>
                    </div>

                    {/* VIEW MODE: Rows Summary */}
                    {!isEditing && (
                      <div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--accent-coffee)', fontWeight: 800, marginBottom: '8px' }}>
                          Distribución Actual de Filas:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '140px', overflowY: 'auto', padding: '4px' }}>
                          {zone.layout_config?.rows && zone.layout_config.rows.map((r, rIdx) => (
                            <span
                              key={rIdx}
                              style={{
                                fontSize: '0.78rem',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                backgroundColor: r.isReserved ? '#1E293B' : '#FFF',
                                color: r.isReserved ? '#94A3B8' : '#374151',
                                border: '1px solid var(--accent-beige-border)',
                                fontWeight: 700
                              }}
                            >
                              {r.rowLabel}: {r.seatsCount} as. {r.isReserved ? '(🔒)' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* EDIT MODE: Rows & Seats Configurator */}
                    {isEditing && (
                      <div style={{ marginTop: '12px' }}>
                        {/* Quick Uniform Generator */}
                        <div style={{ backgroundColor: '#F3F4F6', padding: '12px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '8px' }}>
                            ⚡ Generador Rápido Uniforme
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                            <div>
                              <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block' }}>Filas</label>
                              <input
                                type="number"
                                min="1"
                                max="30"
                                value={zoneQuickRows}
                                onChange={(e) => setZoneQuickRows(e.target.value)}
                                style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CCC', fontSize: '0.85rem' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.72rem', fontWeight: 700, display: 'block' }}>Asientos/Fila</label>
                              <input
                                type="number"
                                min="1"
                                max="50"
                                value={zoneQuickSeats}
                                onChange={(e) => setZoneQuickSeats(e.target.value)}
                                style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #CCC', fontSize: '0.85rem' }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApplyUniformRows(zoneQuickRows, zoneQuickSeats)}
                              className="btn-secondary"
                              style={{ marginTop: '16px', padding: '6px 10px', fontSize: '0.78rem', fontWeight: 700 }}
                            >
                              Aplicar
                            </button>
                          </div>
                        </div>

                        {/* Row-by-Row Custom Editor */}
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '8px' }}>
                          Editor Detallado por Fila ({zoneRowsDraft.length} filas):
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px', marginBottom: '14px' }}>
                          {zoneRowsDraft.map((row, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '80px 1fr auto auto',
                                gap: '8px',
                                alignItems: 'center',
                                backgroundColor: '#FFF',
                                padding: '8px 10px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB'
                              }}
                            >
                              <input
                                type="text"
                                value={row.rowLabel}
                                onChange={(e) => handleRowChange(idx, 'rowLabel', e.target.value)}
                                placeholder="Fila..."
                                style={{ padding: '4px 6px', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #CCC', fontWeight: 700 }}
                              />
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={row.seatsCount}
                                  onChange={(e) => handleRowChange(idx, 'seatsCount', e.target.value)}
                                  style={{ width: '60px', padding: '4px 6px', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #CCC', fontWeight: 700 }}
                                />
                                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>asientos</span>
                              </div>

                              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#4B5563', cursor: 'pointer', whiteSpace: 'nowrap' }} title="Fila Reservada de Protocolo">
                                <input
                                  type="checkbox"
                                  checked={!!row.isReserved}
                                  onChange={(e) => handleRowChange(idx, 'isReserved', e.target.checked)}
                                />
                                🔒 Reservada
                              </label>

                              <button
                                type="button"
                                onClick={() => handleRemoveRow(idx)}
                                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}
                                title="Eliminar fila"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={handleAddRow}
                          style={{
                            width: '100%',
                            padding: '8px',
                            backgroundColor: '#F3F4F6',
                            border: '1px dashed #CBD5E1',
                            borderRadius: '8px',
                            color: 'var(--accent-coffee)',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            marginBottom: '16px'
                          }}
                        >
                          <Plus size={16} /> Agregar Fila
                        </button>

                        {/* Real-time Calculation */}
                        <div style={{ backgroundColor: '#EFF6FF', padding: '10px 14px', borderRadius: '8px', border: '1px solid #BFDBFE', fontSize: '0.82rem', color: '#1E40AF', marginBottom: '16px' }}>
                          <div><strong>Nueva Capacidad Calculada:</strong> {draftTotal} asientos</div>
                          <div style={{ fontSize: '0.75rem', marginTop: '2px', color: '#3B82F6' }}>
                            (Asientos ocupados actuales: {zone.occupied_count} | Disponibles resultantes: {Math.max(0, draftTotal - zone.occupied_count)})
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div style={{ borderTop: '1px solid var(--accent-beige-border)', paddingTop: '16px', marginTop: '16px' }}>
                    {!isEditing ? (
                      <button
                        onClick={() => handleStartEditZone(zone)}
                        className="btn-secondary"
                        style={{ width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Settings size={16} />
                        Editar Filas y Asientos
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleSaveZoneLayout(zone.id)}
                          disabled={zoneSaving}
                          className="btn-primary"
                          style={{ flex: 1, padding: '10px', fontSize: '0.9rem', fontWeight: 800 }}
                        >
                          {zoneSaving ? 'Guardando...' : '💾 Guardar Distribución'}
                        </button>
                        <button
                          onClick={() => setEditingZoneId(null)}
                          className="btn-secondary"
                          style={{ padding: '10px 16px', fontSize: '0.9rem' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: ORACIÓN & TESTIMONIOS (Admin) */}
      {activeTab === 'oracion_admin' && adminUser.role === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* PETICIONES DE ORACIÓN */}
          <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={22} color="#EF4444" />
                  Peticiones de Oración Recibidas
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
                  Gestión e intercesión pastoral. Marca las peticiones listas para llevar al altar en los servicios de Mateo 18:19.
                </p>
              </div>

              <button
                onClick={fetchAdminPrayers}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 800, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={14} className={loadingPrayers ? 'animate-spin' : ''} />
                Actualizar Lista
              </button>
            </div>

            {/* FILTROS DE PETICIONES */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px', backgroundColor: '#FAF8F5', padding: '16px', borderRadius: '16px', border: '1px solid var(--accent-beige-border)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Filtrar por Tipo</label>
                <select
                  value={prayerFilterType}
                  onChange={(e) => setPrayerFilterType(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  <option value="all">Todas las Categorías</option>
                  <option value="Sanidad">Sanidad Física / Divina</option>
                  <option value="Familia">Familia y Matrimonios</option>
                  <option value="Finanzas">Finanzas y Provisión</option>
                  <option value="Salvación">Salvación de Almas</option>
                  <option value="Proceso Personal">Proceso Personal / Fe</option>
                  <option value="Otros">Otros Motivos</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Filtrar por Estado</label>
                <select
                  value={prayerFilterStatus}
                  onChange={(e) => setPrayerFilterStatus(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  <option value="all">Todos los Estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="en_oracion">En Oración</option>
                  <option value="altar">Impresa / En Altar</option>
                  <option value="atendido">Atendido / Respondido</option>
                </select>
              </div>
            </div>

            {/* TABLA DE PETICIONES */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF8F5', borderBottom: '2px solid var(--accent-beige-border)', textAlign: 'left', color: 'var(--accent-coffee)' }}>
                    <th style={{ padding: '12px 14px' }}>Fecha</th>
                    <th style={{ padding: '12px 14px' }}>Nombre</th>
                    <th style={{ padding: '12px 14px' }}>Contacto</th>
                    <th style={{ padding: '12px 14px' }}>Categoría</th>
                    <th style={{ padding: '12px 14px' }}>Petición de Oración</th>
                    <th style={{ padding: '12px 14px' }}>Estado Intercesión</th>
                    <th style={{ padding: '12px 14px' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {prayersList
                    .filter(p => prayerFilterType === 'all' || p.request_type === prayerFilterType)
                    .filter(p => prayerFilterStatus === 'all' || (p.status || 'pendiente') === prayerFilterStatus)
                    .map((prayer) => (
                      <tr key={prayer.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {new Date(prayer.created_at).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--accent-coffee)' }}>
                          {prayer.name}
                        </td>
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                          {prayer.phone ? (
                            <a href={`https://wa.me/506${prayer.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#25D366', fontWeight: 700, textDecoration: 'none' }}>
                              📱 {prayer.phone}
                            </a>
                          ) : (
                            <span style={{ color: '#94A3B8' }}>Sin número</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            backgroundColor: prayer.request_type === 'Sanidad' ? '#FEF2F2' : prayer.request_type === 'Familia' ? '#EFF6FF' : '#F0FDF4',
                            color: prayer.request_type === 'Sanidad' ? '#EF4444' : prayer.request_type === 'Familia' ? '#3B82F6' : '#10B981',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontWeight: 800,
                            fontSize: '0.75rem'
                          }}>
                            {prayer.request_type}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', maxWidth: '300px', lineHeight: 1.5 }}>
                          {prayer.request_text}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <select
                            value={prayer.status || 'pendiente'}
                            onChange={(e) => handleUpdatePrayerStatus(prayer.id, e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              border: '1px solid #CBD5E1',
                              backgroundColor: (prayer.status === 'altar') ? '#F0FDF4' : (prayer.status === 'en_oracion') ? '#EFF6FF' : '#FFF'
                            }}
                          >
                            <option value="pendiente">⏳ Pendiente</option>
                            <option value="en_oracion">🙏 En Oración</option>
                            <option value="altar">✝️ Impresa en Altar</option>
                            <option value="atendido">✅ Atendido / Testimonio</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            onClick={() => handleDeletePrayer(prayer.id)}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                            title="Eliminar petición"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {prayersList.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No hay peticiones de oración registradas por el momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MURO DE TESTIMONIOS */}
          <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={22} color="#977DFF" />
                  Muro de Testimonios y Milagros
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
                  Aprueba o modera los milagros que las personas comparten para ser publicados públicamente en el Muro de Testimonios.
                </p>
              </div>

              <button
                onClick={fetchAdminTestimonies}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 800, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={14} className={loadingTestimonies ? 'animate-spin' : ''} />
                Actualizar Testimonios
              </button>
            </div>

            {/* FILTROS TESTIMONIOS */}
            <div style={{ marginBottom: '20px', backgroundColor: '#FAF8F5', padding: '16px', borderRadius: '16px', border: '1px solid var(--accent-beige-border)' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Filtrar Estado Publicación</label>
              <select
                value={testimonyFilterApproved}
                onChange={(e) => setTestimonyFilterApproved(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
              >
                <option value="all">Todos los Testimonios</option>
                <option value="approved">Publicados en el Muro (Aprobados)</option>
                <option value="pending">Pendientes de Revisión</option>
              </select>
            </div>

            {/* GRID DE TESTIMONIOS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {testimoniesList
                .filter(t => testimonyFilterApproved === 'all' || (testimonyFilterApproved === 'approved' ? t.is_approved === 1 : t.is_approved !== 1))
                .map((t) => (
                  <div key={t.id} style={{
                    backgroundColor: '#FAF8F5',
                    border: '1px solid var(--accent-beige-border)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '14px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 850, color: 'var(--accent-coffee)' }}>{t.name}</span>
                        <span style={{
                          backgroundColor: t.is_approved ? '#F0FDF4' : '#FFFBEB',
                          color: t.is_approved ? '#166534' : '#B45309',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          {t.is_approved ? '✅ PUBLICADO' : '⏳ PENDIENTE'}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#3B82F6', margin: '0 0 8px' }}>{t.title}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                        "{t.story}"
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                      <button
                        onClick={() => handleToggleTestimonyApproval(t.id, t.is_approved)}
                        className={t.is_approved ? 'btn-secondary' : 'btn-primary'}
                        style={{ flex: 1, padding: '8px', fontSize: '0.82rem', fontWeight: 800, borderRadius: '8px' }}
                      >
                        {t.is_approved ? 'Ocultar del Muro' : 'Aprobar y Publicar'}
                      </button>
                      <button
                        onClick={() => handleDeleteTestimony(t.id)}
                        style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#EF4444', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontWeight: 800 }}
                        title="Eliminar testimonio"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              {testimoniesList.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No se han registrado testimonios todavía.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: GRUPOS DE AMISTAD & CONTACTOS (Admin) */}
      {activeTab === 'grupos_admin' && adminUser.role === 'admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* DIRECTORIO DE GRUPOS DE AMISTAD */}
          <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={22} color="#3B82F6" />
                  Directorio de Grupos de Amistad (Casas de Paz)
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
                  Crea, edita o desactiva las Casas de Paz y grupos pequeños por Zona y Cantón.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setEditingGroupModal({ name: '', zone: 'Desamparados', canton: 'Desamparados', address_reference: '', meeting_day: 'Viernes', meeting_time: '7:30 PM', modality: 'Presencial', network_category: 'Mixto', leaders: '', phone: '', is_active: 1 })}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: 800, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} />
                  + Crear Nuevo Grupo
                </button>
                <button
                  onClick={fetchAdminGroups}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 800, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <RefreshCw size={14} className={loadingGroups ? 'animate-spin' : ''} />
                  Actualizar
                </button>
              </div>
            </div>

            {/* FILTROS POR ZONA */}
            <div style={{ marginBottom: '20px', backgroundColor: '#FAF8F5', padding: '16px', borderRadius: '16px', border: '1px solid var(--accent-beige-border)' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Filtrar por Zona / Modalidad</label>
              <select
                value={groupFilterZone}
                onChange={(e) => setGroupFilterZone(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
              >
                <option value="all">Todas las Zonas</option>
                <option value="Desamparados">Desamparados</option>
                <option value="San José">San José Centro</option>
                <option value="Curridabat">Curridabat / Este</option>
                <option value="Virtual">Virtual / Online</option>
              </select>
            </div>

            {/* TABLA DE GRUPOS DE AMISTAD */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF8F5', borderBottom: '2px solid var(--accent-beige-border)', textAlign: 'left', color: 'var(--accent-coffee)' }}>
                    <th style={{ padding: '12px 14px' }}>Grupo</th>
                    <th style={{ padding: '12px 14px' }}>Zona / Cantón</th>
                    <th style={{ padding: '12px 14px' }}>Día & Hora</th>
                    <th style={{ padding: '12px 14px' }}>Categoría</th>
                    <th style={{ padding: '12px 14px' }}>Anfitriones / Líderes</th>
                    <th style={{ padding: '12px 14px' }}>Estado</th>
                    <th style={{ padding: '12px 14px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {adminGroupsList
                    .filter(g => groupFilterZone === 'all' || g.zone === groupFilterZone || g.modality === groupFilterZone)
                    .map((grp) => (
                      <tr key={grp.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--accent-coffee)' }}>
                          {grp.name}
                          <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>{grp.address_reference}</div>
                        </td>
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontWeight: 700 }}>{grp.zone}</span> • {grp.canton}
                        </td>
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', fontWeight: 700, color: '#3B82F6' }}>
                          {grp.meeting_day} @ {grp.meeting_time}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}>
                            {grp.network_category || 'Mixto'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div>{grp.leaders || 'Equipo Pastoral'}</div>
                          {grp.phone && (
                            <a href={`https://wa.me/506${grp.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.78rem', color: '#25D366', fontWeight: 700, textDecoration: 'none' }}>
                              📱 {grp.phone}
                            </a>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ backgroundColor: grp.is_active ? '#F0FDF4' : '#FEF2F2', color: grp.is_active ? '#166534' : '#991B1B', padding: '4px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.75rem' }}>
                            {grp.is_active ? 'ACTIVO' : 'INACTIVO'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => setEditingGroupModal(grp)}
                            className="btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.78rem', fontWeight: 700, marginRight: '8px', borderRadius: '6px' }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteGroup(grp.id)}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                            title="Eliminar grupo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {adminGroupsList.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No hay grupos registrados. Haz clic en "+ Crear Nuevo Grupo".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SOLICITUDES DE CONTACTO ("¡QUIERO UNIRME!") */}
          <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle size={22} color="#10B981" />
                  Solicitudes de Integración ("¡Quiero Unirme!")
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
                  Personas interesadas en unirse a una Casa de Paz o ser contactadas por los anfitriones.
                </p>
              </div>

              <button
                onClick={fetchAdminGroupContacts}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 800, borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={14} className={loadingGroupContacts ? 'animate-spin' : ''} />
                Actualizar Solicitudes
              </button>
            </div>

            {/* FILTROS SOLICITUDES */}
            <div style={{ marginBottom: '20px', backgroundColor: '#FAF8F5', padding: '16px', borderRadius: '16px', border: '1px solid var(--accent-beige-border)' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Filtrar Estado</label>
              <select
                value={contactFilterStatus}
                onChange={(e) => setContactFilterStatus(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
              >
                <option value="all">Todos los Estados</option>
                <option value="pendiente">Pendientes de Contacto</option>
                <option value="contactado">Contactados</option>
                <option value="integrado">Integrados a Casa de Paz</option>
              </select>
            </div>

            {/* GRID DE SOLICITUDES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {adminGroupContactsList
                .filter(c => contactFilterStatus === 'all' || (c.status || 'pendiente') === contactFilterStatus)
                .map((req) => (
                  <div key={req.id} style={{
                    backgroundColor: '#FAF8F5',
                    border: '1px solid var(--accent-beige-border)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 850, color: 'var(--accent-coffee)' }}>{req.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(req.created_at).toLocaleDateString('es-CR', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#3B82F6', marginBottom: '8px' }}>
                        Grupo: {req.group_name || 'Contacto General'}
                      </div>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                        <a href={`https://wa.me/506${req.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ backgroundColor: '#25D366', color: '#FFF', padding: '6px 14px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          📱 Contactar WhatsApp ({req.phone})
                        </a>
                      </div>

                      {req.notes && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', margin: '4px 0 0', backgroundColor: '#FFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          "{req.notes}"
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                      <select
                        value={req.status || 'pendiente'}
                        onChange={(e) => handleUpdateGroupContactStatus(req.id, e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', border: '1px solid #CBD5E1' }}
                      >
                        <option value="pendiente">⏳ Pendiente</option>
                        <option value="contactado">📞 Contactado</option>
                        <option value="integrado">🎉 Integrado a Grupo</option>
                      </select>

                      <button
                        onClick={() => handleDeleteGroupContact(req.id)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                        title="Eliminar solicitud"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              {adminGroupContactsList.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No se han recibido solicitudes de contacto por el momento.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA CREAR O EDITAR GRUPO DE AMISTAD */}
      {editingGroupModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '600px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', margin: 0, fontWeight: 850 }}>
                {editingGroupModal.id ? 'Editar Grupo de Amistad' : 'Crear Nuevo Grupo de Amistad'}
              </h3>
              <button onClick={() => setEditingGroupModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveGroupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Nombre del Grupo / Casa de Paz</label>
                <input
                  type="text"
                  value={editingGroupModal.name || ''}
                  onChange={(e) => setEditingGroupModal({ ...editingGroupModal, name: e.target.value })}
                  required
                  placeholder="ej: Casa de Paz Gravilias"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Zona</label>
                  <select
                    value={editingGroupModal.zone || 'Desamparados'}
                    onChange={(e) => setEditingGroupModal({ ...editingGroupModal, zone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  >
                    <option value="Desamparados">Desamparados</option>
                    <option value="San José">San José Centro</option>
                    <option value="Curridabat">Curridabat / Este</option>
                    <option value="Virtual">Virtual / Online</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Cantón / Distrito</label>
                  <input
                    type="text"
                    value={editingGroupModal.canton || ''}
                    onChange={(e) => setEditingGroupModal({ ...editingGroupModal, canton: e.target.value })}
                    required
                    placeholder="ej: San Miguel, Gravilias, Zapote"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Día de Reunión</label>
                  <input
                    type="text"
                    value={editingGroupModal.meeting_day || ''}
                    onChange={(e) => setEditingGroupModal({ ...editingGroupModal, meeting_day: e.target.value })}
                    placeholder="ej: Viernes"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Hora de Reunión</label>
                  <input
                    type="text"
                    value={editingGroupModal.meeting_time || ''}
                    onChange={(e) => setEditingGroupModal({ ...editingGroupModal, meeting_time: e.target.value })}
                    placeholder="ej: 7:30 PM"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Modalidad</label>
                  <select
                    value={editingGroupModal.modality || 'Presencial'}
                    onChange={(e) => setEditingGroupModal({ ...editingGroupModal, modality: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual / Zoom</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Red / Categoría</label>
                  <select
                    value={editingGroupModal.network_category || 'Mixto'}
                    onChange={(e) => setEditingGroupModal({ ...editingGroupModal, network_category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  >
                    <option value="Mixto">Mixto (Familias)</option>
                    <option value="Jóvenes">MOVE (Jóvenes)</option>
                    <option value="Matrimonios">Matrimonios</option>
                    <option value="Mujeres">Mujeres / Auténticas</option>
                    <option value="Hombres">Hombres</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Dirección / Referencia</label>
                <input
                  type="text"
                  value={editingGroupModal.address_reference || ''}
                  onChange={(e) => setEditingGroupModal({ ...editingGroupModal, address_reference: e.target.value })}
                  placeholder="ej: De la plaza de deportes 200m este, casa esquinera"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Anfitriones / Líderes</label>
                  <input
                    type="text"
                    value={editingGroupModal.leaders || ''}
                    onChange={(e) => setEditingGroupModal({ ...editingGroupModal, leaders: e.target.value })}
                    placeholder="ej: Juan & María Pérez"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '4px' }}>Teléfono de Contacto</label>
                  <input
                    type="text"
                    value={editingGroupModal.phone || ''}
                    onChange={(e) => setEditingGroupModal({ ...editingGroupModal, phone: e.target.value })}
                    placeholder="ej: 8888-8888"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-coffee)', cursor: 'pointer', marginTop: '6px' }}>
                  <input
                    type="checkbox"
                    checked={editingGroupModal.is_active === 1 || editingGroupModal.is_active === true}
                    onChange={(e) => setEditingGroupModal({ ...editingGroupModal, is_active: e.target.checked ? 1 : 0 })}
                  />
                  Grupo Activo y Visible en el Buscador
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setEditingGroupModal(null)} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px', fontWeight: 800 }}>
                  {editingGroupModal.id ? 'Guardar Cambios' : 'Crear Grupo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB: CARTELERA GLOBAL DE EVENTOS (Admin) */}
      {activeTab === 'events_admin' && adminUser.role === 'admin' && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={22} color="#977DFF" />
                Cartelera Global de Eventos & Congresos (2026 vs Proyección 2027)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
                Administra las fichas de eventos, fechas, insignias de inscripción y enlaces de acceso.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newId = `evt_${Date.now()}`;
                setLocalEventsList([
                  ...localEventsList,
                  {
                    id: newId,
                    year: '2026',
                    category: 'Congresos',
                    title: 'Nuevo Evento 2026',
                    subtitle: 'Subtítulo del evento',
                    status: 'Próximamente',
                    date: 'Fecha por confirmar',
                    time: '7:00 PM',
                    location: 'Auditorio Principal Visión Jesús',
                    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000',
                    description: 'Descripción detallada del evento.',
                    url: '/#horarios-section',
                    priceInfo: 'Entrada Gratuita'
                  }
                ]);
              }}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.88rem', fontWeight: 800, borderRadius: '20px' }}
            >
              + Agregar Nuevo Evento
            </button>
          </div>

          {constructionSuccessMsg && (
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 700 }}>
              {constructionSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSaveConstructionSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
              {localEventsList.map((evt, idx) => (
                <div key={evt.id || idx} style={{
                  backgroundColor: '#FAF8F5',
                  border: '1px solid var(--accent-beige-border)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 850, color: 'var(--accent-coffee)', textTransform: 'uppercase' }}>
                      Evento #{idx + 1}: {evt.title || 'Sin Título'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = localEventsList.filter((_, i) => i !== idx);
                        setLocalEventsList(updated);
                      }}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                      title="Eliminar evento"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Año de Proyección</label>
                      <select
                        value={evt.year || '2026'}
                        onChange={(e) => {
                          const updated = [...localEventsList];
                          updated[idx].year = e.target.value;
                          setLocalEventsList(updated);
                        }}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
                      >
                        <option value="2026">Cierre 2026</option>
                        <option value="2027">Proyección 2027</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Categoría</label>
                      <select
                        value={evt.category || 'Congresos'}
                        onChange={(e) => {
                          const updated = [...localEventsList];
                          updated[idx].category = e.target.value;
                          setLocalEventsList(updated);
                        }}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      >
                        <option value="Congresos">Congresos</option>
                        <option value="Adoración">Adoración / Noches de Milagros</option>
                        <option value="Jóvenes">MOVE (Jóvenes)</option>
                        <option value="Congregacional">Congregacional</option>
                        <option value="Talleres">Talleres y Discipulado</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Título del Evento</label>
                    <input
                      type="text"
                      value={evt.title || ''}
                      onChange={(e) => {
                        const updated = [...localEventsList];
                        updated[idx].title = e.target.value;
                        setLocalEventsList(updated);
                      }}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Subtítulo / Tagline</label>
                      <input
                        type="text"
                        value={evt.subtitle || ''}
                        onChange={(e) => {
                          const updated = [...localEventsList];
                          updated[idx].subtitle = e.target.value;
                          setLocalEventsList(updated);
                        }}
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Estado / Badge</label>
                      <input
                        type="text"
                        value={evt.status || ''}
                        onChange={(e) => {
                          const updated = [...localEventsList];
                          updated[idx].status = e.target.value;
                          setLocalEventsList(updated);
                        }}
                        placeholder="ej: Entradas Disponibles, Entrada Libre"
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Fecha</label>
                      <input
                        type="text"
                        value={evt.date || ''}
                        onChange={(e) => {
                          const updated = [...localEventsList];
                          updated[idx].date = e.target.value;
                          setLocalEventsList(updated);
                        }}
                        placeholder="ej: Sábado 18 de Noviembre"
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Hora</label>
                      <input
                        type="text"
                        value={evt.time || ''}
                        onChange={(e) => {
                          const updated = [...localEventsList];
                          updated[idx].time = e.target.value;
                          setLocalEventsList(updated);
                        }}
                        placeholder="ej: 7:00 PM"
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Lugar / Auditorio</label>
                    <input
                      type="text"
                      value={evt.location || ''}
                      onChange={(e) => {
                        const updated = [...localEventsList];
                        updated[idx].location = e.target.value;
                        setLocalEventsList(updated);
                      }}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Descripción</label>
                    <textarea
                      rows={2}
                      value={evt.description || ''}
                      onChange={(e) => {
                        const updated = [...localEventsList];
                        updated[idx].description = e.target.value;
                        setLocalEventsList(updated);
                      }}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Enlace URL Destino</label>
                      <input
                        type="text"
                        value={evt.url || ''}
                        onChange={(e) => {
                          const updated = [...localEventsList];
                          updated[idx].url = e.target.value;
                          setLocalEventsList(updated);
                        }}
                        placeholder="ej: /autenticas o /oracion"
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Precios / Cupo</label>
                      <input
                        type="text"
                        value={evt.priceInfo || ''}
                        onChange={(e) => {
                          const updated = [...localEventsList];
                          updated[idx].priceInfo = e.target.value;
                          setLocalEventsList(updated);
                        }}
                        placeholder="ej: Entrada Gratuita"
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Imagen de Portada (URL)</label>
                    <input
                      type="text"
                      value={evt.image || ''}
                      onChange={(e) => {
                        const updated = [...localEventsList];
                        updated[idx].image = e.target.value;
                        setLocalEventsList(updated);
                      }}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={saveLoading}
              className="btn-primary"
              style={{ marginTop: '30px', width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800 }}
            >
              {saveLoading ? 'Guardando Cartelera...' : 'Guardar Toda la Cartelera de Eventos'}
            </button>
          </form>
        </div>
      )}

      {/* TAB: GESTIÓN DE DONACIONES Y OFRENDAS (Admin) */}
      {activeTab === 'donaciones_admin' && adminUser.role === 'admin' && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', margin: 0, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={22} color="#977DFF" />
                Gestión de Donaciones, SINPE Móvil y Cuentas IBAN
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
                Administra de forma segura los números de SINPE Móvil, titulares de cuenta, IBANs bancarios y la nota de transparencia legal.
              </p>
            </div>
          </div>

          {saveSuccessMsg && (
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 700 }}>
              {saveSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSaveConfigSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* SECCIÓN 1: ENCABEZADO Y VERSÍCULO */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h4 style={{ fontSize: '1.1rem', color: '#977DFF', marginTop: 0, marginBottom: '16px', fontWeight: 700 }}>
                  1. Encabezado y Promesa Bíblica
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Título Principal</label>
                    <input
                      type="text"
                      value={configFields.donar_title || ''}
                      onChange={(e) => setConfigFields({ ...configFields, donar_title: e.target.value })}
                      placeholder="DONACIONES Y OFRENDAS"
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Subtítulo / Eslogan</label>
                    <input
                      type="text"
                      value={configFields.donar_subtitle || ''}
                      onChange={(e) => setConfigFields({ ...configFields, donar_subtitle: e.target.value })}
                      placeholder="Generosidad que transforma vidas..."
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Versículo Bíblico</label>
                    <textarea
                      rows={2}
                      value={configFields.donar_verse || ''}
                      onChange={(e) => setConfigFields({ ...configFields, donar_verse: e.target.value })}
                      placeholder="Cada uno dé como propuso en su corazón..."
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Cita Bíblica</label>
                    <input
                      type="text"
                      value={configFields.donar_verse_ref || ''}
                      onChange={(e) => setConfigFields({ ...configFields, donar_verse_ref: e.target.value })}
                      placeholder="2 Corintios 9:7"
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: CONFIGURACIÓN DE SINPE MÓVIL */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h4 style={{ fontSize: '1.1rem', color: '#10B981', marginTop: 0, marginBottom: '16px', fontWeight: 700 }}>
                  2. SINPE Móvil (Costa Rica)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Número de Teléfono (Sin espacios)</label>
                    <input
                      type="text"
                      value={configFields.sinpe_phone || ''}
                      onChange={(e) => setConfigFields({ ...configFields, sinpe_phone: e.target.value })}
                      placeholder="88888888"
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Teléfono en Formato Visible</label>
                    <input
                      type="text"
                      value={configFields.sinpe_display || ''}
                      onChange={(e) => setConfigFields({ ...configFields, sinpe_display: e.target.value })}
                      placeholder="8888-8888"
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Nombre del Titular de la Cuenta</label>
                    <input
                      type="text"
                      value={configFields.sinpe_holder || ''}
                      onChange={(e) => setConfigFields({ ...configFields, sinpe_holder: e.target.value })}
                      placeholder="Iglesia Visión Jesús"
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: CUENTAS BANCARIAS IBAN */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h4 style={{ fontSize: '1.1rem', color: '#3B82F6', marginTop: 0, marginBottom: '16px', fontWeight: 700 }}>
                  3. Cuentas Bancarias Oficiales (IBAN)
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>BNCR (Banco Nacional) - Colones (CRC)</label>
                      <input
                        type="text"
                        value={configFields.iban_bncr_crc || ''}
                        onChange={(e) => setConfigFields({ ...configFields, iban_bncr_crc: e.target.value })}
                        placeholder="CR05015100010012345678"
                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'monospace' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>BNCR (Banco Nacional) - Dólares (USD)</label>
                      <input
                        type="text"
                        value={configFields.iban_bncr_usd || ''}
                        onChange={(e) => setConfigFields({ ...configFields, iban_bncr_usd: e.target.value })}
                        placeholder="CR05015100010087654321"
                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>BAC Credomatic - Colones (CRC)</label>
                      <input
                        type="text"
                        value={configFields.iban_bac_crc || ''}
                        onChange={(e) => setConfigFields({ ...configFields, iban_bac_crc: e.target.value })}
                        placeholder="CR05010200009876543210"
                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'monospace' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>BAC Credomatic - Dólares (USD)</label>
                      <input
                        type="text"
                        value={configFields.iban_bac_usd || ''}
                        onChange={(e) => setConfigFields({ ...configFields, iban_bac_usd: e.target.value })}
                        placeholder="CR05010200001234567890"
                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 4: TRANSPARENCIA Y NOTAS LEGALES */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h4 style={{ fontSize: '1.1rem', color: '#F59E0B', marginTop: 0, marginBottom: '16px', fontWeight: 700 }}>
                  4. Transparencia Legal
                </h4>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Nota de Transparencia Legal / Comprobantes</label>
                  <textarea
                    rows={3}
                    value={configFields.legal_transparency_note || ''}
                    onChange={(e) => setConfigFields({ ...configFields, legal_transparency_note: e.target.value })}
                    placeholder="Iglesia Visión Jesús es una entidad legalmente constituida..."
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saveLoading}
                className="btn-primary"
                style={{ padding: '14px', fontSize: '1.05rem', fontWeight: 800, background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', border: 'none', borderRadius: '12px' }}
              >
                {saveLoading ? 'Guardando Donaciones...' : 'Guardar Información de Donaciones'}
              </button>
            </div>
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
                  <option value="tickets">Solo Tickets (Gestión Completa)</option>
                  <option value="tickets_readonly">Solo Tickets (Modo Lectura)</option>
                  <option value="scanner">Solo Escáner (puerta)</option>
                  <option value="editor_autenticas">Editor Auténticas</option>
                  <option value="editor_sanados">Editor Sanados</option>
                  <option value="editor_modelo">Editor Modelo</option>
                  <option value="editor_move">Editor Move</option>
                  <option value="editor_tienda">Editor Tienda</option>
                  <option value="admin">Administrador Total</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '16px', padding: '10px 24px' }}>
              <UserPlus size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Crear Usuario
            </button>
          </form>

          {/* EDIT EXISTING USER FORM */}
          {editingUser && (
            <form onSubmit={handleUpdateUser} style={{
              backgroundColor: '#FFFBEB',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #FCD34D',
              marginBottom: '28px'
            }}>
              <h4 style={{ color: 'var(--accent-coffee)', margin: '0 0 16px 0' }}>Editar Usuario: {editingUser.username}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Nombre Completo</label>
                  <input 
                    type="text" 
                    value={editingUser.full_name} 
                    onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })} 
                    required 
                    style={{ padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Usuario</label>
                  <input 
                    type="text" 
                    value={editingUser.username} 
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} 
                    required 
                    style={{ padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Nueva Contraseña (dejar en blanco para mantener)</label>
                  <input 
                    type="text" 
                    value={editingUser.password || ''} 
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} 
                    placeholder="Contraseña nueva" 
                    style={{ padding: '8px 12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '4px' }}>Rol / Permisos</label>
                  <select 
                    value={editingUser.role} 
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CCC', width: '100%' }}
                  >
                    <option value="tickets">Solo Tickets (Gestión Completa)</option>
                    <option value="tickets_readonly">Solo Tickets (Modo Lectura)</option>
                    <option value="scanner">Solo Escáner (puerta)</option>
                    <option value="editor_autenticas">Editor Auténticas</option>
                    <option value="editor_sanados">Editor Sanados</option>
                    <option value="editor_modelo">Editor Modelo</option>
                    <option value="editor_move">Editor Move</option>
                    <option value="editor_tienda">Editor Tienda</option>
                    <option value="admin">Administrador Total</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                  Guardar Cambios
                </button>
                <button type="button" onClick={() => setEditingUser(null)} className="btn-secondary" style={{ padding: '10px 24px' }}>
                  Cancelar
                </button>
              </div>
            </form>
          )}

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
                        backgroundColor: u.role === 'admin' ? '#F59E0B' : u.role === 'tickets' ? '#3B82F6' : u.role === 'tickets_readonly' ? '#6B7280' : u.role.startsWith('editor_') ? '#8B5CF6' : '#10B981',
                        color: '#FFF',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>{u.role === 'admin' ? 'Admin' : u.role === 'tickets' ? 'Tickets' : u.role === 'tickets_readonly' ? 'Tickets (Lectura)' : u.role === 'scanner' ? 'Escáner' : u.role.replace('editor_', 'Editor ')}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setEditingUser({ id: u.id, username: u.username, full_name: u.full_name, role: u.role })}
                      style={{
                        backgroundColor: '#FEF3C7',
                        color: '#D97706',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      Editar
                    </button>
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
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVITY LOG (admin only) */}
      {activeTab === 'activity_log' && adminUser.role === 'admin' && (
        <div className="card-glass" style={{ padding: '32px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ color: 'var(--accent-coffee)', margin: 0, fontSize: '1.4rem' }}>
                <History size={22} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                Bitácora de Actividad / Auditoría
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                Historial de acciones, transacciones, aprobaciones y escaneos de la tiquetera.
              </p>
            </div>
            <button 
              onClick={fetchActivityLogs} 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '10px 16px' }}
            >
              <RefreshCw size={16} />
              Actualizar Bitácora
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {logsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <RefreshCw size={32} style={{ margin: '0 auto 10px', display: 'block' }} className="spin" />
                Cargando historial...
              </div>
            ) : activityLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No hay registros de actividad en el sistema todavía.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--accent-beige-border)', textAlign: 'left', color: 'var(--accent-coffee)' }}>
                    <th style={{ padding: '12px 8px', fontWeight: 800 }}>Fecha / Hora</th>
                    <th style={{ padding: '12px 8px', fontWeight: 800 }}>Usuario</th>
                    <th style={{ padding: '12px 8px', fontWeight: 800 }}>Acción</th>
                    <th style={{ padding: '12px 8px', fontWeight: 800 }}>Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.map((log) => {
                    let localDate = log.timestamp;
                    try {
                      const d = new Date(log.timestamp + 'Z');
                      localDate = d.toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' });
                    } catch (e) {}

                    let badgeColor = '#3B82F6';
                    let badgeLabel = log.action;
                    if (log.action === 'aprobar_reserva') { badgeColor = '#10B981'; badgeLabel = 'Aprobó'; }
                    else if (log.action === 'rechazar_reserva') { badgeColor = '#EF4444'; badgeLabel = 'Rechazó'; }
                    else if (log.action === 'eliminar_reserva') { badgeColor = '#7F1D1D'; badgeLabel = 'Eliminó'; }
                    else if (log.action === 'crear_reserva') { badgeColor = '#2563EB'; badgeLabel = 'Reservó'; }
                    else if (log.action === 'escanear_boleto') { badgeColor = '#059669'; badgeLabel = 'Escaneó'; }
                    else if (log.action === 'intento_reingreso') { badgeColor = '#D97706'; badgeLabel = 'Reingreso'; }

                    return (
                      <tr key={log.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 8px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{localDate}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 700 }}>{log.username}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{
                            backgroundColor: badgeColor,
                            color: '#FFF',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            display: 'inline-block'
                          }}>
                            {badgeLabel}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', color: '#4A3B32' }}>{log.details}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                  <div style={{ fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '10px', fontSize: '1rem', borderBottom: '1px solid #EEE', paddingBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Persona #{i + 1}: {att.full_name} ({att.assigned_ticket_code && att.assigned_ticket_code.includes(' - ') && !att.assigned_ticket_code.startsWith('Fila') && !att.assigned_ticket_code.startsWith('Asiento') ? att.assigned_ticket_code.split(' - ').slice(1).join(' - ') : att.assigned_ticket_code})</span>
                    
                    {reassigningAttendeeId === att.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select 
                          value={selectedNewSeat}
                          onChange={(e) => setSelectedNewSeat(e.target.value)}
                          style={{ padding: '4px', borderRadius: '4px', border: '1px solid #CCC', fontSize: '0.8rem' }}
                        >
                          <option value="">-- Asientos Libres --</option>
                          {(() => {
                            const groupedFreeSeats = {};
                            freeSeatsForReassign.forEach(code => {
                              const parsed = parseTicketCode(code);
                              if (!groupedFreeSeats[parsed.rowLabel]) groupedFreeSeats[parsed.rowLabel] = [];
                              groupedFreeSeats[parsed.rowLabel].push({ code, seatNum: parsed.seatNum });
                            });
                            
                            // Sort rows (handling numbers correctly if possible, or just default sort)
                            return Object.keys(groupedFreeSeats).sort((a, b) => {
                               const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
                               const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
                               return numA - numB || a.localeCompare(b);
                            }).map(rowName => (
                              <optgroup key={rowName} label={rowName}>
                                {groupedFreeSeats[rowName].sort((a,b) => (parseInt(a.seatNum) || 0) - (parseInt(b.seatNum) || 0)).map(seat => (
                                  <option key={seat.code} value={seat.code}>
                                    Asiento #{seat.seatNum}
                                  </option>
                                ))}
                              </optgroup>
                            ));
                          })()}
                        </select>
                        <button 
                          onClick={() => handleReassignSeat(att.id)}
                          disabled={reassigningLoading || !selectedNewSeat}
                          style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: 'var(--accent-coffee)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          {reassigningLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button 
                          onClick={() => setReassigningAttendeeId(null)}
                          style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: '#EEE', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleOpenReassignSeat(att, selectedAttendeesModal)}
                        style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: 'transparent', color: 'var(--accent-coffee)', border: '1px solid var(--accent-beige-border)', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        ✏️ Cambiar Asiento
                      </button>
                    )}
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
                <a
                  href={`${API_URL}${selectedReceipt.comprobante_url}`}
                  download={`Comprobante-${selectedReceipt.purchaser_name.replace(/\s+/g, '-')}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', flex: 1, textDecoration: 'none', textAlign: 'center', cursor: 'pointer' }}
                >
                  <Download size={18} /> Descargar Comprobante Original
                </a>
              </div>

              {adminUser.role !== 'tickets_readonly' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
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
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL: BIBLIOTECA DE MEDIOS (MEDIA LIBRARY) */}
      {showMediaLibrary && (
        <div className="modal-overlay" onClick={() => setShowMediaLibrary(false)} style={{ zIndex: 99999 }}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '850px', width: '90%', borderRadius: '24px', backgroundColor: '#FFFFFF', color: 'var(--accent-coffee)', padding: '24px' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EAEAEA', paddingBottom: '14px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-coffee)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={24} color="var(--accent-gold)" /> Biblioteca de Medios (Media Library)
              </h3>
              <button 
                type="button" 
                onClick={() => setShowMediaLibrary(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Upload & Search Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              
              {/* File input wrapper */}
              <div>
                <label className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '50px', cursor: 'pointer', fontWeight: 800, background: 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)', border: 'none', color: '#FFFFFF' }}>
                  <Plus size={18} /> Subir Nuevo Archivo
                  <input type="file" onChange={handleMediaUpload} style={{ display: 'none' }} accept="image/*,video/*" />
                </label>
              </div>

              {/* Search filter input */}
              <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
                <input 
                  type="text" 
                  placeholder="Buscar archivos por nombre..." 
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '50px', border: '1px solid #CCC', fontSize: '0.88rem' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              </div>
            </div>

            {/* Media Gallery Grid */}
            {loadingMedia ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: '1rem' }}>
                <RefreshCw size={36} className="spin" style={{ margin: '0 auto 12px auto', opacity: 0.3 }} />
                <span>Cargando archivos de medios...</span>
              </div>
            ) : (
              (() => {
                const filteredMedia = mediaList.filter(item => 
                  item.filename.toLowerCase().includes(mediaSearch.toLowerCase())
                );

                if (filteredMedia.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '60px 20px', border: '2px dashed #DDD', borderRadius: '16px', color: 'var(--text-muted)' }}>
                      <Eye size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
                      <p style={{ margin: 0, fontWeight: 700 }}>No se encontraron archivos en la biblioteca.</p>
                      <span style={{ fontSize: '0.85rem' }}>¡Usa el botón de arriba para subir tu primera foto o video!</span>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px', maxHeight: '420px', overflowY: 'auto', padding: '4px' }}>
                    {filteredMedia.map((item, idx) => {
                      const isImage = item.filename.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i);
                      const isVideo = item.filename.match(/\.(mp4|webm|mov|ogg)($|\?)/i);
                      return (
                        <div 
                          key={idx} 
                          onClick={() => selectMediaItem(item.url)}
                          style={{ 
                            position: 'relative', 
                            borderRadius: '14px', 
                            border: '1px solid #E2E8F0', 
                            overflow: 'hidden', 
                            aspectRatio: '1', 
                            cursor: 'pointer',
                            backgroundColor: '#F8FAFC',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                          }}
                        >
                          {/* File Preview */}
                          {isImage ? (
                            <img 
                              src={`${API_URL}${item.url}`} 
                              alt={item.filename} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : isVideo ? (
                            <video 
                              src={`${API_URL}${item.url}`} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              muted
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)' }}>
                              DOC
                            </div>
                          )}

                          {/* Hover Overlay Actions */}
                          <div style={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            right: 0, 
                            backgroundColor: 'rgba(0,0,0,0.75)', 
                            color: '#FFF', 
                            padding: '6px', 
                            fontSize: '0.7rem', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center' 
                          }}>
                            <span style={{ 
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              maxWidth: '80px',
                              fontWeight: 700
                            }}>
                              {item.filename}
                            </span>
                            <button 
                              type="button" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMediaDelete(item.filename);
                              }}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#FFAAAA', 
                                cursor: 'pointer', 
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}

            {/* Footer tips */}
            <div style={{ borderTop: '1px solid #EAEAEA', marginTop: '20px', paddingTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>💡 Haz click en cualquier imagen o video para seleccionarlo y aplicarlo a la sección activa.</span>
              <span>Total: {mediaList.length} archivos</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
