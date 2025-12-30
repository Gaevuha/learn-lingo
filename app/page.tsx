import styles from "./PageHome.module.css";
import Image from "next/image";
import Link from "next/link";
import { StatsSection } from "@/components/StatsSection/StatsSection";
import type { HomeStats } from "@/hooks/useStats";

async function getStats(): Promise<HomeStats | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/stats`, {
      next: { revalidate: 3600 }, // Оновлювати кожну годину
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return null;
  }
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <>
      <section className={`${styles.sectionHero} section`}>
        <div className={`${styles.containerHero} container`}>
          <div className={styles.wrapContent}>
            <h1>
              Unlock your potential with the best <span>language</span> tutors
            </h1>
            <p>
              Embark on an Exciting Language Journey with Expert Language
              Tutors: Elevate your language proficiency to new heights by
              connecting with highly qualified and experienced tutors.
            </p>
            <Link href="/teachers">Get started</Link>
          </div>
          <Image
            src="/img/hero-img.webp"
            alt="hero-img"
            width={568}
            height={530}
            className={styles.heroImg}
            priority
          />
        </div>
      </section>

      <StatsSection initialData={stats || undefined} />
    </>
  );
}
