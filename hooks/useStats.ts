import { useQuery } from "@tanstack/react-query";

export interface HomeStats {
  tutorsCount: number;
  reviewsCount: number;
  subjectsCount: number;
  nationalitiesCount: number;
}

export const useStats = (initialData?: HomeStats) => {
  return useQuery<HomeStats>({
    queryKey: ["stats"],
    queryFn: async (): Promise<HomeStats> => {
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 година кеш (статистика рідко змінюється)
    gcTime: 1000 * 60 * 60 * 24, // 24 години в кеші
    initialData,
  });
};
