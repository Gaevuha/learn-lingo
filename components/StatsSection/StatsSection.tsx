"use client";

import { useStats } from "@/hooks/useStats";
import styles from "./StatsSection.module.css";

export const StatsSection = () => {
  const { data: stats, isLoading, error } = useStats();

  if (error) {
    return null; // Можна показати фолбек або пропустити секцію
  }

  if (isLoading || !stats) {
    return (
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>...</div>
              <div className={styles.statLabel}>Loading...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.statsSection}>
      <div className="container">
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {stats.tutorsCount.toLocaleString()} +
            </div>
            <div className={styles.statLabel}>
              Experienced
              <br />
              tutors
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {stats.reviewsCount.toLocaleString()} +
            </div>
            <div className={styles.statLabel}>
              5-star tutor
              <br />
              reviews
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {stats.subjectsCount.toLocaleString()} +
            </div>
            <div className={styles.statLabel}>
              Subjects
              <br />
              taught
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {stats.nationalitiesCount.toLocaleString()} +
            </div>
            <div className={styles.statLabel}>
              Tutor
              <br />
              nationalities
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
