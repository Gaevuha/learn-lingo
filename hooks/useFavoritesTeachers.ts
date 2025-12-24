import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getTeachersByIds, getUserFavorites } from "@/lib/firebase";

export const useFavoritesTeachers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["favorites", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      // Getting favorite IDs
      const favoriteIds = await getUserFavorites(user.uid);
      if (favoriteIds.length === 0) return [];
      // Getting full information
      return await getTeachersByIds(favoriteIds);
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
