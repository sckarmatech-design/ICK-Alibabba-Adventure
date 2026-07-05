import { SignJWT, jwtVerify } from "jose";
import { redirect } from "react-router";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
);

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifyToken(
  token: string
): Promise<{ sub: string; role: string }> {
  const { payload } = await jwtVerify(token, SECRET);
  return { sub: payload.sub as string, role: payload.role as string };
}

export async function getSessionUser(
  request: Request
): Promise<{ sub: string; role: string } | null> {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => {
      const [k, ...v] = c.split("=");
      return [k, v.join("=")];
    })
  );
  const token = cookies["session"];
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin(request: Request): Promise<string> {
  const user = await getSessionUser(request);
  if (!user || user.role !== "admin") {
    throw redirect("/login");
  }
  return user.sub;
}

export function createSessionCookie(token: string): string {
  const maxAge = 8 * 60 * 60; // 8 hours
  return `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return "session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0";
}
