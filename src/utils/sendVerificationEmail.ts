import nodemailer from 'nodemailer';

export async function sendVerificationEmail(
  email: string,
  token: string,
  url: string,
) {
  const transporter = nodemailer.createTransport({
    // configure email provider
    service: 'gmail',
    auth: {
      user: process.env.MOVEO_EMAIL || '',
      pass: process.env.MOVEO_EMAIL_PASSWORD || '',
    },
  });

  const verificationUrl = `${url}?token=${token}`;

  await transporter.sendMail({
    from: '"MoveoApp" <' + (process.env.MOVEO_EMAIL || '') + '>',
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  });
}
