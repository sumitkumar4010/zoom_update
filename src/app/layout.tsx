import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ ZOOM UPDATE Website SEO Metadata + Favicon Config
export const metadata: Metadata = {
  title: "ZOOM UPDATE - Sabse Tej, Sabse Sahi Job Updates",
  description: "Latest Government Jobs, Admit Card, Result, Syllabus and Admissions.",
  icons: {
    icon: "/favicon.ico", // ya '/favicon.ico' jo bhi aapne src/app/ folder me rakha hai
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}