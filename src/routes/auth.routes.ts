import { Router } from 'express';
import {
  redirectToGoogle,
  handleGoogleCallback,
} from '../controllers/auth.controller';
import { generateEmailVerificationToken } from '../utils/token';
import { sendVerificationEmail } from '../utils/sendVerificationEmail';
import { getUserByEmail, createUser, verifyUser, updateUserVerificationToken } from '../services/users/users.service';

const router = Router();

router.get('/google', redirectToGoogle);
router.get('/google/callback', handleGoogleCallback);


router.get('/register', (req, res) => {

  const token = generateEmailVerificationToken(req.query.email as string);

  // check whether user already exists
  getUserByEmail(req.query.email as string).then((user) => {
    if (user) {
      if (user.is_verified) {
        // User already exists and is verified
        return res.status(400).send('User already exists and is verified.');
      } else {
        // User exists but not verified, update token and resend email
        updateUserVerificationToken(req.query.email as string, token)
          .then(() => sendVerificationEmail(req.query.email as string, token))
          .then(() => res.status(200).send('Verification email re-sent.'))
          .catch((error) => {
            console.error('Error sending verification email:', error);
            res.status(500).send('Error sending verification email.');
          });
        return;
      }
    }

    // User does not exist, create and send verification email
    createUser(req.query.email as string, token)
      .then(() => sendVerificationEmail(req.query.email as string, token))
      .then(() => res.status(200).send('Verification email sent.'))
      .catch((error) => {
        console.error('Error sending verification email:', error);
        res.status(500).send('Error sending verification email.');
      });
  });
});


router.get('/verify', (req, res) => {
  const { token } = req.query;
  verifyUser(token as string)
    .then((message) => res.send(message))
    .catch((error) => res.status(400).send(error));
});

export default router;
