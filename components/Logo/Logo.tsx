// components/Logo/Logo.tsx

"use client";

import Link from "next/link";
import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <Link href={"/"} className={styles.logoLink}>
      <svg className={styles.logo}>
        <use href="/icons/sprite.svg#icon-logo"></use>
      </svg>
      <span className={styles.logoText}>LearnLingo</span>
    </Link>
  );
}
