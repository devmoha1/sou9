"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="home-container">
      <section className="hero">
        <h1>{t.welcome}</h1>
        <p>{t.tagline}</p>
        <div className="hero-buttons">
          <Link href="/ads" className="btn btn-primary">
            {t.browse}
          </Link>
          <Link href="/ads/create" className="btn btn-secondary">
            {t.publishAd}
          </Link>
        </div>
      </section>

      <section className="auth-choice">
        <h2>{t.newHere}</h2>
        <p>{t.joinText}</p>
        <div className="hero-buttons">
          <Link href="/register" className="btn btn-primary">{t.createAccount}</Link>
          <Link href="/login" className="btn btn-secondary">{t.login}</Link>
        </div>
      </section>

      <section className="features">
        <h2>{t.why}</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>{t.simple}</h3>
            <p>{t.simpleText}</p>
          </div>
          <div className="feature-card">
            <h3>{t.local}</h3>
            <p>{t.localText}</p>
          </div>
          <div className="feature-card">
            <h3>{t.fast}</h3>
            <p>{t.fastText}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
