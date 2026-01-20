"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import styles from "./AuthModal.module.css";
import { FiEyeOff, FiEye } from "react-icons/fi";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);

      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email || !password) {
        showToast("Please fill all fields", "error");
        return;
      }

      if (password.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        return;
      }

      await signIn(email, password);
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
            aria-label="Toggle password visibility"
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
          {loading ? "Signing in..." : "Sign in"}
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
