"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/language";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de connexion");
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
        <h1>{t.login}</h1>

        {error && <div className="error-message">{error}</div>}

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
          <label>{t.password}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? t.loginWorking : t.signIn}
        </button>

        <p className="auth-link">
          {t.noAccount} <Link href="/register">{t.signUp}</Link>
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
          max-width: 420px;
          width: 100%;
        }

        .auth-form h1 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #1e293b;
          font-size: 1.5rem;
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

        .form-group input {
          width: 100%;
          padding: 0.75rem 0.85rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          background: #f8fafc;
          transition: all 0.2s;
          min-height: 44px;
        }

        .form-group input:focus {
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
