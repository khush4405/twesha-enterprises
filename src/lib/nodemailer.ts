import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "";
const port = Number(process.env.SMTP_PORT) || 587;
const user = process.env.SMTP_USER || "";
const pass = process.env.SMTP_PASS || "";

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true for 465, false for other ports
  auth: {
    user,
    pass,
  },
  // VERCEL FIX: Force IPv4, as IPv6 to Gmail often times out on Vercel Serverless
  tls: { rejectUnauthorized: false }, // avoid TLS cert issues
  family: 4, // Force IPv4
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
} as any); // THIS CAST IS CRITICAL for Serverless/Next.js builds

export const emailConfig = {
  host,
  port,
  user,
  pass
};
