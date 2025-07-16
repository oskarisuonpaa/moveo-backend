import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./moveoapp.sqlite');

// ADDED product_name_english TO PRODUCTS TABLE, REINITIALIZE DB IF NEEDED
// If you need to reinitialize the database, delete the moveoapp.sqlite file and it will be automatically recreated.
// TODO: replace with real data, automation?
const mockProducts = [
  {
    product_name: 'Moveo Kouvola',
    product_name_english: 'Moveo Kouvola membership',
    product_code: '30030-01',
    product_start: '2025-01-01',
    product_end: '2025-08-31',
  },
  {
    product_name: 'Moveo Lahti jäsenyys, muut korkeakouluopiskelijat',
    product_name_english:
      'MOVEO Lahti student membership, students from other universities',
    product_code: '30010-06',
    product_start: '2025-01-01',
    product_end: '2025-08-31',
  },
  {
    product_name: 'Moveo Lappeenranta kesäjäsenyys, LUT&LAB opiskelijat',
    product_name_english:
      'MOVEO Lappeenranta LUT&LAB students membership for the summer 2025',
    product_code: '30000-02',
    product_start: '2025-01-01',
    product_end: '2025-08-31',
  },
  {
    product_name: 'Moveo Lappeenranta jäsenyys, muut korkeakouluopiskelijat',
    product_name_english:
      'MOVEO Lappeenranta student membership , students from other universities',
    product_code: '30000-05',
    product_start: '2025-01-01',
    product_end: '2025-08-31',
  },
  {
    product_name: 'Moveo Lahti kesäjäsenyys',
    product_name_english: 'MOVEO Lahti student membership for the summer 2025',
    product_code: '30010-03',
    product_start: '2025-01-01',
    product_end: '2025-08-31',
  },
];
db.serialize(() => {
  // store user info used in the app
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_email TEXT UNIQUE NOT NULL,
    shop_email TEXT,
    firstname TEXT,
    lastname TEXT,
    role TEXT,
    product_name TEXT,
    product_code TEXT,
    study_location TEXT,
    membership_start DATE,
    membership_end DATE,
    verification_token TEXT,
    is_verified INTEGER DEFAULT 0
    )
  `);
  // for storing passkey public credential data
  db.run(`
    CREATE TABLE IF NOT EXISTS user_credentials (
    credential_id TEXT PRIMARY KEY,
    user_id INTEGER,
    public_key TEXT,
    sign_count INTEGER,
    transports TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
  `);
  // store data received from shop
  db.run(`
    CREATE TABLE IF NOT EXISTS purchases (
    purchase_id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_email TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    product_code TEXT NOT NULL,
    study_location TEXT NOT NULL,
    purchase_date DATE NOT NULL
    )
    `);
  // store product data
  // product_name: long name
  // product_code: SKU code
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      product_id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name TEXT NOT NULL,
      product_name_english TEXT,
      product_code TEXT NOT NULL,
      product_start DATE,
      product_end DATE NOT NULL
    )
  `);
  // store pending shop emails for verification
  db.run(`
  CREATE TABLE IF NOT EXISTS pending_shop_emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  shop_email TEXT NOT NULL,
  verification_token TEXT NOT NULL,
  created_at DATE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
  )
`);
  // add data to products table (only if empty)
  db.get(
    'SELECT COUNT(*) AS count FROM products',
    (err, row: { count: number }) => {
      if (!err && row.count === 0) {
        db.run('BEGIN TRANSACTION');
        mockProducts.forEach((product) => {
          db.run(
            `INSERT INTO products (product_name, product_name_english, product_code, product_start, product_end) VALUES (?, ?, ?, ?, ?)`,
            [
              product.product_name,
              product.product_name_english,
              product.product_code,
              product.product_start,
              product.product_end,
            ],
          );
        });
        db.run('COMMIT');
      }
    },
  );
});

export default db;
