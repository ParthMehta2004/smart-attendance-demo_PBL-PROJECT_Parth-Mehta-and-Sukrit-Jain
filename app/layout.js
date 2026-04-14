export const metadata = {
  title: "Smart Attendance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#0b0b0b",
        color: "white"
      }}>

        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          backgroundColor: "#111",
          borderBottom: "1px solid #222"
        }}>
          <h1 style={{ margin: 0 }}>Smart Attendance</h1>

          <a href="/admin" style={{
            backgroundColor: "#6d28d9",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            textDecoration: "none"
          }}>
            Admin
          </a>
        </div>

        {children}

      </body>
    </html>
  );
}
