import styles from "./PageHome.module.css";
import Image from "next/image";
import Link from "next/link";
import { StatsSection } from "@/components/StatsSection/StatsSection";

export default function HomePage() {
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

      <StatsSection />
    </>
  );
}
