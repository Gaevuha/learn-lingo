import { useQuery } from "@tanstack/react-query";

export interface HomeStats {
  tutorsCount: number;
  reviewsCount: number;
  subjectsCount: number;
  nationalitiesCount: number;
}

export const useStats = () => {
  return useQuery<HomeStats>({
    queryKey: ["stats"],
    queryFn: async (): Promise<HomeStats> => {
      const response = await fetch("/api/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 10, // 10 хвилин кеш
  });
};
