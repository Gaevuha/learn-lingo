"use client";

import { useState } from "react";
import * as yup from "yup";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import styles from "./AuthModal.module.css";
import { FiEyeOff, FiEye } from "react-icons/fi";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

// Схема валідації для логіну
const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required")
    .trim()
    .lowercase(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function LoginForm({
  onSuccess,
  onSwitchToRegister,
}: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signInWithGoogle } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const rawData = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      // Валідація через Yup
      const validatedData: LoginFormData = await loginSchema.validate(rawData, {
        abortEarly: false,
      });

      await signIn(validatedData.email, validatedData.password);
      showToast("Login successful!", "success");
      onSuccess();
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login error";

      if (error instanceof yup.ValidationError) {
        // Беремо першу помилку валідації
        errorMessage = error.errors[0] || "Validation error";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      showToast(errorMessage, "error");
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
    } catch (error) {
      console.error("Google sign-in error:", error);

      let message = "Google sign-in error";
      if (error instanceof Error) {
        message = error.message;
      }

      setError(message);
      showToast(message, "error");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Log In</h3>
      <p className={styles.formText}>
        Welcome back! Please enter your credentials to access your account.
      </p>

      <form action={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className={styles.input}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={styles.input}
            minLength={6}
            required
            disabled={loading}
          />

          <button
            type="button"
            className={styles.buttonPassword}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Toggle password visibility"
            disabled={loading}
          >
            {showPassword ? (
              <FiEye className={styles.iconPassword} />
            ) : (
              <FiEyeOff className={styles.iconPasswordOff} />
            )}
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className={styles.googleButton}
      >
        {googleLoading ? "Signing in..." : "Sign in with Google"}
      </button>

      <div className={styles.switchForm}>
        <p>
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className={styles.switchLink}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
