

"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { metadata } from "./metadata"; // Import metadata from separate file
import { AuthProvider } from "../components/context/AuthContext"; // Import AuthProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get current page route

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname} // Re-animate when the route changes
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </AuthProvider>
      </body>
    </html>
  );
}

