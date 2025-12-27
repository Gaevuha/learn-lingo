"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import styles from "./AuthModal.module.css";

const registerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await signUp(data.name, data.email, data.password);
      showToast("Registration successful!", "success");
      onSuccess();
    } catch (error: unknown) {
      let message = "Registration error";
      if (error && typeof error === "object" && "message" in error) {
        message = (error as { message: string }).message;
      }
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      showToast("Google sign-up successful!", "success");
      onSuccess();
    } catch (error: unknown) {
      let message = "Google sign-up error";
      if (error && typeof error === "object" && "message" in error) {
        message = (error as { message: string }).message;
      }
      showToast(message, "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Create an account</h3>

      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className={styles.googleButton}
      >
        {googleLoading ? "Signing up..." : "Sign up with Google"}
      </button>

      <div className={styles.divider}>
        <span>Or continue with email</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            {...register("name")}
            placeholder="Full Name"
            className={styles.input}
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
        </div>

        <div className={styles.formGroup}>
          <input
            {...register("email")}
            placeholder="Email"
            className={styles.input}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className={styles.input}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm Password"
            className={styles.input}
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className={styles.switchForm}>
        Already have an account?{" "}
        <button onClick={onSwitchToLogin} className={styles.switchLink}>
          Sign in
        </button>
      </p>
    </div>
  );
}
