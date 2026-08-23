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
        .admin-page { max-width: 1000px; margin: 0 auto; padding: 2rem 1rem; }
        .admin-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; }
        .eyebrow { color: #007bff; font-weight: 700; text-transform: uppercase; font-size: .8rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; gap: .25rem; }
        .stat-card strong { color: #007bff; font-size: 1.8rem; }
        .stat-card span, .admin-item p { color: #666; }
        .admin-list { display: grid; gap: 1rem; }
        .admin-item { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 1rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        .admin-item h2 { color: #333; font-size: 1.1rem; margin-bottom: .4rem; }
        .admin-item a { text-decoration: none; }
        .btn-danger { background: #dc3545; color: white; border: 0; cursor: pointer; }
        .error-message { background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; }
        @media (max-width: 600px) { .admin-header, .admin-item { align-items: stretch; flex-direction: column; } .stats-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
