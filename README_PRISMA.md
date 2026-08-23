# Sou9 - Marketplace Local

Une plateforme pour vendre et acheter des annonces locales en Mauritanie.

## Stack technologique

- **Next.js** avec App Router
- **TypeScript**
- **Prisma** comme ORM
- **SQLite** pour le développement local
- **Supabase PostgreSQL** pour la production

## Installation

```bash
npm install
```

## Configuration de la base de données

### Développement local (SQLite)

```bash
# Créer la migration initiale
npm run prisma:migrate

# Voir la base de données avec Prisma Studio
npm run prisma:studio
```

### Remplir la base avec des données de test

```bash
npm run prisma:seed
```

## Structure du projet

```
app/
├── api/              # Routes API
│   └── health/       # Endpoint pour vérifier la connexion BD
├── ads/              # Pages annonces
├── login/            # Page connexion
└── register/         # Page inscription

lib/
└── prisma.ts         # Client Prisma réutilisable

prisma/
├── schema.prisma     # Schéma de la base de données
└── seed.ts          # Script pour remplir la BD

```

## Schéma de la base de données

### User
- id (Int, PK)
- email (String, unique)
- name (String)
- phone (String)
- city (String)
- password (String, hashed)
- role (String: "buyer", "seller", "admin")
- createdAt (DateTime)
- updatedAt (DateTime)

### Category
- id (Int, PK)
- name (String, unique)

### Listing
- id (Int, PK)
- title (String)
- description (String)
- price (Int, en MRU)
- condition (String: "new", "used")
- city (String)
- sellerId (Int, FK → User)
- categoryId (Int, FK → Category)
- createdAt (DateTime)
- updatedAt (DateTime)

### Image
- id (Int, PK)
- url (String)
- listingId (Int, FK → Listing)
- order (Int)

## Démarrer le développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## Commandes utiles

```bash
# Développement
npm run dev              # Démarrer le serveur de dev
npm run lint            # Vérifier le linting

# Base de données
npm run prisma:migrate   # Créer une nouvelle migration
npm run prisma:seed      # Remplir la BD avec des données de test
npm run prisma:studio    # Ouvrir Prisma Studio

# Production
npm run build            # Builder l'app
npm start               # Lancer l'app en production
```

## Notes de développement

- **Base de données locale** : SQLite stockée dans `prisma/dev.db` (gitignored)
- **Variables d'environnement** : fichier `.env.local` (gitignored)
- **Prisma Client** : réutilisable depuis `lib/prisma.ts`
