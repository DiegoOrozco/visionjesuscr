import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, Download, Eye, Filter, Lock, LogOut, Plus, RefreshCw, Search, ShieldCheck, Ticket, Trash2, UserCheck, UserPlus, Users, X, XCircle, LayoutGrid, Globe, Tag, Heart, History, ArrowUp, ArrowDown, Settings, Layers, Armchair } from 'lucide-react';
import AutenticasPromo from './AutenticasPromo';

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
  const [previewDeviceMode, setPreviewDeviceMode] = useState('desktop');
  const [builderPagePath, setBuilderPagePath] = useState('/');
  const [builderSuccessMsg, setBuilderSuccessMsg] = useState('');
  const [savingBuilder, setSavingBuilder] = useState(false);

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

  const initializeDefaultSectionsForPath = (path) => {
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
        },
        {
          id: 'sec_details_autenticas',
          type: 'custom_text',
          content: {
            title: 'Detalles del Evento',
            text: `📅 Fecha: ${homepageConfig.autenticas_date_info || 'Por anunciar'}\n📍 Lugar: ${homepageConfig.autenticas_place_info || 'Por anunciar'}\n💰 Inversión: ${homepageConfig.autenticas_price_info || 'Por anunciar'}`
          },
          styles: { backgroundColor: '#FAF5EF', textColor: '#2C1A0E', accentColor: '#2C1A0E' }
        }
      ];
    } else if (path === '/sanados' || path === '/modelo' || path === '/move' || path === '/tienda') {
      const pageName = path.replace('/', '').toUpperCase();
      return [
        {
          id: `sec_hero_${pageName}`,
          type: 'hero',
          content: {
            title: `CONGRESO ${pageName}`,
            subtitle: 'Página oficial en construcción',
            bgUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600',
            buttons: []
          },
          styles: { backgroundColor: '#030812', textColor: '#FFFFFF', accentColor: '#0033FF' }
        }
      ];
    }
    return [];
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
      
      const isReserved = editingZoneId === 'vip_central' && i < 2;
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
        tienda_subtitle: homepageConfig.tienda_subtitle || ''
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
      const res = await authFetch(`${API_URL}/api/admin/pricing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricingFields)
      });
      const data = await res.json();
      if (data.success) {
        setPricingSuccessMsg('¡Precios y fecha de preventa guardados con éxito!');
        if (onSaveConfig) onSaveConfig(pricingFields);
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
    try {
      const res = await authFetch(`${API_URL}/api/admin/homepage/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: configFields })
      });
      const data = await res.json();
      if (data.success) {
        setConstructionSuccessMsg('¡Cambios guardados con éxito!');
        if (onSaveConfig) onSaveConfig(configFields);
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
      const res = await authFetch(`${API_URL}/api/admin/export/csv`);
      if (!res.ok) {
        alert('Error al descargar el reporte CSV. Asegúrate de tener permisos.');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reservaciones_autenticas.csv';
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

      {/* Tabs Switcher */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid var(--accent-beige-border)',
        marginBottom: '24px',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {(adminUser.role === 'admin' || adminUser.role === 'tickets' || adminUser.role === 'tickets_readonly') && (
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
        )}

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

        {/* Only admin role can manage zone layouts & seat mapping */}
        {adminUser.role === 'admin' && (
          <button
            onClick={() => { setActiveTab('zones_seating'); fetchZoneAnalytics(); }}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'zones_seating' ? '3px solid var(--accent-coffee)' : '3px solid transparent',
              color: activeTab === 'zones_seating' ? 'var(--accent-coffee)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '10px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Armchair size={18} />
            Zonas y Asientos
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

        {/* Only admin role can view logs */}
        {adminUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('activity_log')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'activity_log' ? '3px solid var(--accent-coffee)' : '3px solid transparent',
              color: activeTab === 'activity_log' ? 'var(--accent-coffee)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '10px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <History size={18} />
            Bitácora de Actividad
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

      {/* TAB 2: CHURCH HOME WEB CONFIGURATION EDITOR (PAGE BUILDER) */}
      {activeTab === 'church_web' && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-coffee)', marginBottom: '6px' }}>
                Constructor de Página de Inicio (Page Builder)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                Modifica libremente el orden, contenido y diseño visual de las secciones del sitio principal.
              </p>
            </div>
            <button 
              onClick={handleSavePageLayout}
              disabled={savingBuilder}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.95rem', fontWeight: 800, background: 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)', boxShadow: '0 4px 15px rgba(0,51,255,0.4)', borderRadius: '50px' }}
            >
              {savingBuilder ? 'Guardando...' : 'Guardar Todo el Diseño'}
            </button>
          </div>

          {builderSuccessMsg && (
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px', borderRadius: '10px', marginBottom: '24px', fontWeight: 700 }}>
              {builderSuccessMsg}
            </div>
          )}

            {/* PAGE PATH SELECTOR */}
            <div style={{ marginBottom: '24px', backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid var(--accent-beige-border)', display: 'flex', justifyBetween: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 850, color: 'var(--accent-coffee)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Selecciona la Página / Ruta a Editar
                </label>
                <select 
                  value={builderPagePath} 
                  onChange={(e) => {
                    setBuilderPagePath(e.target.value);
                    setSelectedSectionId(null);
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '10px 14px', 
                    borderRadius: '10px', 
                    border: '2px solid var(--accent-beige-border)', 
                    fontWeight: 800, 
                    fontSize: '0.9rem',
                    backgroundColor: '#FAF8F5',
                    color: 'var(--accent-coffee)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="/">Inicio (Página Principal)</option>
                  <option value="/autenticas">Congreso Auténticas (/autenticas)</option>
                  <option value="/sanados">Congreso Sanados (/sanados)</option>
                  <option value="/modelo">Congreso Modelo (/modelo)</option>
                  <option value="/move">Congreso Move (/move)</option>
                  <option value="/tienda">Tienda Oficial (/tienda)</option>
                  <option value="/nosotros">Nosotros (/nosotros)</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-end' }}>
                <span style={{ fontSize: '0.82rem', padding: '6px 12px', backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-coffee)', borderRadius: '30px', fontWeight: 800 }}>
                  Ruta Activa: <code>{builderPagePath}</code>
                </span>
              </div>
            </div>

          {builderPagePath !== '/autenticas' && (
            <div style={{ display: 'flex', gap: '24px', alignItems: 'stretch', marginTop: '10px', width: '100%' }}>
            
            {/* LEFT COLUMN: SIDEBAR EDITOR (WordPress Style) */}
            <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
              
              {/* SECTIONS LIST & REORDERING */}
              <div style={{ backgroundColor: '#FAF8F5', padding: '20px', borderRadius: '20px', border: '1px solid var(--accent-beige-border)' }}>
                <h4 style={{ color: 'var(--accent-coffee)', marginTop: 0, marginBottom: '14px', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estructura de la Página</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                  {localSections.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '16px', border: '1px dashed #CCC', borderRadius: '10px' }}>
                      No hay secciones añadidas aún en esta página. ¡Agrega una abajo!
                    </div>
                  ) : (
                    localSections.map((sec, idx) => (
                      <div 
                        key={sec.id} 
                        onClick={() => setSelectedSectionId(sec.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          backgroundColor: selectedSectionId === sec.id ? 'rgba(0, 51, 255, 0.08)' : '#FFFFFF',
                          border: selectedSectionId === sec.id ? '2px solid #0033FF' : '1px solid var(--accent-beige-border)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#977DFF', backgroundColor: '#EAEDF8', width: '22px', height: '22px', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {idx + 1}
                          </span>
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--accent-coffee)' }}>
                              {sec.type === 'hero' && 'Portada (Hero)'}
                              {sec.type === 'news' && 'Noticias y Eventos'}
                              {sec.type === 'pillars' && 'Pilares de la Visión'}
                              {sec.type === 'schedules' && 'Horarios de Servicios'}
                              {sec.type === 'custom_text' && 'Bloque de Texto'}
                              {sec.type === 'cta' && 'Llamado a la Acción'}
                              {sec.type === 'image_text' && 'Imagen + Texto'}
                            </strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{sec.type}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                          <button 
                            type="button"
                            onClick={() => handleMoveSection(idx, 'up')}
                            disabled={idx === 0}
                            style={{ padding: '4px', borderRadius: '6px', backgroundColor: '#F3F4F6', color: idx === 0 ? '#CCC' : '#4B5563', border: 'none', cursor: 'pointer' }}
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleMoveSection(idx, 'down')}
                            disabled={idx === localSections.length - 1}
                            style={{ padding: '4px', borderRadius: '6px', backgroundColor: '#F3F4F6', color: idx === localSections.length - 1 ? '#CCC' : '#4B5563', border: 'none', cursor: 'pointer' }}
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteSection(sec.id)}
                            style={{ padding: '4px', borderRadius: '6px', backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', border: 'none', cursor: 'pointer' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* ADD COMPONENT SELECTOR */}
                <div style={{ borderTop: '1px solid var(--accent-beige-border)', paddingTop: '14px' }}>
                  <h5 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-coffee)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Agregar Sección</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    <button type="button" onClick={() => handleAddSection('hero')} className="btn-secondary" style={{ padding: '8px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                      <Plus size={12} /> Portada
                    </button>
                    <button type="button" onClick={() => handleAddSection('news')} className="btn-secondary" style={{ padding: '8px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                      <Plus size={12} /> Noticias
                    </button>
                    <button type="button" onClick={() => handleAddSection('pillars')} className="btn-secondary" style={{ padding: '8px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                      <Plus size={12} /> Pilares
                    </button>
                    <button type="button" onClick={() => handleAddSection('schedules')} className="btn-secondary" style={{ padding: '8px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                      <Plus size={12} /> Horarios
                    </button>
                    <button type="button" onClick={() => handleAddSection('custom_text')} className="btn-secondary" style={{ padding: '8px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                      <Plus size={12} /> Texto Libre
                    </button>
                    <button type="button" onClick={() => handleAddSection('cta')} className="btn-secondary" style={{ padding: '8px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                      <Plus size={12} /> Banner CTA
                    </button>
                    <button type="button" onClick={() => handleAddSection('image_text')} className="btn-secondary" style={{ padding: '8px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                      <Plus size={12} /> Texto e Imagen
                    </button>
                    <button type="button" onClick={() => handleAddSection('grid')} className="btn-secondary" style={{ padding: '8px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                      <Plus size={12} /> Cuadrícula Bento
                    </button>
                    <button type="button" onClick={() => handleAddSection('pastors_profile')} className="btn-secondary" style={{ padding: '8px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', gridColumn: '1 / -1' }}>
                      <Users size={16} /> Perfil Pastores
                    </button>
                  </div>
                </div>
              </div>

              {/* EDITOR PANEL */}
              <div style={{ backgroundColor: '#FAF8F5', padding: '20px', borderRadius: '20px', border: '1px solid var(--accent-beige-border)', minHeight: '320px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {!selectedSectionId ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                    <Settings size={36} style={{ opacity: 0.3, marginBottom: '10px' }} />
                    <p style={{ fontWeight: 700, margin: 0, fontSize: '0.85rem' }}>Selecciona una sección a la izquierda o arriba para configurar sus contenidos y colores.</p>
                  </div>
                ) : (
                  (() => {
                    const sec = localSections.find(s => s.id === selectedSectionId);
                    if (!sec) return null;

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--accent-beige-border)', paddingBottom: '10px' }}>
                          <h4 style={{ margin: 0, color: 'var(--accent-coffee)', fontWeight: 800, fontSize: '0.9rem' }}>
                            Configurar: {sec.type.toUpperCase()}
                          </h4>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', backgroundColor: '#EAEDF8', borderRadius: '50px', color: '#977DFF' }}>ID: {sec.id.substring(0, 8)}</span>
                        </div>

                        {/* EDIT CONTENT FORM */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', maxHeight: '420px', paddingRight: '4px' }}>
                          
                          {/* Title Field */}
                          {sec.type !== 'news' && (
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Título</label>
                              <input 
                                type="text" 
                                value={sec.content.title || ''} 
                                onChange={(e) => handleUpdateSectionContent('title', e.target.value)} 
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--accent-beige-border)' }}
                              />
                            </div>
                          )}

                          {/* Subtitle Field */}
                          {(sec.type === 'hero' || sec.type === 'pillars') && (
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Subtítulo</label>
                              <input 
                                type="text" 
                                value={sec.content.subtitle || ''} 
                                onChange={(e) => handleUpdateSectionContent('subtitle', e.target.value)} 
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--accent-beige-border)' }}
                              />
                            </div>
                          )}

                          {/* Image/Video URL with Upload */}
                          {(sec.type === 'hero' || sec.type === 'schedules' || sec.type === 'cta' || sec.type === 'image_text') && (
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Imagen / Fondo URL</label>
                              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                                <input 
                                  type="text" 
                                  value={sec.content.bgUrl || ''} 
                                  onChange={(e) => handleUpdateSectionContent('bgUrl', e.target.value)} 
                                  style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--accent-beige-border)', fontSize: '0.8rem' }}
                                  placeholder="http://..."
                                />
                                <button
                                  type="button"
                                  onClick={() => openMediaLibrary(['section', sec.id, 'bgUrl'])}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', backgroundColor: '#EFE3D3', padding: '8px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
                                >
                                  <Download size={12} /> Medios
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Custom Textarea Content */}
                          {(sec.type === 'custom_text' || sec.type === 'image_text') && (
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Texto del Párrafo</label>
                              <textarea 
                                rows="4"
                                value={sec.content.text || ''} 
                                onChange={(e) => handleUpdateSectionContent('text', e.target.value)} 
                                style={{ width: '100%', border: '1px solid var(--accent-beige-border)', borderRadius: '8px', padding: '8px', fontFamily: 'inherit', fontSize: '0.85rem' }}
                              />
                            </div>
                          )}

                          {/* CTA Fields */}
                          {sec.type === 'cta' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Texto Botón</label>
                                <input 
                                  type="text" 
                                  value={sec.content.buttonText || ''} 
                                  onChange={(e) => handleUpdateSectionContent('buttonText', e.target.value)} 
                                  style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--accent-beige-border)' }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Ruta Enlace</label>
                                <input 
                                  type="text" 
                                  value={sec.content.buttonUrl || ''} 
                                  onChange={(e) => handleUpdateSectionContent('buttonUrl', e.target.value)} 
                                  style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--accent-beige-border)' }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Image Position */}
                          {sec.type === 'image_text' && (
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Posición de la Imagen</label>
                              <select 
                                value={sec.content.imagePosition || 'left'} 
                                onChange={(e) => handleUpdateSectionContent('imagePosition', e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--accent-beige-border)' }}
                              >
                                <option value="left">Izquierda</option>
                                <option value="right">Derecha</option>
                              </select>
                            </div>
                          )}

                          {/* Pillars Array Editor */}
                          {sec.type === 'pillars' && (
                            <div style={{ borderTop: '1px solid var(--accent-beige-border)', paddingTop: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--accent-coffee)', fontSize: '0.8rem' }}>Tarjetas de Pilares</h5>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const list = sec.content.pillars || [];
                                    handleUpdateSectionContent('pillars', [...list, { id: Date.now().toString(), title: 'Nuevo Pilar', text: 'Descripción...', icon: 'Compass' }]);
                                  }}
                                  className="btn-secondary"
                                  style={{ padding: '2px 6px', fontSize: '0.7rem', border: 'none', cursor: 'pointer' }}
                                >
                                  + Agregar
                                </button>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {(sec.content.pillars || []).map((p, pIdx) => (
                                  <div key={p.id || pIdx} style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid var(--accent-beige-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '6px' }}>
                                      <input 
                                        type="text" 
                                        value={p.title || ''} 
                                        onChange={(e) => {
                                          const list = [...sec.content.pillars];
                                          list[pIdx].title = e.target.value;
                                          handleUpdateSectionContent('pillars', list);
                                        }}
                                        style={{ fontWeight: 700, padding: '4px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #CCC', flex: 1 }}
                                        placeholder="Título"
                                      />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const list = sec.content.pillars.filter((_, i) => i !== pIdx);
                                          handleUpdateSectionContent('pillars', list);
                                        }}
                                        style={{ padding: '2px 6px', backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <textarea 
                                      rows="2"
                                      value={p.text || ''} 
                                      onChange={(e) => {
                                        const list = [...sec.content.pillars];
                                        list[pIdx].text = e.target.value;
                                        handleUpdateSectionContent('pillars', list);
                                      }}
                                      style={{ width: '100%', fontSize: '0.75rem', padding: '4px', borderRadius: '4px', border: '1px solid #CCC' }}
                                      placeholder="Descripción..."
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                      <label style={{ fontSize: '0.7rem', fontWeight: 700 }}>Icono:</label>
                                      <select 
                                        value={p.icon || 'Compass'} 
                                        onChange={(e) => {
                                          const list = [...sec.content.pillars];
                                          list[pIdx].icon = e.target.value;
                                          handleUpdateSectionContent('pillars', list);
                                        }}
                                        style={{ fontSize: '0.7rem', padding: '2px', width: 'auto' }}
                                      >
                                        <option value="Compass">Compass</option>
                                        <option value="Flame">Flame</option>
                                        <option value="Users">Users</option>
                                      </select>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Schedules Array Editor */}
                          {sec.type === 'schedules' && (
                            <div style={{ borderTop: '1px solid var(--accent-beige-border)', paddingTop: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--accent-coffee)', fontSize: '0.8rem' }}>Horarios</h5>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const list = sec.content.schedules || [];
                                    handleUpdateSectionContent('schedules', [...list, { id: Date.now().toString(), text: 'Servicio 7:00 PM', isVirtual: false }]);
                                  }}
                                  className="btn-secondary"
                                  style={{ padding: '2px 6px', fontSize: '0.7rem', border: 'none', cursor: 'pointer' }}
                                >
                                  + Agregar
                                </button>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {(sec.content.schedules || []).map((s, sIdx) => (
                                  <div key={s.id || sIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '8px', border: '1px solid var(--accent-beige-border)' }}>
                                    <input 
                                      type="text" 
                                      value={s.text || ''} 
                                      onChange={(e) => {
                                        const list = [...sec.content.schedules];
                                        list[sIdx].text = e.target.value;
                                        handleUpdateSectionContent('schedules', list);
                                      }}
                                      style={{ flex: 1, padding: '4px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #CCC' }}
                                      placeholder="Horario..."
                                    />
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                                      <input 
                                        type="checkbox" 
                                        checked={s.isVirtual || false}
                                        onChange={(e) => {
                                          const list = [...sec.content.schedules];
                                          list[sIdx].isVirtual = e.target.checked;
                                          handleUpdateSectionContent('schedules', list);
                                        }}
                                        style={{ width: 'auto' }}
                                      />
                                      Virt.
                                    </label>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const list = sec.content.schedules.filter((_, i) => i !== sIdx);
                                        handleUpdateSectionContent('schedules', list);
                                      }}
                                      style={{ padding: '4px', backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* News Array Editor */}
                          {sec.type === 'news' && (
                            <div style={{ borderTop: '1px solid var(--accent-beige-border)', paddingTop: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--accent-coffee)', fontSize: '0.8rem' }}>Noticias y Eventos</h5>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const list = sec.content.newsItems || [];
                                    handleUpdateSectionContent('newsItems', [...list, { id: Date.now().toString(), title: 'Nueva Noticia', description: '', image: '', link: '', badge: '' }]);
                                  }}
                                  className="btn-secondary"
                                  style={{ padding: '2px 6px', fontSize: '0.7rem', border: 'none', cursor: 'pointer' }}
                                >
                                  + Agregar
                                </button>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {(sec.content.newsItems || []).map((n, nIdx) => (
                                  <div key={n.id || nIdx} style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid var(--accent-beige-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '6px' }}>
                                      <input 
                                        type="text" 
                                        value={n.title || ''} 
                                        onChange={(e) => {
                                          const list = [...sec.content.newsItems];
                                          list[nIdx].title = e.target.value;
                                          handleUpdateSectionContent('newsItems', list);
                                        }}
                                        style={{ fontWeight: 700, padding: '4px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #CCC', flex: 1 }}
                                        placeholder="Título"
                                      />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const list = sec.content.newsItems.filter((_, i) => i !== nIdx);
                                          handleUpdateSectionContent('newsItems', list);
                                        }}
                                        style={{ padding: '2px 6px', backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <textarea 
                                      rows="2"
                                      value={n.description || ''} 
                                      onChange={(e) => {
                                        const list = [...sec.content.newsItems];
                                        list[nIdx].description = e.target.value;
                                        handleUpdateSectionContent('newsItems', list);
                                      }}
                                      style={{ width: '100%', fontSize: '0.75rem', padding: '4px', borderRadius: '4px', border: '1px solid #CCC', marginBottom: '6px' }}
                                      placeholder="Descripción..."
                                    />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                                      <input 
                                        type="text" 
                                        value={n.badge || ''} 
                                        onChange={(e) => {
                                          const list = [...sec.content.newsItems];
                                          list[nIdx].badge = e.target.value;
                                          handleUpdateSectionContent('newsItems', list);
                                        }}
                                        style={{ fontSize: '0.75rem', padding: '4px', borderRadius: '4px', border: '1px solid #CCC' }}
                                        placeholder="Etiqueta (Ej: NUEVO)"
                                      />
                                      <input 
                                        type="text" 
                                        value={n.link || ''} 
                                        onChange={(e) => {
                                          const list = [...sec.content.newsItems];
                                          list[nIdx].link = e.target.value;
                                          handleUpdateSectionContent('newsItems', list);
                                        }}
                                        style={{ fontSize: '0.75rem', padding: '4px', borderRadius: '4px', border: '1px solid #CCC' }}
                                        placeholder="Enlace (opcional)"
                                      />
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <input 
                                        type="text" 
                                        value={n.image || ''} 
                                        onChange={(e) => {
                                          const list = [...sec.content.newsItems];
                                          list[nIdx].image = e.target.value;
                                          handleUpdateSectionContent('newsItems', list);
                                        }}
                                        style={{ flex: 1, fontSize: '0.75rem', padding: '4px', borderRadius: '4px', border: '1px solid #CCC' }}
                                        placeholder="URL de Imagen"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => openMediaLibrary(['section_news', sec.id, nIdx, 'image'])}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', backgroundColor: '#EFE3D3', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
                                      >
                                        <Download size={12} /> Medios
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Grid Array Editor */}
                          {sec.type === 'grid' && (
                            <>
                              <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>Número de Columnas (Desktop)</label>
                                <select 
                                  value={sec.content.columns || 2}
                                  onChange={(e) => handleUpdateSectionContent('columns', parseInt(e.target.value))}
                                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--accent-beige-border)' }}
                                >
                                  <option value={2}>2 Columnas</option>
                                  <option value={3}>3 Columnas</option>
                                  <option value={4}>4 Columnas</option>
                                </select>
                              </div>
                              <div style={{ borderTop: '1px solid var(--accent-beige-border)', paddingTop: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--accent-coffee)', fontSize: '0.8rem' }}>Celdas de la Cuadrícula</h5>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const list = sec.content.cells || [];
                                      handleUpdateSectionContent('cells', [...list, { title: 'Nueva Celda', text: '', imageUrl: '', buttonText: '', buttonUrl: '' }]);
                                    }}
                                    className="btn-secondary"
                                    style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                                  >
                                    + Agregar Celda
                                  </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {(sec.content.cells || []).map((cell, cIdx) => (
                                    <div key={cIdx} style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Celda {cIdx + 1}</span>
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            const list = sec.content.cells.filter((_, i) => i !== cIdx);
                                            handleUpdateSectionContent('cells', list);
                                          }}
                                          style={{ padding: '2px 6px', backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}
                                        >
                                          ✕ Eliminar
                                        </button>
                                      </div>
                                      <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                                        <div style={{ flex: 1 }}>
                                          <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, marginBottom: '2px', color: 'var(--accent-coffee)' }}>Ancho (Cols)</label>
                                          <select 
                                            value={cell.colSpan || 1}
                                            onChange={(e) => {
                                              const list = [...sec.content.cells];
                                              list[cIdx].colSpan = parseInt(e.target.value);
                                              handleUpdateSectionContent('cells', list);
                                            }}
                                            style={{ width: '100%', fontSize: '0.75rem', padding: '4px', borderRadius: '4px', border: '1px solid #CCC' }}
                                          >
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                          </select>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                          <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, marginBottom: '2px', color: 'var(--accent-coffee)' }}>Alto (Filas)</label>
                                          <select 
                                            value={cell.rowSpan || 1}
                                            onChange={(e) => {
                                              const list = [...sec.content.cells];
                                              list[cIdx].rowSpan = parseInt(e.target.value);
                                              handleUpdateSectionContent('cells', list);
                                            }}
                                            style={{ width: '100%', fontSize: '0.75rem', padding: '4px', borderRadius: '4px', border: '1px solid #CCC' }}
                                          >
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                          </select>
                                        </div>
                                      </div>
                                      <input 
                                        type="text" 
                                        placeholder="Título (opcional)"
                                        value={cell.title || ''}
                                        onChange={(e) => {
                                          const list = [...sec.content.cells];
                                          list[cIdx].title = e.target.value;
                                          handleUpdateSectionContent('cells', list);
                                        }}
                                        style={{ width: '100%', fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC' }}
                                      />
                                      <textarea 
                                        rows="2"
                                        placeholder="Texto descriptivo (opcional)"
                                        value={cell.text || ''}
                                        onChange={(e) => {
                                          const list = [...sec.content.cells];
                                          list[cIdx].text = e.target.value;
                                          handleUpdateSectionContent('cells', list);
                                        }}
                                        style={{ width: '100%', fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC', fontFamily: 'inherit' }}
                                      />
                                      <div style={{ display: 'flex', gap: '4px' }}>
                                        <input 
                                          type="text" 
                                          placeholder="URL de Imagen (opcional)"
                                          value={cell.imageUrl || ''}
                                          onChange={(e) => {
                                            const list = [...sec.content.cells];
                                            list[cIdx].imageUrl = e.target.value;
                                            handleUpdateSectionContent('cells', list);
                                          }}
                                          style={{ flex: 1, fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC' }}
                                        />
                                        <label style={{ cursor: 'pointer', padding: '4px 10px', fontSize: '0.7rem', backgroundColor: 'var(--accent-coffee)', color: '#FFF', borderRadius: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                                          Subir Foto
                                          <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={async (e) => {
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
                                                  const list = [...sec.content.cells];
                                                  list[cIdx].imageUrl = data.url;
                                                  handleUpdateSectionContent('cells', list);
                                                } else {
                                                  alert('Error al subir la imagen.');
                                                }
                                              } catch (err) {
                                                alert('Error de red al subir la imagen.');
                                              }
                                            }} 
                                            style={{ display: 'none' }} 
                                          />
                                        </label>
                                      </div>
                                      <div style={{ display: 'flex', gap: '4px' }}>
                                        <input 
                                          type="text" 
                                          placeholder="Ícono Lucide (opcional, ej: Users)"
                                          value={cell.iconName || ''}
                                          onChange={(e) => {
                                            const list = [...sec.content.cells];
                                            list[cIdx].iconName = e.target.value;
                                            handleUpdateSectionContent('cells', list);
                                          }}
                                          style={{ flex: 1, fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC' }}
                                        />
                                      </div>
                                      <div style={{ display: 'flex', gap: '4px' }}>
                                        <input 
                                          type="text" 
                                          placeholder="Texto Botón"
                                          value={cell.buttonText || ''}
                                          onChange={(e) => {
                                            const list = [...sec.content.cells];
                                            list[cIdx].buttonText = e.target.value;
                                            handleUpdateSectionContent('cells', list);
                                          }}
                                          style={{ flex: 1, fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC' }}
                                        />
                                        <input 
                                          type="text" 
                                          placeholder="URL Botón"
                                          value={cell.buttonUrl || ''}
                                          onChange={(e) => {
                                            const list = [...sec.content.cells];
                                            list[cIdx].buttonUrl = e.target.value;
                                            handleUpdateSectionContent('cells', list);
                                          }}
                                          style={{ flex: 1, fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC' }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {/* Hero Buttons Array Editor */}
                          {sec.type === 'hero' && (
                            <div style={{ borderTop: '1px solid var(--accent-beige-border)', paddingTop: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--accent-coffee)', fontSize: '0.8rem' }}>Botones de Acción</h5>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const list = sec.content.buttons || [];
                                    handleUpdateSectionContent('buttons', [...list, { id: Date.now().toString(), label: 'Nuevo Botón', url: '', style: 'primary' }]);
                                  }}
                                  className="btn-secondary"
                                  style={{ padding: '2px 6px', fontSize: '0.7rem', border: 'none', cursor: 'pointer' }}
                                >
                                  + Agregar
                                </button>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {(sec.content.buttons || []).map((b, bIdx) => (
                                  <div key={b.id || bIdx} style={{ backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '8px', border: '1px solid var(--accent-beige-border)' }}>
                                    <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                                      <input 
                                        type="text" 
                                        value={b.label || ''} 
                                        onChange={(e) => {
                                          const list = [...sec.content.buttons];
                                          list[bIdx].label = e.target.value;
                                          handleUpdateSectionContent('buttons', list);
                                        }}
                                        style={{ padding: '4px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '4px', border: '1px solid #CCC', width: '90px' }}
                                        placeholder="Texto"
                                      />
                                      <input 
                                        type="text" 
                                        value={b.url || ''} 
                                        onChange={(e) => {
                                          const list = [...sec.content.buttons];
                                          list[bIdx].url = e.target.value;
                                          handleUpdateSectionContent('buttons', list);
                                        }}
                                        style={{ padding: '4px', fontSize: '0.75rem', flex: 1, borderRadius: '4px', border: '1px solid #CCC' }}
                                        placeholder="Enlace (ej: /autenticas)"
                                      />
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const list = sec.content.buttons.filter((_, i) => i !== bIdx);
                                          handleUpdateSectionContent('buttons', list);
                                        }}
                                        style={{ padding: '2px 6px', backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <label style={{ fontSize: '0.65rem', fontWeight: 700 }}>Estilo:</label>
                                      <select 
                                        value={b.style || 'primary'} 
                                        onChange={(e) => {
                                          const list = [...sec.content.buttons];
                                          list[bIdx].style = e.target.value;
                                          handleUpdateSectionContent('buttons', list);
                                        }}
                                        style={{ fontSize: '0.65rem', padding: '1px', width: '80px' }}
                                      >
                                        <option value="primary">Primario</option>
                                        <option value="secondary">Secundario</option>
                                      </select>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Pastors Profile Array Editor */}
                          {sec.type === 'pastors_profile' && (
                            <div style={{ borderTop: '1px solid var(--accent-beige-border)', paddingTop: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h5 style={{ margin: 0, fontWeight: 800, color: 'var(--accent-coffee)', fontSize: '0.8rem' }}>Perfiles de Pastores</h5>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const list = sec.content.pastors || [];
                                    handleUpdateSectionContent('pastors', [...list, { name: 'Nuevo Pastor', role: 'Pastor Principal', description: '', imageUrl: '', instagramUrl: '', facebookUrl: '' }]);
                                  }}
                                  className="btn-secondary"
                                  style={{ padding: '2px 6px', fontSize: '0.7rem', border: 'none', cursor: 'pointer' }}
                                >
                                  + Agregar Pastor
                                </button>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {(sec.content.pastors || []).map((pastor, pIdx) => (
                                  <div key={pIdx} style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-coffee)' }}>Pastor {pIdx + 1}</span>
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          const list = sec.content.pastors.filter((_, i) => i !== pIdx);
                                          handleUpdateSectionContent('pastors', list);
                                        }}
                                        style={{ padding: '2px 6px', backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}
                                      >
                                        ✕ Eliminar
                                      </button>
                                    </div>

                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <input 
                                        type="text" 
                                        placeholder="Nombre (ej: Wagner Castro)"
                                        value={pastor.name || ''}
                                        onChange={(e) => {
                                          const list = [...sec.content.pastors];
                                          list[pIdx].name = e.target.value;
                                          handleUpdateSectionContent('pastors', list);
                                        }}
                                        style={{ flex: 1, fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC', fontWeight: 700 }}
                                      />
                                      <input 
                                        type="text" 
                                        placeholder="Rol (ej: Pastor Principal)"
                                        value={pastor.role || ''}
                                        onChange={(e) => {
                                          const list = [...sec.content.pastors];
                                          list[pIdx].role = e.target.value;
                                          handleUpdateSectionContent('pastors', list);
                                        }}
                                        style={{ flex: 1, fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC' }}
                                      />
                                    </div>

                                    <textarea 
                                      rows="3"
                                      placeholder="Biografía / Historia del pastor..."
                                      value={pastor.description || ''}
                                      onChange={(e) => {
                                        const list = [...sec.content.pastors];
                                        list[pIdx].description = e.target.value;
                                        handleUpdateSectionContent('pastors', list);
                                      }}
                                      style={{ width: '100%', fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC', fontFamily: 'inherit' }}
                                    />

                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <input 
                                        type="text" 
                                        placeholder="URL de Foto / Imagen"
                                        value={pastor.imageUrl || ''}
                                        onChange={(e) => {
                                          const list = [...sec.content.pastors];
                                          list[pIdx].imageUrl = e.target.value;
                                          handleUpdateSectionContent('pastors', list);
                                        }}
                                        style={{ flex: 1, fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC' }}
                                      />
                                      <button 
                                        type="button" 
                                        onClick={() => setMediaSelectCallback(() => (url) => {
                                          const list = [...sec.content.pastors];
                                          list[pIdx].imageUrl = url;
                                          handleUpdateSectionContent('pastors', list);
                                        })}
                                        style={{ padding: '0 8px', fontSize: '0.7rem', backgroundColor: '#EFE3D3', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                                      >
                                        Medios
                                      </button>
                                    </div>

                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <input 
                                        type="text" 
                                        placeholder="URL Instagram (opcional)"
                                        value={pastor.instagramUrl || ''}
                                        onChange={(e) => {
                                          const list = [...sec.content.pastors];
                                          list[pIdx].instagramUrl = e.target.value;
                                          handleUpdateSectionContent('pastors', list);
                                        }}
                                        style={{ flex: 1, fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC' }}
                                      />
                                      <input 
                                        type="text" 
                                        placeholder="URL Facebook (opcional)"
                                        value={pastor.facebookUrl || ''}
                                        onChange={(e) => {
                                          const list = [...sec.content.pastors];
                                          list[pIdx].facebookUrl = e.target.value;
                                          handleUpdateSectionContent('pastors', list);
                                        }}
                                        style={{ flex: 1, fontSize: '0.75rem', padding: '6px', borderRadius: '4px', border: '1px solid #CCC' }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>

                        {/* EDIT SECTION STYLES */}
                        <div style={{ borderTop: '2px solid var(--accent-beige-border)', paddingTop: '10px' }}>
                          <h5 style={{ margin: '0 0 8px 0', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-coffee)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Diseño y Colores</h5>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '2px' }}>Fondo</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <input 
                                  type="color" 
                                  value={sec.styles.backgroundColor || '#030812'} 
                                  onChange={(e) => handleUpdateSectionStyles('backgroundColor', e.target.value)} 
                                  style={{ width: '30px', height: '26px', padding: '1px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{sec.styles.backgroundColor.substring(1, 5)}</span>
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '2px' }}>Texto</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <input 
                                  type="color" 
                                  value={sec.styles.textColor || '#FFFFFF'} 
                                  onChange={(e) => handleUpdateSectionStyles('textColor', e.target.value)} 
                                  style={{ width: '30px', height: '26px', padding: '1px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{sec.styles.textColor.substring(1, 5)}</span>
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, marginBottom: '2px' }}>Acento</label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <input 
                                  type="color" 
                                  value={sec.styles.accentColor || '#0033FF'} 
                                  onChange={(e) => handleUpdateSectionStyles('accentColor', e.target.value)} 
                                  style={{ width: '30px', height: '26px', padding: '1px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{sec.styles.accentColor.substring(1, 5)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()
                )}
              </div>

              {/* ACCORDION: BARRA DE NAVEGACIÓN (HEADER) */}
              <div style={{ backgroundColor: '#FAF8F5', padding: '20px', borderRadius: '20px', border: '1px solid var(--accent-beige-border)' }}>
                <h4 style={{ color: 'var(--accent-coffee)', marginTop: 0, marginBottom: '14px', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Barra de Navegación (Header)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-coffee)' }}>Links del Menú</label>
                    <button 
                      type="button" 
                      onClick={() => setNavbarLinks([...navbarLinks, { label: 'Nuevo Link', url: '/', isButton: false }])}
                      style={{ padding: '2px 8px', fontSize: '0.7rem', backgroundColor: '#EFE3D3', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                    >
                      + Agregar Link
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navbarLinks.map((link, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '4px', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
                        <input 
                          type="text" 
                          value={link.label} 
                          onChange={(e) => {
                            const list = [...navbarLinks];
                            list[idx].label = e.target.value;
                            setNavbarLinks(list);
                          }}
                          placeholder="Texto del link"
                          style={{ flex: 1, padding: '4px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #CCC' }}
                        />
                        <input 
                          type="text" 
                          value={link.url} 
                          onChange={(e) => {
                            const list = [...navbarLinks];
                            list[idx].url = e.target.value;
                            setNavbarLinks(list);
                          }}
                          placeholder="URL / ruta (#seccion o /pagina)"
                          style={{ flex: 1.5, padding: '4px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #CCC' }}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={link.isButton || false}
                            onChange={(e) => {
                              const list = [...navbarLinks];
                              list[idx].isButton = e.target.checked;
                              setNavbarLinks(list);
                            }}
                          />
                          Botón
                        </label>
                        <button 
                          type="button" 
                          onClick={() => setNavbarLinks(navbarLinks.filter((_, i) => i !== idx))}
                          style={{ padding: '2px 6px', backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button 
                    type="button" 
                    onClick={handleSaveFooterConfig}
                    className="btn-primary"
                    style={{ marginTop: '6px', width: '100%', padding: '8px', fontSize: '0.8rem', fontWeight: 800, backgroundColor: 'var(--accent-coffee)', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    Guardar Navbar
                  </button>
                </div>
              </div>

              {/* COLLAPSIBLE ACCORDION 3: GLOBAL FOOTER SETTINGS */}
              <div style={{ backgroundColor: '#FAF8F5', padding: '20px', borderRadius: '20px', border: '1px solid var(--accent-beige-border)' }}>
                <h4 style={{ color: 'var(--accent-coffee)', marginTop: 0, marginBottom: '14px', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pie de Página (Footer)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {/* Address */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 750, marginBottom: '4px' }}>Dirección de la Iglesia</label>
                    <textarea 
                      rows="2"
                      value={configFields.contact_address || ''} 
                      onChange={(e) => setConfigFields({ ...configFields, contact_address: e.target.value })} 
                      placeholder="Dirección física..."
                      style={{ width: '100%', fontSize: '0.8rem', padding: '6px', borderRadius: '6px', border: '1px solid #CCC', fontFamily: 'inherit' }}
                    />
                  </div>

                  {/* Maps Links */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 750, marginBottom: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#4285F4"><path d="M12 0C7.31 0 3.07 3.11 1.64 7.56c-.05.16-.1.33-.14.5L12 14l10.5-5.94c-.04-.17-.09-.34-.14-.5C20.93 3.11 16.69 0 12 0zm0 2a7.98 7.98 0 0 1 7.94 7H4.06A7.98 7.98 0 0 1 12 2zM1.08 9.13C.39 11.22 0 13.47 0 15.88 0 20.39 5.37 24 12 24s12-3.61 12-8.12c0-2.41-.39-4.66-1.08-6.75L12 15.06 1.08 9.13z"/></svg>
                        Google Maps
                      </label>
                      <input 
                        type="text"
                        value={configFields.maps_google_url || ''} 
                        onChange={(e) => setConfigFields({ ...configFields, maps_google_url: e.target.value })} 
                        placeholder="https://maps.google.com/..."
                        style={{ width: '100%', fontSize: '0.78rem', padding: '6px', borderRadius: '6px', border: '1px solid #CCC' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 750, marginBottom: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#33CCFF"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        Waze
                      </label>
                      <input 
                        type="text"
                        value={configFields.maps_waze_url || ''} 
                        onChange={(e) => setConfigFields({ ...configFields, maps_waze_url: e.target.value })} 
                        placeholder="https://waze.com/ul/..."
                        style={{ width: '100%', fontSize: '0.78rem', padding: '6px', borderRadius: '6px', border: '1px solid #CCC' }}
                      />
                    </div>
                  </div>

                  {/* Contacts Array List */}
                  <div style={{ borderTop: '1px solid var(--accent-beige-border)', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-coffee)' }}>Contactos Directos</label>
                      <button 
                        type="button" 
                        onClick={() => setFooterContacts([...footerContacts, { label: 'Nuevo Contacto', value: '', type: 'phone' }])}
                        style={{ padding: '2px 8px', fontSize: '0.7rem', backgroundColor: '#EFE3D3', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                      >
                        + Agregar
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {footerContacts.map((c, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <input 
                              type="text" 
                              value={c.label} 
                              onChange={(e) => {
                                const list = [...footerContacts];
                                list[idx].label = e.target.value;
                                setFooterContacts(list);
                              }}
                              placeholder="Etiqueta (ej: WhatsApp)"
                              style={{ flex: 1.2, padding: '4px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #CCC' }}
                            />
                            <select 
                              value={c.type}
                              onChange={(e) => {
                                const list = [...footerContacts];
                                list[idx].type = e.target.value;
                                setFooterContacts(list);
                              }}
                              style={{ flex: 0.8, padding: '4px', fontSize: '0.75rem', border: '1px solid #CCC', borderRadius: '4px' }}
                            >
                              <option value="phone">Teléfono / WP</option>
                              <option value="email">Correo / Web</option>
                            </select>
                            <button 
                              type="button" 
                              onClick={() => setFooterContacts(footerContacts.filter((_, i) => i !== idx))}
                              style={{ padding: '2px 6px', backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                            >
                              ✕
                            </button>
                          </div>
                          <input 
                            type="text" 
                            value={c.value} 
                            onChange={(e) => {
                              const list = [...footerContacts];
                              list[idx].value = e.target.value;
                              setFooterContacts(list);
                            }}
                            placeholder="Valor (ej: +506 ...)"
                            style={{ padding: '4px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #CCC' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Socials Array List */}
                  <div style={{ borderTop: '1px solid var(--accent-beige-border)', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-coffee)' }}>Redes Sociales</label>
                      <button 
                        type="button" 
                        onClick={() => setFooterSocials([...footerSocials, { platform: 'facebook', url: 'https://' }])}
                        style={{ padding: '2px 8px', fontSize: '0.7rem', backgroundColor: '#EFE3D3', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                      >
                        + Agregar
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {footerSocials.map((s, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '4px', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
                          <select 
                            value={s.platform}
                            onChange={(e) => {
                              const list = [...footerSocials];
                              list[idx].platform = e.target.value;
                              setFooterSocials(list);
                            }}
                            style={{ flex: 1, padding: '4px', fontSize: '0.75rem', border: '1px solid #CCC', borderRadius: '4px' }}
                          >
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                            <option value="spotify">Spotify</option>
                            <option value="tiktok">TikTok</option>
                            <option value="twitter">X / Twitter</option>
                            <option value="web">Web Externa</option>
                          </select>
                          <input 
                            type="text" 
                            value={s.url} 
                            onChange={(e) => {
                              const list = [...footerSocials];
                              list[idx].url = e.target.value;
                              setFooterSocials(list);
                            }}
                            placeholder="URL completa..."
                            style={{ flex: 2, padding: '4px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #CCC' }}
                          />
                          <button 
                            type="button" 
                            onClick={() => setFooterSocials(footerSocials.filter((_, i) => i !== idx))}
                            style={{ padding: '2px 6px', backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={handleSaveFooterConfig}
                    className="btn-primary"
                    style={{ marginTop: '10px', width: '100%', padding: '8px', fontSize: '0.8rem', fontWeight: 800, backgroundColor: 'var(--accent-coffee)', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    Guardar Datos del Footer
                  </button>
                </div>
              </div>

            </div>

            {/* COLUMN 3: HUGE LIVE PREVIEW SIMULATOR (WordPress Style) */}
            <div style={{ 
              flex: 1,
              backgroundColor: '#1E1E2E', 
              padding: '24px', 
              borderRadius: '24px', 
              border: '4px solid #313244', 
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)', 
              minHeight: '750px',
              display: 'flex',
              flexDirection: 'column',
              color: '#CDD6F4',
              alignSelf: 'stretch',
              position: 'sticky',
              top: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #313244', paddingBottom: '12px' }}>
                <h4 style={{ margin: 0, color: '#F5C2E7', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem' }}>
                  <Globe size={18} /> Vista Previa en Vivo: <code>{builderPagePath}</code>
                </h4>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#313244', padding: '4px', borderRadius: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setPreviewDeviceMode('desktop')} 
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      borderRadius: '8px', 
                      border: 'none', 
                      cursor: 'pointer',
                      backgroundColor: previewDeviceMode === 'desktop' ? '#11111B' : 'transparent',
                      color: previewDeviceMode === 'desktop' ? '#89B4FA' : '#A6ADC8',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    💻 Escritorio
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPreviewDeviceMode('mobile')} 
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      borderRadius: '8px', 
                      border: 'none', 
                      cursor: 'pointer',
                      backgroundColor: previewDeviceMode === 'mobile' ? '#11111B' : 'transparent',
                      color: previewDeviceMode === 'mobile' ? '#89B4FA' : '#A6ADC8',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    📱 Móvil
                  </button>
                </div>
              </div>

              {/* SIMULATED DEVICE VIEWPORT */}
              <div style={{
                flex: 1,
                backgroundColor: '#030812',
                borderRadius: '16px',
                overflowY: 'auto',
                overflowX: 'hidden',
                maxHeight: '800px',
                border: '1px solid #45475A',
                width: previewDeviceMode === 'mobile' ? '320px' : '100%',
                margin: '0 auto',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                
                {/* Dynamic sections mapped inside preview */}
                {localSections.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#BAC2DE', textAlign: 'center' }}>
                    <p style={{ fontStyle: 'italic', margin: '0 0 10px 0', color: '#6C7086' }}>Esta página está vacía.</p>
                    <span style={{ fontSize: '0.8rem', color: '#A6ADC8' }}>Mostrará el contenido clásico por defecto o la pantalla "En Construcción" en el sitio público hasta que agregues secciones.</span>
                  </div>
                ) : (
                  localSections.map((sec) => {
                    const isSelected = selectedSectionId === sec.id;
                    const bgStyle = {
                      backgroundColor: sec.styles?.backgroundColor || '#030812',
                      color: sec.styles?.textColor || '#EAEDF8',
                      padding: '30px 16px',
                      position: 'relative',
                      outline: isSelected ? '4px solid #0033FF' : 'none',
                      outlineOffset: '-4px',
                      boxShadow: isSelected ? '0 0 25px rgba(0, 51, 255, 0.45)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      zIndex: isSelected ? 10 : 1
                    };
                    const accentColor = sec.styles?.accentColor || '#0033FF';

                    switch (sec.type) {
                      case 'hero': {
                        const bgUrl = sec.content.bgUrl || '';
                        const isVideo = bgUrl && !!bgUrl.match(/\.(mp4|webm|mov|ogg)($|\?)/i);
                        return (
                          <div key={sec.id} onClick={() => setSelectedSectionId(sec.id)} style={{ ...bgStyle, minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', padding: '50px 16px' }}>
                            {bgUrl && (
                              isVideo ? (
                                <video src={bgUrl} muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2, zIndex: 0 }} />
                              ) : (
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${bgUrl.startsWith('http') || bgUrl.startsWith('/') ? (bgUrl.startsWith('/') ? `${API_URL}${bgUrl}` : bgUrl) : `${API_URL}/${bgUrl}`})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25, zIndex: 0 }} />
                              )
                            )}
                            <div style={{ position: 'relative', zIndex: 1 }}>
                              <h1 style={{ fontSize: previewDeviceMode === 'mobile' ? '1.2rem' : '1.8rem', fontWeight: 900, marginBottom: '8px', color: '#FFFFFF' }}>{sec.content.title || 'Nueva Portada'}</h1>
                              <p style={{ fontSize: '0.78rem', color: '#BAC2DE', maxWidth: '350px', margin: '0 auto 16px auto' }}>{sec.content.subtitle || ''}</p>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {(sec.content.buttons || []).map((btn) => (
                                  <button key={btn.id} type="button" style={{
                                    padding: '6px 12px',
                                    borderRadius: '50px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    border: 'none',
                                    cursor: 'pointer',
                                    background: btn.style === 'primary' ? 'linear-gradient(135deg, #0033FF 0%, #977DFF 100%)' : '#1e1e2e',
                                    color: '#FFFFFF'
                                  }}>{btn.label}</button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      case 'news': {
                        return (
                          <div key={sec.id} onClick={() => setSelectedSectionId(sec.id)} style={{ ...bgStyle, textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', color: '#FFFFFF' }}>{sec.content.title || 'Noticias y Eventos'}</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: previewDeviceMode === 'mobile' ? '1fr' : 'repeat(2, 1fr)', gap: '10px' }}>
                              <div style={{ backgroundColor: '#11111B', padding: '10px', borderRadius: '10px', border: '1px solid #313244', textAlign: 'left' }}>
                                <div style={{ height: '70px', backgroundColor: '#313244', borderRadius: '6px', marginBottom: '6px' }} />
                                <span style={{ fontSize: '0.6rem', backgroundColor: accentColor, color: '#FFF', padding: '1px 5px', borderRadius: '50px', fontWeight: 800 }}>EJEMPLO</span>
                                <h4 style={{ fontSize: '0.8rem', margin: '4px 0 2px 0', color: '#FFF' }}>Actividad Especial</h4>
                                <p style={{ fontSize: '0.7rem', color: '#A6ADC8', margin: 0 }}>Texto de muestra...</p>
                              </div>
                              <div style={{ backgroundColor: '#11111B', padding: '10px', borderRadius: '10px', border: '1px solid #313244', textAlign: 'left' }}>
                                <div style={{ height: '70px', backgroundColor: '#313244', borderRadius: '6px', marginBottom: '6px' }} />
                                <span style={{ fontSize: '0.6rem', backgroundColor: accentColor, color: '#FFF', padding: '1px 5px', borderRadius: '50px', fontWeight: 800 }}>EJEMPLO</span>
                                <h4 style={{ fontSize: '0.8rem', margin: '4px 0 2px 0', color: '#FFF' }}>Novedad Semanal</h4>
                                <p style={{ fontSize: '0.7rem', color: '#A6ADC8', margin: 0 }}>Texto de muestra...</p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      case 'pillars': {
                        return (
                          <div key={sec.id} onClick={() => setSelectedSectionId(sec.id)} style={{ ...bgStyle, textAlign: 'center' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '2px' }}>{sec.content.title || 'Pilares'}</h2>
                            <p style={{ fontSize: '0.75rem', color: '#BAC2DE', marginBottom: '14px' }}>{sec.content.subtitle || ''}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {(sec.content.pillars || []).map((p, idx) => (
                                <div key={p.id || idx} style={{ backgroundColor: '#11111B', padding: '10px', borderRadius: '10px', borderLeft: `4px solid ${accentColor}`, textAlign: 'left' }}>
                                  <h4 style={{ fontSize: '0.8rem', margin: '0 0 2px 0', color: '#FFFFFF', fontWeight: 800 }}>{p.title}</h4>
                                  <p style={{ fontSize: '0.7rem', color: '#A6ADC8', margin: 0 }}>{p.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      case 'schedules': {
                        const bgUrl = sec.content.bgUrl || '';
                        return (
                          <div key={sec.id} onClick={() => setSelectedSectionId(sec.id)} style={{ ...bgStyle, position: 'relative', overflow: 'hidden', padding: '35px 16px', textAlign: 'center' }}>
                            {bgUrl && (
                              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${bgUrl.startsWith('http') || bgUrl.startsWith('/') ? (bgUrl.startsWith('/') ? `${API_URL}${bgUrl}` : bgUrl) : `${API_URL}/${bgUrl}`})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, zIndex: 0 }} />
                            )}
                            <div style={{ position: 'relative', zIndex: 1 }}>
                              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>{sec.content.title || 'Horarios'}</h2>
                              <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', width: '100%', maxWidth: '260px' }}>
                                {(sec.content.schedules || []).map((s, idx) => (
                                  <div key={s.id || idx} style={{ backgroundColor: 'rgba(17,17,27,0.8)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.05)', color: '#FFFFFF' }}>
                                    {s.text} {s.isVirtual && <span style={{ color: '#A6E3A1', fontSize: '0.65rem', marginLeft: '4px' }}>(Virtual)</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      case 'custom_text': {
                        return (
                          <div key={sec.id} onClick={() => setSelectedSectionId(sec.id)} style={{ ...bgStyle }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>{sec.content.title}</h3>
                            <p style={{ fontSize: '0.75rem', lineHeight: '1.4', color: '#BAC2DE', whiteSpace: 'pre-wrap', margin: 0 }}>{sec.content.text}</p>
                          </div>
                        );
                      }
                      case 'cta': {
                        const bgUrl = sec.content.bgUrl || '';
                        return (
                          <div key={sec.id} onClick={() => setSelectedSectionId(sec.id)} style={{ ...bgStyle, position: 'relative', overflow: 'hidden', padding: '30px 16px', textAlign: 'center' }}>
                            {bgUrl && (
                              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${bgUrl.startsWith('http') || bgUrl.startsWith('/') ? (bgUrl.startsWith('/') ? `${API_URL}${bgUrl}` : bgUrl) : `${API_URL}/${bgUrl}`})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, zIndex: 0 }} />
                            )}
                            <div style={{ position: 'relative', zIndex: 1 }}>
                              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>{sec.content.title}</h3>
                              {sec.content.buttonText && (
                                <button type="button" style={{
                                  padding: '6px 14px',
                                  borderRadius: '50px',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  border: 'none',
                                  backgroundColor: accentColor,
                                  color: '#FFFFFF',
                                  cursor: 'pointer'
                                }}>{sec.content.buttonText}</button>
                              )}
                            </div>
                          </div>
                        );
                      }
                      case 'image_text': {
                        const bgUrl = sec.content.bgUrl || '';
                        const pos = sec.content.imagePosition || 'left';
                        const imageEl = (
                          <div style={{ flex: 1, minWidth: '100px', width: '100%' }}>
                            {bgUrl ? (
                              <img src={bgUrl.startsWith('http') || bgUrl.startsWith('/') ? (bgUrl.startsWith('/') ? `${API_URL}${bgUrl}` : bgUrl) : `${API_URL}/${bgUrl}`} alt="Visual" style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100px', backgroundColor: '#313244', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#A6ADC8' }}>Sin imagen</div>
                            )}
                          </div>
                        );
                        const textEl = (
                          <div style={{ flex: 1.5, minWidth: '140px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>{sec.content.title}</h3>
                            <p style={{ fontSize: '0.72rem', lineHeight: '1.3', color: '#BAC2DE', margin: 0 }}>{sec.content.text}</p>
                          </div>
                        );

                        return (
                          <div key={sec.id} onClick={() => setSelectedSectionId(sec.id)} style={{ ...bgStyle }}>
                            <div style={{ display: 'flex', gap: '12px', flexDirection: previewDeviceMode === 'mobile' ? 'column' : 'row', alignItems: 'center' }}>
                              {pos === 'left' ? <>{imageEl}{textEl}</> : <>{textEl}{imageEl}</>}
                            </div>
                          </div>
                        );
                      }
                      case 'grid': {
                        const cols = sec.content.columns || 2;
                        const cells = sec.content.cells || [];
                        return (
                          <div key={sec.id} onClick={() => setSelectedSectionId(sec.id)} style={{ ...bgStyle }}>
                            {sec.content.title && <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', textAlign: 'center' }}>{sec.content.title}</h2>}
                            <div style={{ display: 'grid', gridTemplateColumns: previewDeviceMode === 'mobile' ? '1fr' : `repeat(${cols}, 1fr)`, gridAutoRows: previewDeviceMode === 'mobile' ? 'auto' : 'minmax(120px, auto)', gap: '16px' }}>
                              {cells.map((cell, idx) => (
                                <div key={idx} style={{ 
                                  backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                                  gridColumn: previewDeviceMode === 'mobile' ? 'span 1' : `span ${cell.colSpan || 1}`,
                                  gridRow: previewDeviceMode === 'mobile' ? 'span 1' : `span ${cell.rowSpan || 1}`,
                                  display: 'flex', flexDirection: 'column'
                                }}>
                                  {cell.imageUrl && (
                                    <img src={cell.imageUrl.startsWith('http') || cell.imageUrl.startsWith('/') ? (cell.imageUrl.startsWith('/') ? `${API_URL}${cell.imageUrl}` : cell.imageUrl) : `${API_URL}/${cell.imageUrl}`} alt={cell.title || 'Cell image'} style={{ width: '100%', height: cell.title || cell.text ? '100px' : '100%', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px', flex: (cell.title || cell.text) ? 'none' : 1 }} />
                                  )}
                                  {cell.title && <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px 0' }}>{cell.title}</h3>}
                                  {cell.text && <p style={{ fontSize: '0.8rem', color: '#BAC2DE', lineHeight: 1.4, margin: '0 0 12px 0', flex: 1 }}>{cell.text}</p>}
                                  {cell.buttonText && (
                                    <div style={{ marginTop: 'auto' }}>
                                      <button type="button" style={{
                                        padding: '6px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, border: 'none',
                                        backgroundColor: accentColor, color: '#FFFFFF', cursor: 'pointer', display: 'inline-block'
                                      }}>{cell.buttonText}</button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      default:
                        return null;
                    }
                  })
                )}

              </div>
            </div>

            </div>
          )}
        </div>
      )}

      {/* TAB: AUTÉNTICAS CONGRESO CONFIGURATION */}
      {(activeTab === 'autenticas' || (activeTab === 'church_web' && builderPagePath === '/autenticas')) && (adminUser.role === 'admin' || adminUser.role === 'editor_autenticas') && (
        <div className="card-glass" style={{ borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--accent-coffee)', marginBottom: '10px' }}>
            Configuración de la Sección Auténticas
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
            Personaliza el banner de cabecera, la descripción promocional, la tarjeta de información y la galería de fotos (carrusel) del Congreso Auténticas.
          </p>

          {autenticasSuccessMsg && (
            <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', padding: '14px', borderRadius: '10px', marginBottom: '20px', fontWeight: 700 }}>
              {autenticasSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSaveAutenticasSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* TITLE */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Título del Banner (Ej: AUTÉNTICAS)</label>
                <input 
                  type="text" 
                  name="autenticas_title" 
                  value={configFields.autenticas_title} 
                  onChange={handleConfigChange} 
                  placeholder="Ej: AUTÉNTICAS"
                />
              </div>

              {/* SUBTITLE */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Subtítulo del Banner (Ej: CONGRESO DE MUJERES)</label>
                <input 
                  type="text" 
                  name="autenticas_subtitle" 
                  value={configFields.autenticas_subtitle} 
                  onChange={handleConfigChange} 
                  placeholder="Ej: CONGRESO DE MUJERES"
                />
              </div>

              {/* DESCRIPTION */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Descripción del Congreso</label>
                <textarea 
                  name="autenticas_description" 
                  rows="3" 
                  value={configFields.autenticas_description} 
                  onChange={handleConfigChange} 
                  style={{ width: '100%', borderRadius: '10px', border: '1px solid #CCC', padding: '10px' }}
                />
              </div>

              {/* HERO BACKGROUND IMAGE */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Imagen de Fondo (Cabecera Auténticas)</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    name="autenticas_hero_bg" 
                    value={configFields.autenticas_hero_bg} 
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
                      onChange={handleAutenticasHeroUpload} 
                      style={{ display: 'none' }} 
                      disabled={uploadingAutenticasHero}
                    />
                  </label>
                </div>
              </div>

              {/* DATE INFO */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Fecha del Evento (Texto libre)</label>
                <input 
                  type="text" 
                  name="autenticas_date_info" 
                  value={configFields.autenticas_date_info} 
                  onChange={handleConfigChange} 
                  placeholder="Ej: Sábado 15 de Noviembre - 5:00 PM"
                />
              </div>

              {/* PLACE INFO */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Lugar del Evento (Texto libre)</label>
                <input 
                  type="text" 
                  name="autenticas_place_info" 
                  value={configFields.autenticas_place_info} 
                  onChange={handleConfigChange} 
                  placeholder="Ej: Auditorio Principal - Desamparados"
                />
              </div>

              {/* MAPS URLs */}
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Enlace de Waze (Cómo Llegar)</label>
                  <input 
                    type="text" 
                    name="autenticas_waze_url" 
                    value={configFields.autenticas_waze_url} 
                    onChange={handleConfigChange} 
                    placeholder="Ej: https://waze.com/ul?ll=..."
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Enlace de Google Maps (Cómo Llegar)</label>
                  <input 
                    type="text" 
                    name="autenticas_maps_url" 
                    value={configFields.autenticas_maps_url} 
                    onChange={handleConfigChange} 
                    placeholder="Ej: https://goo.gl/maps/..."
                  />
                </div>
              </div>

              {/* PRICE INFO */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Inversión / Precios (Texto libre)</label>
                <input 
                  type="text" 
                  name="autenticas_price_info" 
                  value={configFields.autenticas_price_info} 
                  onChange={handleConfigChange} 
                  placeholder="Ej: General ₡7.500 / Gold ₡12.000"
                />
              </div>

              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #EEE', paddingTop: '20px', marginTop: '10px' }}>
                <h4 style={{ color: 'var(--accent-gold)', margin: '0 0 14px 0' }}>Fechas y Precios Avanzados</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Fecha Objetivo del Reloj</label>
                    <input type="datetime-local" name="autenticas_date_countdown" value={configFields.autenticas_date_countdown} onChange={handleConfigChange} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Fecha de Cierre de Preventa</label>
                    <input type="datetime-local" name="autenticas_presale_end" value={configFields.autenticas_presale_end} onChange={handleConfigChange} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>General: Precio Preventa</label>
                    <input type="text" name="autenticas_price_general_presale" value={configFields.autenticas_price_general_presale} onChange={handleConfigChange} placeholder="Ej: ₡7.500" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>General: Precio Oficial</label>
                    <input type="text" name="autenticas_price_general_regular" value={configFields.autenticas_price_general_regular} onChange={handleConfigChange} placeholder="Ej: ₡10.000" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Gold: Precio Preventa</label>
                    <input type="text" name="autenticas_price_gold_presale" value={configFields.autenticas_price_gold_presale} onChange={handleConfigChange} placeholder="Ej: ₡12.000" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Gold: Precio Oficial</label>
                    <input type="text" name="autenticas_price_gold_regular" value={configFields.autenticas_price_gold_regular} onChange={handleConfigChange} placeholder="Ej: ₡15.000" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Características: Acceso General (Una por línea)</label>
                    <textarea name="autenticas_features_general" value={configFields.autenticas_features_general} onChange={handleConfigChange} rows="3" placeholder="Ej:&#10;Viernes 18: Ingreso a las 7:00pm&#10;Sábado 19: Ingreso a las 5:00pm" />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Características: Acceso Gold (Una por línea)</label>
                    <textarea name="autenticas_features_gold" value={configFields.autenticas_features_gold} onChange={handleConfigChange} rows="4" placeholder="Ej:&#10;Viernes 18: Ingreso a las 7:00pm&#10;Sábado 19: Mañana de sanidad a las 9:00am&#10;Taller Entre nosotras" />
                  </div>
                </div>
              </div>

              {/* SPEAKERS MANAGEMENT */}
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #EEE', paddingTop: '20px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ color: 'var(--accent-gold)', margin: 0 }}>Invitadas Especiales</h4>
                  <button 
                    type="button" 
                    onClick={() => setLocalAutenticasSpeakers([...localAutenticasSpeakers, { name: '', title: '', img: '' }])}
                    className="btn-secondary"
                  >
                    + Agregar Invitada
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {localAutenticasSpeakers.map((speaker, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', background: '#F9F9F9', padding: '16px', borderRadius: '12px', alignItems: 'flex-start', border: '1px solid #EEE' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E0E0E0', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                        {speaker.img ? (
                          <img src={speaker.img.startsWith('http') ? speaker.img : `${API_URL}${speaker.img}`} alt="speaker" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.7rem' }}>Sin Foto</div>
                        )}
                        <label style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#FFF', fontSize: '0.6rem', textAlign: 'center', cursor: 'pointer', padding: '2px 0' }}>
                          {uploadingSpeakerImage === idx ? '...' : 'Subir'}
                          <input type="file" accept="image/*" onChange={(e) => handleSpeakerImageUpload(e, idx)} style={{ display: 'none' }} disabled={uploadingSpeakerImage === idx} />
                        </label>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="Nombre (Ej: Pr. Rebeca López)" 
                          value={speaker.name} 
                          onChange={(e) => {
                            const arr = [...localAutenticasSpeakers];
                            arr[idx].name = e.target.value;
                            setLocalAutenticasSpeakers(arr);
                          }}
                          style={{ width: '100%' }}
                        />
                        <input 
                          type="text" 
                          placeholder="Cargo/Título (Ej: Pastora Principal)" 
                          value={speaker.title} 
                          onChange={(e) => {
                            const arr = [...localAutenticasSpeakers];
                            arr[idx].title = e.target.value;
                            setLocalAutenticasSpeakers(arr);
                          }}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setLocalAutenticasSpeakers(localAutenticasSpeakers.filter((_, i) => i !== idx))}
                        style={{ background: 'transparent', color: 'var(--color-red)', border: 'none', cursor: 'pointer', fontWeight: 800, padding: '8px' }}
                      >
                        X
                      </button>
                    </div>
                  ))}
                  {localAutenticasSpeakers.length === 0 && <p style={{ color: '#999', fontSize: '0.9rem' }}>No hay invitadas configuradas. Haz clic en "Agregar Invitada".</p>}
                </div>
              </div>

              {/* GALLERY MANAGEMENT */}
              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #EEE', paddingTop: '20px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ color: 'var(--accent-gold)', margin: 0 }}>Galería de Fotos (Carrusel / Carrete)</h4>
                  <label style={{
                    backgroundColor: 'var(--accent-coffee)',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: '0.82rem'
                  }}>
                    {uploadingGalleryImage ? 'Agregando...' : 'Agregar Foto'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAutenticasGalleryUpload} 
                      style={{ display: 'none' }} 
                      disabled={uploadingGalleryImage}
                    />
                  </label>
                </div>

                {localAutenticasGallery.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed #CCC', borderRadius: '12px' }}>
                    No hay imágenes en la galería de Auténticas. Agrega fotos para activar el carrusel.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '14px' }}>
                    {localAutenticasGallery.map((imgUrl, idx) => (
                      <div key={idx} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #DDD', height: '100px' }}>
                        <img 
                          src={imgUrl.startsWith('http') ? imgUrl : `${API_URL}${imgUrl}`} 
                          alt={`Foto galeria ${idx}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(imgUrl)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: 'rgba(220, 38, 38, 0.9)',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800
                          }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <button type="submit" disabled={saveLoading} className="btn-primary" style={{ marginTop: '30px', width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800 }}>
              {saveLoading ? 'Guardando...' : 'Guardar Configuración Congreso Auténticas'}
            </button>
          </form>

          <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '2px dashed #E0E0E0' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-coffee)', marginBottom: '16px' }}>Vista Previa en Vivo</h3>
            <div style={{ borderRadius: '24px', overflow: 'hidden', border: '4px solid #333', maxHeight: '800px', overflowY: 'auto', backgroundColor: '#FFF' }}>
              <AutenticasPromo 
                config={{ 
                  ...configFields, 
                  autenticas_speakers: JSON.stringify(localAutenticasSpeakers),
                  autenticas_gallery: JSON.stringify(localAutenticasGallery)
                }} 
                onScrollToMap={() => alert('Esto desplazará hacia el mapa de entradas.')} 
              />
            </div>
          </div>
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
            <button type="submit" disabled={saveLoading} className="btn-primary" style={{ marginTop: '30px', width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 800 }}>
              {saveLoading ? 'Guardando...' : 'Guardar Configuración Modelo'}
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
                  Configuración y Remapeo de Zonas y Asientos
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0, maxWidth: '750px' }}>
                  Ajusta la cantidad de filas y asientos por fila para cada sector del auditorio. El sistema calculará en tiempo real los espacios ocupados y libres, sincronizando automáticamente el mapa interactivo.
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
            {zoneAnalytics && zoneAnalytics.global && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
                <div style={{ backgroundColor: '#FAF8F5', padding: '20px', borderRadius: '16px', border: '1px solid var(--accent-beige-border)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Capacidad Total Auditorio</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-coffee)' }}>{zoneAnalytics.global.total_capacity}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Asientos totales configurados</div>
                </div>

                <div style={{ backgroundColor: '#FEF2F2', padding: '20px', borderRadius: '16px', border: '1px solid #FECACA' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', marginBottom: '6px' }}>🔴 Asientos Ocupados</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#DC2626' }}>{zoneAnalytics.global.occupied_count}</div>
                  <div style={{ fontSize: '0.78rem', color: '#991B1B' }}>Reservas y asignaciones activas</div>
                </div>

                <div style={{ backgroundColor: '#F0FDF4', padding: '20px', borderRadius: '16px', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '6px' }}>🟢 Asientos Disponibles</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16A34A' }}>{zoneAnalytics.global.available_capacity}</div>
                  <div style={{ fontSize: '0.78rem', color: '#166534' }}>Libres para reservar</div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>📊 Ocupación General</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A' }}>{zoneAnalytics.global.occupancy_pct}%</div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '6px', marginTop: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${zoneAnalytics.global.occupancy_pct}%`, height: '100%', backgroundColor: 'var(--accent-coffee)' }} />
                  </div>
                </div>
              </div>
            )}
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
