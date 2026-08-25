"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { translateCategory, translateCity, useLanguage } from "@/components/language";

interface Listing {
  id: number;
  title: string;
  price: number;
  city: string;
  condition: string;
  images: { url: string }[];
  seller: { name: string };
}

interface Category {
  id: number;
  name: string;
}

export default function AdsPage() {
  const { language, t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("all");
  const [condition, setCondition] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const cities = ["Nouakchott", "Rosso", "Aleg", "Kaédi", "Néma", "Atar", "Tidjikja", "Autres"];

  const activeFiltersCount = [
    category !== "all",
    city !== "all",
    condition !== "all",
    Boolean(minPrice),
    Boolean(maxPrice),
  ].filter(Boolean).length;

  const fetchListings = async () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "all") params.append("category", category);
    if (city && city !== "all") params.append("city", city);
    if (condition && condition !== "all") params.append("condition", condition);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    setLoading(true);
    const res = await fetch(`/api/listings?${params}`);
    const data = await res.json();
    setListings(data.listings || []);
    setLoading(false);
  };

  const handleFilter = () => {
    fetchListings();
  };

  const handleResetFilters = () => {
    setCategory("all");
    setCity("all");
    setCondition("all");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setLoading(true);
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      const [categoriesResponse, listingsResponse] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/listings"),
      ]);
      const initialCategories = await categoriesResponse.json();
      const initialListings = await listingsResponse.json();

      if (!cancelled) {
        setCategories(initialCategories);
        setListings(initialListings.listings || []);
        setLoading(false);
      }
    };

    void loadInitialData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="listings-page">
      <div className="filters-section">
        {/* Search Bar - Always visible */}
        <div className="search-box">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={t.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFilter()}
            />
            <button onClick={handleFilter} className="search-action-btn" aria-label={t.search}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="filters-toolbar">
          <button 
            type="button" 
            className={`btn-filter-toggle ${showFilters ? "is-active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M6 12h12M10 18h4" />
            </svg>
            <span>{t.filter}</span>
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
              {t.all || "Effacer"}
            </button>
          )}
        </div>

        {/* Collapsible Filters on Mobile / Full on Desktop */}
        <div className={`filters-content ${showFilters ? "is-expanded" : ""}`}>
          <div className="filters-grid">
            <div className="filter-group">
              <label>{t.category}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">{t.all}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {translateCategory(cat.name, language)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{t.city}</label>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="all">{t.all}</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {translateCity(c, language)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{t.condition}</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option value="all">{t.allConditions}</option>
                <option value="new">{t.newCondition}</option>
                <option value="used">{t.usedCondition}</option>
              </select>
            </div>

            <div className="filter-group">
              <label>{t.minPrice}</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>{t.maxPrice}</label>
              <input
                type="number"
                placeholder="∞"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="filters-apply-row">
            <button onClick={handleFilter} className="btn btn-primary btn-apply">
              {t.filter}
            </button>
          </div>
        </div>
      </div>

      <div className="listings-container">
        <div className="listings-header">
          <h2>{t.adsCount}</h2>
          <span className="results-count">{listings.length}</span>
        </div>
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>{t.loading}</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p>{t.noAds}</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <Link
                href={`/ads/${listing.id}`}
                key={listing.id}
                className="listing-card"
              >
                <div className="listing-image">
                  {listing.images.length > 0 ? (
                    <img src={listing.images[0].url} alt={listing.title} loading="lazy" />
                  ) : (
                    <div className="no-image">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span>{t.noImage}</span>
                    </div>
                  )}
                  <span className={`condition-badge ${listing.condition}`}>
                    {listing.condition === "new" ? t.newCondition : t.usedCondition}
                  </span>
                </div>
                <div className="listing-info">
                  <h3>{listing.title}</h3>
                  <p className="price">{listing.price.toLocaleString()} MRU</p>
                  <div className="listing-meta">
                    <span className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {listing.seller.name}
                    </span>
                    <span className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {translateCity(listing.city, language)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .listings-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.25rem 1rem 2rem;
        }

        .filters-section {
          background: white;
          padding: 1.25rem;
          border-radius: 16px;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .search-box {
          margin-bottom: 0.75rem;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .search-input-wrapper:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
          background: #fff;
        }

        .search-icon {
          margin-left: 0.85rem;
          color: #94a3b8;
          flex-shrink: 0;
        }

        [dir="rtl"] .search-icon {
          margin-left: 0;
          margin-right: 0.85rem;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 0.5rem;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          color: #1e293b;
          outline: none;
          min-width: 0;
        }

        .search-action-btn {
          background: #2563eb;
          border: none;
          color: white;
          padding: 0.5rem;
          margin: 0.25rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          min-height: 36px;
          transition: all 0.2s;
        }

        .search-action-btn:hover {
          background: #1d4ed8;
        }

        .filters-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .btn-filter-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #334155;
          padding: 0.5rem 0.85rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 38px;
        }

        .btn-filter-toggle:hover,
        .btn-filter-toggle.is-active {
          background: #e0e7ff;
          color: #2563eb;
          border-color: #c7d2fe;
        }

        .filter-badge {
          background: #2563eb;
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 9999px;
          padding: 0.1rem 0.45rem;
        }

        .btn-reset-filters {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: underline;
          padding: 0.25rem 0.5rem;
        }

        .btn-reset-filters:hover {
          color: #dc2626;
        }

        .filters-content {
          display: none;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        .filters-content.is-expanded {
          display: block;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.85rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-group label {
          font-weight: 600;
          margin-bottom: 0.35rem;
          font-size: 0.82rem;
          color: #475569;
        }

        .filter-group select,
        .filter-group input {
          padding: 0.6rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          background: white;
          transition: all 0.2s;
          min-height: 40px;
        }

        .filter-group select:focus,
        .filter-group input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .filters-apply-row {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }

        .btn-apply {
          width: 100%;
          max-width: 200px;
        }

        /* Listings Container */
        .listings-container {
          margin-top: 1.5rem;
        }

        .listings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .listings-header h2 {
          font-size: 1.35rem;
          color: #1e293b;
          font-weight: 700;
          margin: 0;
        }

        .results-count {
          background: #2563eb;
          color: white;
          padding: 0.2rem 0.65rem;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #64748b;
        }

        .loading-state svg,
        .empty-state svg {
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Listings Grid */
        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .listing-card {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          color: inherit;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }

        .listing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1);
          border-color: #2563eb;
        }

        .listing-image {
          width: 100%;
          height: 180px;
          background: #f1f5f9;
          overflow: hidden;
          position: relative;
        }

        .listing-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .listing-card:hover .listing-image img {
          transform: scale(1.05);
        }

        .no-image {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #94a3b8;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .condition-badge {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          padding: 0.25rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        [dir="rtl"] .condition-badge {
          right: auto;
          left: 0.6rem;
        }

        .condition-badge.new {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .condition-badge.used {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .listing-info {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .listing-info h3 {
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
          color: #1e293b;
          font-weight: 600;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        .price {
          font-size: 1.15rem;
          font-weight: 800;
          color: #2563eb;
          margin-bottom: 0.6rem;
        }

        .listing-meta {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-top: auto;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: #64748b;
        }

        .meta-item svg {
          flex-shrink: 0;
        }

        /* Desktop specific: show filters by default */
        @media (min-width: 769px) {
          .filters-toolbar {
            display: none;
          }

          .filters-content {
            display: block;
            margin-top: 1rem;
            padding-top: 0;
            border-top: none;
          }

          .btn-apply {
            display: none;
          }
        }

        /* Tablet & Mobile Breakpoints */
        @media (max-width: 768px) {
          .listings-page {
            padding: 0.85rem;
          }

          .filters-section {
            padding: 1rem;
            border-radius: 12px;
          }

          .listings-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .listing-image {
            height: 140px;
          }

          .listing-info {
            padding: 0.75rem;
          }

          .listing-info h3 {
            font-size: 0.88rem;
          }

          .price {
            font-size: 1rem;
          }

          .btn-apply {
            max-width: 100%;
          }
        }

        /* Ultra-small screen (< 360px) */
        @media (max-width: 360px) {
          .listings-grid {
            grid-template-columns: 1fr;
          }

          .listing-image {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
}
