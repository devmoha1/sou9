import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { setAuthCookie } from "@/lib/cookies";
import { normalizeMauritaniaPhone } from "@/lib/phone";

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, city, password } = await request.json();

    if (!email || !password || !name || !phone || !city) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone: `+${normalizeMauritaniaPhone(phone)}`,
        city,
        password: hashedPassword,
        role: "buyer",
      },
    });

    const response = NextResponse.json(
      { message: "Inscription réussie", user: { id: user.id, email: user.email } },
      { status: 201 }
    );

    setAuthCookie(response, user.id);
    return response;
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
