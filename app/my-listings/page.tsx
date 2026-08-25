"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language";
import Link from "next/link";

interface Image {
  id: string;
  url: string;
  listingId: string;
}

interface Category {
  id: string;
  name: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  condition: string;
  createdAt: string;
  images: Image[];
  category: Category;
}

export default function MyListingsPage() {
  const { t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    
    const fetchMyListings = async () => {
      try {
        const response = await fetch("/api/listings/my-listings");
        if (response.status === 401) {
          if (isMounted) {
            setError("Vous devez être connecté pour voir vos annonces");
          }
          return;
        }
        if (!response.ok) {
          throw new Error("Erreur lors du chargement");
        }
        const data = await response.json();
        if (isMounted) {
          setListings(data);
        }
      } catch {
        if (isMounted) {
          setError("Erreur lors du chargement de vos annonces");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMyListings();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading">{t.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="auth-choice">
          <h2>{t.myAds}</h2>
          <p>{error}</p>
          <Link href="/login" className="btn btn-primary">
            {t.login}
          </Link>
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="main-content">
        <div className="auth-choice">
          <h2>{t.myAds}</h2>
          <p>Vous n&apos;avez pas encore d&apos;annonces</p>
          <Link href="/ads/create" className="btn btn-primary">
            {t.publish}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-listings-page">
      <div className="page-header">
        <h1>{t.myAds}</h1>
        <Link href="/ads/create" className="btn btn-primary btn-publish">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t.publish}
        </Link>
      </div>

      <div className="my-listings-grid">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/ads/${listing.id}`}
            className="my-listing-card"
          >
            <div className="card-image-wrap">
              {listing.images.length > 0 ? (
                <img
                  src={listing.images[0].url}
                  alt={listing.title}
                  loading="lazy"
                />
              ) : (
                <div className="no-image">
                  <span>{t.noImage}</span>
                </div>
              )}
              <span className={`condition-badge ${listing.condition}`}>
                {listing.condition === "new" ? t.newCondition : t.usedCondition}
              </span>
            </div>
            <div className="card-content">
              <h3>{listing.title}</h3>
              <p className="price">
                {listing.price.toLocaleString()} MRU
              </p>
              <p className="meta">
                {listing.city}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .my-listings-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 1rem 3rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .page-header h1 {
          font-size: clamp(1.4rem, 4vw, 1.85rem);
          color: #1e293b;
          font-weight: 700;
          margin: 0;
        }

        .my-listings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .my-listing-card {
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

        .my-listing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
          border-color: #2563eb;
        }

        .card-image-wrap {
          width: 100%;
          height: 180px;
          background: #f1f5f9;
          position: relative;
          overflow: hidden;
        }

        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .condition-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        [dir="rtl"] .condition-badge {
          right: auto;
          left: 0.5rem;
        }

        .condition-badge.new {
          background: #10b981;
          color: white;
        }

        .condition-badge.used {
          background: #f59e0b;
          color: white;
        }

        .card-content {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-content h3 {
          font-size: 0.95rem;
          margin-bottom: 0.4rem;
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
          margin-bottom: 0.4rem;
        }

        .meta {
          color: #64748b;
          font-size: 0.85rem;
          margin-top: auto;
        }

        @media (max-width: 768px) {
          .my-listings-page {
            padding: 1rem 0.85rem 2rem;
          }

          .my-listings-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .card-image-wrap {
            height: 140px;
          }

          .card-content {
            padding: 0.75rem;
          }

          .card-content h3 {
            font-size: 0.88rem;
          }

          .price {
            font-size: 1rem;
          }
        }

        @media (max-width: 360px) {
          .my-listings-grid {
            grid-template-columns: 1fr;
          }

          .card-image-wrap {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
}