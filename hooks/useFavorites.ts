import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getUserFavorites,
  addToFavorites as apiAddToFavorites,
  removeFromFavorites as apiRemoveFromFavorites,
} from "@/lib/firebase";
import { FavoriteActionResult } from "@/types/user";

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        console.log("No user, clearing favorites");
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching favorites for user:", user.uid);

        const favoriteIds = await getUserFavorites(user.uid);
        console.log("Fetched favorites:", favoriteIds);
        setFavorites(favoriteIds);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("Error fetching favorites:", errorMessage);
        setError(`Не вдалося завантажити обране: ${errorMessage}`);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    // Завантажуємо дані тільки якщо користувач завантажений
    if (user) {
      fetchFavorites();
    }
  }, [user?.uid]); // Залежність від user.uid замість user, щоб уникнути зайвих викликів

  const addMutation = useMutation({
    mutationFn: async (teacherId: string) => {
      console.log("Adding to favorites:", teacherId);
      return apiAddToFavorites(user!.uid, teacherId);
    },
    onMutate: async (teacherId) => {
      console.log("Optimistically adding:", teacherId);
      // Optimistic update
      setFavorites((prev) => [...prev, teacherId]);
      return { teacherId };
    },
    onSuccess: async () => {
      console.log("Successfully added to favorites, refreshing data");
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.uid] });
      // Reload favorites from Firebase to ensure sync
      try {
        const favoriteIds = await getUserFavorites(user!.uid);
        console.log("Reloaded favorites after add:", favoriteIds);
        setFavorites(favoriteIds);
      } catch (err) {
        console.error("Error reloading favorites after add:", err);
      }
    },
    onError: (error, teacherId, context) => {
      console.error("Failed to add to favorites:", error);
      // Revert optimistic update
      setFavorites((prev) => prev.filter((id) => id !== teacherId));
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (teacherId: string) => {
      console.log("Removing from favorites:", teacherId);
      return apiRemoveFromFavorites(user!.uid, teacherId);
    },
    onMutate: async (teacherId) => {
      console.log("Optimistically removing:", teacherId);
      // Optimistic update
      setFavorites((prev) => prev.filter((id) => id !== teacherId));
      return { teacherId };
    },
    onSuccess: async () => {
      console.log("Successfully removed from favorites, refreshing data");
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.uid] });
      // Reload favorites from Firebase to ensure sync
      try {
        const favoriteIds = await getUserFavorites(user!.uid);
        console.log("Reloaded favorites after remove:", favoriteIds);
        setFavorites(favoriteIds);
      } catch (err) {
        console.error("Error reloading favorites after remove:", err);
      }
    },
    onError: (error, teacherId, context) => {
      console.error("Failed to remove from favorites:", error);
      // Revert optimistic update
      setFavorites((prev) => [...prev, teacherId]);
    },
  });

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
      await addMutation.mutateAsync(teacherId);
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
      await removeMutation.mutateAsync(teacherId);
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
