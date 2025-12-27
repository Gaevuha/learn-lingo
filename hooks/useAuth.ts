"use client";

import { useState, useEffect } from "react";
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/auth";
import { createUser } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create user record in database if it doesn't exist
        try {
          await createUser(user.uid, {
            email: user.email || "",
            name: user.displayName || user.email?.split("@")[0] || "User",
          });
        } catch (error) {
          // User might already exist, ignore error
        }
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: name });
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // Додаємо custom параметри для кращої сумісності
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      // Ігноруємо помилку COOP, оскільки вона не критична
      // Авторизація все одно працює, просто popup не закривається автоматично
      // Глобальний фільтр CoopErrorSuppressor пригнічує console помилки
      const err = error as { code?: string; message?: string };
      if (
        err?.code !== "auth/popup-closed-by-user" &&
        !err?.message?.includes("Cross-Origin-Opener-Policy")
      ) {
        throw error;
      }
      // Якщо це помилка COOP, перевіряємо чи користувач все ж авторизований
      if (auth.currentUser) {
        return; // Авторизація успішна
      }
      throw error;
    }
  };

  const signOut = () => firebaseSignOut(auth);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
}
