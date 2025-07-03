import { Request, Response, RequestHandler } from 'express'
import * as wpHash from 'wordpress-hash-node'
import jwt from 'jsonwebtoken'
import { findUserByEmail, updateUserPassword } from '../mocks/mockDB'

// Registration that assumes the users email already exists in the mockDB
export const registerUser: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { email, password } = req.body

    // Simulation
    const user = findUserByEmail(email)

    // Return error if no user was found
    if (!user) {
      res.status(404).json({ error: 'User with this email was not found' })
      return
    }

    const alreadyHasPassword =
      user.user_pass && user.user_pass !== '' && user.user_pass !== 'pending'

    // Return error if user has already registered before
    if (alreadyHasPassword) {
      res.status(400).json({ error: 'User already registered. Please log in instead.' })
      return
    }

    const hashedPassword = wpHash.HashPassword(password)

    // Simulation
    updateUserPassword(email, hashedPassword)

    // If valid registration, generate JWT token
    const token = jwt.sign(
      { id: user.ID, 
        email: user.user_email, 
        role: 'student' },
      process.env.JWT_SECRET || 'mockSecret',
      { expiresIn: '1h' }
    )

    // Respond with success
    res.json({ message: 'Registration successful (mock)', token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error (mock)' })
  }
}