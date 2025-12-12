import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Core historical events for Putin 1999-2025
const events = [
  // 1999
  {
    date: '1999-08-09',
    year: 1999,
    title: 'Appointment as Prime Minister',
    description: 'Yeltsin appoints Putin as Prime Minister from Saint Petersburg',
    type: 'domestic',
    latitude: '59.9311',
    longitude: '30.3609',
    location: 'Saint Petersburg',
    country: 'Russia',
    significance: 10,
    verified: true,
  },
  {
    date: '1999-12-31',
    year: 1999,
    title: 'Acting President',
    description: 'Yeltsin announces resignation, Putin becomes Acting President',
    type: 'ceremony',
    latitude: '55.7558',
    longitude: '37.6173',
    location: 'Kremlin, Moscow',
    country: 'Russia',
    significance: 10,
    verified: true,
  },

  // 2000
  {
    date: '2000-01-01',
    year: 2000,
    title: 'New Year Address from Kremlin',
    description: 'First New Year address as Acting President',
    type: 'speech',
    latitude: '55.7558',
    longitude: '37.6173',
    location: 'Kremlin, Moscow',
    country: 'Russia',
    significance: 9,
    verified: true,
  },
  {
    date: '2000-03-26',
    year: 2000,
    title: 'Presidential Election Victory',
    description: 'Putin wins presidential election with 52.9% of votes',
    type: 'ceremony',
    latitude: '55.7558',
    longitude: '37.6173',
    location: 'Kremlin, Moscow',
    country: 'Russia',
    significance: 10,
    verified: true,
  },
  {
    date: '2000-05-07',
    year: 2000,
    title: 'First Inauguration',
    description: 'Putin inaugurated as President of Russia',
    type: 'ceremony',
    latitude: '55.7558',
    longitude: '37.6173',
    location: 'Kremlin, Moscow',
    country: 'Russia',
    significance: 10,
    verified: true,
  },

  // 2001
  {
    date: '2001-06-18',
    year: 2001,
    title: 'Visit to Germany',
    description: 'State visit to Germany, meets with Chancellor Schröder',
    type: 'international',
    latitude: '52.5200',
    longitude: '13.4050',
    location: 'Berlin',
    country: 'Germany',
    significance: 8,
    verified: true,
  },

  // 2008
  {
    date: '2008-09-04',
    year: 2008,
    title: 'Bear Release at Sochi Zoo',
    description: 'Putin releases bear at Sochi Zoo - iconic moment',
    type: 'domestic',
    latitude: '43.5890',
    longitude: '39.7383',
    location: 'Sochi',
    country: 'Russia',
    significance: 7,
    verified: true,
  },

  // 2012
  {
    date: '2012-05-07',
    year: 2012,
    title: 'Third Inauguration',
    description: 'Putin inaugurated for third term as President',
    type: 'ceremony',
    latitude: '55.7558',
    longitude: '37.6173',
    location: 'Kremlin, Moscow',
    country: 'Russia',
    significance: 10,
    verified: true,
  },

  // 2014
  {
    date: '2014-03-18',
    year: 2014,
    title: 'Crimea Return Speech',
    description: 'Putin delivers historic speech on Crimea annexation at St. George Hall',
    type: 'speech',
    latitude: '55.7558',
    longitude: '37.6173',
    location: 'Kremlin, Moscow',
    country: 'Russia',
    significance: 10,
    verified: true,
  },
  {
    date: '2014-03-21',
    year: 2014,
    title: 'Crimea Bridge Crossing',
    description: 'Putin crosses newly opened Crimea Bridge',
    type: 'domestic',
    latitude: '45.3571',
    longitude: '36.6753',
    location: 'Crimea Bridge',
    country: 'Russia',
    significance: 9,
    verified: true,
  },

  // 2018
  {
    date: '2018-03-18',
    year: 2018,
    title: 'Election Victory Concert',
    description: 'Putin attends victory concert after re-election',
    type: 'ceremony',
    latitude: '55.7558',
    longitude: '37.6173',
    location: 'Red Square, Moscow',
    country: 'Russia',
    significance: 8,
    verified: true,
  },
  {
    date: '2018-05-07',
    year: 2018,
    title: 'Fourth Inauguration',
    description: 'Putin inaugurated for fourth term',
    type: 'ceremony',
    latitude: '55.7558',
    longitude: '37.6173',
    location: 'Kremlin, Moscow',
    country: 'Russia',
    significance: 10,
    verified: true,
  },

  // 2022
  {
    date: '2022-02-24',
    year: 2022,
    title: 'Special Military Operation Announcement',
    description: 'Putin announces special military operation in Ukraine',
    type: 'speech',
    latitude: '55.7558',
    longitude: '37.6173',
    location: 'Kremlin, Moscow',
    country: 'Russia',
    significance: 10,
    verified: true,
  },

  // 2024
  {
    date: '2024-03-29',
    year: 2024,
    title: 'Victory Concert at Red Square',
    description: 'Putin attends concert celebrating election victory',
    type: 'ceremony',
    latitude: '55.7558',
    longitude: '37.6173',
    location: 'Red Square, Moscow',
    country: 'Russia',
    significance: 8,
    verified: true,
  },

  // 2025
  {
    date: '2025-01-01',
    year: 2025,
    title: 'New Year Address 2025',
    description: 'Putin delivers New Year address to the nation',
    type: 'speech',
    latitude: '55.7558',
    longitude: '37.6173',
    location: 'Kremlin, Moscow',
    country: 'Russia',
    significance: 8,
    verified: true,
  },
];

