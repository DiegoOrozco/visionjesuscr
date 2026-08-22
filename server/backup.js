const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'data');
const backupsDir = path.join(dbDir, 'backups');

// Ensure backups directory exists
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'event_ticketing.db');

if (!fs.existsSync(dbPath)) {
  console.error(`Error: Base de datos no encontrada en ${dbPath}`);
  process.exit(1);
}

// Generate timestamped filename
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');
const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
const backupPath = path.join(backupsDir, `event_ticketing_backup_${timestamp}.db`);

console.log(`Iniciando copia de seguridad de la base de datos...`);
console.log(`Origen: ${dbPath}`);
console.log(`Destino: ${backupPath}`);

const db = new Database(dbPath);

db.backup(backupPath)
  .then(() => {
    console.log('¡Copia de seguridad completada con éxito!');
    
    // Cleanup old backups (keep only last 15 days)
    cleanupOldBackups(backupsDir, 15);
    
    db.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error al realizar la copia de seguridad:', err);
    db.close();
    process.exit(1);
  });

function cleanupOldBackups(dir, daysToKeep) {
  try {
    const files = fs.readdirSync(dir);
    const nowMs = Date.now();
    const maxAgeMs = daysToKeep * 24 * 60 * 60 * 1000;

    files.forEach(file => {
      if (file.startsWith('event_ticketing_backup_') && file.endsWith('.db')) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const ageMs = nowMs - stats.mtimeMs;

        if (ageMs > maxAgeMs) {
          fs.unlinkSync(filePath);
          console.log(`Eliminado respaldo antiguo por antigüedad: ${file}`);
        }
      }
    });
  } catch (error) {
    console.error('Error al limpiar copias de seguridad antiguas:', error);
  }
}
