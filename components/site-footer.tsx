"use client";

import { useLanguage } from "@/components/language";

export default function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <p>&copy; 2026 Sou9. {t.rights}</p>
    </footer>
  );
}