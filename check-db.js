const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    // Vérifier tous les utilisateurs
    const users = await prisma.user.findMany();
    console.log('=== UTILISATEURS DANS LA BASE ===');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Email: ${user.email}, Nom: ${user.name}, Téléphone: ${user.phone}, Role: ${user.role}`);
    });

    // Vérifier le compte admin
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });
    
    if (adminUser) {
      console.log('\n=== COMPTE ADMIN ACTUEL ===');
      console.log(adminUser);
    }

    // Vérifier les annonces récentes
    const recentListings = await prisma.listing.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: true
      }
    });
    
    console.log('\n=== ANNONCES RÉCENTES ===');
    recentListings.forEach(listing => {
      console.log(`Annonce: ${listing.title}`);
      console.log(`Vendeur: ${listing.seller.name}, Tel: ${listing.seller.phone}`);
    });

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();