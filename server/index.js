const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'data', 'uploads', 'comprobantes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads/comprobantes', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|heic|pdf/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    if (allowedTypes.test(ext) || allowedTypes.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no válido. Solo se permiten imágenes (JPG, PNG, WEBP) o PDF.'));
    }
  }
});

// --- API ROUTES ---

// 1. Get Zones, Pricing Tiers & List of Occupied Seats
app.get('/api/zones', (req, res) => {
  try {
    const zones = db.prepare(`
      SELECT id, name, price, regular_price, total_capacity, available_capacity, description, color_code
      FROM zones
    `).all();

    // Fetch all assigned/occupied seat codes from attendees table AND seat_queues table
    const occupiedAttendees = db.prepare(`
      SELECT assigned_ticket_code FROM attendees WHERE assigned_ticket_code IS NOT NULL AND assigned_ticket_code != ''
    `).all().map(r => r.assigned_ticket_code);

    const occupiedQueues = db.prepare(`
      SELECT ticket_code FROM seat_queues WHERE is_assigned = 1
    `).all().map(r => r.ticket_code);

    const occupiedSeats = Array.from(new Set([...occupiedAttendees, ...occupiedQueues]));

    const now = new Date();
    const cutoffDate = new Date('2026-08-15T23:59:59');
    const isPresale = now <= cutoffDate;

    res.json({
      success: true,
      isPresale,
      cutoffDate: '2026-08-15',
      zones,
      occupiedSeats
    });
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({ success: false, message: 'Error al consultar las zonas.' });
  }
});

