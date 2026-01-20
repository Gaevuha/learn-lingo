"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import styles from "./AuthModal.module.css";
import { FiEyeOff, FiEye } from "react-icons/fi";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

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
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      // Проста валідація
      if (!name?.trim() || !email?.trim() || !password) {
        throw new Error("Будь ласка, заповніть всі поля");
      }

      if (password.length < 6) {
        throw new Error("Пароль має містити щонайменше 6 символів");
      }

      // Використовуємо ваш існуючий хук
      await signUp(name.trim(), email.trim().toLowerCase(), password);

      showToast("Реєстрація успішна!", "success");
      onSuccess();
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Помилка реєстрації. Спробуйте ще раз.";

      if (error instanceof Error) {
        // Обробка специфічних помилок Firebase
        const message = error.message.toLowerCase();

        if (
          message.includes("email-already-in-use") ||
          message.includes("email_exists")
        ) {
          errorMessage =
            "Цей email вже зареєстрований. Спробуйте інший або увійдіть в систему.";
        } else if (message.includes("invalid-email")) {
          errorMessage = "Невірний формат email.";
        } else if (message.includes("weak-password")) {
          errorMessage = "Пароль занадто слабкий. Оберіть надійніший пароль.";
        } else if (message.includes("network")) {
          errorMessage = "Проблема з мережею. Перевірте з'єднання.";
        } else {
          // Показуємо оригінальне повідомлення про помилку
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
      showToast("Успішний вхід через Google!", "success");
      onSuccess();
    } catch (error) {
      console.error("Google sign-in error:", error);
      let message = "Помилка входу через Google";

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
