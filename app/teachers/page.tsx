import TeachersList from "@/components/TeachersList";
import { getAllTeachers } from "@/lib/firebase";

export default async function TeachersPage() {
  // Loading the first 4 cards on the server
  const { teachers: allTeachers, totalCount } = await getAllTeachers();
  const initialTeachers = allTeachers.slice(0, 4);

  return (
    <div className="container">
      <TeachersList initialTeachers={initialTeachers} totalCount={totalCount} />
    </div>
  );
}
