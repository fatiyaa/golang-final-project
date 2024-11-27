"use client";

import { ReactNode, useEffect, useState } from 'react';
import localFont from "next/font/local";
import "./globals.css";

// Import local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect and apply dark mode based on system preference or localStorage
  useEffect(() => {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");

    // Apply the theme from localStorage or system preference
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      setIsDarkMode(systemPrefersDark);
    }

    // Toggle dark mode on the document element
    document.documentElement.classList.toggle("dark", savedTheme === "dark" || (systemPrefersDark && !savedTheme));
  }, []);

  // Handle theme toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  return (
    <html lang="en" className={isDarkMode ? 'dark' : ''}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <button
          className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
        {children}
      </body>
    </html>
  );
}
