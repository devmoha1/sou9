"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { translateCategory, translateCity, useLanguage } from "@/components/language";
import { normalizeMauritaniaPhone } from "@/lib/phone";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  condition: string;
  city: string;
  images: { url: string }[];
  seller: { id: number; name: string; phone: string; city: string };
  category: { name: string };
}

export default function ListingDetailPage() {
  const { language, t } = useLanguage();
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>{t.loading}</div>;
  if (!listing) return <div>{t.notFound}</div>;

  return (
    <div className="detail-page">
      <div className="detail-container">
        <div className="images-section">
          {listing.images.length > 0 ? (
            <div className="main-image">
              <img src={listing.images[0].url} alt={listing.title} />
            </div>
          ) : (
            <div className="no-image">{t.noImage}</div>
          )}
        </div>

        <div className="info-section">
          <div className="listing-header">
            <h1>{listing.title}</h1>
            <span className={`condition-badge ${listing.condition}`}>
              {listing.condition === "new" ? t.newCondition : t.usedCondition}
            </span>
          </div>

          <div className="price-box">
            <p className="price">{listing.price.toLocaleString()} MRU</p>
          </div>

          <div className="details-box">
            <p>
              <strong>{t.categoryLabel}</strong> {translateCategory(listing.category.name, language)}
            </p>
            <p>
              <strong>{t.cityLabel}</strong> {translateCity(listing.city, language)}
            </p>
            <p>
              <strong>{t.conditionLabel}</strong> {listing.condition === "new" ? t.newCondition : t.usedCondition}
            </p>
          </div>

          <div className="description-section">
            <h2>{t.description}</h2>
            <p>{listing.description}</p>
          </div>

          <div className="seller-section">
            <h2>{t.seller}</h2>
            <div className="seller-card">
              <p>
                <strong>{listing.seller.name}</strong>
              </p>
              <p>{translateCity(listing.seller.city, language)}</p>
              <div className="contact-buttons">
                <a
                  href={`https://wa.me/${normalizeMauritaniaPhone(listing.seller.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  WhatsApp
                </a>
                <a href={`tel:${listing.seller.phone}`} className="btn btn-secondary">
                  {t.call}
                </a>
              </div>
            </div>
          </div>

          <Link href="/ads" className="btn btn-secondary">
            {t.backAds}
          </Link>
        </div>
      </div>

      <style jsx>{`
        .detail-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .detail-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .images-section {
          display: flex;
          align-items: center;
        }

        .main-image {
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
        }

        .main-image img {
          width: 100%;
          height: auto;
        }

        .no-image {
          background: #f0f0f0;
          padding: 4rem;
          text-align: center;
          color: #999;
          border-radius: 8px;
        }

        .info-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .listing-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .listing-header h1 {
          font-size: 1.8rem;
          color: #333;
        }

        .condition-badge {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .condition-badge.new {
          background-color: #d4edda;
          color: #155724;
        }

        .condition-badge.used {
          background-color: #fff3cd;
          color: #856404;
        }

        .price-box {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #007bff;
        }

        .price {
          font-size: 2rem;
          font-weight: bold;
          color: #007bff;
          margin: 0;
        }

        .details-box {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 8px;
        }

        .details-box p {
          margin: 0.5rem 0;
        }

        .description-section {
          border-top: 1px solid #ddd;
          padding-top: 1rem;
        }

        .seller-section {
          border-top: 1px solid #ddd;
          padding-top: 1rem;
        }

        .seller-card {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .seller-card p {
          margin: 0.5rem 0;
        }

        .contact-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .contact-buttons .btn {
          flex: 1;
          text-align: center;
        }

        @media (max-width: 768px) {
          .detail-container {
            grid-template-columns: 1fr;
          }

          .listing-header {
            flex-direction: column;
          }

          .contact-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
