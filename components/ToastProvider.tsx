"use client";

import { useEffect } from "react";

export default function ToastProvider() {
  useEffect(() => {
    // Ініціалізація iziToast на клієнті
    if (typeof window !== "undefined") {
      // Імпортуємо CSS
      import("izitoast/dist/css/iziToast.min.css");
      
      // Імпортуємо та ініціалізуємо iziToast
      import("izitoast").then((iziToast) => {
        // Ініціалізуємо iziToast глобально
        (window as any).iziToast = iziToast.default;
      });
    }
  }, []);

  return null;
}

