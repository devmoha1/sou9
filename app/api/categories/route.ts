import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { getAuthenticatedUser } from "@/lib/admin";

const defaultCategories = [
  "Téléphones",
  "Ordinateurs",
  "Vêtements",
  "Meubles",
  "Électronique",
  "Livres",
  "Sports",
  "Automobiles",
  "Autres",
];

export async function GET() {
  try {
    let categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    if (categories.length === 0) {
      for (const name of defaultCategories) {
        try {
          await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
          });
        } catch {
          // ignore duplicate / concurrent upsert
        }
      }
      categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
    }

    if (categories.length === 0) {
      return NextResponse.json(
        defaultCategories.map((name, idx) => ({ id: idx + 1, name })),
        { status: 200 }
      );
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error in categories GET:", error);
    return NextResponse.json(
      defaultCategories.map((name, idx) => ({ id: idx + 1, name })),
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Accès réservé à l'administrateur" },
        { status: 403 }
      );
    }

    const { name } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Nom requis" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name: name.trim() },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}