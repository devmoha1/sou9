"use client";

import { createContext, startTransition, useContext, useEffect, useState } from "react";

export type Language = "fr" | "ar";

const arabicCities: Record<string, string> = {
  Nouakchott: "نواكشوط",
  Rosso: "روصو",
  Aleg: "ألاك",
  "Kaédi": "كيهيدي",
  "Néma": "النعمة",
  Atar: "أطار",
  Tidjikja: "تجكجة",
  Autres: "أخرى",
};

const arabicCategories: Record<string, string> = {
  Téléphones: "الهواتف",
  Ordinateurs: "الحواسيب",
  Vêtements: "الملابس",
  Meubles: "الأثاث",
  Électronique: "الإلكترونيات",
  Livres: "الكتب",
  Sports: "الرياضة",
  Automobiles: "السيارات",
  Autres: "أخرى",
};

export function translateCity(city: string, language: Language) {
  return language === "ar" ? arabicCities[city] || city : city;
}

export function translateCategory(category: string, language: Language) {
  return language === "ar" ? arabicCategories[category] || category : category;
}

const translations = {
  fr: {
    ads: "Annonces",
    publish: "Publier",
    admin: "Administration",
    users: "Utilisateurs",
    login: "Connexion",
    register: "S'inscrire",
    categories: "Catégories",
    myAds: "Mes annonces",
    profile: "Profil",
    logout: "Déconnexion",
    closeMenu: "Fermer le menu",
    browseAds: "Parcourir les annonces",
    welcome: "Bienvenue sur Sou9",
    tagline: "La plateforme locale pour acheter et vendre facilement",
    browse: "Parcourir les annonces",
    publishAd: "Publier une annonce",
    newHere: "Nouveau sur Sou9 ?",
    joinText: "Créez votre compte ou connectez-vous pour publier vos annonces.",
    createAccount: "Créer un compte",
    why: "Pourquoi Sou9 ?",
    simple: "Simple",
    simpleText: "Publiez vos annonces en quelques clics",
    local: "Local",
    localText: "Trouvez des vendeurs près de chez vous",
    fast: "Rapide",
    fastText: "Contactez directement le vendeur",
    language: "Langue",
    searchAd: "Rechercher une annonce",
    search: "Rechercher...",
    category: "Catégorie",
    all: "Toutes",
    city: "Ville",
    condition: "État",
    allConditions: "Tous",
    newCondition: "Neuf",
    usedCondition: "Occasion",
    minPrice: "Prix min (MRU)",
    maxPrice: "Prix max (MRU)",
    filter: "Filtrer",
    adsCount: "Annonces",
    loading: "Chargement...",
    noAds: "Aucune annonce trouvée",
    noImage: "Pas d'image",
    seeAll: "Voir tout",
    recentListings: "Annonces récentes",
    sellYourItems: "Vendez vos articles",
    exploreOffers: "Explorez les offres",
    by: "Par",
    title: "Titre",
    description: "Description",
    describe: "Décrivez votre produit en détail...",
    imageHelp: "Images (6 maximum, 5 Mo par image)",
    selectCategory: "Sélectionner une catégorie",
    price: "Prix (MRU)",
    createListing: "Publier une annonce",
    creating: "Création en cours...",
    fullName: "Nom complet",
    phone: "Téléphone",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    loginWorking: "Connexion en cours...",
    signIn: "Se connecter",
    signUpWorking: "Inscription en cours...",
    mismatch: "Les mots de passe ne correspondent pas",
    haveAccount: "Vous avez un compte ?",
    noAccount: "Pas de compte ?",
    connect: "Connectez-vous",
    signUp: "Inscrivez-vous",
    details: "Détails de l'annonce",
    categoryLabel: "Catégorie:",
    cityLabel: "Ville:",
    conditionLabel: "État:",
    seller: "Vendeur",
    call: "Appel",
    backAds: "Retour aux annonces",
    notFound: "Annonce non trouvée",
    administration: "Administration",
    manageAds: "Gestion des annonces",
    delete: "Supprimer",
    deleteQuestion: "Supprimer cette annonce ?",
    deleteError: "Impossible de supprimer cette annonce.",
    adminOnly: "Cette page est réservée à l'administrateur.",
    rights: "Tous droits réservés.",
    visitorTip: "Astuce : créez un compte pour publier vos annonces et contacter facilement les vendeurs.",
    memberTip: "Astuce : utilisez Mes annonces pour retrouver et gérer vos publications.",
  },
  ar: {
    ads: "الإعلانات",
    publish: "نشر إعلان",
    admin: "الإدارة",
    users: "المستخدمون",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    categories: "الفئات",
    myAds: "إعلاناتي",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    closeMenu: "إغلاق القائمة",
    browseAds: "تصفح الإعلانات",
    welcome: "مرحبا بكم في سوق",
    tagline: "منصة محلية للبيع والشراء بسهولة",
    browse: "تصفح الإعلانات",
    publishAd: "نشر إعلان",
    newHere: "جديد في سوق؟",
    joinText: "أنشئ حسابك أو سجل الدخول لنشر إعلاناتك.",
    createAccount: "إنشاء حساب",
    why: "لماذا سوق؟",
    simple: "بسيط",
    simpleText: "انشر إعلاناتك ببضع نقرات",
    local: "محلي",
    localText: "اعثر على بائعين بالقرب منك",
    fast: "سريع",
    fastText: "تواصل مباشرة مع البائع",
    language: "اللغة",
    searchAd: "البحث عن إعلان",
    search: "بحث...",
    category: "الفئة",
    all: "الكل",
    city: "المدينة",
    condition: "الحالة",
    allConditions: "الكل",
    newCondition: "جديد",
    usedCondition: "مستعمل",
    minPrice: "السعر الأدنى (أوقية)",
    maxPrice: "السعر الأقصى (أوقية)",
    filter: "تصفية",
    adsCount: "الإعلانات",
    loading: "جار التحميل...",
    noAds: "لم يتم العثور على إعلانات",
    noImage: "لا توجد صورة",
    seeAll: "عرض الكل",
    recentListings: "الإعلانات الأخيرة",
    sellYourItems: "بع منتجاتك",
    exploreOffers: "استكشف العروض",
    by: "بواسطة",
    title: "العنوان",
    description: "الوصف",
    describe: "صف منتجك بالتفصيل...",
    imageHelp: "الصور (6 كحد أقصى، 5 ميغابايت للصورة)",
    selectCategory: "اختر فئة",
    price: "السعر (أوقية)",
    createListing: "نشر إعلان",
    creating: "جار النشر...",
    fullName: "الاسم الكامل",
    phone: "الهاتف",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    loginWorking: "جار تسجيل الدخول...",
    signIn: "تسجيل الدخول",
    signUpWorking: "جار إنشاء الحساب...",
    mismatch: "كلمتا المرور غير متطابقتين",
    haveAccount: "لديك حساب؟",
    noAccount: "ليس لديك حساب؟",
    connect: "سجل الدخول",
    signUp: "أنشئ حسابا",
    details: "تفاصيل الإعلان",
    categoryLabel: "الفئة:",
    cityLabel: "المدينة:",
    conditionLabel: "الحالة:",
    seller: "البائع",
    call: "اتصال",
    backAds: "العودة إلى الإعلانات",
    notFound: "الإعلان غير موجود",
    administration: "الإدارة",
    manageAds: "إدارة الإعلانات",
    delete: "حذف",
    deleteQuestion: "هل تريد حذف هذا الإعلان؟",
    deleteError: "تعذر حذف هذا الإعلان.",
    adminOnly: "هذه الصفحة مخصصة للمسؤول.",
    rights: "جميع الحقوق محفوظة.",
    visitorTip: "نصيحة: أنشئ حسابا لنشر إعلاناتك والتواصل بسهولة مع البائعين.",
    memberTip: "نصيحة: استخدم إعلاناتي للعثور على منشوراتك وإدارتها.",
  },
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof translations.fr;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("sou9-language");
    if (savedLanguage === "ar") {
      startTransition(() => setLanguage("ar"));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sou9-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage doit être utilisé dans LanguageProvider");
  return context;
}

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className="language-switcher">
      <span>{t.language}</span>
      <select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
      </select>
    </label>
  );
}