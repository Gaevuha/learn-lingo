import { ref, set, push } from "firebase/database";
import { db } from "@/firebase/db";
import { Teacher, BookingData } from "@/types/teacher";
import { UserData } from "@/types/user";
import { handleFirebaseError } from "./db-utils";
import { get } from "firebase/database";

/**
 * Створити нового вчителя
 */
export const createTeacher = async (
  teacherData: Omit<Teacher, "id">
): Promise<string> => {
  try {
    const teachersRef = ref(db, "/");
    const newTeacherRef = push(teachersRef);

    await set(newTeacherRef, teacherData);

    return newTeacherRef.key!;
  } catch (error) {
    throw new Error(`Failed to create teacher: ${handleFirebaseError(error)}`);
  }
};

/**
 * Створити нового користувача
 */
export const createUser = async (
  userId: string,
  userData: Omit<UserData, "favorites" | "createdAt" | "lastLogin">
): Promise<void> => {
  try {
    const userRef = ref(db, `users/${userId}`);

    // Перевіряємо, чи користувач вже існує
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      // Користувач вже існує, тільки оновлюємо lastLogin
      await set(ref(db, `users/${userId}/lastLogin`), Date.now());
      return;
    }

    // Створюємо нового користувача
    const fullUserData: UserData = {
      ...userData,
      favorites: {},
      createdAt: Date.now(),
      lastLogin: Date.now(),
    };

    await set(userRef, fullUserData);
  } catch (error) {
    throw new Error(`Failed to create user: ${handleFirebaseError(error)}`);
  }
};

/**
 * Додати відгук до вчителя
 */
export const addTeacherReview = async (
  teacherId: string,
  review: {
    comment: string;
    reviewer_name?: string;
    reviewer_rating: number;
  }
): Promise<void> => {
  try {
    const teacherRef = ref(db, `/${teacherId}`);
    const snapshot = await get(teacherRef);

    if (!snapshot.exists()) {
      throw new Error(`Teacher ${teacherId} not found`);
    }

    const teacher = snapshot.val();
    const reviews = teacher.reviews || [];

    const updatedReviews = [
      ...reviews,
      {
        ...review,
        date: Date.now(),
      },
    ];

    // Оновлюємо рейтинг
    const totalRating = updatedReviews.reduce(
      (sum, r) => sum + r.reviewer_rating,
      0
    );
    const averageRating = parseFloat(
      (totalRating / updatedReviews.length).toFixed(1)
    );

    await set(ref(db, `/${teacherId}/reviews`), updatedReviews);
    await set(ref(db, `/${teacherId}/rating`), averageRating);
  } catch (error) {
    throw new Error(`Failed to add review: ${handleFirebaseError(error)}`);
  }
};

/**
 * Додати вчителя до улюблених
 */
export const addToFavorites = async (
  userId: string,
  teacherId: string
): Promise<void> => {
  try {
    const favoriteRef = ref(db, `users/${userId}/favorites/${teacherId}`);
    await set(favoriteRef, true);

    // Оновлюємо lastLogin
    await set(ref(db, `users/${userId}/lastLogin`), Date.now());
  } catch (error) {
    throw new Error(
      `Failed to add to favorites: ${handleFirebaseError(error)}`
    );
  }
};

/**
 * Створити бронювання уроку
 */
export const createBooking = async (
  userId: string,
  bookingData: BookingData
): Promise<void> => {
  try {
    const bookingsRef = ref(db, `users/${userId}/bookings`);
    const newBookingRef = push(bookingsRef);

    const bookingWithId = {
      ...bookingData,
      id: newBookingRef.key!,
      createdAt: Date.now(),
      status: "pending",
    };

    await set(newBookingRef, bookingWithId);

    // Оновлюємо lastLogin
    await set(ref(db, `users/${userId}/lastLogin`), Date.now());
  } catch (error) {
    throw new Error(`Failed to create booking: ${handleFirebaseError(error)}`);
  }
};
