import { Router } from 'express';
import { verifyUser } from '../services/users/users.service';
import {
  registerVerification,
  shopEmailToUserLink,
  shopEmailToUserVerification,
} from '@controllers/verification.controller';

const router = Router();

// Endpoint to register a user and send verification email
// (this may not be needed if auth is done with google)
router.get('/register', registerVerification);

// Endpoint to verify user email
// (same with this one)
router.get('/verify', (req, res) => {
  const { token } = req.query;
  verifyUser(token as string)
    .then((message) => res.send(message))
    .catch((error) => res.status(400).send(error));
});

// linking shop email to user
// TODO: add validation for shop email format
// TODO: checking token for expiration
router.post('/link-shop-email', shopEmailToUserLink);

// Endpoint to verify shop email and link it to the user
router.post('/verify-shop-email', shopEmailToUserVerification);

export default router;
