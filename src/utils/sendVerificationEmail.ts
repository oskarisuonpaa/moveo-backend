const nodemailer = require('nodemailer');
require('dotenv').config();

export async function sendVerificationEmail(email : string, token : string) {
  const transporter = nodemailer.createTransport({
    // configure email provider
    service: 'gmail',
    auth: {
        user: process.env.MOVEO_EMAIL || '',
        pass: process.env.MOVEO_EMAIL_PASSWORD || ''
    }
  });

  const verificationUrl = `http://localhost:3001/verification/verify?token=${token}`;

  await transporter.sendMail({
    from: '"MoveoApp" <' + (process.env.MOVEO_EMAIL || '') + '>',
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
  });
};