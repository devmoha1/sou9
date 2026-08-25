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
            <div className="no-image">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span>{t.noImage}</span>
            </div>
          )}
        </div>

        <div className="info-section">
          <div className="listing-header">
            <div className="header-content">
              <h1>{listing.title}</h1>
              <span className={`condition-badge ${listing.condition}`}>
                {listing.condition === "new" ? t.newCondition : t.usedCondition}
              </span>
            </div>
          </div>

          <div className="price-box">
            <p className="price">{listing.price.toLocaleString()} MRU</p>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z" />
                </svg>
              </div>
              <div className="detail-content">
                <span className="detail-label">{t.categoryLabel}</span>
                <span className="detail-value">{translateCategory(listing.category.name, language)}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="detail-content">
                <span className="detail-label">{t.cityLabel}</span>
                <span className="detail-value">{translateCity(listing.city, language)}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div className="detail-content">
                <span className="detail-label">{t.conditionLabel}</span>
                <span className="detail-value">{listing.condition === "new" ? t.newCondition : t.usedCondition}</span>
              </div>
            </div>
          </div>

          <div className="description-section">
            <h2>{t.description}</h2>
            <p>{listing.description}</p>
          </div>

          <div className="seller-section">
            <h2>{t.seller}</h2>
            <div className="seller-card">
              <div className="seller-header">
                <div className="seller-avatar">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="seller-info">
                  <p className="seller-name">{listing.seller.name}</p>
                  <p className="seller-location">{translateCity(listing.seller.city, language)}</p>
                </div>
              </div>
              <div className="contact-buttons">
                <a
                  href={`https://wa.me/${normalizeMauritaniaPhone(listing.seller.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-whatsapp"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
                <a href={`tel:${listing.seller.phone}`} className="btn btn-secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {t.call}
                </a>
              </div>
            </div>
          </div>

          <Link href="/ads" className="btn btn-secondary btn-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t.backAds}
          </Link>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="mobile-bottom-bar">
        <a
          href={`https://wa.me/${normalizeMauritaniaPhone(listing.seller.phone)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-mobile-action btn-mobile-whatsapp"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>WhatsApp</span>
        </a>
        <a href={`tel:${listing.seller.phone}`} className="btn-mobile-action btn-mobile-call">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>{t.call}</span>
        </a>
      </div>

      <style jsx>{`
        .detail-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
        }

        .detail-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .images-section {
          display: flex;
          align-items: center;
        }

        .main-image {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .main-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .no-image {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          padding: 4rem;
          text-align: center;
          color: #64748b;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .no-image svg {
          color: #94a3b8;
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

        .header-content {
          flex: 1;
        }

        .listing-header h1 {
          font-size: 2rem;
          color: #1e293b;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .condition-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .condition-badge.new {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .condition-badge.used {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .price-box {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }

        .price {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .detail-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #2563eb;
          border-radius: 10px;
          color: white;
          flex-shrink: 0;
        }

        .detail-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 0.95rem;
          color: #1e293b;
          font-weight: 600;
        }

        .description-section {
          border-top: 1px solid #e2e8f0;
          padding-top: 1.5rem;
        }

        .description-section h2 {
          font-size: 1.25rem;
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .description-section p {
          color: #475569;
          line-height: 1.7;
          margin: 0;
        }

        .seller-section {
          border-top: 1px solid #e2e8f0;
          padding-top: 1.5rem;
        }

        .seller-section h2 {
          font-size: 1.25rem;
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .seller-card {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .seller-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .seller-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border-radius: 50%;
          color: white;
          flex-shrink: 0;
        }

        .seller-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .seller-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 1rem;
          margin: 0;
        }

        .seller-location {
          color: #64748b;
          font-size: 0.875rem;
          margin: 0;
        }

        .contact-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .contact-buttons .btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-whatsapp {
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
        }

        .btn-whatsapp:hover {
          background: linear-gradient(135deg, #128C7E 0%, #075E54 100%);
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        /* Mobile Bottom Bar (hidden on desktop) */
        .mobile-bottom-bar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom, 0px));
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.12);
          border-top: 1px solid #e2e8f0;
          z-index: 990;
          gap: 0.75rem;
        }

        .btn-mobile-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          min-height: 48px;
          transition: transform 0.15s ease;
        }

        .btn-mobile-action:active {
          transform: scale(0.98);
        }

        .btn-mobile-whatsapp {
          background: #25D366;
          color: white;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }

        .btn-mobile-call {
          background: #2563eb;
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .detail-page {
            padding: 0.85rem 0.85rem 5rem; /* Extra padding for bottom bar */
          }

          .detail-container {
            grid-template-columns: 1fr;
            padding: 1.25rem;
            border-radius: 14px;
            gap: 1.25rem;
          }

          .listing-header h1 {
            font-size: 1.35rem;
            word-break: break-word;
          }

          .price-box {
            padding: 1rem 1.25rem;
          }

          .price {
            font-size: 1.65rem;
          }

          .details-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.65rem;
          }

          .detail-item {
            padding: 0.65rem;
            gap: 0.65rem;
          }

          .detail-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
          }

          .detail-icon svg {
            width: 16px;
            height: 16px;
          }

          .detail-value {
            font-size: 0.85rem;
          }

          .seller-header {
            flex-direction: row;
            text-align: left;
          }

          .contact-buttons {
            display: none; /* Replaced by sticky mobile bottom bar on smartphones */
          }

          .mobile-bottom-bar {
            display: flex;
          }
        }

        @media (max-width: 360px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
        }

        /* RTL Support */
        [dir="rtl"] .listing-header {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .detail-item {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .seller-header {
          flex-direction: row-reverse;
          text-align: right;
        }

        [dir="rtl"] .contact-buttons {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .btn-back {
          flex-direction: row-reverse;
        }

        [dir="rtl"] .btn-back svg {
          transform: rotate(180deg);
        }

        [dir="rtl"] .mobile-bottom-bar {
          flex-direction: row-reverse;
        }
      `}</style>
    </div>
  );
}
