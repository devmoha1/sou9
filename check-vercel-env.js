// Script pour vérifier les variables d'environnement Vercel
console.log('=== VARIABLES D\'ENVIRONNEMENT ===');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('Autres variables:', Object.keys(process.env).filter(k => !k.includes('PATH') && !k.includes('NODE')));