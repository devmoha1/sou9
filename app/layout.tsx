import type { Metadata } from "next";
import "./globals.css";
import SiteNav from "@/components/site-nav";
import { LanguageProvider } from "@/components/language";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Sou9 - Marketplace local",
  description: "Plateforme de vente d'annonces locales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <LanguageProvider>
          <SiteNav />
          <main className="main-content">{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
