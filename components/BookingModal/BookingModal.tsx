"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "@/components/Modal/Modal";
import styles from "./BookingModal.module.css";

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
}
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  loading: boolean;
  onSubmit: SubmitHandler<BookingFormData>;
}

export default function BookingModal({
  isOpen,
  onClose,
  teacherName,
  loading,
  onSubmit,
}: BookingModalProps) {
  const schema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone is required"),
    date: yup.string().required("Date is required"),
    time: yup.string().required("Time is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({ resolver: yupResolver(schema) });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <h3 className={styles.title}>Book trial lesson</h3>
        <p className={styles.teacher}>{teacherName}</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <input {...register("name")} placeholder="Name" />
          {errors.name && <p>{errors.name.message}</p>}

          <input {...register("email")} placeholder="Email" />
          {errors.email && <p>{errors.email.message}</p>}

          <input {...register("phone")} placeholder="Phone" />
          {errors.phone && <p>{errors.phone.message}</p>}

          <input {...register("date")} type="date" />
          {errors.date && <p>{errors.date.message}</p>}

          <input {...register("time")} type="time" />
          {errors.time && <p>{errors.time.message}</p>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Book"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