// 2. Create Reservation & Save Complete Attendee Form
app.post('/api/reservations', upload.single('comprobante'), (req, res) => {
  try {
    const { zone_id, purchaser_name, purchaser_email, purchaser_phone, attendees: rawAttendees } = req.body;
    let attendees = [];
    
    if (typeof rawAttendees === 'string') {
      attendees = JSON.parse(rawAttendees);
    } else if (Array.isArray(rawAttendees)) {
      attendees = rawAttendees;
    }

    if (!zone_id || !purchaser_name || !purchaser_email || !purchaser_phone || !attendees || attendees.length === 0) {
      return res.status(400).json({ success: false, message: 'Faltan campos requeridos o la lista de asistentes está vacía.' });
    }

    const quantity = attendees.length;

    const zone = db.prepare('SELECT * FROM zones WHERE id = ?').get(zone_id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Zona no encontrada.' });
    }

    if (zone.available_capacity < quantity) {
      return res.status(400).json({
        success: false,
        message: `No hay suficientes cupos disponibles en la ${zone.name}. Cupos disponibles: ${zone.available_capacity}`
      });
    }

    const comprobanteUrl = req.file ? `/uploads/comprobantes/${req.file.filename}` : null;
    const reservationId = uuidv4();
    const qrCodeHash = uuidv4();
    const totalAmount = quantity * zone.price;

    const reservationTx = db.transaction(() => {
      const availableSeats = db.prepare(`
        SELECT id, ticket_number, ticket_code
        FROM seat_queues
        WHERE zone_id = ? AND is_assigned = 0
        ORDER BY ticket_number ASC
        LIMIT ?
      `).all(zone_id, quantity);

      if (availableSeats.length < quantity) {
        throw new Error('Cola de asientos insuficiente en este momento.');
      }

      db.prepare(`
        INSERT INTO reservations (
          id, zone_id, purchaser_name, purchaser_email, purchaser_phone,
          quantity, total_amount, comprobante_url, status, qr_code_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', ?)
      `).run(reservationId, zone_id, purchaser_name, purchaser_email, purchaser_phone, quantity, totalAmount, comprobanteUrl, qrCodeHash);

      const updateQueueStmt = db.prepare(`
        UPDATE seat_queues
        SET is_assigned = 1, reservation_id = ?
        WHERE id = ?
      `);

      const insertAttendeeStmt = db.prepare(`
        INSERT INTO attendees (
          reservation_id, full_name, age, phone, residence, civil_status,
          is_vision_jesus, church_network, invited_by, attended_encounter, assigned_ticket_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const assignedTickets = [];

      for (let i = 0; i < quantity; i++) {
        const seat = availableSeats[i];
        const att = attendees[i] || {};
        
        const finalSeatCode = att.assigned_ticket_code || seat.ticket_code;

        updateQueueStmt.run(reservationId, seat.id);
        insertAttendeeStmt.run(
          reservationId,
          att.full_name || purchaser_name,
          att.age || null,
          att.phone || purchaser_phone,
          att.residence || '',
          att.civil_status || '',
          att.is_vision_jesus || '',
          att.church_network || '',
          att.invited_by || '',
          att.attended_encounter || '',
          finalSeatCode
        );
        assignedTickets.push(finalSeatCode);
      }

      db.prepare(`
        UPDATE zones
        SET available_capacity = available_capacity - ?
        WHERE id = ?
      `).run(quantity, zone_id);

      return { reservationId, qrCodeHash, assignedTickets, totalAmount };
    });

    const result = reservationTx();

    res.json({
      success: true,
      message: '¡Reserva creada exitosamente! Tu comprobante está en revisión.',
      reservation: {
        id: result.reservationId,
        qr_code_hash: result.qrCodeHash,
        assigned_tickets: result.assignedTickets,
        total_amount: result.totalAmount,
        quantity: quantity,
        zone_name: zone.name,
        purchaser_name,
        purchaser_phone,
        status: 'pendiente'
      }
    });

  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ success: false, message: error.message || 'Error interno al procesar la reserva.' });
  }
});

// 3. Get Ticket Details by QR Hash
app.get('/api/tickets/:qrHash', (req, res) => {
  try {
    const { qrHash } = req.params;
    const reservation = db.prepare(`
      SELECT r.*, z.name as zone_name, z.price as ticket_price
      FROM reservations r
      JOIN zones z ON r.zone_id = z.id
      WHERE r.qr_code_hash = ?
    `).get(qrHash);

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Boleto o código QR no encontrado.' });
    }

    const attendees = db.prepare(`
      SELECT *
      FROM attendees
      WHERE reservation_id = ?
    `).all(reservation.id);

    res.json({
      success: true,
      ticket: {
        ...reservation,
        attendees
      }
    });
  } catch (error) {
    console.error('Error getting ticket:', error);
    res.status(500).json({ success: false, message: 'Error al consultar boleto.' });
  }
});

// 4. Admin Login
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM admin_users WHERE username = ? AND password_hash = ?').get(username, password);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor durante login.' });
  }
});

// 5. Get Reservations (Admin)
app.get('/api/admin/reservations', (req, res) => {
  try {
    const reservations = db.prepare(`
      SELECT r.*, z.name as zone_name
      FROM reservations r
      JOIN zones z ON r.zone_id = z.id
      ORDER BY r.created_at DESC
    `).all();

    const result = reservations.map(resv => {
      const attendees = db.prepare(`
        SELECT *
        FROM attendees
        WHERE reservation_id = ?
      `).all(resv.id);

      return {
        ...resv,
        attendees
      };
    });

    res.json({ success: true, reservations: result });
  } catch (error) {
    console.error('Error fetching reservations for admin:', error);
    res.status(500).json({ success: false, message: 'Error al cargar lista de reservaciones.' });
  }
});

// 6. Update Status
app.post('/api/admin/reservations/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['aprobado', 'rechazado'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Estado no válido.' });
    }

    const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reserva no encontrada.' });
    }

    db.prepare(`
      UPDATE reservations
      SET status = ?, approved_at = CASE WHEN ? = 'aprobado' THEN CURRENT_TIMESTAMP ELSE approved_at END, notes = ?
      WHERE id = ?
    `).run(status, status, notes || '', id);

    res.json({ success: true, message: `Reserva ${status === 'aprobado' ? 'APROBADA' : 'RECHAZADA'} con éxito.` });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado de la reserva.' });
  }
});

// 7. Delete Reservation Permanently (API Endpoint for Admin)
app.delete('/api/admin/reservations/:id', (req, res) => {
  try {
    const { id } = req.params;

    const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reserva no encontrada.' });
    }

    const deleteTx = db.transaction(() => {
      // 1. Release assigned seats in seat_queues
      db.prepare(`
        UPDATE seat_queues
        SET is_assigned = 0, reservation_id = NULL
        WHERE reservation_id = ?
      `).run(id);

      // 2. Increment available capacity in zones
      db.prepare(`
        UPDATE zones
        SET available_capacity = available_capacity + ?
        WHERE id = ?
      `).run(reservation.quantity, reservation.zone_id);

      // 3. Delete attendees
      db.prepare(`
        DELETE FROM attendees
        WHERE reservation_id = ?
      `).run(id);

      // 4. Delete reservation record
      db.prepare(`
        DELETE FROM reservations
        WHERE id = ?
      `).run(id);
    });

    deleteTx();

    res.json({ success: true, message: 'Reserva eliminada permanentemente y sus asientos han sido liberados.' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ success: false, message: 'Error interno al eliminar la reserva.' });
  }
});

// 8. Door Scanner Check
app.post('/api/scan', (req, res) => {
  try {
    const { qr_hash, scanned_by } = req.body;

    if (!qr_hash) {
      return res.status(400).json({
        success: false,
        code: 'INVALID_FORMAT',
        message: 'Código QR no enviado o incompleto.'
      });
    }

    const reservation = db.prepare(`
      SELECT r.*, z.name as zone_name
      FROM reservations r
      JOIN zones z ON r.zone_id = z.id
      WHERE r.qr_code_hash = ?
    `).get(qr_hash);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        code: 'NOT_FOUND',
        message: '¡ERROR! Código QR no registrado en el sistema.'
      });
    }

    if (reservation.status === 'pendiente') {
      return res.status(400).json({
        success: false,
        code: 'PENDING_APPROVAL',
        message: '¡PAGO PENDIENTE! El comprobante de esta reserva no ha sido aprobado por administración.',
        reservation
      });
    }

    if (reservation.status === 'rechazado') {
      return res.status(400).json({
        success: false,
        code: 'REJECTED',
        message: '¡ACCESO DENEGADO! Esta reserva fue rechazada por el administrador.',
        reservation
      });
    }

    if (reservation.status === 'usado') {
      const attendees = db.prepare(`
        SELECT *
        FROM attendees
        WHERE reservation_id = ?
      `).all(reservation.id);

      return res.json({
        success: true,
        code: 'ALREADY_USED',
        message: `¡ATENCIÓN! ESTE BOLETO YA FUE ESCANEADO Y USADO.\nFecha de ingreso: ${new Date(reservation.scanned_at).toLocaleString()}`,
        reservation: {
          ...reservation,
          attendees
        }
      });
    }

    const attendees = db.prepare(`
      SELECT *
      FROM attendees
      WHERE reservation_id = ?
    `).all(reservation.id);

    db.prepare(`
      UPDATE reservations
      SET status = 'usado', scanned_at = CURRENT_TIMESTAMP, scanned_by = ?
      WHERE id = ?
    `).run(scanned_by || 'Personal de Puerta', reservation.id);

    res.json({
      success: true,
      code: 'APPROVED_PASS',
      message: '¡ENTRADA VÁLIDA! BIENVENIDA AL CONGRESO',
      reservation: {
        ...reservation,
        status: 'usado',
        attendees
      }
    });

  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ success: false, code: 'SERVER_ERROR', message: 'Error interno durante el escaneo.' });
  }
});

// --- HOMEPAGE CONFIGURATION API ---
app.get('/api/homepage/config', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM homepage_config').all();
    const config = {};
    rows.forEach(r => {
      config[r.key] = r.value;
    });
    res.json({ success: true, config });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.post('/api/admin/homepage/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Archivo no subido.' });
    }
    const fileUrl = `/uploads/comprobantes/${req.file.filename}`;
    // Update homepage_config hero_bg
    const updateStmt = db.prepare('INSERT OR REPLACE INTO homepage_config (key, value) VALUES (?, ?)');
    updateStmt.run('hero_bg', fileUrl);
    res.json({ success: true, url: fileUrl });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

app.post('/api/admin/homepage/config', (req, res) => {
  try {
    const { config } = req.body;
    if (!config) {
      return res.status(400).json({ success: false, message: 'Configuración no provista.' });
    }
    const updateStmt = db.prepare('INSERT OR REPLACE INTO homepage_config (key, value) VALUES (?, ?)');
    const tx = db.transaction(() => {
      for (const [key, val] of Object.entries(config)) {
        updateStmt.run(key, String(val));
      }
    });
    tx();
    res.json({ success: true, message: 'Configuración de portada guardada con éxito.' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// --- ADMIN USER MANAGEMENT ---

// List all admin users (no passwords)
app.get('/api/admin/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, username, full_name, role FROM admin_users').all();
    res.json({ success: true, users });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Create new admin user
app.post('/api/admin/users', (req, res) => {
  try {
    const { username, password, full_name, role } = req.body;
    if (!username || !password || !full_name || !role) {
      return res.status(400).json({ success: false, message: 'Todos los campos son requeridos.' });
    }

    const validRoles = ['admin', 'tickets', 'scanner'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Rol no válido. Use: admin, tickets, scanner.' });
    }

    const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get(username);
    if (existing) {
      return res.status(400).json({ success: false, message: 'El nombre de usuario ya existe.' });
    }

    db.prepare('INSERT INTO admin_users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)').run(username, password, full_name, role);
    res.json({ success: true, message: `Usuario "${username}" creado con rol "${role}".` });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Delete admin user
app.delete('/api/admin/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }
    db.prepare('DELETE FROM admin_users WHERE id = ?').run(id);
    res.json({ success: true, message: `Usuario "${user.username}" eliminado.` });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// --- CSV EXPORT ---
app.get('/api/admin/export/csv', (req, res) => {
  try {
    const reservations = db.prepare(`
      SELECT r.id, r.purchaser_name, r.purchaser_email, r.purchaser_phone, r.quantity, r.total_amount, r.status, r.created_at, r.approved_at, z.name as zone_name
      FROM reservations r
      JOIN zones z ON r.zone_id = z.id
      ORDER BY r.created_at DESC
    `).all();

    // CSV Header
    const headers = [
      'Reserva ID', 'Comprador', 'Email Comprador', 'Teléfono Comprador',
      'Zona', 'Cantidad', 'Monto Total', 'Estado', 'Fecha Reserva', 'Fecha Aprobación',
      'Asistente Nombre', 'Edad', 'Teléfono', 'Residencia', 'Estado Civil',
      '¿Visión Jesús?', 'Red', '¿Quién Invitó?', '¿Fue a Encuentro?', 'Asiento'
    ];

    let csvContent = '\uFEFF' + headers.join(',') + '\n'; // BOM for Excel UTF-8

    for (const resv of reservations) {
      const attendees = db.prepare('SELECT * FROM attendees WHERE reservation_id = ?').all(resv.id);
      
      if (attendees.length === 0) {
        // Reservation with no attendees
        const row = [
          resv.id, resv.purchaser_name, resv.purchaser_email, resv.purchaser_phone,
          resv.zone_name, resv.quantity, resv.total_amount, resv.status,
          resv.created_at || '', resv.approved_at || '',
          '', '', '', '', '', '', '', '', '', ''
        ].map(v => `"${String(v || '').replace(/"/g, '""')}"`);
        csvContent += row.join(',') + '\n';
      } else {
        for (const att of attendees) {
          const row = [
            resv.id, resv.purchaser_name, resv.purchaser_email, resv.purchaser_phone,
            resv.zone_name, resv.quantity, resv.total_amount, resv.status,
            resv.created_at || '', resv.approved_at || '',
            att.full_name || '', att.age || '', att.phone || '', att.residence || '', att.civil_status || '',
            att.is_vision_jesus || '', att.church_network || '', att.invited_by || '', att.attended_encounter || '',
            att.assigned_ticket_code || ''
          ].map(v => `"${String(v || '').replace(/"/g, '""')}"`);
          csvContent += row.join(',') + '\n';
        }
      }
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=reservaciones_autenticas.csv');
    res.send(csvContent);
  } catch (e) {
    console.error('CSV export error:', e);
    res.status(500).json({ success: false, message: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Express API Server listening on port ${PORT}`);
});

