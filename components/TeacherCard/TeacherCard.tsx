"use client";

import { memo, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { LuBookOpen } from "react-icons/lu";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";

import { TeacherCardProps, BookingFormDataToSend } from "@/types/teacher";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useBooking } from "@/hooks/useBooking";
import { useToast } from "@/hooks/useToast";

import BookingModal from "@/components/BookingModal/BookingModal";

import styles from "./TeacherCard.module.css";

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  reason: string;
}

function TeacherCard({ teacher, selectedLevel }: TeacherCardProps) {
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
  const cardRef = useRef<HTMLDivElement>(null);

  const isFavoriteCurrent = teacher.id ? isFavorite(teacher.id) : false;

  const closeAll = useCallback(() => {
    setIsExpanded(false);
    setShowBookingModal(false);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (isExpanded || showBookingModal)) {
        e.preventDefault();
        closeAll();
      }
    };

    if (isExpanded || showBookingModal) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isExpanded, showBookingModal, closeAll]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

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

  const handleBookingSubmit = async (data: BookingFormData) => {
    if (!user) {
      closeAll();
      const ru = pathname || "/";
      router.push(`/auth/login?returnUrl=${encodeURIComponent(ru)}`);
      return;
    }

    if (!teacher.id) {
      showToast("Teacher not found", "error");
      return;
    }

    try {
      const bookingPayload: BookingFormDataToSend = {
        teacherId: teacher.id,
        teacherName: `${teacher.name} ${teacher.surname}`,
        studentName: data.name,
        email: data.email,
        phone: data.phone,
        reason: data.reason,
      };

      const result = await bookTrialLesson(bookingPayload);

      if (result.success) {
        showToast(result.message, "success");
        closeAll();
      } else {
        showToast(result.message || "Booking failed", "error");
      }
    } catch (error) {
      showToast("Unexpected error", "error");
    }
  };

  const handleBookButtonClick = () => {
    if (!user) {
      const ru = pathname || "/";
      router.push(`/auth/login?returnUrl=${encodeURIComponent(ru)}`);
    } else {
      setShowBookingModal(true);
    }
  };

  if (!teacher) return null;

  return (
    <>
      <div ref={cardRef} className={styles.card}>
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

        <div className={styles.content}>
          <div className={styles.header}>
            <div>
              <p className={styles.languagesLabel}>Languages</p>
              <h3 className={styles.teacherName}>
                {teacher.name} {teacher.surname}
              </h3>
            </div>
            <ul className={styles.metaList}>
              <li>
                <LuBookOpen className={styles.iconBook} />
                Lessons online
              </li>

              <li>
                Lessons done:{" "}
                <b className={styles.lessonCount}>{teacher.lessons_done}</b>
              </li>
              <li>
                <FaStar className={styles.iconStar} />
                {teacher.rating}
              </li>
              <li className={styles.price}>
                Price / 1 hour:{" "}
                <span className={styles.priceAccent}>
                  {teacher.price_per_hour}$
                </span>
              </li>
            </ul>
            <button
              onClick={handleFavoriteClick}
              disabled={
                (favoritesLoading || isProcessing || authLoading) && !!user
              }
              className={styles.favoriteButton}
              aria-label="favorite"
            >
              {isFavoriteCurrent ? (
                <FaHeart className={styles.favoriteActive} />
              ) : (
                <FaRegHeart className={styles.favoriteInactive} />
              )}
            </button>
          </div>

          <p className={styles.speaks}>
            <b>Speaks:</b> {teacher.languages?.join(", ")}
          </p>

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

          {!isExpanded && (
            <button
              className={styles.readMoreButton}
              onClick={() => setIsExpanded(true)}
            >
              Read more
            </button>
          )}

          {isExpanded && (
            <div className={styles.expanded}>
              <p>
                <b>Experience:</b> {teacher.experience}
              </p>

              {teacher.reviews?.length > 0 && (
                <div className={styles.reviews}>
                  {teacher.reviews.map((review, index) => (
                    <div key={index} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewerAvatar}>
                          {review.reviewer_name.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.reviewerInfo}>
                          <b>{review.reviewer_name}</b>
                          <div className={styles.reviewRating}>
                            {Array.from({ length: review.reviewer_rating }).map(
                              (_, i) => (
                                <FaStar key={i} />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <p>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={styles.levels}>
            {teacher.levels?.map((level) => {
              const isActive =
                selectedLevel &&
                selectedLevel !== "all" &&
                level === selectedLevel;

              return (
                <span
                  key={level}
                  className={`${styles.levelBadge} ${
                    isActive ? styles.levelBadgeActive : ""
                  }`}
                >
                  #{level}
                </span>
              );
            })}
          </div>

          {isExpanded && (
            <button
              className={styles.bookButton}
              onClick={handleBookButtonClick}
            >
              Book trial lesson
            </button>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={closeAll}
        teacherName={`${teacher.name} ${teacher.surname}`}
        teacherAvatar={teacher.avatar_url}
        onSubmit={handleBookingSubmit}
      />
    </>
  );
}

export default memo(TeacherCard, (prev, next) => {
  return (
    prev.teacher.id === next.teacher.id &&
    prev.selectedLevel === next.selectedLevel
  );
});
