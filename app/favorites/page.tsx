"use client";

import { useAuth } from "@/hooks/useAuth";
import { useFavoritesTeachers } from "@/hooks/useFavoritesTeachers";
import TeacherCard from "@/components/TeacherCard/TeacherCard";
import styles from "./FavoritesPage.module.css";

export default function FavoritesPage() {
  const { user } = useAuth();
  const { data: favorites = [], isLoading, error } = useFavoritesTeachers();

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.messageBox}>
          <div className={styles.messageIcon}>
            <span>🔒</span>
          </div>
          <h3 className={styles.messageTitle}>Access denied</h3>
          <p className={styles.messageText}>
            Sign in to your account to view favorite teachers
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={`${styles.messageBox} ${styles.errorBox}`}>
          <p className={styles.errorText}>
            {error instanceof Error
              ? error.message
              : "Failed to load favorites"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Favorite teachers</h1>

      {favorites.length === 0 ? (
        <div className={styles.emptyBox}>
          <div className={styles.emptyIcon}>
            <span>🤍</span>
          </div>
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
  );
}
