"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { translateCategory, translateCity, useLanguage } from "@/components/language";

interface Category {
  id: number;
  name: string;
}

export default function CreateListingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "used",
    city: "Nouakchott",
    categoryId: "",
  });

  const cities = ["Nouakchott", "Rosso", "Aleg", "Kaédi", "Néma", "Atar", "Tidjikja", "Autres"];

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImages = Array.from(e.target.files || []).slice(0, 6);
    setImages(selectedImages);
    setPreviews(selectedImages.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const uploadData = new FormData();
        images.forEach((image) => uploadData.append("images", image));
        const uploadResponse = await fetch("/api/uploads", {
          method: "POST",
          body: uploadData,
        });
        const uploadText = await uploadResponse.text();

let uploadResult: { urls?: string[]; error?: string } = {};

try {
  uploadResult = uploadText ? JSON.parse(uploadText) : {};
} catch {
  throw new Error(
    `Erreur d'upload (${uploadResponse.status}) : réponse invalide du serveur`
  );
}

if (!uploadResponse.ok) {
  throw new Error(uploadResult.error || "Erreur d'upload");
}

if (!Array.isArray(uploadResult.urls)) {
  throw new Error("Le serveur n'a pas retourné les URLs des images");
}

imageUrls = uploadResult.urls;
      }

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price, 10),
          categoryId: parseInt(formData.categoryId, 10),
          images: imageUrls,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de création");
      }

      const listing = await res.json();
      router.push(`/ads/${listing.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <form onSubmit={handleSubmit} className="create-form">
        <h1>{t.createListing}</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>{t.title}</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="ex: iPhone 15 Pro..."
            required
          />
        </div>

        <div className="form-group">
          <label>{t.description}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t.describe}
            rows={5}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">{t.imageHelp}</label>
          <input
            id="images"
            type="file"
            name="images"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImagesChange}
          />
          {previews.length > 0 && (
            <div className="previews">
              {previews.map((preview, index) => (
                <img key={preview} src={preview} alt={`Aperçu ${index + 1}`} />
              ))}
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t.category}</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
              <option value="">{t.selectCategory}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {translateCategory(cat.name, language)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>{t.price}</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t.condition}</label>
            <select name="condition" value={formData.condition} onChange={handleChange}>
              <option value="new">{t.newCondition}</option>
              <option value="used">{t.usedCondition}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t.city}</label>
            <select name="city" value={formData.city} onChange={handleChange}>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {translateCity(c, language)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t.creating : t.publishAd}
        </button>
      </form>

      <style jsx>{`
        .create-page {
          max-width: 650px;
          margin: 0 auto;
          padding: 1.5rem 1rem 3rem;
        }

        .create-form {
          background: white;
          padding: 2rem 1.75rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .create-form h1 {
          margin-bottom: 1.5rem;
          color: #1e293b;
          font-size: clamp(1.35rem, 4vw, 1.75rem);
          font-weight: 700;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 600;
          font-size: 0.88rem;
          color: #334155;
        }

        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group input[type="file"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem 0.85rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          font-family: inherit;
          background: #f8fafc;
          transition: all 0.2s;
          min-height: 44px;
        }

        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
          background: #fff;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .previews {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
          margin-top: 0.75rem;
        }

        .previews img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .error-message {
          background-color: #fee2e2;
          color: #991b1b;
          padding: 0.85rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.25rem;
          font-size: 0.9rem;
          border: 1px solid #fca5a5;
        }

        button[type="submit"] {
          width: 100%;
          margin-top: 0.75rem;
        }

        @media (max-width: 640px) {
          .create-page {
            padding: 1rem 0.75rem 2rem;
          }

          .create-form {
            padding: 1.25rem 1rem;
            border-radius: 12px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
