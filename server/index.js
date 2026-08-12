const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3001;

function generateShortCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars like O, 0, I, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function sendReservationEmail({ toEmail, purchaserName, zoneName, quantity, assignedTickets, qrCodeHash, totalAmount, origin }) {
  try {
    const ticketUrl = `${origin || 'https://www.visionjesuscr.com'}/ticket/${qrCodeHash}`;
    const controlCode = qrCodeHash.substring(0, 6).toUpperCase();
    const formattedAmount = `₡${Number(totalAmount).toLocaleString('es-CR')}`;
    const seatsList = assignedTickets.map(t => 
      t.includes(' - ') && !t.startsWith('Fila') && !t.startsWith('Asiento') 
        ? t.split(' - ').slice(1).join(' - ') 
        : t
    ).join(' • ');

    // Generate QR Code image as a buffer
    const qrBuffer = await QRCode.toBuffer(qrCodeHash, {
      margin: 2,
      width: 250,
      color: {
        dark: '#2C1A0E',
        light: '#FFFFFF'
      }
    });

    const qrBase64 = qrBuffer.toString('base64');
    const logoPath = path.join(__dirname, '..', 'logo-anual.png');
    let logoBase64 = null;
    if (fs.existsSync(logoPath)) {
      logoBase64 = fs.readFileSync(logoPath).toString('base64');
    }

    const attachments = [
      {
        filename: 'qrcode.png',
        content: qrBase64,
        contentType: 'image/png',
        content_id: 'qrcode'
      }
    ];

    if (logoBase64) {
      attachments.push({
        filename: 'logo-anual.png',
        content: logoBase64,
        contentType: 'image/png',
        content_id: 'logo'
      });
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Reservación - Mujeres Auténticas 2026</title>
</head>
<body style="background-color: #FAF6F0; font-family: 'Outfit', 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #2C1A0E;">
  <div style="width: 100%; background-color: #FAF6F0; padding: 30px 0;">
    <div style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E6D5C3; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(92, 61, 46, 0.08);">
      <div style="background: linear-gradient(135deg, #5C3D2E 0%, #4A2E1B 100%); padding: 30px 20px; text-align: center;">
        ${logoBase64 ? '<img src="cid:logo" alt="Logo Auténticas" style="max-width: 180px; height: auto; display: block; margin: 0 auto;">' : ''}
        <h1 style="color: #FFFFFF; margin: 15px 0 0 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">Registro Recibido</h1>
      </div>
      <div style="padding: 35px 25px;">
        <p style="font-size: 16px; line-height: 1.6; color: #4A3B32; margin: 0 0 25px 0;">
          Hola <strong style="color: #5C3D2E;">${purchaserName}</strong>,<br><br>
          Tu solicitud de reservación para el <strong>Congreso Anual de Mujeres Auténticas 2026</strong> ha sido registrada con éxito.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; background-color: #FAF6F0; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 14px 16px; border-bottom: 1px solid #E6D5C3; font-size: 14px; font-weight: 700; color: #5C3D2E; width: 35%;">Comprador:</td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #E6D5C3; font-size: 14px; color: #2C1A0E; font-weight: 500;">${purchaserName}</td>
          </tr>
          <tr>
            <td style="padding: 14px 16px; border-bottom: 1px solid #E6D5C3; font-size: 14px; font-weight: 700; color: #5C3D2E; width: 35%;">Zona:</td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #E6D5C3; font-size: 14px; color: #2C1A0E; font-weight: 500;">${zoneName}</td>
          </tr>
          <tr>
            <td style="padding: 14px 16px; border-bottom: 1px solid #E6D5C3; font-size: 14px; font-weight: 700; color: #5C3D2E; width: 35%;">Cantidad:</td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #E6D5C3; font-size: 14px; color: #2C1A0E; font-weight: 500;">${quantity} ${quantity === 1 ? 'Persona' : 'Personas'}</td>
          </tr>
          <tr>
            <td style="padding: 14px 16px; border-bottom: 1px solid #E6D5C3; font-size: 14px; font-weight: 700; color: #5C3D2E; width: 35%;">Asientos:</td>
            <td style="padding: 14px 16px; border-bottom: 1px solid #E6D5C3; font-size: 14px; color: #2C1A0E; font-weight: 500;">${seatsList}</td>
          </tr>
          <tr>
            <td style="padding: 14px 16px; border-bottom: none; font-size: 14px; font-weight: 700; color: #5C3D2E; width: 35%;">Monto Total:</td>
            <td style="padding: 14px 16px; border-bottom: none; font-size: 14px; color: #5C3D2E; font-weight: 700;">${formattedAmount}</td>
          </tr>
        </table>

        <div style="text-align: center; padding: 25px; background-color: #FAF6F0; border: 2px dashed #C69B6D; border-radius: 16px; margin-bottom: 25px;">
          <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #5C3D2E;">Código QR Digital de Entrada</p>
          <div style="border: 3px solid #C69B6D; border-radius: 12px; padding: 8px; background-color: #FFFFFF; display: inline-block; width: 180px; height: 180px;">
            <img src="cid:qrcode" alt="Código QR" style="display: block; width: 100%; height: auto;">
          </div>
          <div style="font-size: 13px; color: #8C7456; margin-top: 12px; font-weight: bold; letter-spacing: 1px;">CÓDIGO DE CONTROL: ${controlCode}</div>
        </div>

        <p style="font-size: 13px; line-height: 1.5; color: #6B7280; text-align: center; margin-top: 20px;">
          <em>Nota: Una vez que nuestro equipo valide tu comprobante de pago, el código QR quedará habilitado para ser escaneado en la entrada del evento.</em>
        </p>

        <div style="text-align: center; margin: 30px 0 10px;">
          <a href="${ticketUrl}" target="_blank" style="background: linear-gradient(135deg, #C69B6D 0%, #B58A5C 100%); color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 4px 10px rgba(198, 155, 109, 0.3);">Ver Boleto en la Web</a>
        </div>
      </div>
      <div style="background-color: #FAF6F0; padding: 20px; text-align: center; font-size: 12px; color: #8C7456; border-top: 1px solid #E6D5C3;">
        <p style="margin: 5px 0; line-height: 1.4;"><strong>Iglesia Visión Jesús</strong></p>
        <p style="margin: 5px 0; line-height: 1.4;">© 2026 Conferencia de Mujeres Auténticas</p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('ERROR: RESEND_API_KEY environment variable is not defined.');
      return;
    }

    // Default to custom domain if API key is set (assumes domain is verified)
    // You can override the sender with RESEND_FROM_EMAIL env variable if needed
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'Mujeres Auténticas <autenticas@visionjesuscr.com>';

    const payload = {
      from: fromAddress,
      to: [toEmail],
      subject: '🎟️ Registro Recibido - Mujeres Auténticas 2026',
      html: htmlContent,
      attachments
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      console.log('Reservation email sent successfully via Resend. ID:', data.id);
    } else {
      console.error('Error response from Resend API:', data);
    }
  } catch (error) {
    console.error('Error sending reservation email:', error);
  }
}

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
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|heic|pdf|mp4|webm|mov|ogg/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    if (allowedTypes.test(ext) || allowedTypes.test(mime) || mime.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Formato de archivo no válido. Se permiten imágenes, PDFs y videos (MP4, WEBM, MOV).'));
    }
  }
});

