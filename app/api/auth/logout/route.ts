import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/cookies";

export function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: "Déconnexion réussie" },
    { status: 200 }
  );

  clearAuthCookie(response);
  return response;
}
