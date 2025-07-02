import express from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../db/mysql'
import wpHash from 'wordpress-hash-node'

// WordPress password hasher
const hasher = new wpHash()

const router = express.Router()

// POST /api/login login endpoint
router.post('/', async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body

  try {
    // Query the WP users table for a matching email
    const [rows] = await db.query(
      'SELECT ID, user_login, user_email, user_pass FROM wp_users WHERE user_email = ?',
      [email]
    )

    // Get the first matching user
    const user: any = (rows as any[])[0]

    // If no user found or password doesnt match (WP hash check)
    if (!user || !hasher.CheckPassword(password, user.user_pass)) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate a JWT token with the user's ID, email and role
    const token = jwt.sign(
      { 
        id: user.ID, 
        email: user.user_email, 
        role: 'student' // Replaceable
      }, 
      process.env.JWT_SECRET || '', // Secret key from .env file
      { expiresIn: '1h' } // Token expires in 1 hour
    )

    // Return the token as a reponse
    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router