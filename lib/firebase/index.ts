// Реекспорт ваших типів
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

// GET запити
export * from "./get-requests";

// POST запити
export * from "./post-requests";

// PUT запити
export * from "./put-requests";

// DELETE запити
export * from "./delete-requests";

// Утиліти
export * from "./db-utils";

// Додаткові типи API
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
