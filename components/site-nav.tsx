"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LanguageSwitcher, useLanguage } from "@/components/language";

interface User {
  id: string;
  email: string;
  name: string;
  city: string | null;
  role: string;
}

interface NavLinksProps {
  user: User | null;
  onLinkClick: () => void;
  onLogout: () => void;
  t: Record<string, string>;
}

function NavLinks({ user, onLinkClick, onLogout, t }: NavLinksProps) {
  return (
    <>
      <Link href="/ads" className="nav-link" onClick={onLinkClick}>
        {t.browseAds}
      </Link>
      <Link href="/ads/create" className="nav-link nav-link-primary" onClick={onLinkClick}>
        {t.publish}
      </Link>
      {user ? (
        <>
          {user.role === "admin" && (
            <Link href="/admin" className="nav-link" onClick={onLinkClick}>
              {t.admin}
            </Link>
          )}
          <Link href="/my-listings" className="nav-link" onClick={onLinkClick}>
            {t.myAds}
          </Link>
          <button onClick={onLogout} className="nav-link nav-link-logout">
            {t.logout}
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="nav-link" onClick={onLinkClick}>
            {t.login}
          </Link>
          <Link href="/register" className="nav-link nav-link-primary" onClick={onLinkClick}>
            {t.register}
          </Link>
        </>
      )}
    </>
  );
}

export default function SiteNav() {
  const { t } = useLanguage();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (isMounted) {
          setUser(data.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      }
    };

    checkAuth();
    window.addEventListener("sou9-auth-change", checkAuth);

    return () => {
      isMounted = false;
      window.removeEventListener("sou9-auth-change", checkAuth);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.dispatchEvent(new Event("sou9-auth-change"));
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ads?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleBackdropClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo" onClick={handleLinkClick}>
          <span className="logo-icon">🛒</span>
          <span>Sou9</span>
        </Link>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearch} className="search-bar desktop-search">
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button" aria-label="Rechercher">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>

        {/* Desktop Navigation */}
        <div className="navbar-links desktop-nav">
          <NavLinks user={user} onLinkClick={handleLinkClick} onLogout={handleLogout} t={t} />
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? t.closeMenu : (t.language === "العربية" ? "فتح القائمة" : "Ouvrir le menu")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`hamburger ${menuOpen ? "is-open" : ""}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        {/* Mobile Navigation Links */}
        <div className="mobile-nav-links">
          <NavLinks user={user} onLinkClick={handleLinkClick} onLogout={handleLogout} t={t} />
          <div className="mobile-language">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      
      {/* Mobile menu backdrop */}
      {menuOpen && (
        <div 
          className="mobile-menu-backdrop is-open"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}