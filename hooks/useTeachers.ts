import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Teacher } from "@/types/teacher";

interface TeachersQueryParams {
  language?: string;
  level?: string;
  price?: string;
  offset?: number;
  limit?: number;
}

export const useTeachers = (params: TeachersQueryParams = {}) => {
  return useQuery({
    queryKey: ["teachers", params],
    queryFn: async (): Promise<{ teachers: Teacher[]; totalCount: number }> => {
      const searchParams = new URLSearchParams();
      if (params.limit !== undefined)
        searchParams.set("limit", params.limit.toString());
      if (params.offset !== undefined)
        searchParams.set("offset", params.offset.toString());
      if (params.language && params.language !== "all")
        searchParams.set("language", params.language);
      if (params.level && params.level !== "all")
        searchParams.set("level", params.level);
      if (params.price && params.price !== "all")
        searchParams.set("price", params.price);

      const response = await axios.get(`/api/teachers?${searchParams}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 хвилин
  });
};

export const useTeacherById = (id: string) => {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: async (): Promise<Teacher | null> => {
      if (!id) return null;
      const response = await axios.get(`/api/teachers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