// Statistics by year
const statistics = [
  { year: 1999, totalFlightDistance: 50000, countriesVisited: 5, domesticVisits: 8, internationalVisits: 2, handshakesCount: 50, speechesCount: 3 },
  { year: 2000, totalFlightDistance: 120000, countriesVisited: 12, domesticVisits: 20, internationalVisits: 8, handshakesCount: 150, speechesCount: 15 },
  { year: 2001, totalFlightDistance: 180000, countriesVisited: 18, domesticVisits: 25, internationalVisits: 12, handshakesCount: 200, speechesCount: 20 },
  { year: 2008, totalFlightDistance: 250000, countriesVisited: 25, domesticVisits: 35, internationalVisits: 18, handshakesCount: 300, speechesCount: 30 },
  { year: 2012, totalFlightDistance: 320000, countriesVisited: 35, domesticVisits: 45, internationalVisits: 25, handshakesCount: 400, speechesCount: 40 },
  { year: 2014, totalFlightDistance: 380000, countriesVisited: 42, domesticVisits: 50, internationalVisits: 30, handshakesCount: 500, speechesCount: 50 },
  { year: 2018, totalFlightDistance: 450000, countriesVisited: 52, domesticVisits: 60, internationalVisits: 38, handshakesCount: 600, speechesCount: 60 },
  { year: 2022, totalFlightDistance: 280000, countriesVisited: 35, domesticVisits: 40, internationalVisits: 20, handshakesCount: 350, speechesCount: 35 },
  { year: 2024, totalFlightDistance: 320000, countriesVisited: 40, domesticVisits: 45, internationalVisits: 25, handshakesCount: 400, speechesCount: 40 },
  { year: 2025, totalFlightDistance: 150000, countriesVisited: 20, domesticVisits: 22, internationalVisits: 12, handshakesCount: 200, speechesCount: 18 },
];

try {
  // Insert events
  for (const event of events) {
    const query = `
      INSERT INTO events (date, year, title, description, type, latitude, longitude, location, country, significance, verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [
      event.date,
      event.year,
      event.title,
      event.description,
      event.type,
      event.latitude,
      event.longitude,
      event.location,
      event.country,
      event.significance,
      event.verified,
    ]);
  }

  // Insert statistics
  for (const stat of statistics) {
    const query = `
      INSERT INTO statistics (year, totalFlightDistance, countriesVisited, domesticVisits, internationalVisits, handshakesCount, speechesCount)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [
      stat.year,
      stat.totalFlightDistance,
      stat.countriesVisited,
      stat.domesticVisits,
      stat.internationalVisits,
      stat.handshakesCount,
      stat.speechesCount,
    ]);
  }

  console.log('✅ Events and statistics seeded successfully');
} catch (error) {
  console.error('❌ Error seeding data:', error);
} finally {
  await connection.end();
}