// --- API ROUTES ---

// Helper: Clean up expired seat holds
function cleanupExpiredHolds() {
  try {
    db.prepare(`DELETE FROM seat_holds WHERE expires_at < CURRENT_TIMESTAMP`).run();
  } catch (e) {
    console.error('Error cleaning up seat holds:', e);
  }
}

// Helper: Log activity
function logActivity(username, action, details) {
  try {
    db.prepare(`
      INSERT INTO activity_logs (username, action, details)
      VALUES (?, ?, ?)
    `).run(username, action, details);
  } catch (error) {
    console.error('Error writing activity log:', error);
  }
}

// 1. Get Zones, Pricing Tiers & List of Occupied/Held Seats
app.get('/api/zones', (req, res) => {
  try {
    cleanupExpiredHolds();

    // Read presale config from homepage_config
    const configRows = db.prepare('SELECT key, value FROM homepage_config').all();
    const config = {};
    configRows.forEach(r => config[r.key] = r.value);

    const cutoffDateStr = config.presale_cutoff_date || '2026-08-15';
    const cutoffDate = new Date(`${cutoffDateStr}T23:59:59`);
    const now = new Date();
    const isPresale = now <= cutoffDate;

    const vipPresale = parseFloat(config.vip_presale_price || '12000');
    const vipRegular = parseFloat(config.vip_regular_price || '15000');
    const genPresale = parseFloat(config.general_presale_price || '7500');
    const genRegular = parseFloat(config.general_regular_price || '10000');

    const activeVipPrice = isPresale ? vipPresale : vipRegular;
    const activeGenPrice = isPresale ? genPresale : genRegular;

    const rawZones = db.prepare(`
      SELECT id, name, price, regular_price, total_capacity, available_capacity, description, color_code
      FROM zones
    `).all();

    const zones = rawZones.map(z => {
      const isVip = z.id.startsWith('vip');
      const currentPrice = isVip ? activeVipPrice : activeGenPrice;
      const regularPrice = isVip ? vipRegular : genRegular;
      return {
        ...z,
        price: currentPrice,
        regular_price: regularPrice
      };
    });

    // Fetch all assigned/occupied seat codes from attendees table AND seat_queues table
    const occupiedAttendees = db.prepare(`
      SELECT assigned_ticket_code FROM attendees WHERE assigned_ticket_code IS NOT NULL AND assigned_ticket_code != ''
    `).all().map(r => r.assigned_ticket_code);

    const occupiedQueues = db.prepare(`
      SELECT ticket_code FROM seat_queues WHERE is_assigned = 1
    `).all().map(r => r.ticket_code);

    // Fetch active held seat codes from seat_holds table
    const activeHeldSeats = db.prepare(`
      SELECT seat_code FROM seat_holds WHERE expires_at >= CURRENT_TIMESTAMP
    `).all().map(r => r.seat_code);

    const occupiedSeats = Array.from(new Set([...occupiedAttendees, ...occupiedQueues, ...activeHeldSeats]));

    res.json({
      success: true,
      isPresale,
      cutoffDate: cutoffDateStr,
      presaleConfig: {
        cutoffDate: cutoffDateStr,
        vipPresale,
        vipRegular,
        genPresale,
        genRegular
      },
      zones,
      occupiedSeats
    });
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({ success: false, message: 'Error al consultar las zonas.' });
  }
});

