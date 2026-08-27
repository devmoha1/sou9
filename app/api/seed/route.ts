import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

async function seedDatabase() {
  const adminEmail = "devmohamed59@gmail.com";
  const currentAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  const legacyAdmin = await prisma.user.findUnique({ where: { email: "ali@test.com" } });

  if (!currentAdmin && legacyAdmin) {
    await prisma.user.update({
      where: { id: legacyAdmin.id },
      data: { email: adminEmail },
    });
  }

  // Créer les catégories
  const categoryNames = [
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

  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Créer un utilisateur de test
  const testUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "admin", password: await hashPassword("admin123") },
    create: {
      email: adminEmail,
      name: "Mohamed Khyarhoum",
      phone: "+22220528895",
      city: "Nouakchott",
      password: await hashPassword("admin123"),
      role: "admin",
    },
  });

  // Créer quelques annonces de test
  const phoneCategory = await prisma.category.findUnique({
    where: { name: "Téléphones" },
  });

  if (phoneCategory) {
    await prisma.listing.create({
      data: {
        title: "iPhone 15 Pro - Excellent état",
        description:
          "iPhone 15 Pro 256GB, très peu utilisé, avec boîte et accessoires. Écran impeccable.",
        price: 450000,
        condition: "used",
        city: "Nouakchott",
        sellerId: testUser.id,
        categoryId: phoneCategory.id,
        images: {
          create: [
            {
              url: "https://via.placeholder.com/400x300?text=iPhone+15+Pro",
              order: 0,
            },
          ],
        },
      },
    });
  }
}

export async function GET() {
  try {
    await seedDatabase();

    const count = await prisma.user.count();
    const listingCount = await prisma.listing.count();

    return NextResponse.json(
      {
        status: "ok",
        message: "Base de données initialisée",
        stats: { users: count, listings: listingCount },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Erreur lors de l'initialisation",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}