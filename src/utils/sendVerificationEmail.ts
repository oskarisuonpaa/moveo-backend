import nodemailer from 'nodemailer';
import config from '@config';

/**
 * Sends a verification email to the user.
 * @param email - The email address of the user.
 * @param token - The verification token.
 * @param url - The base URL for the verification link.
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  url: string,
) {
  const transporter = nodemailer.createTransport({
    // configure email provider
    // TODO: replace with actual email provider configuration
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: config.moveoEmail,
      pass: config.moveoEmailPassword,
    },
  });

  const verificationUrl = `${url}?token=${token}`;

  await transporter.sendMail({
    from: '"MoveoApp" <' + config.moveoEmail + '>',
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  });
}
