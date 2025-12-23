import { ref, set, remove } from "firebase/database";
import { db } from "@/firebase/db";
import { handleFirebaseError } from "./db-utils";
import { get } from "firebase/database";

/**
 * Видалити вчителя
 */
export const deleteTeacher = async (teacherId: string): Promise<void> => {
  try {
    await remove(ref(db, `/${teacherId}`));
  } catch (error) {
    console.error(`Error deleting teacher ${teacherId}:`, error);
    throw new Error(`Failed to delete teacher: ${handleFirebaseError(error)}`);
  }
};

/**
 * Видалити користувача
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await remove(ref(db, `users/${userId}`));
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw new Error(`Failed to delete user: ${handleFirebaseError(error)}`);
  }
};

/**
 * Видалити вчителя з улюблених
 */
export const removeFromFavorites = async (
  userId: string,
  teacherId: string
): Promise<void> => {
  try {
    await set(ref(db, `users/${userId}/favorites/${teacherId}`), null);
  } catch (error) {
    console.error(`Error removing teacher ${teacherId} from favorites:`, error);
    throw new Error(
      `Failed to remove from favorites: ${handleFirebaseError(error)}`
    );
  }
};

/**
 * Очистити всі улюблені
 */
export const clearAllFavorites = async (userId: string): Promise<void> => {
  try {
    await set(ref(db, `users/${userId}/favorites`), {});
  } catch (error) {
    console.error(`Error clearing favorites for user ${userId}:`, error);
    throw new Error(`Failed to clear favorites: ${handleFirebaseError(error)}`);
  }
};

/**
 * Видалити відгук
 */
export const deleteReview = async (
  teacherId: string,
  reviewIndex: number
): Promise<void> => {
  try {
    const reviewsRef = ref(db, `/${teacherId}/reviews`);
    const snapshot = await get(reviewsRef);

    if (snapshot.exists()) {
      const reviews = snapshot.val();
      if (Array.isArray(reviews) && reviews[reviewIndex]) {
        const updatedReviews = [...reviews];
        updatedReviews.splice(reviewIndex, 1);

        await set(reviewsRef, updatedReviews);

        // Оновити рейтинг
        if (updatedReviews.length > 0) {
          const totalRating = updatedReviews.reduce(
            (sum, r) => sum + r.reviewer_rating,
            0
          );
          const averageRating = parseFloat(
            (totalRating / updatedReviews.length).toFixed(1)
          );
          await set(ref(db, `/${teacherId}/rating`), averageRating);
        } else {
          await set(ref(db, `/${teacherId}/rating`), 0);
        }
      }
    }
  } catch (error) {
    console.error(`Error deleting review from teacher ${teacherId}:`, error);
    throw new Error(`Failed to delete review: ${handleFirebaseError(error)}`);
  }
};
