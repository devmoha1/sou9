"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { translateCity, useLanguage } from "@/components/language";

interface Listing {
  id: number;
  title: string;
  price: number;
  city: string;
  seller: { name: string };
}

interface Stats {
  listings: number;
  users: number;
  categories: number;
}

export default function AdminPage() {
  const { language, t } = useLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<Stats>({ listings: 0, users: 0, categories: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAdminData = async () => {
      const userResponse = await fetch("/api/auth/me");
      const userData = await userResponse.json();
      if (userData.user?.role !== "admin") {
        setError(t.adminOnly);
        return;
      }

      const [listingsResponse, statsResponse] = await Promise.all([
        fetch("/api/listings"),
        fetch("/api/admin/stats"),
      ]);
      const listingsData = await listingsResponse.json();
      const statsData = await statsResponse.json();
      setListings(listingsData.listings || []);
      setStats(statsData);
    };

    void loadAdminData();
  }, [t.adminOnly]);

  const deleteListing = async (id: number) => {
    if (!window.confirm(t.deleteQuestion)) return;
    const response = await fetch(`/api/listings/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError(t.deleteError);
      return;
    }
    setListings((current) => current.filter((listing) => listing.id !== id));
    setStats((current) => ({ ...current, listings: current.listings - 1 }));
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">{t.administration}</p>
          <h1>{t.manageAds}</h1>
        </div>
        <Link href="/ads/create" className="btn btn-primary">{t.publishAd}</Link>
      </div>

      {error ? <p className="error-message">{error}</p> : (
        <>
          <div className="stats-grid">
            <div className="stat-card"><strong>{stats.listings}</strong><span>{t.ads}</span></div>
            <div className="stat-card"><strong>{stats.users}</strong><span>{t.users}</span></div>
            <div className="stat-card"><strong>{stats.categories}</strong><span>{t.categories}</span></div>
          </div>
          <div className="admin-list">
            {listings.map((listing) => (
              <article className="admin-item" key={listing.id}>
                <div>
                  <Link href={`/ads/${listing.id}`}><h2>{listing.title}</h2></Link>
                  <p>{listing.price.toLocaleString()} MRU · {translateCity(listing.city, language)} · {listing.seller.name}</p>
                </div>
                <button className="btn btn-danger" onClick={() => deleteListing(listing.id)}>{t.delete}</button>
              </article>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .admin-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 1.5rem 1rem 3rem;
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .eyebrow {
          color: #2563eb;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          margin-bottom: 0.2rem;
        }

        .admin-header h1 {
          font-size: clamp(1.35rem, 4vw, 1.75rem);
          color: #1e293b;
          font-weight: 700;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
          text-align: center;
        }

        .stat-card strong {
          color: #2563eb;
          font-size: 1.75rem;
          font-weight: 800;
        }

        .stat-card span {
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .admin-list {
          display: grid;
          gap: 0.85rem;
        }

        .admin-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .admin-item h2 {
          color: #1e293b;
          font-size: 1rem;
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        .admin-item p {
          color: #64748b;
          font-size: 0.85rem;
          margin: 0;
        }

        .admin-item a {
          text-decoration: none;
        }

        .admin-item a:hover h2 {
          color: #2563eb;
        }

        .btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: 0;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.88rem;
          min-height: 38px;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #fca5a5;
        }

        @media (max-width: 640px) {
          .admin-page {
            padding: 1rem 0.75rem 2rem;
          }

          .admin-header {
            flex-direction: column;
            align-items: stretch;
          }

          .stats-grid {
            gap: 0.5rem;
          }

          .stat-card {
            padding: 0.85rem 0.5rem;
          }

          .stat-card strong {
            font-size: 1.4rem;
          }

          .stat-card span {
            font-size: 0.75rem;
          }

          .admin-item {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
            padding: 1rem;
          }

          .admin-item .btn-danger {
            width: 100%;
          }
        }

        @media (max-width: 360px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        [dir="rtl"] .admin-item {
          text-align: right;
        }
      `}</style>
    </div>
  );
}
