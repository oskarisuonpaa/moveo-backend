import express from 'express';
import { loginUser } from '../controllers/login.controller';

const router = express.Router();

// Delegate POST request to the controller
router.post('/', loginUser);

export default router;
