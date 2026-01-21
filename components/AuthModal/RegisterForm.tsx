"use client";

import { useState } from "react";
import * as yup from "yup";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import styles from "./AuthModal.module.css";
import { FiEyeOff, FiEye } from "react-icons/fi";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

// Схема валідації для реєстрації
const registerSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .trim(),
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

type RegisterFormData = yup.InferType<typeof registerSchema>;

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signUp, signInWithGoogle } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      // Валідація через Yup
      const validatedData: RegisterFormData = await registerSchema.validate(
        rawData,
        {
          abortEarly: false,
        }
      );

      // Використовуємо ваш існуючий хук
      await signUp(
        validatedData.name,
        validatedData.email,
        validatedData.password
      );

      showToast("Registration successful!", "success");
      onSuccess();
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration error. Please try again.";

      if (error instanceof yup.ValidationError) {
        // Беремо першу помилку валідації
        errorMessage = error.errors[0] || "Validation error";
      } else if (error instanceof Error) {
        // Обробка специфічних помилок Firebase
        const message = error.message.toLowerCase();

        if (
          message.includes("email-already-in-use") ||
          message.includes("email_exists")
        ) {
          errorMessage =
            "This email is already registered. Please try a different email or sign in.";
        } else if (message.includes("invalid-email")) {
          errorMessage = "Invalid email format.";
        } else if (message.includes("weak-password")) {
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
        } else if (message.includes("network")) {
          errorMessage = "Network problem. Please check your connection.";
        } else {
          errorMessage = error.message;
        }
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
      <h3 className={styles.formTitle}>Registration</h3>

      <p className={styles.formText}>
        Thank you for your interest in our platform! In order to register, we
        need some information. Please provide us with the following information
      </p>

      <form action={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            name="name"
            placeholder="Name"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className={styles.input}
            required
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
          />
          <button
            type="button"
            className={styles.buttonPassword}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={loading}
          >
            {showPassword ? (
              <FiEye className={styles.iconPassword} />
            ) : (
              <FiEyeOff className={styles.iconPasswordOff} />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className={styles.googleButton}
        >
          {googleLoading ? "Signing in..." : "Sign in with Google"}
        </button>
      </form>
    </div>
  );
}
