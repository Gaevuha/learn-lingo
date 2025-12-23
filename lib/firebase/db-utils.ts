import { ref } from "firebase/database";
import { db } from "@/firebase/db";

/**
 * Створює посилання на базу даних з правильним шляхом
 */
export const getRef = (path: string) => {
  return ref(db, path);
};

/**
 * Перетворює об'єкт Firebase в масив з ID
 */
export const convertToArrayWithId = <T>(
  firebaseObject: Record<string, T>
): Array<T & { id: string }> => {
  if (!firebaseObject) return [];

  return Object.keys(firebaseObject).map((key) => ({
    id: key,
    ...firebaseObject[key],
  }));
};

/**
 * Перетворює масив в об'єкт Firebase
 */
export const convertToFirebaseObject = <T extends { id?: string }>(
  items: T[],
  idField?: string
): Record<string, Omit<T, "id">> => {
  const result: Record<string, Omit<T, "id">> = {};

  items.forEach((item) => {
    const id =
      item.id || (idField ? (item[idField as keyof T] as string) : undefined);
    if (id) {
      const rest = { ...item };
      delete rest.id;
      result[id] = rest;
    }
  });

  return result;
};

/**
 * Обробка помилок Firebase
 */
export const handleFirebaseError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const firebaseError = error as { code?: string; message?: string };
    return (
      firebaseError.message || firebaseError.code || "Unknown Firebase error"
    );
  }

  return String(error);
};
