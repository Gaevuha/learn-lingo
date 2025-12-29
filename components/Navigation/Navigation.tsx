"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

interface NavigationProps {
  isAuthenticated: boolean;
  user: {
    displayName?: string | null;
    email?: string | null;
  } | null;
  onSignOut: () => void;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export default function Navigation({
  isAuthenticated,
  user,
  onSignOut,
  isMobile = false,
  onLinkClick,
}: NavigationProps) {
  const pathname = usePathname();

  const getAuthHref = (mode: "login" | "register") => {
    const ru = pathname || "/";
    return `/auth/${mode}?returnUrl=${encodeURIComponent(ru)}`;
  };

  if (isMobile) {
    return (
      <div className={styles.mobileNavWrapper}>
        <nav className={styles.mobileNav}>
          <Link href="/" onClick={onLinkClick}>
            Home
          </Link>
          <Link href="/teachers" onClick={onLinkClick}>
            Teachers
          </Link>

          {isAuthenticated && (
            <Link href="/favorites" onClick={onLinkClick}>
              Favorites
            </Link>
          )}
        </nav>

        <div className={styles.mobileActions}>
          {isAuthenticated ? (
            <>
              <span className={styles.mobileUser}>
                {user?.displayName || user?.email}
              </span>
              <button onClick={onSignOut}>Logout</button>
            </>
          ) : (
            <>
              <Link
                href={getAuthHref("login")}
                className={styles.mobileAuthButton}
                onClick={onLinkClick}
              >
                <svg className={styles.loginIcon}>
                  <use href="/icons/sprite.svg#icon-log-in"></use>
                </svg>
                Log in
              </Link>
              <Link
                href={getAuthHref("register")}
                className={styles.mobileRegisterButton}
                onClick={onLinkClick}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <nav className={styles.desktopNav}>
      <Link href="/" className={styles.homeLink}>
        Home
      </Link>
      <Link
        href="/teachers"
        className={
          isAuthenticated
            ? styles.teachersLink
            : styles.teachersLinkUnauthenticated
        }
      >
        Teachers
      </Link>

      {isAuthenticated ? (
        <>
          <Link href="/favorites" className={styles.favoritesLink}>
            Favorites
          </Link>
          <span className={styles.userName}>
            {user?.displayName || user?.email}
          </span>
          <button onClick={onSignOut}>Logout</button>
        </>
      ) : (
        <>
          <Link href={getAuthHref("login")} className={styles.loginLink}>
            <svg className={styles.loginIcon}>
              <use href="/icons/sprite.svg#icon-log-in"></use>
            </svg>
            Log in
          </Link>
          <Link href={getAuthHref("register")} className={styles.registerLink}>
            Register
          </Link>
        </>
      )}
    </nav>
  );
}
