import db from '../../db';
import type {User} from '../../types/user';

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

export const updateUserVerificationToken = (email: string, token: string) => {
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