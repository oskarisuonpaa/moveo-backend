const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./moveoapp.sqlite');

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
      product_code TEXT NOT NULL,
      product_start DATE,
      product_end DATE NOT NULL
    )
  `);
});

export default db;