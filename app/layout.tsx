import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bima Yangu — AI savings autopilot for Kenya's informal workers",
  description: "A working demo with synthetic data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}