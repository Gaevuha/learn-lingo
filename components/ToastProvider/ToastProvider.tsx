"use client";

import { useEffect } from "react";

export default function ToastProvider() {
  useEffect(() => {
    let mounted = true;

    if (typeof window !== "undefined") {
      import("izitoast").then((module) => {
        if (!mounted) return;
        window.iziToast = module.default;
      });
    }

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
