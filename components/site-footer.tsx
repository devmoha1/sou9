"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language";

export default function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">🛒 Sou9</span>
          <p className="footer-tagline">{t.tagline}</p>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h3>{t.categories}</h3>
            <Link href="/ads">{t.browseAds}</Link>
            <Link href="/ads/create">{t.publish}</Link>
          </div>
          <div className="footer-section">
            <h3>{t.profile || "Compte"}</h3>
            <Link href="/login">{t.login}</Link>
            <Link href="/register">{t.register}</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Sou9. {t.rights}</p>
      </div>
    </footer>
  );
}