import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET doit être défini et contenir au moins 32 caractères"
    );
  }

  return secret;
}

function createToken(userId: number): string {
  const payload = userId.toString();
  const signature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

function verifyToken(token: string): number | null {
  const [userId, signature] = token.split(".");

  if (!userId || !signature || !/^\d+$/.test(userId)) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(userId)
    .digest("hex");

  try {
    const valid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!valid) return null;

    return Number(userId);
  } catch {
    return null;
  }
}

export function setAuthCookie(response: NextResponse, userId: number) {
  const token = createToken(userId);

  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function getAuthCookie(request: NextRequest): number | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) return null;

  return verifyToken(token);
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}