"use client";

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; 
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/header";

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
  const [isScrolled, setIsScrolled] = useState(false); // State to track scroll position
  const pathname = usePathname();

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

    // Scroll event to handle header visibility
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Show header when scrolled more than 50px
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle theme toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  return (
    <html lang="en" className={isDarkMode ? 'dark' : ''}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Conditionally render the header based on scroll position  for '/' */}
        {pathname == '/' && isScrolled && (
          <Header isFixed={true} />
        )}
        {/* for other */}
        {pathname !== '/login' && pathname !== '/signup' && pathname !== '/' && (
          <Header isFixed={false}/>
        )}
        {/* Dark Mode Toggle Button */}
        <button className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded" onClick={toggleDarkMode}>
          {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>

        {children}
      </body>
    </html>
  );
}
