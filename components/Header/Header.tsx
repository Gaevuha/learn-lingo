"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Logo from "@/components/Logo/Logo";
import Navigation from "@/components/Navigation/Navigation";
import styles from "./Header.module.css";

export default function Header() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { showToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast("Sign out successful", "success");
      setIsMobileMenuOpen(false);
    } catch {
      showToast("Sign out error", "error");
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.containerHeader}>
          <div
            className={`${styles.logoWrapper} ${
              isMobileMenuOpen ? styles.logoOnTop : ""
            }`}
          >
            <Logo />
          </div>

          <Navigation
            isAuthenticated={isAuthenticated}
            user={user}
            onSignOut={handleSignOut}
          />

          {isAuthenticated && (
            <span className={styles.tabletUser}>
              {user?.displayName || user?.email}
            </span>
          )}

          <button
            className={`${styles.burger} ${
              isMobileMenuOpen ? styles.open : ""
            }`}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className="container">
              <Navigation
                isAuthenticated={isAuthenticated}
                user={user}
                onSignOut={handleSignOut}
                isMobile
                onLinkClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </header>
    </>
  );
}
