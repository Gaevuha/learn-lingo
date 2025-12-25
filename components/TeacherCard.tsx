"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TeacherCardProps } from "@/types/teacher";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import Image from "next/image";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const bookingSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
});

type BookingFormData = yup.InferType<typeof bookingSchema>;

export default function TeacherCard({ teacher }: TeacherCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    isFavorite,
    toggleFavorite,
    loading: favoritesLoading,
  } = useFavorites();
  const { bookTrialLesson, isLoading: bookingLoading } = useBooking();

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema),
  });

  const isFavoriteCurrent = teacher.id ? isFavorite(teacher.id) : false;
  console.log(
    `Teacher ${teacher.id}: isFavorite = ${isFavoriteCurrent}, user = ${user?.uid}`
  );

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("handleFavoriteClick called", { 
      teacherId: teacher.id, 
      user: user?.uid, 
      authLoading,
      showAuthModal 
    });
    
    if (!teacher.id) {
      console.log("No teacher id");
      return;
    }

    // Якщо авторизація ще завантажується, не робимо нічого
    if (authLoading) {
      console.log("Auth is loading, waiting...");
      return;
    }

    // Якщо користувач не авторизований
    if (!user) {
      console.log("No user, showing auth modal");
      setShowAuthModal(true);
      return;
    }

    console.log(
      `Toggling favorite for teacher ${teacher.id}, current state: ${isFavoriteCurrent}`
    );
    setIsProcessing(true);
    const wasFavorite = isFavoriteCurrent;
    try {
      const result = await toggleFavorite(teacher.id);
      console.log("Toggle result:", result);
      if (result.success) {
        showToast(
          result.message ||
            (wasFavorite ? "Removed from favorites" : "Added to favorites"),
          "success"
        );
      } else if (result.message) {
        showToast(result.message, "error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error toggling favorite:", errorMessage);
      showToast(`Error: ${errorMessage}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookingSubmit = async (data: BookingFormData) => {
    if (!user) {
      showToast("Please sign in to your account", "error");
      return;
    }

    if (!teacher.id) {
      showToast("Error: Teacher ID not found", "error");
      return;
    }

    const bookingData = {
      teacherId: teacher.id,
      teacherName: `${teacher.name} ${teacher.surname}`,
      studentName: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
    };

    const result = await bookTrialLesson(bookingData);

    if (result.success) {
      showToast(result.message, "success");
      setShowBookingModal(false);
      reset();
    } else {
      showToast(result.message, "error");
    }
  };

  if (!teacher) {
    return null;
  }

  return (
    <div>
      {/* Avatar */}
      <div className="relative shrink-0">
        <Image
          src={teacher.avatar_url || "/avatar-placeholder.png"}
          alt={`${teacher.name} ${teacher.surname}`}
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover border-4 border-yellow-200"
        />
        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-400">Languages</p>
            <h3 className="text-2xl font-semibold text-gray-900">
              {teacher.name} {teacher.surname}
            </h3>
          </div>

          {/* Favorite */}
          <button
            onClick={handleFavoriteClick}
            disabled={(favoritesLoading || isProcessing || authLoading) && !!user}
            className="text-gray-400 hover:text-red-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            aria-label={isFavoriteCurrent ? "Remove from favorites" : "Add to favorites"}
          >
            {favoritesLoading && user ? "⏳" : isFavoriteCurrent ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-1">
            📘 <span>Lessons online</span>
          </div>

          <div>
            Lessons done: <b>{teacher.lessons_done}</b>
          </div>

          <div className="flex items-center gap-1">
            ⭐ <b>{teacher.rating}</b>
          </div>

          <div className="text-green-600 font-semibold">
            Price / 1 hour: {teacher.price_per_hour}$
          </div>
        </div>

        {/* Languages */}
        <p className="mt-3 text-gray-700">
          <span className="font-medium">Speaks:</span>{" "}
          <span className="underline">{teacher.languages?.join(", ")}</span>
        </p>

        {/* Lesson info */}
        {teacher.lesson_info && (
          <p className="mt-2 text-gray-700">
            <span className="font-medium">Lesson Info:</span>{" "}
            {teacher.lesson_info}
          </p>
        )}

        {/* Conditions */}
        {teacher.conditions && teacher.conditions.length > 0 && (
          <p className="mt-2 text-gray-700">
            <span className="font-medium">Conditions:</span>{" "}
            {teacher.conditions.join(" ")}
          </p>
        )}

        {/* Read more */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm font-medium underline"
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>

        {/* Book trial lesson */}
        <button
          onClick={() => setShowBookingModal(true)}
          className="mt-2 ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book trial lesson
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            {/* Experience */}
            <p className="mt-2 text-gray-700">
              <span className="font-medium">Experience:</span>{" "}
              {teacher.experience}
            </p>

            {/* Reviews */}
            {teacher.reviews && teacher.reviews.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Reviews:</h4>
                <div className="space-y-3">
                  {teacher.reviews.map((review, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {review.reviewer_name}
                        </span>
                        <span className="text-yellow-500">
                          {"⭐".repeat(review.reviewer_rating)}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Levels */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {teacher.levels?.map((level) => (
            <span
              key={level}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                level === "A1 Beginner"
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              #{level}
            </span>
          ))}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <Modal isOpen={showAuthModal} onClose={() => {
          console.log("Closing auth modal");
          setShowAuthModal(false);
        }}>
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Авторизація необхідна
              </h3>
              <p className="text-gray-600 mb-4">
                Цей функціонал доступний лише для авторизованих користувачів.
                Будь ласка, увійдіть в акаунт або зареєструйтеся, щоб додавати
                викладачів в обране.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  console.log("Navigate to login");
                  setShowAuthModal(false);
                  router.push("/auth/login");
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Увійти в акаунт
              </button>
              <button
                onClick={() => {
                  console.log("Navigate to register");
                  setShowAuthModal(false);
                  router.push("/auth/register");
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Зареєструватися
              </button>
              <button
                onClick={() => {
                  console.log("Cancel clicked");
                  setShowAuthModal(false);
                }}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Скасувати
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Book trial lesson</h3>
          <p className="text-gray-600 mb-4">
            Teacher: {teacher.name} {teacher.surname}
          </p>
          <form
            onSubmit={handleSubmit(handleBookingSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                {...register("phone")}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                {...register("date")}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                {...register("time")}
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.time.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={bookingLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? "Booking..." : "Book lesson"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
