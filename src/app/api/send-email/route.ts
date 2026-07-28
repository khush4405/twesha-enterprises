import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, company, phone, message } = await req.json();
    
    // In production, these should be set in .env.local / Vercel Environment Variables
    const host = process.env.SMTP_HOST || '';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

    // If SMTP is not configured, we just log it and simulate success for demo purposes
    if (!host || !user || !pass) {
      console.warn("SMTP credentials missing. Simulating email success. Please configure .env.local.");
      console.log(`[Mock Email] From: ${email}, Subject: Inquiry from ${firstName} ${lastName}, Message: ${message}`);
      return NextResponse.json({ success: true, mock: true });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
    });

    const htmlBody = `
      <h2>New Inquiry from Twesha Enterprises Website</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <br/>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // IMPORTANT: Await the sendMail function in Next.js Serverless environments
    await transporter.sendMail({
      from: user, // Must match the authenticated user
      to: user, // Send to yourself (sales/inquiries inbox)
      subject: `New Website Inquiry: ${firstName} ${lastName} - ${company || ''}`,
      html: htmlBody,
      replyTo: email
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: 'Failed to send inquiry. Please try again.' }, { status: 500 });
  }
}
