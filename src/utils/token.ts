import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'very-secret-key';

/**
 * Generates a JWT token for email verification
 * @param {string} email - The user's email to embed in the token
 * @param {string | number} expiresIn - Expiry time (e.g. '1h', '10m')
 * @returns {string} - JWT token
 */
export function generateEmailVerificationToken(email: string) {
  const payload = { email };
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}
