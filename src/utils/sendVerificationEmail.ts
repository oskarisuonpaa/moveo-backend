import nodemailer from 'nodemailer';
import config from '@config';
import AppError from '@utils/errors';

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
    host: config.moveoEmailHost,
    port: 2525,
    auth: {
      user: config.moveoEmail,
      pass: config.moveoEmailPassword,
    },
  });

  const verificationUrl = `${url}?token=${token}`;

  // probably not worth setting up i18n for just the email
  const lang = 'en'; // TODO: change once saving user settings server-side is implemented

  const subjects = {
    en: 'Verify your email',
    fi: 'Vahvista sähköpostisi',
  };

  const bodies = {
    en: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
    fi: `<p>Klikkaa <a href="${verificationUrl}">tästä</a> vahvistaaksesi sähköpostisi.</p>`,
  };

  try {
    await transporter.sendMail({
      from: '"MoveoApp" <' + config.moveoEmail + '>',
      to: email,
      subject: subjects[lang],
      html: bodies[lang],
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw AppError.internal(
      'Failed to send verification email. Please try again later.',
      error,
    );
  }
}
