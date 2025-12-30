"use client";

import { useState, useRef, useEffect } from "react";
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
  const [openSelect, setOpenSelect] = useState<string | null>(null);

  const handleSelectToggle = (name: string) => {
    setOpenSelect(openSelect === name ? null : name);
  };

  const handleOptionSelect = (key: string, value: string) => {
    onFilterChange(key, value);
    setOpenSelect(null);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as Element).closest(`.${styles.selectWrapper}`)) {
      setOpenSelect(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const getCurrentLabel = (key: string, value: string) => {
    if (key === "language") {
      return value;
    }
    if (key === "level") {
      return value;
    }
    if (key === "price") {
      return `${value} $`;
    }
    return "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Languages */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Languages</label>
          <div
            className={`${styles.selectWrapper} ${
              openSelect === "language" ? styles.open : ""
            }`}
          >
            <div
              className={styles.select}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectToggle("language");
              }}
            >
              <span>{getCurrentLabel("language", filters.language)}</span>
              <svg className={styles.arrow}>
                <use href="/icons/sprite.svg#icon-arrow" />
              </svg>
            </div>

            {openSelect === "language" && (
              <div className={styles.dropdown}>
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className={`${styles.option} ${
                      filters.language === lang ? styles.selected : ""
                    }`}
                    onClick={() => handleOptionSelect("language", lang)}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Level */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Level of knowledge</label>
          <div
            className={`${styles.selectWrapper} ${
              openSelect === "level" ? styles.open : ""
            }`}
          >
            <div
              className={styles.select}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectToggle("level");
              }}
            >
              <span>{getCurrentLabel("level", filters.level)}</span>
              <svg className={styles.arrow}>
                <use href="/icons/sprite.svg#icon-arrow" />
              </svg>
            </div>

            {openSelect === "level" && (
              <div className={styles.dropdown}>
                {levels.map((lvl) => (
                  <div
                    key={lvl}
                    className={`${styles.option} ${
                      filters.level === lvl ? styles.selected : ""
                    }`}
                    onClick={() => handleOptionSelect("level", lvl)}
                  >
                    {lvl}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Price</label>
          <div
            className={`${styles.selectWrapper} ${
              openSelect === "price" ? styles.open : ""
            }`}
          >
            <div
              className={styles.select}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectToggle("price");
              }}
            >
              <span>{getCurrentLabel("price", filters.price)}</span>
              <svg className={styles.arrow}>
                <use href="/icons/sprite.svg#icon-arrow" />
              </svg>
            </div>

            {openSelect === "price" && (
              <div className={styles.dropdown}>
                {prices.map((price) => (
                  <div
                    key={price}
                    className={`${styles.option} ${
                      filters.price === price ? styles.selected : ""
                    }`}
                    onClick={() => handleOptionSelect("price", price)}
                  >
                    {price} $
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
