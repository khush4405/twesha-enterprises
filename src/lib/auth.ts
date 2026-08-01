import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET === "default_secret" || JWT_SECRET === "super_secret_jwt_key_change_in_production") {
  if (process.env.NODE_ENV === 'production') {
    throw new Error("FATAL: JWT_SECRET environment variable is missing or insecure in production.");
  }
}

const finalSecret = JWT_SECRET || "default_secret";
const key = new TextEncoder().encode(finalSecret);

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}
