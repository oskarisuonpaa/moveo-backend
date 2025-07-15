import { Router } from 'express';
import { generateEmailVerificationToken } from '../utils/token';
import { sendVerificationEmail } from '../utils/sendVerificationEmail';
import { getUserByEmail, createUser, verifyUser, updateUserVerificationToken, linkShopEmailToUser, getUserById, getUserByVerificationToken } from '../services/users/users.service';
import { addPendingShopEmail, getPendingShopEmailByUserId, removePendingShopEmail } from '../services/shop/pendingShopEmails.service';

const router = Router();
const verificationUrl = 'http://localhost:3001/verification';
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
                    .then(() => sendVerificationEmail(req.query.email as string, token, `${verificationUrl}/verify`))
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
            .then(() => sendVerificationEmail(req.query.email as string, token, `${verificationUrl}/verify`))
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

// linking shop email to user
// TODO: add validation for shop email format
// TODO: checking token for expiration
router.post('/link-shop-email', (req, res) => {
    const userId = req.body.userId;
    const shopEmail = req.body.shopEmail;

    getUserById(userId).then((user) => {
        if (!user) return res.status(404).send('User not found.');

        if (shopEmail === user.app_email && user.is_verified) {
            // Directly link if emails match and user is verified
            linkShopEmailToUser(userId, shopEmail)
                .then(() => res.status(200).send('Shop email linked successfully.'))
                .catch((error) => {
                    console.error('Error linking shop email:', error);
                    res.status(500).send('Error linking shop email.');
                });
        } else {
            // Generate token and send verification email to shopEmail
            const token = generateEmailVerificationToken(shopEmail);
            addPendingShopEmail(userId, shopEmail, token)
                .then(() => {
                    updateUserVerificationToken(user.app_email, token)
                        .then(() => sendVerificationEmail(shopEmail, token, `${verificationUrl}/verify-shop-email`))
                        .then(() => res.status(200).send('Verification email sent to shop email.'))
                        .catch((error) => {
                            console.error('Error sending verification email:', error);
                            res.status(500).send('Error sending verification email.');
                        });
                });
        }
    })
});

// Endpoint to verify shop email and link it to the user
router.get('/verify-shop-email', (req, res) => {
    const token = req.query.token as string;
    getUserByVerificationToken(token).then((user) => {
        if (!user) return res.status(400).send('Invalid or expired token.');

        // Link shop email after verification
        getPendingShopEmailByUserId(user.user_id)
            .then((pendingEmail) => {
                if (!pendingEmail) {
                    return res.status(400).send('No pending shop email found for this user.');
                }

                linkShopEmailToUser(user.user_id, pendingEmail)
                    .then(() => {
                        // clear the token
                        updateUserVerificationToken(user.app_email, null);
                        // remove pending shop email
                        removePendingShopEmail(user.user_id)
                        return res.status(200).send('Shop email verified and linked.');
                    })
                    .catch((error) => {
                        console.error('Error linking shop email:', error);
                        res.status(500).send('Error linking shop email.');
                    });
            });
    });
});

export default router;