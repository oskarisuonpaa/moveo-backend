import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import * as wpHash from 'wordpress-hash-node'
import { findUserByEmail } from '../mocks/mockDB'

export const loginUser: RequestHandler = async (req, res) => {
  const { email, password } = req.body

  // Simulation
  const user = findUserByEmail(email)

  // Return error if credentials are invalid
  if (!user || !wpHash.CheckPassword(password, user.user_pass)) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  // If valid login, generate JWT token
  const token = jwt.sign(
    {
      id: user.ID,
      email: user.user_email,
      role: 'student',
    },
    process.env.JWT_SECRET || 'mockSecret',
    { expiresIn: '1h' }
  )

  res.json({ token })
}