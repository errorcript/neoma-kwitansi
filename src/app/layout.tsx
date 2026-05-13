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

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Sistem Kwitansi Neoma - Paguyuban Dharma Putra Mahesa",
  description: "Sistem manajemen kwitansi donasi profesional dan transparan.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-paguyuban.png",
    apple: "/logo-paguyuban.png",
  }
};

export const viewport: Viewport = {
  themeColor: "#054d3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { OnboardingTour } from "@/components/OnboardingTour";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-20 sm:pb-0">
        <OnboardingTour />
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
