import db from '../../db';

export const getPendingShopEmailByUserId = (
  userId: number,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM pending_shop_emails WHERE user_id = ?',
      [userId],
      (err: Error | null, email: string) => {
        if (err) {
          console.error('Database error:', err);
          return reject(new Error('Database error.'));
        }
        resolve(email);
      },
    );
  });
};

export const addPendingShopEmail = (
  userId: number,
  shopEmail: string,
  verificationToken: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO pending_shop_emails (user_id, shop_email, verification_token) VALUES (?, ?, ?)',
      [userId, shopEmail, verificationToken],
      function (err: Error | null) {
        if (err) {
          console.error('Error adding pending shop email:', err);
          return reject(new Error('Error adding pending shop email.'));
        }
        resolve();
      },
    );
  });
};

export const removePendingShopEmail = (userId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM pending_shop_emails WHERE user_id = ?',
      [userId],
      function (err: Error | null) {
        if (err) {
          console.error('Error removing pending shop email:', err);
          return reject(new Error('Error removing pending shop email.'));
        }
        resolve();
      },
    );
  });
};
