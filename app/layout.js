export const metadata = {
  title: "Smart Attendance – Professor Panel",
  description: "Session control and real-time attendance logs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
