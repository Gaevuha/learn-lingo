import TeachersList from "@/components/TeachersList/TeachersList";
import { getAllTeachers } from "@/lib/firebase";
import { Teacher } from "@/types/teacher";
import styles from "./TeachersPage.module.css";

export default async function TeachersPage() {
  let initialTeachers: Teacher[] = [];
  let totalCount = 0;
  let loadError: string | null = null;

  try {
    const { teachers: allTeachers, totalCount: count } = await getAllTeachers();
    initialTeachers = allTeachers.slice(0, 4);
    totalCount = count;
  } catch (error) {
    loadError = (error as Error)?.message || "Unknown error";
  }

  return (
    <section className={`${styles.sectionTeachers} section`}>
      <div className={`${styles.containerTeacher} container`}>
        {loadError ? (
          <div style={{ padding: 24 }}>
            <h2>Failed to load Teachers</h2>
            <p>{loadError}</p>
          </div>
        ) : (
          <TeachersList
            initialTeachers={initialTeachers}
            totalCount={totalCount}
          />
        )}
      </div>
    </section>
  );
}
