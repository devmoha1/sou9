"use client";

import { useLanguage } from "@/components/language";
import { useEffect } from "react";

export function LanguageDirectionManager() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  return null;
}