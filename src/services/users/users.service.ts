import db from '../../db';
import type {User} from '../../types/user';
import type { RunResult } from 'sqlite3';

export function getUserByEmail(email: string): Promise<User | undefined> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE app_email = ?', [email], (err: Error | null, user: User | undefined) => {
      if (err) {
        console.error('Database error:', err);
        return reject('Database error.');
      }
      resolve(user);
    });
  });
};

export const createUser = (email: string, token: string) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO users (app_email, verification_token) VALUES (?, ?)', [email, token], (err: Error | null) => {
      if (err) {
        console.error('Error registering user:', err);
        return reject('Error registering user.');
      }
      resolve('User registered successfully.');
    });
  });
};

export const updateUserVerificationToken = (email: string, token: string | null) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET verification_token = ? WHERE app_email = ?', [token, email], (err: Error | null) => {
      if (err) {
        console.error('Error updating verification token:', err);
        return reject('Error updating verification token.');
      }
      resolve('Verification token updated successfully.');
    });
  });
};

export const verifyUser = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE verification_token = ?', [token], (err: Error | null, user: User | undefined) => {
      if (err) {
        console.error('Database error:', err);
        return reject('Database error.');
      }
      if (!user) {
        return reject('Invalid or expired token.');
      }

      db.run(
        'UPDATE users SET is_verified = 1, verification_token = NULL WHERE user_id = ?',
        [user.user_id],
        function (err: Error | null) {
          if (err) {
            console.error('Database error:', err);
            return reject('Database error.');
          }
          resolve('Email verified! You can now log in.');
        }
      );
    });
  });
}

// linking shop email to user
export const linkShopEmailToUser = (userId: number, shopEmail: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE users SET shop_email = ? WHERE user_id = ?', [shopEmail, userId], function (this: RunResult, err: Error | null) {
      if (err) {
        console.error('Error linking shop email:', err);
        return reject('Error linking shop email.');
      }
      if (this.changes === 0) {
        return reject('User not found or shop email already linked.');
      }
      resolve('Shop email linked successfully.');
    });
  });
}

export const getUserById = (userId: number): Promise<User | undefined> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE user_id = ?', [userId], (err: Error | null, user: User | undefined) => {
      if (err) {
        console.error('Database error:', err);
        return reject('Database error.');
      }
      resolve(user);
    });
  });
};

export const getUserByVerificationToken = (token: string): Promise<User | undefined> => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE verification_token = ?', [token], (err: Error | null, user: User | undefined) => {
      if (err) {
        console.error('Database error:', err);
        return reject('Database error.');
      }
      resolve(user);
    });
  });
};