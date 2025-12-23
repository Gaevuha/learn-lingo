"use client";

import { useState, useEffect, useMemo } from "react";
import TeacherCard from "./TeacherCard";
import { Teacher } from "@/types/teacher";
import { getAllTeachers } from "@/lib/firebase";

interface FilterState {
  minRating: number;
  maxPrice: number;
  language: string;
  level: string;
  sortBy: "rating" | "price_low" | "price_high" | "lessons" | "name";
}

export default function TeachersList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    minRating: 0,
    maxPrice: 0,
    language: "all",
    level: "all",
    sortBy: "rating",
  });

  // Завантаження даних через API
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      const teachersData = await getAllTeachers();

      setTeachers(teachersData);
      setFilteredTeachers(teachersData);
    } catch (error) {
      setError(
        "Не вдалося завантажити дані: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Фільтрація та сортування
  useEffect(() => {
    let result = [...teachers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (teacher) =>
          teacher.name?.toLowerCase().includes(query) ||
          teacher.surname?.toLowerCase().includes(query) ||
          teacher.languages?.some((lang) =>
            lang.toLowerCase().includes(query)
          ) ||
          teacher.levels?.some((level) => level.toLowerCase().includes(query))
      );
    }

    if (filters.minRating > 0) {
      result = result.filter((teacher) => teacher.rating >= filters.minRating);
    }

    if (filters.maxPrice > 0) {
      result = result.filter(
        (teacher) => teacher.price_per_hour <= filters.maxPrice
      );
    }

    if (filters.language !== "all") {
      result = result.filter((teacher) =>
        teacher.languages?.includes(filters.language)
      );
    }

    if (filters.level !== "all") {
      result = result.filter((teacher) =>
        teacher.levels?.includes(filters.level)
      );
    }

    switch (filters.sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price_low":
        result.sort((a, b) => a.price_per_hour - b.price_per_hour);
        break;
      case "price_high":
        result.sort((a, b) => b.price_per_hour - a.price_per_hour);
        break;
      case "lessons":
        result.sort((a, b) => b.lessons_done - a.lessons_done);
        break;
      case "name":
        result.sort((a, b) =>
          `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`)
        );
        break;
    }

    setFilteredTeachers(result);
  }, [teachers, searchQuery, filters]);

  // Отримання унікальних значень для фільтрів
  const languages = useMemo(() => {
    const allLanguages = teachers.flatMap((t) => t.languages || []);
    return ["all", ...Array.from(new Set(allLanguages))];
  }, [teachers]);

  const levels = useMemo(() => {
    const allLevels = teachers.flatMap((t) => t.levels || []);
    return ["all", ...Array.from(new Set(allLevels))];
  }, [teachers]);

  const resetFilters = () => {
    setFilters({
      minRating: 0,
      maxPrice: 0,
      language: "all",
      level: "all",
      sortBy: "rating",
    });
    setSearchQuery("");
  };

  // Статистика
  const stats = useMemo(() => {
    if (teachers.length === 0) return null;

    const totalTeachers = teachers.length;
    const averageRating =
      teachers.reduce((sum, t) => sum + t.rating, 0) / totalTeachers;
    const averagePrice =
      teachers.reduce((sum, t) => sum + t.price_per_hour, 0) / totalTeachers;
    const totalLessons = teachers.reduce((sum, t) => sum + t.lessons_done, 0);

    return {
      totalTeachers,
      averageRating: averageRating.toFixed(1),
      averagePrice: Math.round(averagePrice),
      totalLessons,
    };
  }, [teachers]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Завантаження вчителів...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button
            onClick={fetchTeachers}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Спробувати ще раз
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Статус */}
      {teachers.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <div>
              <p className="font-medium text-green-800">
                База даних підключена
              </p>
              <p className="text-sm text-green-700">
                Знайдено {teachers.length} вчителів
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Пошук та фільтри */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Знайдіть свого вчителя
            </h1>
            <p className="text-gray-600">
              {teachers.length} кваліфікованих викладачів готові вам допомогти
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showFilters
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>🔍</span>
              Фільтри
            </button>
            {(searchQuery ||
              filters.minRating > 0 ||
              filters.maxPrice > 0 ||
              filters.language !== "all" ||
              filters.level !== "all") && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span>🗑️</span>
                Очистити
              </button>
            )}
          </div>
        </div>

        {/* Пошук */}
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <span>🔍</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Пошук за ім'ям, прізвищем, мовою або рівнем..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Фільтри */}
        {showFilters && (
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Мінімальний рейтинг */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Мінімальний рейтинг: {filters.minRating}+
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.minRating}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minRating: parseFloat(e.target.value),
                      })
                    }
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium">{filters.minRating}</span>
                  </div>
                </div>
              </div>

              {/* Максимальна ціна */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Макс. ціна за годину
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <span>💲</span>
                  </div>
                  <input
                    type="number"
                    value={filters.maxPrice || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters({
                        ...filters,
                        maxPrice: value === "" ? 0 : parseInt(value) || 0,
                      });
                    }}
                    placeholder="Не обмежено"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    min="0"
                  />
                </div>
              </div>

              {/* Мова */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Мова
                </label>
                <select
                  value={filters.language}
                  onChange={(e) =>
                    setFilters({ ...filters, language: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === "all" ? "Всі мови" : lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Рівень */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Рівень
                </label>
                <select
                  value={filters.level}
                  onChange={(e) =>
                    setFilters({ ...filters, level: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level === "all" ? "Всі рівні" : level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Сортування */}
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сортування
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "rating", label: "За рейтингом", emoji: "★" },
                    {
                      value: "price_low",
                      label: "Ціна (низька → висока)",
                      emoji: "💲",
                    },
                    {
                      value: "price_high",
                      label: "Ціна (висока → низька)",
                      emoji: "💲",
                    },
                    {
                      value: "lessons",
                      label: "За кількістю уроків",
                      emoji: "📈",
                    },
                    { value: "name", label: "За ім'ям", emoji: "👤" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          sortBy: option.value as FilterState["sortBy"],
                        })
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        filters.sortBy === option.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span>{option.emoji}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600">👨‍🏫</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Вчителів</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalTeachers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600">★</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Середній рейтинг</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRating}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600">💲</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Середня ціна</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.averagePrice}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600">📚</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Всього уроків</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalLessons.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Результати */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredTeachers.length}{" "}
            {filteredTeachers.length === 1
              ? "вчитель знайдений"
              : "вчителів знайдено"}
            {searchQuery && ` за запитом "${searchQuery}"`}
          </h2>

          <div className="text-sm text-gray-600">
            {filteredTeachers.length === 0 ? (
              <span className="text-red-600">Нічого не знайдено</span>
            ) : (
              <span>
                {filteredTeachers.length} з {teachers.length}
              </span>
            )}
          </div>
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Вчителів не знайдено
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Спробуйте змінити параметри пошуку або фільтри
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Скинути фільтри
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
