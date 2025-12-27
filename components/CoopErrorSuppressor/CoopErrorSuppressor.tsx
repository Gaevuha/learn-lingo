"use client";

import { useEffect } from "react";

/**
 * Компонент для пригнічення не критичних помилок COOP від Firebase Auth SDK.
 * Ці помилки виникають через політику безпеки браузера, але не впливають на функціональність.
 */
export default function CoopErrorSuppressor() {
  useEffect(() => {
    // Зберігаємо оригінальний console.error
    const originalError = console.error;
    const originalWarn = console.warn;

    // Створюємо фільтр для пригнічення помилок COOP
    const filterFn = (...args: any[]) => {
      // Перевіряємо всі аргументи на наявність COOP помилок
      const allArgs = args
        .map((arg) => {
          if (arg instanceof Error) {
            return `${arg.message} ${arg.stack || ""}`;
          }
          return String(arg || "");
        })
        .join(" ");

      // Пригнічуємо помилки COOP від Firebase SDK (popup.ts)
      const isCoopError =
        allArgs.includes("Cross-Origin-Opener-Policy") &&
        (allArgs.includes("window.closed") ||
          allArgs.includes("window.close") ||
          allArgs.includes("popup.ts:302") ||
          allArgs.includes("popup.ts:50") ||
          allArgs.includes("popup.ts"));

      if (isCoopError) {
        // Тихо ігноруємо - це не критична помилка
        return;
      }

      // Викликаємо оригінальний console.error для всіх інших помилок
      return false; // вказує, що не пригнічуємо
    };

    // Встановлюємо фільтр для error
    console.error = (...args: any[]) => {
      const suppressed = filterFn(...args);
      if (suppressed !== false) return;
      originalError.apply(console, args);
    };

    // Встановлюємо фільтр для warn (деякі SDK логує як warn)
    console.warn = (...args: any[]) => {
      const suppressed = filterFn(...args);
      if (suppressed !== false) return;
      originalWarn.apply(console, args);
    };

    // Відновлюємо оригінальний console.error при розмонтуванні
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // Цей компонент не рендерить нічого
  return null;
}
