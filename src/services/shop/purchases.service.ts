import db from '../../db';

// handles purchases table

// get all purchases based on email
export const getPurchasesByEmail = (shopEmail: string) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM purchases WHERE shop_email = ?',
      [shopEmail],
      (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return reject(new Error('Database error.'));
        }
        resolve(rows);
      },
    );
  });
};

// gets the latest purchase based on email
export const getLatestPurchaseByEmail = (shopEmail: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM purchases WHERE shop_email = ? ORDER BY purchase_date DESC LIMIT 1',
      [shopEmail],
      (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return reject(new Error('Database error.'));
        }
        resolve(row);
      },
    );
  });
};


// adds a new purchase
export const addPurchase = (
  shopEmail: string,
  productId: number,
  purchaseDate: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO purchases (shop_email, product_id, purchase_date) VALUES (?, ?, ?)',
      [shopEmail, productId, purchaseDate],
      function (err: Error | null) {
        if (err) {
          console.error('Error adding purchase:', err);
          return reject(new Error('Error adding purchase.'));
        }
        resolve();
      },
    );
  });
};

// gets a purchase by its ID
export const getPurchaseById = (purchaseId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM purchases WHERE purchase_id = ?',
      [purchaseId],
      (err: Error | null, purchase: any) => {
        if (err) {
          console.error('Database error:', err);
          return reject(new Error('Database error.'));
        }
        resolve(purchase);
      },
    );
  });
};


// gets all purchases for a specific product code
export const getPurchasesByProductCode = (
  productCode: string,
) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM purchases WHERE product_code = ?',
      [productCode],
      (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return reject(new Error('Database error.'));
        }
        resolve(rows);
      },
    );
  });
};

// deletes a purchase by its ID, probably not needed if we want to keep a record of all purchases
export const deletePurchase = (purchaseId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM purchases WHERE purchase_id = ?',
      [purchaseId],
      function (err: Error | null) {
        if (err) {
          console.error('Error deleting purchase:', err);
          return reject(new Error('Error deleting purchase.'));
        }
        resolve();
      },
    );
  });
};

// updates a purchase by its id, not sure this is needed if we want to keep a record of all purchases
export const updatePurchase = (
  purchaseId: number,
  shopEmail: string,
  productId: number,
  purchaseDate: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE purchases SET shop_email = ?, product_id = ?, purchase_date = ? WHERE purchase_id = ?',
      [shopEmail, productId, purchaseDate, purchaseId],
      function (err: Error | null) {
        if (err) {
          console.error('Error updating purchase:', err);
          return reject(new Error('Error updating purchase.'));
        }
        resolve();
      },
    );
  });
};

// gets a list of all purchases
// this could be used for admin purposes to see all purchases made
export const getAllPurchases = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM purchases', (err: Error | null, rows: any[]) => {
      if (err) {
        console.error('Database error:', err);
        return reject(new Error('Database error.'));
      }
      resolve(rows);
    });
  });
};

// gets purchases made within a specific date range
// this could be used for reporting purposes
export const getPurchasesByDateRange = (
  startDate: string,
  endDate: string,
): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM purchases WHERE purchase_date BETWEEN ? AND ?',
      [startDate, endDate],
      (err: Error | null, rows: any[]) => {
        if (err) {
          console.error('Database error:', err);
          return reject(new Error('Database error.'));
        }
        resolve(rows);
      },
    );
  });
};