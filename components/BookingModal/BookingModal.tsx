"use client";

import Image from "next/image";
import { useState } from "react";

import Modal from "@/components/Modal/Modal";
import styles from "./BookingModal.module.css";

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  reason: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  teacherAvatar?: string;
  loading: boolean;
  onSubmit: (data: BookingFormData) => Promise<void>;
}

export default function BookingModal({
  isOpen,
  onClose,
  teacherName,
  teacherAvatar,
  loading,
  onSubmit,
}: BookingModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      const data: BookingFormData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        reason: formData.get("reason") as string,
      };

      // Валідація
      if (!data.name || !data.email || !data.phone || !data.reason) {
        setError("Please fill all required fields");
        return;
      }

      if (!data.email.includes("@")) {
        setError("Please enter a valid email");
        return;
      }

      setError(null);
      await onSubmit(data);
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="booking">
      <form className={styles.bookingForm} action={handleSubmit} noValidate>
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
            <input type="radio" name="reason" value="career" defaultChecked />
            <span />
            Career and business
          </label>

          <label className={styles.radio}>
            <input type="radio" name="reason" value="kids" />
            <span />
            Lesson for kids
          </label>

          <label className={styles.radio}>
            <input type="radio" name="reason" value="abroad" />
            <span />
            Living abroad
          </label>

          <label className={styles.radio}>
            <input type="radio" name="reason" value="exams" />
            <span />
            Exams and coursework
          </label>

          <label className={styles.radio}>
            <input type="radio" name="reason" value="hobby" />
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
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            className={styles.input}
            required
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
