import { NextRequest, NextResponse } from "next/server";

export function setAuthCookie(response: NextResponse, userId: number) {
  console.log(`[Auth] Setting cookie for userId: ${userId}`);
  response.cookies.set({
    name: "userId",
    value: userId.toString(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

export function getAuthCookie(request: NextRequest): number | null {
  const userId = request.cookies.get("userId")?.value;
  console.log(`[Auth] Getting cookie, userId: ${userId}`);
  return userId ? parseInt(userId, 10) : null;
}

export function clearAuthCookie(response: NextResponse) {
  console.log(`[Auth] Clearing auth cookie`);
  response.cookies.set({
    name: "userId",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
