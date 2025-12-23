// Реекспорт ваших існуючих типів
export type { Teacher, TeacherCardProps, Review } from "@/types/teacher";
export type {
  UserData,
  UserFavorites,
  FavoriteActionResult,
} from "@/types/user";
export type {
  AuthUser,
  AuthState,
  LoginFormData,
  RegisterFormData,
} from "@/types/auth";

// Додаткові типи для API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FilterOptions {
  minRating?: number;
  maxPrice?: number;
  language?: string;
  level?: string;
  limit?: number;
  sortBy?: "rating" | "price_low" | "price_high" | "lessons" | "name";
}
