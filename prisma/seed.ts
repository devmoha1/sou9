import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

async function seed() {
  console.log("🌱 Seeding database...");
  const adminEmail = "devmohamed59@gmail.com";
  const currentAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  const legacyAdmin = await prisma.user.findUnique({ where: { email: "ali@example.com" } });
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

  console.log(`✅ ${categoryNames.length} catégories vérifiées`);

  // Créer un utilisateur de test
  const testUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "admin", password: await hashPassword("admin123") },
    create: {
      email: adminEmail,
      name: "Ali Mohamed",
      phone: "+22223456789",
      city: "Nouakchott",
      password: await hashPassword("admin123"),
      role: "admin",
    },
  });

  console.log(`✅ Utilisateur test créé: ${testUser.email}`);

  // Créer quelques annonces de test
  const categoryPhones = await prisma.category.findUnique({
    where: { name: "Téléphones" },
  });

  if (categoryPhones) {
    const listing = await prisma.listing.create({
      data: {
        title: "iPhone 15 Pro - Excellent état",
        description:
          "iPhone 15 Pro 256GB, très peu utilisé, avec boîte et accessoires",
        price: 450000,
        condition: "used",
        city: "Nouakchott",
        sellerId: testUser.id,
        categoryId: categoryPhones.id,
        images: {
          create: [
            {
              url: "/placeholder-iphone.jpg",
              order: 0,
            },
          ],
        },
      },
    });

    console.log(`✅ Annonce de test créée: ${listing.title}`);
  }

  console.log("✨ Seeding terminé!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
