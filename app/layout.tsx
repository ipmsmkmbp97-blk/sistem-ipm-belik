import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Menggunakan font Inter untuk tampilan profesional dan bersih
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPM Management System | SMK Muhammadiyah Belik",
  description: "Sistem Manajemen Digital Organisasi IPM SMK Muhammadiyah Belik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Konten utama aplikasi akan di-render di sini */}
        {children}
      </body>
    </html>
  );
}