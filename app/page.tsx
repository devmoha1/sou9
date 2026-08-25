"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage, translateCategory } from "@/components/language";

interface Listing {
  id: number;
  title: string;
  price: number;
  city: string;
  condition: string;
  images: { url: string }[];
  seller: { name: string };
  category: { name: string };
}

interface Category {
  id: number;
  name: string;
}

const categoryIcons: Record<string, string> = {
  "Téléphones": "📱",
  "Ordinateurs": "💻",
  "Vêtements": "👕",
  "Meubles": "🛋️",
  "Électronique": "📺",
  "Livres": "📚",
  "Sports": "⚽",
  "Automobiles": "🚗",
  "Autres": "📦",
};

export default function Home() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesResponse, listingsResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/listings?limit=6"),
        ]);
        const initialCategories = await categoriesResponse.json();
        const initialListings = await listingsResponse.json();
        setCategories(initialCategories);
        setListings(initialListings.listings || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ads?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    return categoryIcons[categoryName] || "📦";
  };

  return (
    <div className="home-container">
      {/* Hero Section Mobile */}
      <section className="hero-mobile">
        <div className="hero-bg">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content-mobile">
          <h1 className="hero-title-mobile">{t.welcome}</h1>
          <p className="hero-subtitle-mobile">{t.tagline}</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hero-search-mobile">
            <div className="search-wrapper-mobile">
              <svg className="search-icon-mobile" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-mobile"
              />
              <button type="submit" className="search-btn-mobile">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="hero-actions-mobile">
            <Link href="/ads/create" className="hero-action-btn hero-action-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t.publishAd}
            </Link>
            <Link href="/ads" className="hero-action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {t.browseAds}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section-mobile">
        <div className="section-header-mobile">
          <h2 className="section-title-mobile">{t.categories}</h2>
          <Link href="/ads" className="section-link-mobile">
            {t.seeAll}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="categories-scroll-mobile">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/ads?category=${category.id}`}
              className="category-item-mobile"
            >
              <div className="category-icon-wrapper-mobile">
                <span className="category-icon-mobile">{getCategoryIcon(category.name)}</span>
              </div>
              <span className="category-label-mobile">{translateCategory(category.name, language)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="listings-section-mobile">
        <div className="section-header-mobile">
          <h2 className="section-title-mobile">{t.recentListings}</h2>
          <Link href="/ads" className="section-link-mobile">
            {t.seeAll}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="loading-mobile">
            <div className="loading-spinner-mobile"></div>
            <p>{t.loading}</p>
          </div>
        ) : listings.length > 0 ? (
          <div className="listings-scroll-mobile">
            {listings.map((listing) => (
              <Link
                href={`/ads/${listing.id}`}
                key={listing.id}
                className="listing-card-mobile"
              >
                <div className="listing-image-mobile">
                  {listing.images.length > 0 ? (
                    <img src={listing.images[0].url} alt={listing.title} loading="lazy" />
                  ) : (
                    <div className="no-image-mobile">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                  <div className={`listing-badges-mobile`}>
                    <span className={`badge-mobile ${listing.condition}`}>
                      {listing.condition === "new" ? t.newCondition : t.usedCondition}
                    </span>
                  </div>
                </div>
                <div className="listing-content-mobile">
                  <h3 className="listing-title-mobile">{listing.title}</h3>
                  <div className="listing-price-row-mobile">
                    <span className="listing-price-mobile">{listing.price.toLocaleString()} MRU</span>
                  </div>
                  <div className="listing-meta-mobile">
                    <span className="meta-tag-mobile">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {listing.city}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-mobile">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p>{t.noAds}</p>
            <Link href="/ads/create" className="empty-action-mobile">
              {t.publishAd}
            </Link>
          </div>
        )}
      </section>

      {/* Auth Section */}
      <section className="auth-section-mobile">
        <div className="auth-card-mobile">
          <div className="auth-icon-mobile">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="auth-title-mobile">{t.newHere}</h3>
          <p className="auth-text-mobile">{t.joinText}</p>
          <div className="auth-buttons-mobile">
            <Link href="/register" className="auth-btn-mobile auth-btn-primary">
              {t.createAccount}
            </Link>
            <Link href="/login" className="auth-btn-mobile">
              {t.login}
            </Link>
          </div>
        </div>
      </section>

      {/* Desktop Hero */}
      <section className="hero desktop-only">
        <div className="hero-content">
          <h1>{t.welcome}</h1>
          <p>{t.tagline}</p>
          <div className="hero-buttons">
            <Link href="/ads" className="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {t.browse}
            </Link>
            <Link href="/ads/create" className="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t.publishAd}
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-container {
          width: 100%;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Hero Section Mobile */
        .hero-mobile {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 1rem 2.75rem;
          color: white;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.1;
        }

        .hero-pattern {
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%);
        }

        .hero-content-mobile {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0 auto;
        }

        .hero-title-mobile {
          font-size: clamp(1.5rem, 6vw, 2.25rem);
          font-weight: 800;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        .hero-subtitle-mobile {
          font-size: clamp(0.9rem, 3.5vw, 1.05rem);
          margin: 0 0 1.25rem 0;
          opacity: 0.92;
          line-height: 1.45;
        }

        .hero-search-mobile {
          margin-bottom: 1.25rem;
        }

        .search-wrapper-mobile {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 14px;
          padding: 0.35rem 0.5rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        }

        .search-icon-mobile {
          color: #9ca3af;
          margin-left: 0.5rem;
          flex-shrink: 0;
        }

        .search-input-mobile {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.65rem 0.5rem;
          font-size: 0.95rem;
          color: #1f2937;
          outline: none;
          min-width: 0;
        }

        .search-input-mobile::placeholder {
          color: #9ca3af;
        }

        .search-btn-mobile {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 10px;
          padding: 0.65rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 40px;
          min-height: 40px;
          flex-shrink: 0;
        }

        .search-btn-mobile:hover {
          transform: scale(1.04);
        }

        .hero-actions-mobile {
          display: flex;
          gap: 0.65rem;
        }

        .hero-action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.75rem 0.75rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.88rem;
          text-decoration: none;
          transition: all 0.2s;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.12);
          color: white;
          backdrop-filter: blur(10px);
          min-height: 44px;
        }

        .hero-action-primary {
          background: white;
          color: #667eea;
          border-color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .hero-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
        }

        /* Categories Section */
        .categories-section-mobile {
          padding: 1.25rem 1rem;
          background: white;
          margin-top: -1.25rem;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
          position: relative;
          z-index: 2;
        }

        .section-header-mobile {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.85rem;
        }

        .section-title-mobile {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .section-link-mobile {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: #667eea;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .section-link-mobile:hover {
          background: #f0f4ff;
        }

        .categories-scroll-mobile {
          display: flex;
          gap: 0.85rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }

        .categories-scroll-mobile::-webkit-scrollbar {
          display: none;
        }

        .category-item-mobile {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 72px;
          text-decoration: none;
          scroll-snap-align: start;
        }

        .category-icon-wrapper-mobile {
          width: 58px;
          height: 58px;
          background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.4rem;
          transition: all 0.2s;
          border: 1.5px solid #e8f0fe;
        }

        .category-item-mobile:hover .category-icon-wrapper-mobile {
          transform: scale(1.08);
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
        }

        .category-icon-mobile {
          font-size: 1.5rem;
        }

        .category-label-mobile {
          font-size: 0.72rem;
          color: #4b5563;
          font-weight: 500;
          text-align: center;
          white-space: nowrap;
        }

        /* Listings Section */
        .listings-section-mobile {
          padding: 1.25rem 1rem;
        }

        .listings-scroll-mobile {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .listing-card-mobile {
          display: flex;
          background: white;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
          border: 1px solid #e5e7eb;
          min-height: 100px;
        }

        .listing-card-mobile:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.09);
        }

        .listing-image-mobile {
          width: 110px;
          min-height: 100px;
          background: #f3f4f6;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .listing-image-mobile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image-mobile {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #9ca3af;
        }

        .listing-badges-mobile {
          position: absolute;
          top: 0.4rem;
          right: 0.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .badge-mobile {
          padding: 0.2rem 0.45rem;
          border-radius: 6px;
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-mobile.new {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .badge-mobile.used {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .listing-content-mobile {
          flex: 1;
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }

        .listing-title-mobile {
          font-size: 0.92rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.35rem 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        .listing-price-row-mobile {
          margin-bottom: 0.35rem;
        }

        .listing-price-mobile {
          font-size: 1.1rem;
          font-weight: 800;
          color: #667eea;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .listing-meta-mobile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .meta-tag-mobile {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.2rem 0.45rem;
          border-radius: 6px;
        }

        /* Auth Section */
        .auth-section-mobile {
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .auth-card-mobile {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 1.5rem 1.25rem;
          text-align: center;
          color: white;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
        }

        .auth-icon-mobile {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          margin-bottom: 0.75rem;
        }

        .auth-title-mobile {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 0.4rem 0;
        }

        .auth-text-mobile {
          font-size: 0.85rem;
          opacity: 0.92;
          margin: 0 0 1rem 0;
          line-height: 1.45;
        }

        .auth-buttons-mobile {
          display: flex;
          gap: 0.65rem;
        }

        .auth-btn-mobile {
          flex: 1;
          padding: 0.75rem 0.85rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.88rem;
          text-decoration: none;
          transition: all 0.2s;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .auth-btn-primary {
          background: white;
          color: #667eea;
        }

        .auth-btn-mobile:not(.auth-btn-primary) {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1.5px solid rgba(255, 255, 255, 0.35);
        }

        .auth-btn-mobile:hover {
          transform: translateY(-2px);
        }

        /* Loading and Empty States */
        .loading-mobile,
        .empty-mobile {
          text-align: center;
          padding: 2.5rem 1rem;
          color: #6b7280;
        }

        .loading-spinner-mobile {
          width: 36px;
          height: 36px;
          border: 3px solid #e5e7eb;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 0.75rem;
        }

        .empty-action-mobile {
          display: inline-block;
          margin-top: 0.85rem;
          padding: 0.7rem 1.25rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Desktop vs Mobile display */
        .desktop-only {
          display: none;
        }

        @media (min-width: 768px) {
          .hero-mobile,
          .categories-section-mobile,
          .listings-section-mobile,
          .auth-section-mobile {
            display: none;
          }

          .desktop-only {
            display: block;
          }

          .home-container {
            background: #f8fafc;
            padding: 1.5rem 1rem;
          }
        }

        /* Very Small Mobile screens (< 360px) */
        @media (max-width: 360px) {
          .hero-actions-mobile,
          .auth-buttons-mobile {
            flex-direction: column;
          }

          .category-item-mobile {
            min-width: 64px;
          }

          .category-icon-wrapper-mobile {
            width: 50px;
            height: 50px;
          }

          .listing-image-mobile {
            width: 90px;
          }
        }

        /* RTL Support */
        [dir="rtl"] .search-icon-mobile {
          margin-left: 0;
          margin-right: 0.5rem;
        }

        [dir="rtl"] .listing-badges-mobile {
          right: auto;
          left: 0.4rem;
        }

        [dir="rtl"] .section-link-mobile {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .section-link-mobile svg {
          transform: rotate(180deg);
        }

        [dir="rtl"] .category-item-mobile {
          text-align: right;
        }

        [dir="rtl"] .listing-card-mobile {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .meta-tag-mobile {
          flex-direction: row-reverse;
        }
      `}</style>
    </div>
  );
}
