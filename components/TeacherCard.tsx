"use client";

import { useState } from "react";
import { TeacherCardProps } from "@/types/teacher";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const [showFullExperience, setShowFullExperience] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllConditions, setShowAllConditions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    isFavorite,
    toggleFavorite,
    loading: favoritesLoading,
  } = useFavorites();

  const { showToast } = useToast();

  const maxConditionsToShow = 2;
  const maxReviewsToShow = 2;

  const displayedConditions = showAllConditions
    ? teacher.conditions
    : teacher.conditions?.slice(0, maxConditionsToShow) || [];

  const displayedReviews = showAllReviews
    ? teacher.reviews
    : teacher.reviews?.slice(0, maxReviewsToShow) || [];

  const hasMoreConditions = teacher.conditions?.length > maxConditionsToShow;
  const hasMoreReviews = teacher.reviews?.length > maxReviewsToShow;

  const handleFavoriteClick = async () => {
    if (!teacher.id) return;

    setIsProcessing(true);
    try {
      const result = await toggleFavorite(teacher.id);
      if (result.success) {
        showToast(
          result.message ||
            (isFavoriteCurrent ? "Видалено з обраного" : "Додано в обране"),
          "success"
        );
      } else if (result.message) {
        showToast(result.message, "error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Невідома помилка";
      showToast(`Помилка: ${errorMessage}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const isFavoriteCurrent = teacher.id ? isFavorite(teacher.id) : false;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
      <div className="p-6">
        {/* Профіль вчителя */}
        <div className="flex items-start gap-4 mb-6">
          {/* Аватар */}
          <div className="flex-shrink-0">
            {teacher.avatar_url ? (
              <Image
                src={teacher.avatar_url}
                alt={`${teacher.name} ${teacher.surname}`}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback =
                    target.parentElement?.querySelector(".avatar-fallback");
                  fallback?.classList.remove("hidden");
                }}
              />
            ) : null}
            <div
              className={`avatar-fallback w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${
                teacher.avatar_url ? "hidden" : ""
              }`}
            >
              <span className="text-2xl font-bold text-blue-600">
                {teacher.name?.[0] || ""}
                {teacher.surname?.[0] || ""}
              </span>
            </div>
          </div>

          {/* Інформація про вчителя */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {teacher.name} {teacher.surname}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 font-semibold">{teacher.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    ({teacher.reviews?.length || 0} відгуків)
                  </span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {teacher.lessons_done} уроків
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {/* Кнопка "Обране" */}
                <button
                  onClick={handleFavoriteClick}
                  disabled={favoritesLoading || isProcessing || !teacher.id}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isFavoriteCurrent
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  } ${
                    favoritesLoading || isProcessing
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  title={
                    isFavoriteCurrent
                      ? "Видалити з обраного"
                      : "Додати в обране"
                  }
                  aria-label={
                    isFavoriteCurrent
                      ? "Видалити з обраного"
                      : "Додати в обране"
                  }
                >
                  <span className="text-xl">
                    {isFavoriteCurrent ? "❤️" : "🤍"}
                  </span>
                </button>

                {/* Ціна та статус */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${teacher.price_per_hour}
                    <span className="text-sm font-normal text-gray-500">
                      /год
                    </span>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Доступний
                  </div>
                </div>
              </div>
            </div>

            {/* Мови */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-gray-400">🌐</span>
              {teacher.languages?.map((language, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Рівні */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Рівні
          </h4>
          <div className="flex flex-wrap gap-2">
            {teacher.levels?.map((level, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 rounded-lg text-sm font-semibold border border-blue-200"
              >
                {level}
              </span>
            ))}
          </div>
        </div>

        {/* Досвід */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-amber-500">🏆</span>
              <h4 className="font-semibold text-gray-800">Досвід</h4>
            </div>
            {teacher.experience.length > 150 && (
              <button
                onClick={() => setShowFullExperience(!showFullExperience)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {showFullExperience ? "Згорнути ▲" : "Розгорнути ▼"}
              </button>
            )}
          </div>
          <p
            className={`text-gray-700 ${
              !showFullExperience ? "line-clamp-3" : ""
            }`}
          >
            {teacher.experience}
          </p>
        </div>

        {/* Інформація про урок */}
        {teacher.lesson_info && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600">💬</span>
              <h4 className="font-semibold text-blue-800">Про урок</h4>
            </div>
            <p className="text-blue-900 text-sm">{teacher.lesson_info}</p>
          </div>
        )}

        {/* Умови */}
        {teacher.conditions && teacher.conditions.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">Умови</h4>
              {hasMoreConditions && (
                <button
                  onClick={() => setShowAllConditions(!showAllConditions)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showAllConditions
                    ? "Показати менше"
                    : `Показати всі (${teacher.conditions.length})`}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {displayedConditions.map((condition, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700">{condition}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Відгуки */}
        {teacher.reviews && teacher.reviews.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">Відгуки</h4>
              {hasMoreReviews && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showAllReviews
                    ? "Показати менше"
                    : `Показати всі (${teacher.reviews.length})`}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {displayedReviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {review.reviewer_name?.[0] || "?"}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {review.reviewer_name || "Анонім"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 font-medium">
                        {review.reviewer_rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Кнопки дій */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg">
            Записатися на урок
          </button>
          <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Профіль
          </button>
        </div>
      </div>

      {/* Футер картки */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>🕒</span>
            <span>Стаж: {Math.floor(teacher.lessons_done / 20)} років</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💲</span>
            <span className="font-medium">${teacher.price_per_hour}/год</span>
          </div>
        </div>
      </div>
    </div>
  );
}