// 1b. Hold Seats (5-minute temporary reservation lock for concurrency control)
app.post('/api/seats/hold', (req, res) => {
  try {
    cleanupExpiredHolds();

    const { seat_codes, session_id, zone_id } = req.body;

    if (!seat_codes || !Array.isArray(seat_codes) || seat_codes.length === 0 || !session_id || !zone_id) {
      return res.status(400).json({ success: false, message: 'Se requieren asientos, ID de sesión y zona.' });
    }

    // 1. Check permanently assigned seats
    const occupiedAttendees = db.prepare(`
      SELECT assigned_ticket_code FROM attendees WHERE assigned_ticket_code IS NOT NULL AND assigned_ticket_code != ''
    `).all().map(r => r.assigned_ticket_code);

    const occupiedQueues = db.prepare(`
      SELECT ticket_code FROM seat_queues WHERE is_assigned = 1
    `).all().map(r => r.ticket_code);

    const permanentlyAssigned = new Set([...occupiedAttendees, ...occupiedQueues]);

    // 2. Check active holds by other sessions
    const activeHoldsOtherSessions = db.prepare(`
      SELECT seat_code FROM seat_holds WHERE session_id != ? AND expires_at >= CURRENT_TIMESTAMP
    `).all(session_id).map(r => r.seat_code);

    const otherSessionHolds = new Set(activeHoldsOtherSessions);

    // Identify conflicts
    const conflictSeats = seat_codes.filter(code => permanentlyAssigned.has(code) || otherSessionHolds.has(code));

    if (conflictSeats.length > 0) {
      return res.json({
        success: false,
        code: 'SEATS_TAKEN',
        conflictSeats,
        message: '¡Atención! Uno o más de los asientos seleccionados fueron reservados o apartados por otra persona. Por favor refresca la página y selecciona otros asientos disponibles.'
      });
    }

    // Insert or renew hold for 5 minutes (300 seconds)
    const holdTx = db.transaction(() => {
      db.prepare('DELETE FROM seat_holds WHERE session_id = ?').run(session_id);

      const insertHold = db.prepare(`
        INSERT INTO seat_holds (id, session_id, seat_code, zone_id, expires_at)
        VALUES (?, ?, ?, ?, datetime('now', '+5 minutes'))
      `);

      for (const seatCode of seat_codes) {
        insertHold.run(uuidv4(), session_id, seatCode, zone_id);
      }
    });

    holdTx();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    res.json({
      success: true,
      message: 'Asientos apartados temporalmente por 5 minutos.',
      session_id,
      expires_at: expiresAt,
      hold_duration_seconds: 300
    });
  } catch (error) {
    console.error('Error holding seats:', error);
    res.status(500).json({ success: false, message: 'Error interno al apartar los asientos.' });
  }
});

