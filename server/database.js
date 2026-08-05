const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const uploadsDir = path.join(dbDir, 'uploads', 'comprobantes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'event_ticketing.db');
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
  `);

  // Migrations for columns
  try { db.exec(`ALTER TABLE zones ADD COLUMN regular_price REAL`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN age INTEGER`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN residence TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN civil_status TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN is_vision_jesus TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN church_network TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN invited_by TEXT`); } catch (e) {}
  try { db.exec(`ALTER TABLE attendees ADD COLUMN attended_encounter TEXT`); } catch (e) {}

  // Determine pricing tier (Preventa: VIP=12000, Gen=7500 | Regular tras 15 Agosto: VIP=15000, Gen=10000)
  const now = new Date();
  const cutoffDate = new Date('2026-08-15T23:59:59');
  const isPresale = now <= cutoffDate;

  const vipPrice = isPresale ? 12000.00 : 15000.00;
  const generalPrice = isPresale ? 7500.00 : 10000.00;

  // New Capacities: VIP = 250 Total, General = 350 Total.
  // VIP Central: 90 seats, VIP Izquierda: 80 seats, VIP Derecha: 80 seats. (Sum = 250)
  // General Central: 150 seats, General Izquierda: 100 seats, General Derecha: 100 seats. (Sum = 350)
  const zoneList = [
    { id: 'vip_central', name: 'VIP Central', price: vipPrice, regular_price: 15000.00, capacity: 90, prefix: 'VIP-CTR', color: '#DB2777', desc: 'Ubicación preferencial en el centro del altar (90 asientos).' },
    { id: 'vip_izquierda', name: 'VIP Izquierda', price: vipPrice, regular_price: 15000.00, capacity: 80, prefix: 'VIP-IZQ', color: '#9333EA', desc: 'Sector VIP lateral izquierdo (80 asientos).' },
    { id: 'vip_derecha', name: 'VIP Derecha', price: vipPrice, regular_price: 15000.00, capacity: 80, prefix: 'VIP-DER', color: '#9333EA', desc: 'Sector VIP lateral derecho (80 asientos).' },
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

  // Seed default admin users
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admin_users').get();
  if (adminCount.count === 0) {
    db.prepare(`
      INSERT INTO admin_users (username, password_hash, role, full_name)
      VALUES 
      ('admin', 'admin123', 'admin', 'Administrador Principal'),
      ('scanner', 'puerta123', 'scanner', 'Personal de Puerta / Escáner')
    `).run();
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
    { id: '1', label: 'Congreso de Mujeres', emoji: '🎟️', url: '/autenticas', style: 'primary' }
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
}

initDb();

module.exports = db;
