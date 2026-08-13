const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');

const testDbPath = path.join(__dirname, 'data', 'test_ticketing.db');
const PORT = 3500;
const BASE_URL = `http://localhost:${PORT}`;

// Clean up previous test DB if any
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

console.log('🚀 Iniciando servidor backend de pruebas (Railway QA)...');

const serverProcess = fork(path.join(__dirname, 'index.js'), {
  env: {
    ...process.env,
    NODE_ENV: 'test',
    PORT: PORT.toString(),
    RESEND_API_KEY: 're_mock_test_key' // bypass API call checking
  }
});

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    testsPassed++;
    console.log(`✅ [PASS] ${message}`);
  } else {
    testsFailed++;
    console.error(`❌ [FAIL] ${message}`);
  }
}

// Wait for server to boot
setTimeout(async () => {
  try {
    console.log('\n🧠 Iniciando conjunto de pruebas de integración de QA...\n');

    // Test 1: Get Zones
    const zonesRes = await fetch(`${BASE_URL}/api/zones`);
    const zonesData = await zonesRes.json();
    assert(zonesRes.ok && zonesData.zones.length > 0, 'Prueba 1: Endopoint /api/zones devuelve las zonas y precios correctamente.');
    const targetZone = zonesData.zones[0];

    // Test 2: Hold Seats
    const holdRes = await fetch(`${BASE_URL}/api/seats/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seat_codes: ['PRE-001', 'PRE-002'],
        session_id: 'test-session-123',
        zone_id: targetZone.id
      })
    });
    const holdData = await holdRes.json();
    assert(holdRes.ok && holdData.success, 'Prueba 2: Bloqueo temporal de asientos exitoso.');

    // Test 2b: Concurrency Hold Seats (Multisolicitud)
    // Both sessions attempt to hold 'PRE-003' at the exact same time
    const [holdA, holdB] = await Promise.all([
      fetch(`${BASE_URL}/api/seats/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seat_codes: ['PRE-003'], session_id: 'session-A', zone_id: targetZone.id })
      }).then(r => r.json()),
      fetch(`${BASE_URL}/api/seats/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seat_codes: ['PRE-003'], session_id: 'session-B', zone_id: targetZone.id })
      }).then(r => r.json())
    ]);

    const onlyOneSucceeded = (holdA.success && !holdB.success && holdB.code === 'SEATS_TAKEN') || 
                             (!holdA.success && holdA.code === 'SEATS_TAKEN' && holdB.success);
    assert(onlyOneSucceeded, 'Prueba 2b (Multisolicitud): Un asiento no puede ser reservado por dos usuarios simultáneamente.');

    // Test 2c: Rejection of invalid phone format (letters or wrong length)
    const badPhoneRes = await fetch(`${BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        purchaser_name: 'QA Test Bad Phone',
        purchaser_email: 'bad-phone@test.com',
        purchaser_phone: '8888-9999', // contains symbol (-)
        zone_id: targetZone.id,
        quantity: 1,
        session_id: 'test-session-123',
        attendees: [
          { full_name: 'Persona Bad Phone', age: 25, phone: '8888AA88', assigned_ticket_code: 'PRE-001' } // contains letters
        ]
      })
    });
    const badPhoneData = await badPhoneRes.json();
    assert(badPhoneRes.status === 400 && !badPhoneData.success, 'Prueba 2c: Bloqueo de números de teléfono con formatos inválidos (deben ser 8 dígitos numéricos).');

    // Test 3: Create Reservation
    const reserveRes = await fetch(`${BASE_URL}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        purchaser_name: 'Usuario QA Test',
        purchaser_email: 'test-qa@visionjesuscr.com',
        purchaser_phone: '88888888', // 8 digits
        zone_id: targetZone.id,
        quantity: 2,
        session_id: 'test-session-123',
        comprobante_url: '/uploads/comprobantes/test-comprobante.jpg',
        attendees: [
          { full_name: 'Persona QA 1', age: 25, phone: '77777777', assigned_ticket_code: 'PRE-001' }, // 8 digits
          { full_name: 'Persona QA 2', age: 30, phone: '66666666', assigned_ticket_code: 'PRE-002' }  // 8 digits
        ]
      })
    });
    const reserveData = await reserveRes.json();
    assert(reserveRes.ok && reserveData.success && reserveData.reservation, 'Prueba 3: Creación de reservación en base de datos completada.');
    const reservation = reserveData.reservation;

    // Test 4: View Reservations (Admin)
    const adminRes = await fetch(`${BASE_URL}/api/admin/reservations`);
    const adminData = await adminRes.json();
    assert(adminRes.ok && adminData.reservations.length > 0, 'Prueba 4: Recuperación de reservación por el módulo de administración.');

    // Test 5: Scan Ticket - Pending state (should fail)
    const scanPendingRes = await fetch(`${BASE_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_hash: reservation.qr_code_hash, scanned_by: 'QA Scanner' })
    });
    const scanPendingData = await scanPendingRes.json();
    assert(scanPendingRes.status === 400 && scanPendingData.code === 'PENDING_APPROVAL', 'Prueba 5: Escaneo denegado para boleto pendiente de aprobación de pago.');

    // Test 6: Approve Reservation
    const approveRes = await fetch(`${BASE_URL}/api/admin/reservations/${reservation.id}/status`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Admin-User': 'Dayanna_reservas'
      },
      body: JSON.stringify({ status: 'aprobado' })
    });
    const approveData = await approveRes.json();
    assert(approveRes.ok && approveData.success, 'Prueba 6: Aprobación de pago de reservación exitosa.');

    // Test 7: Scan Ticket - Approved state (should succeed)
    const scanOkRes = await fetch(`${BASE_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_hash: reservation.qr_code_hash, scanned_by: 'Stephanie_scanner' })
    });
    const scanOkData = await scanOkRes.json();
    assert(scanOkRes.ok && scanOkData.success && scanOkData.code === 'APPROVED_PASS', 'Prueba 7: Escaneo y acceso permitido para boleto aprobado.');

    // Test 8: Scan Ticket - Re-entry (should warn already used)
    const scanUsedRes = await fetch(`${BASE_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_hash: reservation.qr_code_hash, scanned_by: 'Evelyn_scanner' })
    });
    const scanUsedData = await scanUsedRes.json();
    assert(scanUsedRes.ok && scanUsedData.code === 'ALREADY_USED', 'Prueba 8: Detección y bloqueo de intento de reingreso (boleto ya usado).');

    // Test 9: Verify Activity logs
    const logsRes = await fetch(`${BASE_URL}/api/admin/logs`);
    const logsData = await logsRes.json();
    assert(
      logsRes.ok && 
      logsData.logs.some(l => l.action === 'crear_reserva') &&
      logsData.logs.some(l => l.action === 'aprobar_reserva') &&
      logsData.logs.some(l => l.action === 'escanear_boleto') &&
      logsData.logs.some(l => l.action === 'intento_reingreso'),
      'Prueba 9: Verificación de bitácora de actividad (logs de auditoría registrados de forma correcta).'
    );

    console.log('\n📊 Resumen de Resultados QA:');
    console.log(`   - Pasadas: ${testsPassed}`);
    console.log(`   - Fallidas: ${testsFailed}\n`);

  } catch (err) {
    console.error('Error durante la ejecución de QA tests:', err);
    testsFailed++;
  } finally {
    // Kill the test server process
    serverProcess.kill();

    // Clean up test DB
    setTimeout(() => {
      if (fs.existsSync(testDbPath)) {
        try {
          fs.unlinkSync(testDbPath);
        } catch (e) {}
      }
      process.exit(testsFailed > 0 ? 1 : 0);
    }, 1000);
  }
}, 2000);
