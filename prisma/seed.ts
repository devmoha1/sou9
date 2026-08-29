import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

async function seed() {
  console.log("🌱 Seeding database...");

  const adminEmail = "devmohamed59@gmail.com";

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

  // Créer / mettre à jour le compte administrateur
  const testUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "admin",
      password: await hashPassword("admin123"),
    },
    create: {
      email: adminEmail,
      name: "Mohamed Khyarhoum",
      phone: "+22220528895",
      city: "Nouakchott",
      password: await hashPassword("admin123"),
      role: "admin",
    },
  });

  console.log(`✅ Utilisateur administrateur vérifié: ${testUser.email}`);

  // Créer une annonce de test uniquement si nécessaire
  const categoryPhones = await prisma.category.findUnique({
    where: { name: "Téléphones" },
  });

  if (categoryPhones) {
    const existingListing = await prisma.listing.findFirst({
      where: {
        sellerId: testUser.id,
        title: "iPhone 15 Pro - Excellent état",
      },
    });

    if (!existingListing) {
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
    } else {
      console.log("ℹ️ Annonce de test déjà existante");
    }
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