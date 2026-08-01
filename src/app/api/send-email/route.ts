import { NextResponse } from 'next/server';
import { z } from 'zod';
import { transporter, emailConfig } from '@/lib/nodemailer';
import { rateLimit } from '@/lib/rate-limit';

const formSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // 3 emails per minute max to prevent spam
    const limitResult = rateLimit(ip, { maxRequests: 3, windowMs: 60 * 1000 });
    
    if (!limitResult.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const body = await req.json();
    const result = formSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid form data', details: result.error.flatten().fieldErrors }, { status: 400 });
    }
    
    const { firstName, lastName, email, company, phone, message } = result.data;

    // If SMTP is not configured, we just log it and simulate success for demo purposes
    if (!emailConfig.host || !emailConfig.user || !emailConfig.pass || emailConfig.host === "info.tweshaenterprise.com") {
      console.warn("SMTP credentials missing or misconfigured. Simulating email success. Please check .env.local.");
      console.log(`[Mock Email] Inquiry received successfully from ${ip} (PII redacted for security)`);
      return NextResponse.json({ success: true, mock: true });
    }

    const htmlBody = `
      <h2>New Inquiry from Twesha Enterprises Website</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName && lastName !== 'N/A' ? lastName : ''}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <br/>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    // IMPORTANT: Await the sendMail function in Next.js Serverless environments
    const mailPromise = transporter.sendMail({
      from: emailConfig.user, // Must match the authenticated user
      to: process.env.RECEIVER_EMAIL || emailConfig.user, // Configurable receiver
      subject: `New Website Inquiry: ${firstName} ${lastName && lastName !== 'N/A' ? lastName : ''} - ${company || 'General'}`,
      html: htmlBody,
      replyTo: email
    });

    // Auto-reply to the sender
    const autoReplyHtml = `
      <h2>Thank you for contacting Twesha Enterprises!</h2>
      <p>Dear ${firstName},</p>
      <p>We have received your inquiry and our team will get back to you shortly.</p>
      <br/>
      <p><strong>Your Message:</strong></p>
      <p>${message}</p>
      <br/>
      <p><em>Please note: This is an automated no-reply email. Please do not reply directly to this message.</em></p>
    `;

    const autoReplyPromise = transporter.sendMail({
      from: `"Twesha Enterprises (No Reply)" <${emailConfig.user}>`, // Must match the authenticated user
      to: email, // Send to the person who filled out the form
      subject: `Thank you for your inquiry - Twesha Enterprises`,
      html: autoReplyHtml,
    });

    // Await is MANDATORY so Vercel doesn't kill the function early
    await Promise.allSettled([mailPromise, autoReplyPromise]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ error: 'Failed to send inquiry. Please try again.' }, { status: 500 });
  }
}
