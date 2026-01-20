"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  returnUrl?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  returnUrl,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const router = useRouter();

  const handleSuccess = () => {
    onClose();
    setMode("login");
    if (returnUrl) {
      router.push(returnUrl);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="auth">
      <div className={styles.content}>
        {mode === "login" ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setMode("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setMode("login")}
          />
        )}
      </div>
    </Modal>
  );
}
