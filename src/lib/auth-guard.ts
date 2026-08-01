import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export async function authGuard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return { success: false, error: "Unauthorized: No token provided" };
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return { success: false, error: "Unauthorized: Invalid or expired token" };
  }

  return { success: true, payload };
}
