import userModel from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ name, email, genotp, userId }: any) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Queryly Support" <${process.env.GMAIL_USER}>`,
      replyTo: 'noreply@queryly.app',
      to: email,
      subject: 'Queryly Email Verification',
      text: `Hi ${name},\n\nPlease use the following code to complete your email verification:\n\n${genotp}\n\nIf you didn’t request this, you can safely ignore this email.\n\n- Queryly Team`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Verification</title>
<style>
body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
.container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #ddd; }
.header { background-color: #4CAF50; color: #fff; padding: 20px; text-align: center; font-size: 22px; font-weight: bold; }
.content { padding: 20px; color: #333; line-height: 1.6; }
.verification-code { margin: 20px 0; font-size: 20px; color: #4CAF50; background: #e8f5e9; border: 1px dashed #4CAF50; padding: 10px; text-align: center; border-radius: 4px; font-weight: bold; letter-spacing: 2px; }
.footer { background-color: #f4f4f4; padding: 10px; text-align: center; color: #777; font-size: 12px; border-top: 1px solid #ddd; }
</style>
</head>
<body>
<div class="container">
  <div class="header">Email Verification</div>
  <div class="content">
    <p>Hi ${name},</p>
    <p>Please use the following code to complete your email verification:</p>
    <div class="verification-code">${genotp}</div>
    <p>If you didn’t request this, you can safely ignore this email.</p>
  </div>
  <div class="footer">&copy; ${new Date().getFullYear()} queryly.vercel.app</div>
</div>
</body>
</html>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.error('Error sending email:', error);
  }
};
