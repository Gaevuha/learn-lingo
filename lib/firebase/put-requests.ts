import { ref, update, set } from "firebase/database";
import { db } from "@/firebase/db";
import { Teacher } from "@/types/teacher";
import { UserData } from "@/types/user";
import { handleFirebaseError } from "./db-utils";
import { get } from "firebase/database";

/**
 * Оновити дані вчителя
 */
export const updateTeacher = async (
  teacherId: string,
  updates: Partial<Teacher>
): Promise<void> => {
  try {
    const updatesObj: Record<string, unknown> = {};

    Object.keys(updates).forEach((key) => {
      if (updates[key as keyof Teacher] !== undefined) {
        updatesObj[`/${teacherId}/${key}`] = updates[key as keyof Teacher];
      }
    });

    await update(ref(db), updatesObj);
  } catch (error) {
    throw new Error(`Failed to update teacher: ${handleFirebaseError(error)}`);
  }
};

/**
 * Оновити дані користувача
 */
export const updateUser = async (
  userId: string,
  updates: Partial<UserData>
): Promise<void> => {
  try {
    const updatesObj: Record<string, unknown> = {};

    Object.keys(updates).forEach((key) => {
      if (updates[key as keyof UserData] !== undefined) {
        updatesObj[`users/${userId}/${key}`] = updates[key as keyof UserData];
      }
    });

    await update(ref(db), updatesObj);
  } catch (error) {
    throw new Error(`Failed to update user: ${handleFirebaseError(error)}`);
  }
};

/**
 * Оновити останній логін користувача
 */
export const updateUserLastLogin = async (userId: string): Promise<void> => {
  try {
    await set(ref(db, `users/${userId}/lastLogin`), Date.now());
  } catch (error) {
    throw new Error(
      `Failed to update last login: ${handleFirebaseError(error)}`
    );
  }
};

/**
 * Оновити кількість проведених уроків
 */
export const incrementTeacherLessons = async (
  teacherId: string,
  incrementBy: number = 1
): Promise<void> => {
  try {
    const teacherRef = ref(db, `/${teacherId}/lessons_done`);
    const snapshot = await get(teacherRef);

    const currentLessons = snapshot.exists() ? snapshot.val() : 0;
    const newLessons = currentLessons + incrementBy;

    await set(teacherRef, newLessons);
  } catch (error) {
    throw new Error(
      `Failed to increment lessons: ${handleFirebaseError(error)}`
    );
  }
};

/**
 * Тоггл улюбленого вчителя
 */
export const toggleFavorite = async (
  userId: string,
  teacherId: string
): Promise<boolean> => {
  try {
    const favoriteRef = ref(db, `users/${userId}/favorites/${teacherId}`);
    const snapshot = await get(favoriteRef);

    const isFavorite = snapshot.exists() && snapshot.val() === true;

    if (isFavorite) {
      // Видалити з улюблених
      await set(favoriteRef, null);
      return false;
    } else {
      // Додати в улюблені
      await set(favoriteRef, true);
      // Оновити lastLogin
      await set(ref(db, `users/${userId}/lastLogin`), Date.now());
      return true;
    }
  } catch (error) {
    throw new Error(`Failed to toggle favorite: ${handleFirebaseError(error)}`);
  }
};
