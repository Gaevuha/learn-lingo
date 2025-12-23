import { ref, get } from "firebase/database";
import { db } from "@/firebase/db";
import { Teacher } from "@/types/teacher";
import { UserData } from "@/types/user";
import { convertToArrayWithId, handleFirebaseError } from "./db-utils";

/**
 * Отримати всіх вчителів
 */
export const getAllTeachers = async (): Promise<Teacher[]> => {
  try {
    const teachersRef = ref(db, "/");
    const snapshot = await get(teachersRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return convertToArrayWithId<Teacher>(data);
    }

    return [];
  } catch (error) {
    console.error("Error getting teachers:", error);
    throw new Error(`Failed to get teachers: ${handleFirebaseError(error)}`);
  }
};

/**
 * Отримати вчителя по ID
 */
export const getTeacherById = async (
  teacherId: string
): Promise<Teacher | null> => {
  try {
    const teacherRef = ref(db, `/${teacherId}`);
    const snapshot = await get(teacherRef);

    if (snapshot.exists()) {
      return {
        id: teacherId,
        ...snapshot.val(),
      };
    }

    return null;
  } catch (error) {
    console.error(`Error getting teacher ${teacherId}:`, error);
    throw new Error(`Failed to get teacher: ${handleFirebaseError(error)}`);
  }
};

/**
 * Отримати улюблених вчителів для користувача
 */
export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const favoritesRef = ref(db, `users/${userId}/favorites`);
    const snapshot = await get(favoritesRef);

    if (snapshot.exists()) {
      const favorites = snapshot.val();
      return Object.keys(favorites).filter((key) => favorites[key] === true);
    }

    return [];
  } catch (error) {
    console.error(`Error getting favorites for user ${userId}:`, error);
    throw new Error(`Failed to get favorites: ${handleFirebaseError(error)}`);
  }
};

/**
 * Отримати дані користувача
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    return null;
  } catch (error) {
    console.error(`Error getting user data for ${userId}:`, error);
    throw new Error(`Failed to get user data: ${handleFirebaseError(error)}`);
  }
};

/**
 * Перевірити, чи вчитель є в улюблених
 */
export const isTeacherFavorite = async (
  userId: string,
  teacherId: string
): Promise<boolean> => {
  try {
    const favoriteRef = ref(db, `users/${userId}/favorites/${teacherId}`);
    const snapshot = await get(favoriteRef);

    return snapshot.exists() && snapshot.val() === true;
  } catch (error) {
    console.error(`Error checking favorite status:`, error);
    return false;
  }
};

/**
 * Отримати статистику по вчителям
 */
export const getTeachersStats = async () => {
  try {
    const teachers = await getAllTeachers();

    if (teachers.length === 0) {
      return {
        total: 0,
        averageRating: 0,
        averagePrice: 0,
        totalLessons: 0,
        totalReviews: 0,
      };
    }

    const total = teachers.length;
    const averageRating =
      teachers.reduce((sum, t) => sum + t.rating, 0) / total;
    const averagePrice =
      teachers.reduce((sum, t) => sum + t.price_per_hour, 0) / total;
    const totalLessons = teachers.reduce((sum, t) => sum + t.lessons_done, 0);
    const totalReviews = teachers.reduce(
      (sum, t) => sum + (t.reviews?.length || 0),
      0
    );

    // Групування за мовами
    const languages: Record<string, number> = {};
    teachers.forEach((teacher) => {
      teacher.languages?.forEach((lang) => {
        languages[lang] = (languages[lang] || 0) + 1;
      });
    });

    // Групування за рівнями
    const levels: Record<string, number> = {};
    teachers.forEach((teacher) => {
      teacher.levels?.forEach((level) => {
        levels[level] = (levels[level] || 0) + 1;
      });
    });

    return {
      total,
      averageRating: parseFloat(averageRating.toFixed(1)),
      averagePrice: Math.round(averagePrice),
      totalLessons,
      totalReviews,
      languages,
      levels,
    };
  } catch (error) {
    console.error("Error getting teachers stats:", error);
    throw new Error(`Failed to get stats: ${handleFirebaseError(error)}`);
  }
};

/**
 * Пошук вчителів
 */
export const searchTeachers = async (
  searchTerm: string
): Promise<Teacher[]> => {
  try {
    const teachers = await getAllTeachers();
    const term = searchTerm.toLowerCase();

    return teachers.filter((teacher) => {
      return (
        teacher.name.toLowerCase().includes(term) ||
        teacher.surname.toLowerCase().includes(term) ||
        teacher.languages?.some((lang) => lang.toLowerCase().includes(term)) ||
        teacher.levels?.some((level) => level.toLowerCase().includes(term)) ||
        teacher.experience.toLowerCase().includes(term) ||
        teacher.lesson_info.toLowerCase().includes(term)
      );
    });
  } catch (error) {
    console.error("Error searching teachers:", error);
    throw new Error(`Failed to search teachers: ${handleFirebaseError(error)}`);
  }
};
