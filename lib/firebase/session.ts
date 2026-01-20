import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = "session";
const DEFAULT_EXPIRES_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function createSessionCookie(
  idToken: string,
  expiresIn = DEFAULT_EXPIRES_MS
) {
  return admin.auth().createSessionCookie(idToken, { expiresIn });
}

export function setSessionCookieOnResponse(
  res: NextResponse,
  sessionCookie: string,
  expiresIn = DEFAULT_EXPIRES_MS
) {
  res.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: Math.floor(expiresIn / 1000),
    path: "/",
    sameSite: "lax",
  });
}

export function clearSessionCookieOnResponse(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  });
}

export async function verifySessionFromRequest(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!cookie) return null;

  try {
    const decoded = await admin.auth().verifySessionCookie(cookie, true);
    return decoded;
  } catch (err) {
    return null;
  }
}
