"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { MdOutlineClose } from "react-icons/md";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: "auth" | "booking";
}

export default function Modal({
  isOpen,
  onClose,
  children,
  width = "auth",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // 🔒 lock scroll via class
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalClassName = `${styles.modal} ${
    width === "booking" ? styles.booking : styles.auth
  }`;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={modalClassName} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <MdOutlineClose className={styles.iconClose} />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
}
