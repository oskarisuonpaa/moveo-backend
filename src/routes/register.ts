import express from 'express'
import { registerUser } from '../controllers/register.controller'

const router = express.Router()

// Delegate POST request to the controller
router.post('/', registerUser)

export default router
