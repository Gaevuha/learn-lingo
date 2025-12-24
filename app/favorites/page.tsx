"use client";

import { useAuth } from "@/hooks/useAuth";
import { useFavoritesTeachers } from "@/hooks/useFavoritesTeachers";
import { Teacher } from "@/types/teacher";
import TeacherCard from "@/components/TeacherCard";

export default function FavoritesPage() {
  const { user } = useAuth();
  const { data: favorites = [], isLoading, error } = useFavoritesTeachers();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Access denied
          </h3>
          <p className="text-gray-600 mb-4">
            Sign in to your account to view favorite teachers
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
            <p className="text-red-600 font-semibold mb-2">
              {error instanceof Error
                ? error.message
                : "Failed to load favorites"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Favorite teachers
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No favorite teachers
          </h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Add teachers to favorites on the Teachers page
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((teacher) => (
            <li
              key={teacher.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-6"
            >
              <TeacherCard teacher={teacher} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
