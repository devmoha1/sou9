const Database = require("better-sqlite3");
const { PrismaClient } = require("@prisma/client");

const sqlite = new Database("./prisma/prisma/dev.db");
const neon = new PrismaClient();

async function main() {
  console.log("🚀 Début de la migration SQLite → Neon\n");

  // Lire les données SQLite
  const users = sqlite.prepare("SELECT * FROM User").all();
  const categories = sqlite.prepare("SELECT * FROM Category").all();
  const listings = sqlite.prepare("SELECT * FROM Listing").all();
  const images = sqlite.prepare("SELECT * FROM Image").all();

  console.log(`👤 Utilisateurs : ${users.length}`);
  console.log(`📂 Catégories  : ${categories.length}`);
  console.log(`📢 Annonces    : ${listings.length}`);
  console.log(`🖼️ Images      : ${images.length}\n`);

  // Vérification de sécurité
  if (users.length === 0) {
    throw new Error("❌ Aucune donnée trouvée dans SQLite. Migration annulée.");
  }

  // Vérifier ce qui existe déjà dans Neon
  const existingUsers = await neon.user.count();
  const existingCategories = await neon.category.count();
  const existingListings = await neon.listing.count();

  console.log("📊 Données actuellement dans Neon :");
  console.log(`   Utilisateurs : ${existingUsers}`);
  console.log(`   Catégories   : ${existingCategories}`);
  console.log(`   Annonces     : ${existingListings}\n`);

  if (existingUsers > 0 || existingCategories > 0 || existingListings > 0) {
    throw new Error(
      "⚠️ Neon contient déjà des données. Migration annulée pour éviter les doublons."
    );
  }

  // --------------------------------------------------
  // 1. Utilisateurs
  // --------------------------------------------------
  console.log("👤 Migration des utilisateurs...");

  for (const user of users) {
    await neon.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        city: user.city,
        password: user.password,
        role: user.role,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      },
    });
  }

  // --------------------------------------------------
  // 2. Catégories
  // --------------------------------------------------
  console.log("📂 Migration des catégories...");

  for (const category of categories) {
    await neon.category.create({
      data: {
        id: category.id,
        name: category.name,
      },
    });
  }

  // --------------------------------------------------
  // 3. Annonces
  // --------------------------------------------------
  console.log("📢 Migration des annonces...");

  for (const listing of listings) {
    await neon.listing.create({
      data: {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        condition: listing.condition,
        city: listing.city,
        sellerId: listing.sellerId,
        categoryId: listing.categoryId,
        createdAt: new Date(listing.createdAt),
        updatedAt: new Date(listing.updatedAt),
      },
    });
  }

  // --------------------------------------------------
  // 4. Images
  // --------------------------------------------------
  console.log("🖼️ Migration des images...");

  for (const image of images) {
    await neon.image.create({
      data: {
        id: image.id,
        url: image.url,
        listingId: image.listingId,
        order: image.order,
      },
    });
  }

  console.log("\n✅ MIGRATION TERMINÉE !");
  console.log("Les données SQLite ont été copiées vers Neon.");
}

main()
  .catch((error) => {
    console.error("\n❌ MIGRATION ANNULÉE :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    sqlite.close();
    await neon.$disconnect();
  });