// 1c. Release Seats Hold
app.post('/api/seats/release', (req, res) => {
  try {
    const { session_id } = req.body;
    if (session_id) {
      db.prepare('DELETE FROM seat_holds WHERE session_id = ?').run(session_id);
    }
    res.json({ success: true, message: 'Asientos liberados.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    
    let qrCodeHash;
    let isUnique = false;
    while (!isUnique) {
      qrCodeHash = generateShortCode();
      const existing = db.prepare('SELECT id FROM reservations WHERE qr_code_hash = ?').get(qrCodeHash);
      if (!existing) {
        isUnique = true;
      }
    }

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

      // Clean up seat_holds for this session if provided
      if (req.body.session_id) {
        db.prepare('DELETE FROM seat_holds WHERE session_id = ?').run(req.body.session_id);
      }

      return { reservationId, qrCodeHash, assignedTickets, totalAmount };
    });

    const result = reservationTx();

    logActivity(
      'sistema',
      'crear_reserva',
      `Reserva creada por ${purchaser_name} (${purchaser_email}) de ${quantity} boletos en la zona ${zone.name}. Total: ₡${totalAmount.toLocaleString('es-CR')}. ID: ${result.reservationId}`
    );

    // Send email asynchronously in the background
    const origin = req.headers.origin || 'https://www.visionjesuscr.com';
    sendReservationEmail({
      toEmail: purchaser_email,
      purchaserName: purchaser_name,
      zoneName: zone.name,
      quantity: quantity,
      assignedTickets: result.assignedTickets,
      qrCodeHash: result.qrCodeHash,
      totalAmount: result.totalAmount,
      origin
    }).catch(err => console.error('Background email error:', err));

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

    const updateTx = db.transaction(() => {
      db.prepare(`
        UPDATE reservations
        SET status = ?, approved_at = CASE WHEN ? = 'aprobado' THEN CURRENT_TIMESTAMP ELSE approved_at END, notes = ?
        WHERE id = ?
      `).run(status, status, notes || '', id);

      // When rejecting, release the seats so they become available again
      if (status === 'rechazado') {
        db.prepare(`
          UPDATE seat_queues
          SET is_assigned = 0, reservation_id = NULL
          WHERE reservation_id = ?
        `).run(id);

        db.prepare(`
          UPDATE zones
          SET available_capacity = available_capacity + ?
          WHERE id = ?
        `).run(reservation.quantity, reservation.zone_id);
      }
    });

    updateTx();

    const adminUser = req.headers['x-admin-user'] || req.body.admin_username || 'desconocido';
    logActivity(
      adminUser,
      status === 'aprobado' ? 'aprobar_reserva' : 'rechazar_reserva',
      `Reserva de ${reservation.purchaser_name} (${reservation.id}) cambiada a ${status}.`
    );

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
      // Only release seats & restore capacity if NOT already rejected
      // (rejected reservations already had their seats freed)
      if (reservation.status !== 'rechazado') {
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
      }

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

    const adminUser = req.headers['x-admin-user'] || req.body.admin_username || 'desconocido';
    logActivity(
      adminUser,
      'eliminar_reserva',
      `Reserva de ${reservation.purchaser_name} (${reservation.id}) de ${reservation.quantity} boletos eliminada permanentemente.`
    );

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

    let reservation = db.prepare(`
      SELECT r.*, z.name as zone_name
      FROM reservations r
      JOIN zones z ON r.zone_id = z.id
      WHERE r.qr_code_hash = ?
    `).get(qr_hash);

    if (!reservation) {
      reservation = db.prepare(`
        SELECT r.*, z.name as zone_name
        FROM reservations r
        JOIN zones z ON r.zone_id = z.id
        WHERE r.qr_code_hash LIKE ?
      `).get(`${qr_hash}%`);
    }

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

      const formattedDate = reservation.scanned_at ? new Date(reservation.scanned_at + 'Z').toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' }) : 'Fecha desconocida';

      logActivity(
        scanned_by || 'Personal de Puerta',
        'intento_reingreso',
        `Intento de reingreso para boleto de ${reservation.purchaser_name} (${reservation.qr_code_hash})`
      );

      return res.json({
        success: true,
        code: 'ALREADY_USED',
        message: `¡ATENCIÓN! ESTE BOLETO YA FUE ESCANEADO Y USADO.\nFecha de ingreso: ${formattedDate}`,
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

    logActivity(
      scanned_by || 'Personal de Puerta',
      'escanear_boleto',
      `Boleto de ${reservation.purchaser_name} (${reservation.qr_code_hash}) de ${reservation.quantity} personas escaneado con éxito para ingreso.`
    );

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

app.post('/api/admin/autenticas/gallery-upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Archivo no subido.' });
    }
    const fileUrl = `/uploads/comprobantes/${req.file.filename}`;
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

// Admin Pricing and Presale Config
app.post('/api/admin/pricing', (req, res) => {
  try {
    const {
      presale_cutoff_date,
      vip_presale_price,
      vip_regular_price,
      general_presale_price,
      general_regular_price
    } = req.body;

    if (!presale_cutoff_date || !vip_presale_price || !vip_regular_price || !general_presale_price || !general_regular_price) {
      return res.status(400).json({ success: false, message: 'Todos los campos de precios y fecha límite son requeridos.' });
    }

    const updateConfig = db.prepare('INSERT OR REPLACE INTO homepage_config (key, value) VALUES (?, ?)');
    
    const tx = db.transaction(() => {
      updateConfig.run('presale_cutoff_date', String(presale_cutoff_date));
      updateConfig.run('vip_presale_price', String(vip_presale_price));
      updateConfig.run('vip_regular_price', String(vip_regular_price));
      updateConfig.run('general_presale_price', String(general_presale_price));
      updateConfig.run('general_regular_price', String(general_regular_price));

      const cutoffDate = new Date(`${presale_cutoff_date}T23:59:59`);
      const isPresale = new Date() <= cutoffDate;

      const activeVip = isPresale ? parseFloat(vip_presale_price) : parseFloat(vip_regular_price);
      const activeGen = isPresale ? parseFloat(general_presale_price) : parseFloat(general_regular_price);

      db.prepare(`UPDATE zones SET price = ?, regular_price = ? WHERE id LIKE 'vip%'`).run(activeVip, parseFloat(vip_regular_price));
      db.prepare(`UPDATE zones SET price = ?, regular_price = ? WHERE id NOT LIKE 'vip%'`).run(activeGen, parseFloat(general_regular_price));
    });

    tx();

    res.json({ success: true, message: 'Precios y fecha de preventa guardados con éxito.' });
  } catch (e) {
    console.error('Error saving pricing:', e);
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

    const validRoles = ['admin', 'tickets', 'tickets_readonly', 'scanner', 'editor_autenticas', 'editor_sanados', 'editor_modelo', 'editor_move', 'editor_tienda'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Rol no válido.' });
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

// Update admin user
app.put('/api/admin/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, full_name, role } = req.body;
    if (!username || !full_name || !role) {
      return res.status(400).json({ success: false, message: 'Usuario, Nombre Completo y Rol son requeridos.' });
    }

    const validRoles = ['admin', 'tickets', 'tickets_readonly', 'scanner', 'editor_autenticas', 'editor_sanados', 'editor_modelo', 'editor_move', 'editor_tienda'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Rol no válido.' });
    }

    const existing = db.prepare('SELECT id FROM admin_users WHERE username = ? AND id != ?').get(username, id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'El nombre de usuario ya está tomado.' });
    }

    if (password && password.trim() !== '') {
      db.prepare('UPDATE admin_users SET username = ?, password_hash = ?, full_name = ?, role = ? WHERE id = ?')
        .run(username, password, full_name, role, id);
    } else {
      db.prepare('UPDATE admin_users SET username = ?, full_name = ?, role = ? WHERE id = ?')
        .run(username, full_name, role, id);
    }
    res.json({ success: true, message: 'Usuario actualizado con éxito.' });
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

// Get Activity Logs (Admin)
app.get('/api/admin/logs', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 500').all();
    res.json({ success: true, logs });
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

