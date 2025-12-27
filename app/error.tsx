"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          textAlign: "center",
          padding: "32px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
        }}
      >
        <h1
          style={{ fontSize: "2rem", marginBottom: "16px", color: "#d32f2f" }}
        >
          Щось пішло не так!
        </h1>
        <p style={{ marginBottom: "24px", color: "#666" }}>
          {error.message || "Сталася непередбачена помилка"}
        </p>
        <button
          onClick={reset}
          style={{
            padding: "12px 24px",
            fontSize: "1rem",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#1565c0")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#1976d2")
          }
        >
          Спробувати знову
        </button>
      </div>
    </div>
  );
}
