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
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || "Erreur d'upload");
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
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .create-form {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .create-form h1 {
          margin-bottom: 2rem;
          color: #333;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .previews {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .previews img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 4px;
        }

        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
