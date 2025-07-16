import db from '../../db';
import type { User } from '../../types/user';
import type { RunResult } from 'sqlite3';

export function getUserByEmail(email: string): Promise<User | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE app_email = ?',
      [email],
      (err: Error | null, user: User | undefined) => {
        if (err) {
          console.error('Database error:', err);
          return reject(new Error('Database error.'));
        }
        resolve(user);
      },
    );
  });
}

export const createUser = (email: string, token: string) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (app_email, verification_token) VALUES (?, ?)',
      [email, token],
      (err: Error | null) => {
        if (err) {
          console.error('Error registering user:', err);
          return reject(new Error('Error registering user.'));
        }
        resolve('User registered successfully.');
      },
    );
  });
};

export const updateUserVerificationToken = (
  email: string,
  token: string | null,
) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET verification_token = ? WHERE app_email = ?',
      [token, email],
      (err: Error | null) => {
        if (err) {
          console.error('Error updating verification token:', err);
          return reject(new Error('Error updating verification token.'));
        }
        resolve('Verification token updated successfully.');
      },
    );
  });
};

export const verifyUser = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE verification_token = ?',
      [token],
      (err: Error | null, user: User | undefined) => {
        if (err) {
          console.error('Database error:', err);
          return reject(new Error('Database error.'));
        }
        if (!user) {
          return reject(new Error('Invalid or expired token.'));
        }

        db.run(
          'UPDATE users SET is_verified = 1, verification_token = NULL WHERE user_id = ?',
          [user.user_id],
          function (err: Error | null) {
            if (err) {
              console.error('Database error:', err);
              return reject(new Error('Database error.'));
            }
            resolve('Email verified! You can now log in.');
          },
        );
      },
    );
  });
};

// linking shop email to user
export const linkShopEmailToUser = (
  userId: number,
  shopEmail: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET shop_email = ? WHERE user_id = ?',
      [shopEmail, userId],
      function (this: RunResult, err: Error | null) {
        if (err) {
          console.error('Error linking shop email:', err);
          return reject(new Error('Error linking shop email.'));
        }
        if (this.changes === 0) {
          return reject(
            new Error('User not found or shop email already linked.'),
          );
        }
        resolve('Shop email linked successfully.');
      },
    );
  });
};

export const updateUserInfoFromPurchase = (
  userId: number,
  purchaseData: {
    firstname: string;
    lastname: string;
    product_code: string;
    study_location: string;
    membership_start: string;
    membership_end: string;
    product_name: string;
  },
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET firstname = ?, lastname = ?, product_code = ?, study_location = ?, membership_start = ?, membership_end = ?, product_name = ? WHERE user_id = ?',
      [
        purchaseData.firstname,
        purchaseData.lastname,
        purchaseData.product_code,
        purchaseData.study_location,
        purchaseData.membership_start,
        purchaseData.membership_end,
        purchaseData.product_name,
        userId,
      ],
      function (err: Error | null) {
        if (err) {
          console.error('Error updating user info:', err);
          return reject(new Error('Error updating user info.'));
        }
        resolve();
      },
    );
  });
};

export const getUserById = (userId: number): Promise<User | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE user_id = ?',
      [userId],
      (err: Error | null, user: User | undefined) => {
        if (err) {
          console.error('Database error:', err);
          return reject(new Error('Database error.'));
        }
        resolve(user);
      },
    );
  });
};

export const getUserByVerificationToken = (
  token: string,
): Promise<User | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE verification_token = ?',
      [token],
      (err: Error | null, user: User | undefined) => {
        if (err) {
          console.error('Database error:', err);
          return reject(new Error('Database error.'));
        }
        resolve(user);
      },
    );
  });
};
