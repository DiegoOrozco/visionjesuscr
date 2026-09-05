const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const uploadsDir = path.join(dbDir, 'uploads', 'comprobantes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const isTest = process.env.NODE_ENV === 'test';
const dbPath = path.join(dbDir, isTest ? 'test_ticketing.db' : 'event_ticketing.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS zones (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      regular_price REAL NOT NULL,
      total_capacity INTEGER NOT NULL,
      available_capacity INTEGER NOT NULL,
      description TEXT,
      color_code TEXT
    );

    CREATE TABLE IF NOT EXISTS seat_queues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zone_id TEXT NOT NULL,
      ticket_number INTEGER NOT NULL,
      ticket_code TEXT NOT NULL,
      is_assigned INTEGER DEFAULT 0,
      reservation_id TEXT,
      FOREIGN KEY (zone_id) REFERENCES zones (id)
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      zone_id TEXT NOT NULL,
      purchaser_name TEXT NOT NULL,
      purchaser_email TEXT NOT NULL,
      purchaser_phone TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      comprobante_url TEXT,
      status TEXT DEFAULT 'pendiente',
      qr_code_hash TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved_at DATETIME,
      scanned_at DATETIME,
      scanned_by TEXT,
      notes TEXT,
      FOREIGN KEY (zone_id) REFERENCES zones (id)
    );

    CREATE TABLE IF NOT EXISTS attendees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      age INTEGER,
      phone TEXT NOT NULL,
      residence TEXT,
      civil_status TEXT,
      is_vision_jesus TEXT,
      church_network TEXT,
      invited_by TEXT,
      attended_encounter TEXT,
      assigned_ticket_code TEXT,
      FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'staff',
      full_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS homepage_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS seat_holds (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      seat_code TEXT NOT NULL,
      zone_id TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      username TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT
    );

    CREATE TABLE IF NOT EXISTS page_sections (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      sequence_order INTEGER NOT NULL,
      content TEXT NOT NULL,
      styles TEXT NOT NULL,
      page_path TEXT DEFAULT '/'
    );

    CREATE INDEX IF NOT EXISTS idx_seat_holds_expires ON seat_holds (expires_at);
    CREATE INDEX IF NOT EXISTS idx_seat_holds_seat_code ON seat_holds (seat_code);
    CREATE INDEX IF NOT EXISTS idx_seat_holds_session ON seat_holds (session_id);
  `);

  // Migrations for columns
  try { db.exec(`ALTER TABLE page_sections ADD COLUMN page_path TEXT DEFAULT '/'`); } catch (e) {}
  try { db.exec(`ALTER TABLE zones ADD COLUMN regular_price REAL`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN age INTEGER`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN residence TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN civil_status TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN is_vision_jesus TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN church_network TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN invited_by TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN attended_encounter TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE reservations ADD COLUMN payment_method TEXT DEFAULT 'sinpe'`); } catch (e) {}
  try { db.exec(`ALTER TABLE reservations ADD COLUMN paypal_order_id TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE reservations ADD COLUMN paypal_capture_id TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE reservations ADD COLUMN amount_usd REAL`); } catch (e) {}

  // Determine pricing tier (Preventa: VIP=12000, Gen=7500 | Regular: VIP=15000, Gen=10000)
  let isPresale = true;
  let vipPrice = 12000.00;
  let generalPrice = 7500.00;

  try {
    const configRows = db.prepare('SELECT key, value FROM homepage_config').all();
    const config = {};
    configRows.forEach(r => config[r.key] = r.value);
    
    const cutoffDateStr = config.presale_cutoff_date || '2026-08-15';
    const cutoffDate = new Date(`${cutoffDateStr}T23:59:59`);
    const now = new Date();
    isPresale = now <= cutoffDate;

    const vipPresale = parseFloat(config.vip_presale_price || '12000');
    const vipRegular = parseFloat(config.vip_regular_price || '15000');
    const genPresale = parseFloat(config.general_presale_price || '7500');
    const genRegular = parseFloat(config.general_regular_price || '10000');

    vipPrice = isPresale ? vipPresale : vipRegular;
    generalPrice = isPresale ? genPresale : genRegular;
  } catch (e) {
    isPresale = new Date() <= new Date('2026-08-15T23:59:59');
    vipPrice = isPresale ? 12000.00 : 15000.00;
    generalPrice = isPresale ? 7500.00 : 10000.00;
  }

  // New Capacities: VIP = 250 Total, General = 350 Total.
  // VIP Central: 90 seats, VIP Izquierda: 80 seats, VIP Derecha: 80 seats. (Sum = 250)
  // General Central: 150 seats, General Izquierda: 100 seats, General Derecha: 100 seats. (Sum = 350)
  const zoneList = [
    { id: 'vip_central', name: 'Gold Central', price: vipPrice, regular_price: 15000.00, capacity: 90, prefix: 'GLD-CTR', color: '#DB2777', desc: 'Ubicación preferencial en el centro del altar (90 asientos).' },
    { id: 'vip_izquierda', name: 'Gold Izquierda', price: vipPrice, regular_price: 15000.00, capacity: 80, prefix: 'GLD-IZQ', color: '#9333EA', desc: 'Sector Gold lateral izquierdo (80 asientos).' },
    { id: 'vip_derecha', name: 'Gold Derecha', price: vipPrice, regular_price: 15000.00, capacity: 80, prefix: 'GLD-DER', color: '#9333EA', desc: 'Sector Gold lateral derecho (80 asientos).' },
    { id: 'central_atras', name: 'General Central', price: generalPrice, regular_price: 10000.00, capacity: 150, prefix: 'GEN-CTR', color: '#10B981', desc: 'Área general central (150 asientos).' },
    { id: 'lateral_izquierda', name: 'General Izquierda', price: generalPrice, regular_price: 10000.00, capacity: 100, prefix: 'GEN-IZQ', color: '#F59E0B', desc: 'Área general lateral izquierda (100 asientos).' },
    { id: 'lateral_derecha', name: 'General Derecha', price: generalPrice, regular_price: 10000.00, capacity: 100, prefix: 'GEN-DER', color: '#F59E0B', desc: 'Área general lateral derecha (100 asientos).' }
  ];

  const insertZoneStmt = db.prepare(`
    INSERT OR REPLACE INTO zones (id, name, price, regular_price, total_capacity, available_capacity, description, color_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertQueueStmt = db.prepare(`
    INSERT OR IGNORE INTO seat_queues (zone_id, ticket_number, ticket_code) VALUES (?, ?, ?)
  `);

  db.transaction(() => {
    for (const z of zoneList) {
      // Calculate active available_capacity based on existing assigned seats
      const occupiedCount = db.prepare('SELECT COUNT(*) as c FROM seat_queues WHERE zone_id = ? AND is_assigned = 1').get(z.id).c;
      const newAvailable = Math.max(0, z.capacity - occupiedCount);
      
      insertZoneStmt.run(z.id, z.name, z.price, z.regular_price, z.capacity, newAvailable, z.desc, z.color);
      
      const count = db.prepare('SELECT COUNT(*) as c FROM seat_queues WHERE zone_id = ?').get(z.id).c;
      if (count < z.capacity) {
        for (let i = count + 1; i <= z.capacity; i++) {
          const code = `${z.prefix}-${String(i).padStart(3, '0')}`;
          insertQueueStmt.run(z.id, i, code);
        }
      }
    }
  })();

  // Seed default admin and editor users using bcrypt
  const hashPass = (p) => bcrypt.hashSync(p, 10);
  const insertUser = db.prepare('INSERT OR IGNORE INTO admin_users (username, password_hash, role, full_name) VALUES (?, ?, ?, ?)');
  insertUser.run('admin', hashPass('admin123'), 'admin', 'Administrador Principal');
  insertUser.run('scanner', hashPass('puerta123'), 'scanner', 'Personal de Puerta / Escáner');
  insertUser.run('editor_move', hashPass('move123'), 'editor_move', 'Editor de Move');
  insertUser.run('editor_sanados', hashPass('sanados123'), 'editor_sanados', 'Editor de Sanados');
  insertUser.run('editor_modelo', hashPass('modelo123'), 'editor_modelo', 'Editor de Modelo');
  insertUser.run('editor_tienda', hashPass('tienda123'), 'editor_tienda', 'Editor de Tienda');
  insertUser.run('editor_autenticas', hashPass('autenticas123'), 'editor_autenticas', 'Editor de Auténticas');
  insertUser.run('Evelyn_reservas', hashPass('Ev8mR9t4'), 'tickets_readonly', 'Evelyn Reservas (Lectura)');
  insertUser.run('Dayanna_reservas', hashPass('Dy6qA3w1'), 'tickets', 'Dayanna Reservas');
  insertUser.run('Stephanie_scanner', hashPass('Sp7nS2x8'), 'scanner', 'Stephanie Scanner');
  insertUser.run('Evelyn_scanner', hashPass('Ev2kS5z9'), 'scanner', 'Evelyn Scanner');
  insertUser.run('Andrea_scanner', hashPass('An4pS7w2'), 'scanner', 'Andrea Scanner');

  // Automatic migration for any pre-existing plain text passwords in admin_users
  try {
    const existingUsers = db.prepare('SELECT id, password_hash FROM admin_users').all();
    for (const u of existingUsers) {
      if (u.password_hash && !u.password_hash.startsWith('$2a$') && !u.password_hash.startsWith('$2b$')) {
        const hashed = bcrypt.hashSync(u.password_hash, 10);
        db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(hashed, u.id);
      }
    }
  } catch (e) {
    console.error('Error auto-migrating passwords to bcrypt:', e);
  }

  // Seed default homepage config values
  const configCount = db.prepare('SELECT COUNT(*) as count FROM homepage_config').get();
  if (configCount.count === 0) {
    const defaultConfig = {
      hero_bg: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600',
      hero_title: 'Bienvenido a TU CASA',
      hero_subtitle: 'Iglesia Visión Jesús — Un lugar de fe, amor y restauración',
      about_text: 'Somos una comunidad apasionada por compartir el mensaje de esperanza, amor y gracia de Jesucristo en Costa Rica y el mundo entero. ¡Nuestras puertas están abiertas para ti!',
      social_fb: 'https://facebook.com/visionjesus',
      social_ig: 'https://instagram.com/visionjesus',
      social_yt: 'https://youtube.com/visionjesus',
      social_spotify: 'https://spotify.com/visionjesus',
      schedule_thursday: 'Jueves 7:30 PM',
      schedule_saturday: 'Sábado 5:30 PM',
      schedule_sunday_1: 'Domingo 9:00 AM',
      schedule_sunday_2: 'Domingo 11:00 AM',
      schedule_sunday_virtual: 'Domingo (Virtual) 5:30 PM',
      contact_address: '50 norte y 50 oeste de la Cruz Roja de Desamparados. Auditorio Principal.',
      contact_email: 'info@somosimpact.com',
      contact_phone_1: '+506 4115 1212',
      contact_phone_2: '+506 6453 1212'
    };

    const insertConfig = db.prepare('INSERT OR IGNORE INTO homepage_config (key, value) VALUES (?, ?)');
    db.transaction(() => {
      for (const [key, val] of Object.entries(defaultConfig)) {
        insertConfig.run(key, val);
      }
    })();
  }

  // Ensure presale and pricing keys exist in homepage_config
  const insertConfig = db.prepare('INSERT OR IGNORE INTO homepage_config (key, value) VALUES (?, ?)');
  insertConfig.run('presale_cutoff_date', '2026-08-15');
  insertConfig.run('vip_presale_price', '12000');
  insertConfig.run('vip_regular_price', '15000');
  insertConfig.run('general_presale_price', '7500');
  insertConfig.run('general_regular_price', '10000');

  // Ensure default Vision, Misión, Valores exist
  insertConfig.run('vision_title', 'NUESTRA VISIÓN');
  insertConfig.run('vision_text', 'Ser una iglesia viva que inspira a miles de personas a experimentar una relación personal con Dios, transformando vidas y formando discípulos apasionados por la verdad.');
  insertConfig.run('mision_title', 'NUESTRA MISIÓN');
  insertConfig.run('mision_text', 'Evangelizar, consolidar, edificar y enviar a cada creyente a vivir su propósito divino, restaurando familias y equipando líderes para impactar nuestra sociedad.');
  insertConfig.run('valores_title', 'NUESTROS VALORES');
  insertConfig.run('valores_text', 'Amor incondicional, adoración genuina, excelencia en el servicio, integridad moral, restauración familiar y fe firme en las promesas de Dios.');

  // Ensure default Sanados, Modelo, Move, and Tienda exist
  insertConfig.run('sanados_hero_bg', 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1600');
  insertConfig.run('sanados_title', 'SANADOS PARA SANAR');
  insertConfig.run('sanados_subtitle', 'Un espacio de restauración, sanidad interior y libertad en Cristo.');

  insertConfig.run('modelo_hero_bg', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600');
  insertConfig.run('modelo_title', 'MODELO DE JESÚS');
  insertConfig.run('modelo_subtitle', 'Capacitación, discipulado y formación de líderes comprometidos.');

  insertConfig.run('move_hero_bg', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600');
  insertConfig.run('move_title', 'MOVE');
  insertConfig.run('move_subtitle', 'El movimiento de jóvenes de Iglesia Visión Jesús. Pasión, adoración y propósito.');

  insertConfig.run('tienda_hero_bg', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1600');
  insertConfig.run('tienda_title', 'TIENDA VISIÓN');
  insertConfig.run('tienda_subtitle', 'Ropa oficial, bebidas, literatura y recursos variados de la iglesia.');

  // Ensure default Autenticas config values exist
  insertConfig.run('autenticas_hero_bg', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600');
  insertConfig.run('autenticas_title', 'AUTÉNTICAS');
  insertConfig.run('autenticas_subtitle', 'CONGRESO DE MUJERES');
  insertConfig.run('autenticas_description', 'El congreso anual para mujeres que deciden sanar sus heridas, abrazar su historia y descubrir la belleza que Dios ha trazado en cada una de sus cicatrices. Un encuentro para ser transformadas por el amor y la presencia de Dios.');
  insertConfig.run('autenticas_date_info', 'Sábado 15 de Noviembre - 5:00 PM');
  insertConfig.run('autenticas_place_info', 'Auditorio Principal - Desamparados');
  insertConfig.run('autenticas_price_info', 'General ₡7.500 / Gold ₡12.000');
  insertConfig.run('autenticas_gallery', JSON.stringify([
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000',
    'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1000',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1000'
  ]));

  // Ensure schedules key exists
  db.prepare(`
    INSERT OR IGNORE INTO homepage_config (key, value)
    VALUES ('schedules', ?)
  `).run(JSON.stringify([
    { id: '1', text: 'JUEVES 7:30PM', isVirtual: false },
    { id: '2', text: 'SÁBADOS 5:30PM', isVirtual: false },
    { id: '3', text: 'DOMINGOS 9:00AM', isVirtual: false },
    { id: '4', text: 'DOMINGOS 11:00AM', isVirtual: false },
    { id: '5', text: 'DOMINGOS (VIRTUAL) 5:30PM', isVirtual: true }
  ]));

  // Ensure hero_buttons key exists (dynamic buttons on landing hero)
  db.prepare(`
    INSERT OR IGNORE INTO homepage_config (key, value)
    VALUES ('hero_buttons', ?)
  `).run(JSON.stringify([
    { id: '1', label: 'Congreso de Mujeres', emoji: '', url: '/autenticas', style: 'primary' }
  ]));

  // Ensure news_items key exists (gallery/carousel on landing)
  db.prepare(`
    INSERT OR IGNORE INTO homepage_config (key, value)
    VALUES ('news_items', ?)
  `).run(JSON.stringify([]));

  // Ensure schedule_bg key exists (background image for schedules section)
  db.prepare(`
    INSERT OR IGNORE INTO homepage_config (key, value)
    VALUES ('schedule_bg', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600')
  `).run();

  // Ensure default zone_layouts_config exists
  const defaultZoneLayouts = {
    vip_central: {
      zoneId: 'vip_central',
      name: 'Gold Central',
      color: '#DB2777',
      prefix: 'VIP-CTR',
      rows: [
        { rowLabel: 'Fila 1', seatsCount: 9, isReserved: true },
        { rowLabel: 'Fila 2', seatsCount: 9, isReserved: true },
        { rowLabel: 'Fila 3', seatsCount: 9, isReserved: false },
        { rowLabel: 'Fila 4', seatsCount: 9, isReserved: false },
        { rowLabel: 'Fila 5', seatsCount: 9, isReserved: false },
        { rowLabel: 'Fila 6', seatsCount: 9, isReserved: false },
        { rowLabel: 'Fila 7', seatsCount: 9, isReserved: false },
        { rowLabel: 'Fila 8', seatsCount: 9, isReserved: false },
        { rowLabel: 'Fila 9', seatsCount: 9, isReserved: false },
        { rowLabel: 'Fila 10', seatsCount: 9, isReserved: false }
      ]
    },
    vip_izquierda: {
      zoneId: 'vip_izquierda',
      name: 'Gold Izquierda',
      color: '#9333EA',
      prefix: 'VIP-IZQ',
      rows: [
        { rowLabel: 'Fila 1', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 2', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 3', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 4', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 5', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 6', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 7', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 8', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 9', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 10', seatsCount: 8, isReserved: false }
      ]
    },
    vip_derecha: {
      zoneId: 'vip_derecha',
      name: 'Gold Derecha',
      color: '#9333EA',
      prefix: 'VIP-DER',
      rows: [
        { rowLabel: 'Fila 1', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 2', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 3', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 4', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 5', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 6', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 7', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 8', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 9', seatsCount: 8, isReserved: false },
        { rowLabel: 'Fila 10', seatsCount: 8, isReserved: false }
      ]
    },
    central_atras: {
      zoneId: 'central_atras',
      name: 'General Central',
      color: '#10B981',
      prefix: 'GEN-CTR',
      rows: [
        { rowLabel: 'Fila A', seatsCount: 15, isReserved: false },
        { rowLabel: 'Fila B', seatsCount: 15, isReserved: false },
        { rowLabel: 'Fila C', seatsCount: 15, isReserved: false },
        { rowLabel: 'Fila D', seatsCount: 15, isReserved: false },
        { rowLabel: 'Fila E', seatsCount: 15, isReserved: false },
        { rowLabel: 'Fila F', seatsCount: 15, isReserved: false },
        { rowLabel: 'Fila G', seatsCount: 15, isReserved: false },
        { rowLabel: 'Fila H', seatsCount: 15, isReserved: false },
        { rowLabel: 'Fila I', seatsCount: 15, isReserved: false },
        { rowLabel: 'Fila J', seatsCount: 15, isReserved: false }
      ]
    },
    lateral_izquierda: {
      zoneId: 'lateral_izquierda',
      name: 'General Izquierda',
      color: '#F59E0B',
      prefix: 'GEN-IZQ',
      rows: [
        { rowLabel: 'Fila A', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila B', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila C', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila D', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila E', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila F', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila G', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila H', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila I', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila J', seatsCount: 10, isReserved: false }
      ]
    },
    lateral_derecha: {
      zoneId: 'lateral_derecha',
      name: 'General Derecha',
      color: '#F59E0B',
      prefix: 'GEN-DER',
      rows: [
        { rowLabel: 'Fila A', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila B', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila C', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila D', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila E', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila F', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila G', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila H', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila I', seatsCount: 10, isReserved: false },
        { rowLabel: 'Fila J', seatsCount: 10, isReserved: false }
      ]
    }
  };

  db.prepare(`
    INSERT OR IGNORE INTO homepage_config (key, value)
    VALUES ('zone_layouts_config', ?)
  `).run(JSON.stringify(defaultZoneLayouts));

  // Seed default page sections if empty
  const sectionsCount = db.prepare('SELECT COUNT(*) as count FROM page_sections').get();
  if (sectionsCount.count === 0) {
    const insertSection = db.prepare('INSERT INTO page_sections (id, type, sequence_order, content, styles) VALUES (?, ?, ?, ?, ?)');
    
    insertSection.run(
      'sec_hero',
      'hero',
      1,
      JSON.stringify({
        title: 'Bienvenido a TU CASA',
        subtitle: 'Iglesia Visión Jesús — Un lugar de fe, amor y restauración',
        bgUrl: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600',
        buttons: [{ id: '1', label: 'Congreso de Mujeres', emoji: '', url: '/autenticas', style: 'primary' }]
      }),
      JSON.stringify({
        backgroundColor: '#030812',
        textColor: '#FFFFFF',
        accentColor: '#0033FF'
      })
    );

    insertSection.run(
      'sec_news',
      'news',
      2,
      JSON.stringify({
        title: 'NOTICIAS Y EVENTOS',
        items: []
      }),
      JSON.stringify({
        backgroundColor: '#030812',
        textColor: '#FFFFFF',
        accentColor: '#0033FF'
      })
    );

    insertSection.run(
      'sec_pillars',
      'pillars',
      3,
      JSON.stringify({
        title: 'CONOCÉ LA VISIÓN',
        subtitle: 'Una iglesia viva, apasionada y comprometida con revelar el amor transformador de Jesucristo en cada corazón, hogar y comunidad.',
        pillars: [
          { id: '1', title: 'NUESTRA VISIÓN', text: 'Ser una iglesia viva que inspira a miles de personas a experimentar una relación personal con Dios, transformando vidas y formando discípulos apasionados por la verdad.', icon: 'Compass' },
          { id: '2', title: 'NUESTRA MISIÓN', text: 'Evangelizar, consolidar, edificar y enviar a cada creyente a vivir su propósito divino, restaurando familias y equipando líderes para impactar nuestra sociedad.', icon: 'Flame' },
          { id: '3', title: 'NUESTROS VALORES', text: 'Amor incondicional, adoración genuina, excelencia en el servicio, integridad moral, restauración familiar y fe firme en las promesas de Dios.', icon: 'Users' }
        ]
      }),
      JSON.stringify({
        backgroundColor: '#030812',
        textColor: '#FFFFFF',
        accentColor: '#977DFF'
      })
    );

    insertSection.run(
      'sec_schedules',
      'schedules',
      4,
      JSON.stringify({
        title: 'HORARIOS DE SERVICIOS',
        bgUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600',
        schedules: [
          { id: '1', text: 'JUEVES 7:30PM', isVirtual: false },
          { id: '2', text: 'SÁBADOS 5:30PM', isVirtual: false },
          { id: '3', text: 'DOMINGOS 9:00AM', isVirtual: false },
          { id: '4', text: 'DOMINGOS 11:00AM', isVirtual: false },
          { id: '5', text: 'DOMINGOS (VIRTUAL) 5:30PM', isVirtual: true }
        ]
      }),
      JSON.stringify({
        backgroundColor: '#030812',
        textColor: '#FFFFFF',
        accentColor: '#977DFF'
      })
    );
  }

  seedNosotrosSections(db);
}

function seedNosotrosSections(targetDb = db) {
  try {
    const check = targetDb.prepare("SELECT COUNT(*) as count FROM page_sections WHERE page_path = '/nosotros' OR page_path = '/acerca-de-la-vision'").get();
    if (check.count === 0) {
      const insertSection = targetDb.prepare('INSERT OR REPLACE INTO page_sections (id, type, sequence_order, content, styles, page_path) VALUES (?, ?, ?, ?, ?, ?)');

      insertSection.run(
        'sec_nosotros_hero',
        'image_text',
        1,
        JSON.stringify({
          title: '¿Eres nuevo en Visión Jesús?',
          text: 'Si es la primera vez que asistes a uno de nuestros servicios te aseguramos que te sentirás como en casa, en todo momento contarás con nuestro equipo de servicio quienes te guiarán de principio a fin.',
          bgUrl: 'https://images.unsplash.com/photo-1543165365-07232ed12fad?q=80&w=1600',
          imagePosition: 'right'
        }),
        JSON.stringify({
          backgroundColor: '#030812',
          textColor: '#FFFFFF',
          accentColor: '#0033FF'
        }),
        '/nosotros'
      );

      insertSection.run(
        'sec_nosotros_grid',
        'grid',
        2,
        JSON.stringify({
          title: 'Visión Jesús es un espacio para ti:',
          columns: 4,
          cells: [
            {
              title: 'VJ Kids',
              text: 'Hay servicios apropiados según la edad disponibles para niños desde 1 a 12 años.',
              imageUrl: '',
              iconName: 'Heart',
              colSpan: 1,
              rowSpan: 1
            },
            {
              title: 'Parqueo',
              text: 'Nuestro equipo de estacionamiento te ayudará a encontrar un espacio.',
              imageUrl: '',
              iconName: 'Compass',
              colSpan: 1,
              rowSpan: 1
            },
            {
              title: 'Cafetería',
              text: 'Café preparado y repostería disponibles en nuestro lobby.',
              imageUrl: '',
              iconName: 'Coffee',
              colSpan: 1,
              rowSpan: 1
            },
            {
              title: 'Grupos Conexión',
              text: 'Hay grupos para todas las edades e intereses. Encontrarás un espacio seguro, lleno de propósito y amistad.',
              imageUrl: '',
              iconName: 'Users',
              colSpan: 1,
              rowSpan: 1
            }
          ]
        }),
        JSON.stringify({
          backgroundColor: '#050A15',
          textColor: '#FFFFFF',
          accentColor: '#0033FF'
        }),
        '/nosotros'
      );

      insertSection.run(
        'sec_nosotros_sede',
        'image_text',
        3,
        JSON.stringify({
          title: 'Nuestra Sede (Desamparados)',
          text: 'Te ofrecemos una comunidad llena de amor. Y un lugar donde puedes conectar y sentirte en casa.',
          bgUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1000',
          imagePosition: 'left'
        }),
        JSON.stringify({
          backgroundColor: '#030812',
          textColor: '#FFFFFF',
          accentColor: '#0033FF'
        }),
        '/nosotros'
      );

      insertSection.run(
        'sec_nosotros_pastors',
        'pastors_profile',
        4,
        JSON.stringify({
          title: 'Nuestros Pastores',
          subtitle: 'Liderazgo Principal de Visión Jesús',
          pastors: [
            {
              name: 'Wagner Castro',
              role: 'Pastor Principal',
              description: 'En el año 1999 abrimos un pequeño local con el objetivo de compartir el amor de Jesús. Siempre hemos creído que amar a las personas es el mayor distintivo de un cristiano.\n\nEsa misión nos ha acompañado durante todos estos años.',
              imageUrl: '/media/WagnerCastro.JPG',
              instagramUrl: 'https://instagram.com/wagnercastro',
              facebookUrl: 'https://facebook.com/wagnercastro'
            },
            {
              name: 'Dayana Castro',
              role: 'Pastora Principal',
              description: 'Trabajamos con el modelo de Jesús: "Haced discípulos a todos los pueblos". Nuestro sistema se basa en grupos de amistad, donde impulsamos a las personas a tener un encuentro real con Dios y formarse en la Academia.\n\nNuestra misión diaria es mostrar y brindar amor e interés a cada persona, siempre a la manera de Jesús. Entendemos que nuestra esencia principal debe ser el amor.',
              imageUrl: '/media/DayanaMonge.JPG',
              instagramUrl: 'https://instagram.com/dayanacastro',
              facebookUrl: 'https://facebook.com/dayanacastro'
            }
          ]
        }),
        JSON.stringify({
          backgroundColor: '#050A15',
          textColor: '#FFFFFF',
          accentColor: '#0033FF'
        }),
        '/nosotros'
      );
    }
  } catch (e) {
    console.error('Error seeding nosotros sections:', e);
  }
}

initDb();

db.seedNosotrosSections = seedNosotrosSections;
module.exports = db;
