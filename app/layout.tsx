import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteNav from "@/components/site-nav";
import { LanguageProvider } from "@/components/language";
import SiteFooter from "@/components/site-footer";
import { LanguageDirectionManager } from "@/components/language-direction";

export const metadata: Metadata = {
  title: "Sou9 - Marketplace local",
  description: "Plateforme de vente d'annonces locales en Mauritanie",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <LanguageDirectionManager />
          <SiteNav />
          <main className="main-content">{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
