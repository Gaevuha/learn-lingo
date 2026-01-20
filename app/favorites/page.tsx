"use client";

import { useAuth } from "@/hooks/useAuth";
import { useFavoritesTeachers } from "@/hooks/useFavoritesTeachers";
import TeacherCard from "@/components/TeacherCard/TeacherCard";
import styles from "./FavoritesPage.module.css";

export default function FavoritesPage() {
  const { user } = useAuth();
  const { data: favorites = [], isLoading, error } = useFavoritesTeachers();

  /* 🔒 NOT AUTHORIZED */
  if (!user) {
    return (
      <section className="section">
        <div className="container">
          <div className={styles.containerFavorites}>
            <div className={styles.messageBox}>
              <div className={styles.messageIcon}>🔒</div>
              <h3 className={styles.messageTitle}>Access denied</h3>
              <p className={styles.messageText}>
                Sign in to your account to view favorite teachers
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ⏳ LOADING */
  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  /* ❌ ERROR */
  if (error) {
    return (
      <section className="section">
        <div className="container">
          <div className={`${styles.messageBox} ${styles.errorBox}`}>
            <p className={styles.errorText}>
              {error instanceof Error
                ? error.message
                : "Failed to load favorites"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ✅ CONTENT */
  return (
    <section className="section">
      <div className="container">
        <div className={styles.containerFavorites}>
          <h1 className={styles.title}>Favorite teachers</h1>

          {favorites.length === 0 ? (
            <div className={styles.emptyBox}>
              <div className={styles.emptyIcon}>🤍</div>
              <h3 className={styles.emptyTitle}>No favorite teachers</h3>
              <p className={styles.emptyText}>
                Add teachers to favorites on the Teachers page
              </p>
            </div>
          ) : (
            <div className={styles.teachersList}>
              {favorites.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
