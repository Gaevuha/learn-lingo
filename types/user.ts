export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserFavorites {
  [teacherId: string]: boolean;
}

export interface UserData {
  email: string | null;
  favorites: UserFavorites;
  createdAt?: number;
  lastLogin?: number;
}

export interface FavoriteActionResult {
  success: boolean;
  message?: string;
}

export interface FavoriteState {
  favorites: string[];
  loading: boolean;
  error: string | null;
  addToFavorites: (teacherId: string) => Promise<FavoriteActionResult>;
  removeFromFavorites: (teacherId: string) => Promise<FavoriteActionResult>;
  isFavorite: (teacherId: string) => boolean;
  toggleFavorite: (teacherId: string) => Promise<FavoriteActionResult>;
  clearFavorites: () => Promise<FavoriteActionResult>;
  count: number;
}
