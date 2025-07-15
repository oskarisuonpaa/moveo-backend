require('dotenv').config();
const jwt = require('jsonwebtoken');

// You should keep your secret in an environment variable!
const SECRET = process.env.JWT_SECRET; 

/**
 * Generates a JWT token for email verification
 * @param {string} email - The user's email to embed in the token
 * @param {number} expiresIn - Expiry time (e.g. '1h', '10m')
 * @returns {string} - JWT token
 */
export function generateEmailVerificationToken(email : string, expiresIn = '1h') {
  const payload = { email };
  return jwt.sign(payload, SECRET, { expiresIn });
}
