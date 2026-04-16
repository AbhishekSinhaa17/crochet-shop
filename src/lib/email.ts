import nodemailer from 'nodemailer';
import { Logger } from './logger';
import { EmailPayload } from '@/types/email';

/**
 * 📧 Nodemailer Transporter Setup
 * Configured specifically for Gmail SMTP with App Passwords.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * 📧 Deliver email via Nodemailer
 * Supports HTML rendering and error logging
 */
export async function deliverEmail(payload: EmailPayload, html: string) {
  try {
    const { to, subject } = payload;
    
    // Ensure "to" is always an array of strings
    const recipients = Array.isArray(to) ? to : [to];

    // Build mail options
    const mailOptions = {
      from: `"Strokes of Craft" <${process.env.GMAIL_USER}>`,
      to: recipients.join(', '), // Nodemailer expects a comma-separated string or array
      subject: subject,
      html: html,
      headers: {
        'X-Entity-Ref-ID': payload.orderId || payload.type, // For deliverability & threading
      },
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    Logger.info('Email Delivered Successfully', { 
      to: recipients, 
      subject, 
      messageId: info.messageId,
      type: payload.type 
    });
    
    return info;
  } catch (error: any) {
    Logger.error('Email Delivery Fatal Error', error, { payload });
    throw error;
  }
}

/**
 * 🏗️ Generic Email Wrapper for templates
 */
export function wrapInEmailTemplate(content: string, previewText?: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Strokes of Craft</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
        body { margin: 0; padding: 0; font-family: 'Outfit', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, helvetica, arial, sans-serif; background-color: #f8fafc; color: #1e293b; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); padding: 60px 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em; }
        .content { padding: 48px 40px; }
        .footer { background-color: #f1f5f9; padding: 40px; text-align: center; font-size: 14px; color: #64748b; }
        .btn { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); color: #ffffff !important; text-decoration: none; border-radius: 14px; font-weight: 600; margin-top: 24px; box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3); }
        .price { font-size: 24px; font-weight: 800; color: #7c3aed; }
        .item-row { display: flex; align-items: center; padding: 16px 0; border-bottom: 1px solid #f1f5f9; }
        .item-details { flex-grow: 1; margin-left:16px; }
        .badge { display: inline-block; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: #f1f5f9; color: #475569; }
      </style>
    </head>
    <body>
      ${previewText ? `<div style="display: none; max-height: 0px; overflow: hidden;">${previewText}</div>` : ''}
      <div class="container">
        <div class="header">
          <h1>Strokes of Craft</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Strokes of Craft. All rights reserved.</p>
          <p>Handmade with love for you.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
