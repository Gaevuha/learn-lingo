"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import styles from "./AuthModal.module.css";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({
  onSuccess,
  onSwitchToRegister,
}: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await signIn(data.email, data.password);
      showToast("Login successful!", "success");
      onSuccess();
    } catch (error: unknown) {
      let message = "Login error";
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
      showToast("Google sign-in successful!", "success");
      onSuccess();
    } catch (error: unknown) {
      let message = "Google sign-in error";
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
      <h3 className={styles.formTitle}>Sign in</h3>

      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className={styles.googleButton}
      >
        {googleLoading ? "Signing in..." : "Sign in with Google"}
      </button>

      <div className={styles.divider}>
        <span>Or continue with email</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className={styles.switchForm}>
        Don&apos;t have an account?{" "}
        <button onClick={onSwitchToRegister} className={styles.switchLink}>
          Sign up
        </button>
      </p>
    </div>
  );
}
