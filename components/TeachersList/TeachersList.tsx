"use client";

import { useState, useEffect, useMemo } from "react";
import TeacherCard from "../TeacherCard/TeacherCard";
import FilterBar from "../FilterBar/FilterBar";
import { Teacher } from "@/types/teacher";
import { useTeachers } from "@/hooks/useTeachers";
import styles from "./TeachersList.module.css";

interface TeachersListProps {
  initialTeachers: Teacher[];
  totalCount: number;
}

export default function TeachersList({
  initialTeachers,
  totalCount: initialTotalCount,
}: TeachersListProps) {
  const [allTeachers, setAllTeachers] = useState<Teacher[]>(initialTeachers);

  // Getting unique values for filters
  const languages = useMemo(() => {
    const allLanguages = initialTeachers.flatMap(
      (teacher) => teacher.languages || []
    );
    return Array.from(new Set(allLanguages));
  }, [initialTeachers]);

  const levels = useMemo(() => {
    const allLevels = initialTeachers.flatMap(
      (teacher) => teacher.levels || []
    );
    return Array.from(new Set(allLevels));
  }, [initialTeachers]);

  const prices = useMemo(() => {
    const allPrices = initialTeachers.map((teacher) => teacher.price_per_hour);
    return Array.from(new Set(allPrices)).sort((a, b) => a - b);
  }, [initialTeachers]);

  const [currentFilters, setCurrentFilters] = useState({
    language: languages[0] || "",
    level: levels[0] || "",
    price: prices[0]?.toString() || "",
  });
  const [currentOffset, setCurrentOffset] = useState(0);

  const { data, isLoading, error } = useTeachers({
    ...currentFilters,
    offset: currentOffset,
    limit: 4,
  });

  // Update allTeachers when receiving new data
  useEffect(() => {
    if (!data?.teachers) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllTeachers((prev) => {
      // Якщо offset === 0, просто замінюємо
      if (currentOffset === 0) {
        // Порівнюємо по ID, щоб уникнути непотрібних оновлень
        const prevIds = new Set(
          prev.map((t) => t.id).filter((id): id is string => Boolean(id))
        );

        const newIds = new Set(
          data.teachers
            .map((t) => t.id)
            .filter((id): id is string => Boolean(id))
        );

        const idsEqual =
          prevIds.size === newIds.size &&
          Array.from(prevIds).every((id) => newIds.has(id));

        if (!idsEqual) {
          return data.teachers;
        }
        return prev;
      }

      // Для додавання нових викладачів
      const newTeachers = data.teachers.filter(
        (t) => !prev.some((prevT) => prevT.id === t.id)
      );
      if (newTeachers.length === 0) return prev;

      return [...prev, ...newTeachers];
    });
  }, [data, currentOffset]);

  // Мемоізуємо список вчителів для запобігання непотрібних ререндерів
  const teachers = useMemo(() => allTeachers, [allTeachers]);
  const totalCount = data?.totalCount || initialTotalCount;

  const handleFilterBarChange = (key: string, value: string) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);
    setCurrentOffset(0);
    // Не очищаємо список одразу - дані оновляться через useEffect коли прийдуть нові дані
    // Це запобігає миготінню, оскільки старі картки залишаються до появи нових
  };

  const loadMore = () => {
    if (teachers.length < totalCount) {
      setCurrentOffset((prev) => prev + 4);
    }
  };

  if (isLoading && teachers.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading teachers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorBox}>
          <p className={styles.errorText}>
            {error instanceof Error ? error.message : "Failed to load data"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* FilterBar */}
      <FilterBar
        filters={currentFilters}
        onFilterChange={handleFilterBarChange}
        languages={languages}
        levels={levels}
        prices={prices.map((p) => p.toString())}
      />

      {/* Results */}
      <div className={styles.results}>
        {teachers.length === 0 && !isLoading ? (
          <div className={styles.noResultsContainer}>
            <div className={styles.noResultsBox}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h3 className={styles.noResultsTitle}>
                Не знайдено жодного вчителя
              </h3>
              <p className={styles.noResultsText}>
                Не знайдено жодного вчителя з такими параметрами. Спробуйте інші
                параметри пошуку.
              </p>
            </div>
          </div>
        ) : (
          <>
            <ul className={styles.grid}>
              {teachers.map((teacher) => (
                <li key={teacher.id} className={styles.listItem}>
                  <TeacherCard
                    teacher={teacher}
                    selectedLevel={currentFilters.level}
                  />
                </li>
              ))}
            </ul>
            {teachers.length < totalCount && !isLoading && (
              <div className={styles.loadMoreContainer}>
                <button onClick={loadMore} className={styles.loadMoreButton}>
                  Load More
                </button>
              </div>
            )}
            {isLoading && teachers.length > 0 && (
              <div className={styles.loadingSpinner}>
                <div className={styles.smallSpinner}></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
