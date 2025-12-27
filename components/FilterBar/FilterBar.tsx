"use client";

import styles from "./FilterBar.module.css";

interface FilterBarProps {
  filters: {
    language: string;
    level: string;
    price: string;
  };
  onFilterChange: (key: string, value: string) => void;
  languages: string[];
  levels: string[];
  prices: string[];
}

export default function FilterBar({
  filters,
  onFilterChange,
  languages,
  levels,
  prices,
}: FilterBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Languages */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Languages</label>
          <div className={styles.selectWrapper}>
            <select
              value={filters.language}
              onChange={(e) => onFilterChange("language", e.target.value)}
              className={styles.select}
            >
              <option value="all">All Languages</option>
              {languages
                .filter((lang) => lang !== "all")
                .map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
            </select>
            <span className={styles.selectArrow}>▼</span>
          </div>
        </div>

        {/* Level */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Level of knowledge</label>
          <div className={styles.selectWrapper}>
            <select
              value={filters.level}
              onChange={(e) => onFilterChange("level", e.target.value)}
              className={styles.select}
            >
              <option value="all">All Levels</option>
              {levels
                .filter((lvl) => lvl !== "all")
                .map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
            </select>
            <span className={styles.selectArrow}>▼</span>
          </div>
        </div>

        {/* Price */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Price</label>
          <div className={styles.selectWrapper}>
            <select
              value={filters.price}
              onChange={(e) => onFilterChange("price", e.target.value)}
              className={styles.select}
            >
              <option value="all">All Prices</option>
              {prices.map((price) => (
                <option key={price} value={price}>
                  {price} $
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>▼</span>
          </div>
        </div>
      </div>
    </div>
  );
}

