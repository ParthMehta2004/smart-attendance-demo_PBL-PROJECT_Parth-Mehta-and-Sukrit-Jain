export const metadata = {
  title: "Smart Attendance – Professor Panel",
  description: "Session control and live attendance logs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", margin: 0, padding: 16 }}>
          <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-3 shadow">
            <h1 className="text-lg font-bold">Smart Attendance</h1>
            <a href="/admin" className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100">
              Admin
            </a>
          </div>
        {children}
      </body>
    </html>
  );
}

