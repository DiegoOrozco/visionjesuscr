const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'event_ticketing.db');
const db = new Database(dbPath);

console.log('Migrating /nosotros sections...');

const insertSection = db.prepare('INSERT OR REPLACE INTO page_sections (id, type, sequence_order, content, styles, page_path) VALUES (?, ?, ?, ?, ?, ?)');

// 1. Hero
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

// 2. Grid
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

// 3. Sede
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

// 4. Pastores
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

console.log('Migration complete.');
db.close();
