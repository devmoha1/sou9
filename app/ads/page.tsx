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

  const cities = ["Nouakchott", "Rosso", "Aleg", "Kaédi", "Néma", "Atar", "Tidjikja", "Autres"];

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
        <h2>{t.searchAd}</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder={t.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          />
        </div>

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
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>{t.maxPrice}</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>&nbsp;</label>
            <button onClick={handleFilter} className="btn btn-primary">
              {t.filter}
            </button>
          </div>
        </div>
      </div>

      <div className="listings-container">
        <h2>{t.adsCount} ({listings.length})</h2>
        {loading ? (
          <p>{t.loading}</p>
        ) : listings.length === 0 ? (
          <p>{t.noAds}</p>
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
                    <img src={listing.images[0].url} alt={listing.title} />
                  ) : (
                    <div className="no-image">{t.noImage}</div>
                  )}
                </div>
                <div className="listing-info">
                  <h3>{listing.title}</h3>
                  <p className="price">{listing.price.toLocaleString()} MRU</p>
                  <p className="seller">{t.by} {listing.seller.name}</p>
                  <p className="city">{translateCity(listing.city, language)}</p>
                  <span className={`condition ${listing.condition}`}>
                    {listing.condition === "new" ? t.newCondition : t.usedCondition}
                  </span>
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
          padding: 2rem 1rem;
        }

        .filters-section {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .search-box {
          margin-bottom: 1.5rem;
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-group label {
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .filter-group select,
        .filter-group input {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .listing-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s, box-shadow 0.3s;
          text-decoration: none;
          color: inherit;
        }

        .listing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .listing-image {
          width: 100%;
          height: 200px;
          background: #f0f0f0;
          overflow: hidden;
        }

        .listing-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #999;
        }

        .listing-info {
          padding: 1rem;
        }

        .listing-info h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .price {
          font-size: 1.2rem;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 0.5rem;
        }

        .seller,
        .city {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .condition {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .condition.new {
          background-color: #d4edda;
          color: #155724;
        }

        .condition.used {
          background-color: #fff3cd;
          color: #856404;
        }

        @media (max-width: 768px) {
          .filters-grid {
            grid-template-columns: 1fr;
          }

          .listings-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
