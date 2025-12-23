import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
} from "@/lib/firebase";
import { FavoriteActionResult } from "@/types/user";

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const favoriteIds = await getUserFavorites(user.uid);
        setFavorites(favoriteIds);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(`Не вдалося завантажити обране: ${errorMessage}`);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const addToFavoritesHandler = async (
    teacherId: string
  ): Promise<FavoriteActionResult> => {
    if (!user) {
      return {
        success: false,
        message: "Будь ласка, увійдіть в акаунт, щоб додавати в обране",
      };
    }

    if (favorites.includes(teacherId)) {
      return {
        success: false,
        message: "Цей вчитель вже є в обраному",
      };
    }

    try {
      await addToFavorites(user.uid, teacherId);
      setFavorites((prev) => [...prev, teacherId]);

      return {
        success: true,
        message: "Додано в обране",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Не вдалося додати в обране";
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const removeFromFavoritesHandler = async (
    teacherId: string
  ): Promise<FavoriteActionResult> => {
    if (!user) {
      return {
        success: false,
        message: "Користувач не авторизований",
      };
    }

    if (!favorites.includes(teacherId)) {
      return {
        success: false,
        message: "Цей вчитель не знаходиться в обраному",
      };
    }

    try {
      await removeFromFavorites(user.uid, teacherId);
      setFavorites((prev) => prev.filter((id) => id !== teacherId));

      return {
        success: true,
        message: "Видалено з обраного",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Не вдалося видалити з обраного";
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const isFavorite = (teacherId: string): boolean => {
    return favorites.includes(teacherId);
  };

  const toggleFavoriteHandler = async (
    teacherId: string
  ): Promise<FavoriteActionResult> => {
    if (isFavorite(teacherId)) {
      return await removeFromFavoritesHandler(teacherId);
    } else {
      return await addToFavoritesHandler(teacherId);
    }
  };

  return {
    favorites,
    loading,
    error,
    addToFavorites: addToFavoritesHandler,
    removeFromFavorites: removeFromFavoritesHandler,
    isFavorite,
    toggleFavorite: toggleFavoriteHandler,
    count: favorites.length,
  };
};
