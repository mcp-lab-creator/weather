import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "pacheri_admin";

function expectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("smart-pacheri-admin-session").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  // Hash both sides so the buffers always have equal length.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return safeEqual(input, password);
}

export function sessionToken(): string {
  const token = expectedToken();
  if (!token) throw new Error("ADMIN_PASSWORD is not set");
  return token;
}

export async function isAdmin(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, expected);
}

/** Use at the top of every admin server action. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin");
}
