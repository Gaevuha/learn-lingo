import Link from "next/link";

export default function NotFound() {
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
        }}
      >
        <h1
          style={{
            fontSize: "6rem",
            marginBottom: "16px",
            color: "#1976d2",
            fontWeight: "bold",
          }}
        >
          404
        </h1>
        <h2 style={{ fontSize: "2rem", marginBottom: "16px", color: "#333" }}>
          Сторінку не знайдено
        </h2>
        <p style={{ marginBottom: "32px", color: "#666", fontSize: "1.1rem" }}>
          На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 32px",
            fontSize: "1rem",
            backgroundColor: "#1976d2",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            transition: "background-color 0.2s",
          }}
        >
          Повернутися на головну
        </Link>
      </div>
    </div>
  );
}
