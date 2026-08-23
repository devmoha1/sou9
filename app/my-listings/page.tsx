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
    <div className="main-content">
      <h1 style={{ marginBottom: "2rem" }}>{t.myAds}</h1>
      <div className="features-grid">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/ads/${listing.id}`}
            className="feature-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {listing.images.length > 0 ? (
              <img
                src={listing.images[0].url}
                alt={listing.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                }}
              >
                {t.noImage}
              </div>
            )}
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              {listing.title}
            </h3>
            <p style={{ color: "#007bff", fontWeight: "bold", marginBottom: "0.5rem" }}>
              {listing.price.toLocaleString()} MRU
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              {listing.city} • {listing.condition}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}