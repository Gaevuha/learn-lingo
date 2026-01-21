"use client";

import Image from "next/image";
import { useState } from "react";
import * as yup from "yup";
import Modal from "@/components/Modal/Modal";
import styles from "./BookingModal.module.css";

// Схема валідації Yup
const bookingSchema = yup.object({
  name: yup.string().required("Name is required").trim(),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .trim(),
  phone: yup.string().required("Phone is required").trim(),
  reason: yup.string().required("Select a reason"),
});

export type BookingFormData = yup.InferType<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  teacherAvatar?: string;
  onSubmit: (data: BookingFormData) => Promise<void>;
}

export default function BookingModal({
  isOpen,
  onClose,
  teacherName,
  teacherAvatar,
  onSubmit,
}: BookingModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    try {
      // Отримуємо дані з форми
      const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        reason: formData.get("reason") as string,
      };

      // Валідація через Yup
      const validatedData = await bookingSchema.validate(rawData, {
        abortEarly: false,
      });

      // Викликаємо onSubmit з перевіреними даними
      await onSubmit(validatedData);
    } catch (error) {
      console.error("Booking error:", error);

      // Обробка помилок Yup
      if (error instanceof yup.ValidationError) {
        // Беремо першу помилку
        setError(error.errors[0] || "Validation error");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="booking">
      <form action={handleSubmit} className={styles.bookingForm}>
        {/* Header */}
        <h2 className={styles.title}>Book trial lesson</h2>
        <p className={styles.subtitle}>
          Our experienced tutor will assess your current language level, discuss
          your learning goals, and tailor the lesson to your specific needs.
        </p>

        {/* Teacher */}
        <div className={styles.teacher}>
          <Image
            src={teacherAvatar || "/avatar-placeholder.png"}
            alt={teacherName}
            width={44}
            height={44}
            className={styles.avatar}
          />
          <div>
            <span className={styles.teacherLabel}>Your teacher</span>
            <p className={styles.teacherName}>{teacherName}</p>
          </div>
        </div>

        {/* Question */}
        <h3 className={styles.question}>
          What is your main reason for learning English?
        </h3>

        {/* Radio group */}
        <div className={styles.radioGroup}>
          <label className={styles.radio}>
            <input
              type="radio"
              name="reason"
              value="career"
              defaultChecked
              disabled={loading}
            />
            <span />
            Career and business
          </label>

          <label className={styles.radio}>
            <input type="radio" name="reason" value="kids" disabled={loading} />
            <span />
            Lesson for kids
          </label>

          <label className={styles.radio}>
            <input
              type="radio"
              name="reason"
              value="abroad"
              disabled={loading}
            />
            <span />
            Living abroad
          </label>

          <label className={styles.radio}>
            <input
              type="radio"
              name="reason"
              value="exams"
              disabled={loading}
            />
            <span />
            Exams and coursework
          </label>

          <label className={styles.radio}>
            <input
              type="radio"
              name="reason"
              value="hobby"
              disabled={loading}
            />
            <span />
            Culture, travel or hobby
          </label>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {/* Inputs */}
        <div className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className={styles.input}
            required
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
            required
            disabled={loading}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            className={styles.input}
            required
            disabled={loading}
          />
        </div>

        {/* Submit */}
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? "Booking..." : "Book"}
        </button>
      </form>
    </Modal>
  );
}
