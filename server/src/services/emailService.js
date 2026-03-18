import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: 'RentEase <onboarding@resend.dev>', // Update with your verified domain if possible
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email sending failed');
  }
};
