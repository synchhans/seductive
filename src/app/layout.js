"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [isBlurred, setIsBlurred] = useState(false);

  return (
    <html lang="en">
      <head>
        <head>
          <title>Seductive HOT</title>
          <meta
            name="description"
            content="Website for age 18 years and over"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
          <header className="bg-white shadow sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-blue-600">
                📸 Galeri Gambar
              </h1>
              <button
                onClick={() => setIsBlurred((prev) => !prev)}
                className="text-sm px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
              >
                {isBlurred ? "Unblur" : "Blur"}
              </button>
            </div>
          </header>

          <main
            className={`flex-1 p-6 max-w-6xl mx-auto transition duration-300 ${
              isBlurred ? "blur-lg pointer-events-none select-none" : ""
            }`}
          >
            {children}
          </main>

          <footer
            className={`text-sm text-gray-400 py-6 text-center transition duration-300 ${
              isBlurred ? "blur-sm pointer-events-none select-none" : ""
            }`}
          >
            &copy; {new Date().getFullYear()} Galeri App. Dibuat dengan ❤️
          </footer>
        </div>
      </body>
    </html>
  );
}
