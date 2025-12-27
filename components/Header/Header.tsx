"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import Logo from "@/components/Logo/Logo";
import Navigation from "@/components/Navigation/Navigation";
import styles from "./Header.module.css";

export default function Header() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { showToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className={`${styles.container} container`}>
          <div
            className={`${styles.logoWrapper} ${
              isMobileMenuOpen ? styles.logoOnTop : ""
            }`}
          >
            <Logo />
          </div>

          {/* ===== Desktop navigation ===== */}
          <Navigation
            isAuthenticated={isAuthenticated}
            user={user}
            onSignOut={handleSignOut}
          />

          {/* ===== Tablet username ===== */}
          {isAuthenticated && (
            <span className={styles.tabletUser}>
              {user?.displayName || user?.email}
            </span>
          )}

          {/* ===== Burger ===== */}
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

        {/* ===== Mobile / Tablet menu ===== */}
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

      {/* Modal is rendered via parallel route slot @modal */}
    </>
  );
}
