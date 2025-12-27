"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { TeacherCardProps } from "@/types/teacher";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useBooking } from "@/hooks/useBooking";
import { useToast } from "@/hooks/useToast";

import BookingModal from "@/components/BookingModal/BookingModal";

import styles from "./TeacherCard.module.css";

/* =======================
   Booking form schema
======================= */
const bookingSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
});

type BookingFormData = yup.InferType<typeof bookingSchema>;

function TeacherCard({ teacher }: TeacherCardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading: authLoading } = useAuth();
  const {
    isFavorite,
    toggleFavorite,
    loading: favoritesLoading,
  } = useFavorites();
  const { bookTrialLesson, isLoading: bookingLoading } = useBooking();
  const { showToast } = useToast();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isFavoriteCurrent = teacher.id ? isFavorite(teacher.id) : false;

  /* =======================
     Booking form
  ======================= */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema),
  });

  /* =======================
     Favorite handler
  ======================= */
  const handleFavoriteClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!teacher.id || authLoading) return;

    if (!user) {
      const ru = pathname || "/";
      router.push(`/auth/login?returnUrl=${encodeURIComponent(ru)}`);
      return;
    }

    try {
      setIsProcessing(true);
      const wasFavorite = isFavoriteCurrent;
      const result = await toggleFavorite(teacher.id);

      if (result.success) {
        showToast(
          wasFavorite ? "Removed from favorites" : "Added to favorites",
          "success"
        );
      } else {
        showToast(result.message || "Error", "error");
      }
    } catch (error) {
      showToast("Unexpected error", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  /* =======================
     Booking submit
  ======================= */
  const handleBookingSubmit = async (data: BookingFormData) => {
    if (!user) {
      setShowBookingModal(false);
      const ru = pathname || "/";
      router.push(`/auth/login?returnUrl=${encodeURIComponent(ru)}`);
      return;
    }

    if (!teacher.id) {
      showToast("Teacher not found", "error");
      return;
    }

    const result = await bookTrialLesson({
      teacherId: teacher.id,
      teacherName: `${teacher.name} ${teacher.surname}`,
      studentName: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
    });

    if (result.success) {
      showToast(result.message, "success");
      reset();
      setShowBookingModal(false);
    } else {
      showToast(result.message, "error");
    }
  };

  if (!teacher) return null;

  return (
    <>
      <div className={styles.card}>
        {/* Avatar */}
        <div className={styles.avatarContainer}>
          <Image
            src={teacher.avatar_url || "/avatar-placeholder.png"}
            alt={`${teacher.name} ${teacher.surname}`}
            width={96}
            height={96}
            className={styles.avatar}
          />
          <span className={styles.statusIndicator} />
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <p className={styles.languagesLabel}>Languages</p>
              <h3 className={styles.teacherName}>
                {teacher.name} {teacher.surname}
              </h3>
            </div>

            <button
              onClick={handleFavoriteClick}
              disabled={
                (favoritesLoading || isProcessing || authLoading) && !!user
              }
              className={styles.favoriteButton}
              aria-label="favorite"
            >
              {favoritesLoading && user
                ? "⏳"
                : isFavoriteCurrent
                ? "❤️"
                : "🤍"}
            </button>
          </div>

          {/* Meta */}
          <div className={styles.meta}>
            <span>📘 Lessons online</span>
            <span>
              Lessons done: <b>{teacher.lessons_done}</b>
            </span>
            <span>⭐ {teacher.rating}</span>
            <span className={styles.price}>
              Price / 1 hour: {teacher.price_per_hour}$
            </span>
          </div>

          {/* Languages */}
          <p className={styles.speaks}>
            <b>Speaks:</b> {teacher.languages?.join(", ")}
          </p>

          {/* Info */}
          {teacher.lesson_info && (
            <p>
              <b>Lesson info:</b> {teacher.lesson_info}
            </p>
          )}

          {teacher.conditions?.length > 0 && (
            <p>
              <b>Conditions:</b> {teacher.conditions.join(" ")}
            </p>
          )}

          {/* Read more */}
          <button
            className={styles.readMoreButton}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>

          {/* Expanded */}
          {isExpanded && (
            <div className={styles.expanded}>
              <p>
                <b>Experience:</b> {teacher.experience}
              </p>

              {teacher.reviews?.length > 0 && (
                <div className={styles.reviews}>
                  <h4>Reviews</h4>
                  {teacher.reviews.map((review, index) => (
                    <div key={index} className={styles.reviewItem}>
                      <b>{review.reviewer_name}</b>
                      <span>{"⭐".repeat(review.reviewer_rating)}</span>
                      <p>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Levels */}
          <div className={styles.levels}>
            {teacher.levels?.map((level) => (
              <span key={level} className={styles.levelBadge}>
                #{level}
              </span>
            ))}
          </div>

          {/* Booking */}
          <button
            className={styles.bookButton}
            onClick={() => {
              if (!user) {
                const ru = pathname || "/";
                router.push(`/auth/login?returnUrl=${encodeURIComponent(ru)}`);
              } else {
                setShowBookingModal(true);
              }
            }}
          >
            Book trial lesson
          </button>
        </div>
      </div>

      {/* Booking modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        teacherName={`${teacher.name} ${teacher.surname}`}
        loading={bookingLoading}
        onSubmit={handleBookingSubmit}
      />
    </>
  );
}

/* =======================
   Memo
======================= */
export default memo(TeacherCard, (prev, next) => {
  return prev.teacher.id === next.teacher.id;
});
