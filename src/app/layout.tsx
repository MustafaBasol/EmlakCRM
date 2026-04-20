import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

import AuthProvider from "@/components/auth/auth-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Emlak CRM | Yönetim Paneli",
  description: "Modern Emlak Ofisi Yönetim ve CRM Sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <body
        className={`${inter.variable} font-sans h-full antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
