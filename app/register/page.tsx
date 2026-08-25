"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { translateCity, useLanguage } from "@/components/language";

export default function RegisterPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Nouakchott",
    password: "",
    confirmPassword: "",
  });

  const cities = ["Nouakchott", "Rosso", "Aleg", "Kaédi", "Néma", "Atar", "Tidjikja", "Autres"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t.mismatch);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur d'inscription");
      }

      window.dispatchEvent(new Event("sou9-auth-change"));
      router.push("/ads");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>{t.register} sur Sou9</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>{t.fullName}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t.phone}</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+222 23 45 67 89"
            required
          />
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

        <div className="form-group">
          <label>{t.password}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>{t.confirmPassword}</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t.signUpWorking : t.register}
        </button>

        <p className="auth-link">
          {t.haveAccount} <Link href="/login">{t.connect}</Link>
        </p>
      </form>

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 180px);
          padding: 1.5rem 1rem 3rem;
        }

        .auth-form {
          background: white;
          padding: 2rem 1.75rem;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
          max-width: 460px;
          width: 100%;
        }

        .auth-form h1 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #1e293b;
          font-size: 1.45rem;
          font-weight: 700;
        }

        .form-group {
          margin-bottom: 1.15rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.35rem;
          font-weight: 600;
          font-size: 0.88rem;
          color: #334155;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem 0.85rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          background: #f8fafc;
          transition: all 0.2s;
          min-height: 44px;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
          background: #fff;
        }

        .error-message {
          background-color: #fee2e2;
          color: #991b1b;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.25rem;
          font-size: 0.88rem;
          border: 1px solid #fca5a5;
        }

        button[type="submit"] {
          width: 100%;
          margin-top: 0.5rem;
        }

        .auth-link {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.9rem;
          color: #64748b;
        }

        .auth-link a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-link a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .auth-container {
            padding: 1rem 0.75rem 2rem;
          }

          .auth-form {
            padding: 1.5rem 1.25rem;
            border-radius: 14px;
          }
        }
      `}</style>
    </div>
  );
}
