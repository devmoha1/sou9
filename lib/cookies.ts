import { NextRequest, NextResponse } from "next/server";

export function setAuthCookie(response: NextResponse, userId: number) {
  response.cookies.set({
    name: "userId",
    value: userId.toString(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

export function getAuthCookie(request: NextRequest): number | null {
  const userId = request.cookies.get("userId")?.value;
  return userId ? parseInt(userId, 10) : null;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete("userId");
}
