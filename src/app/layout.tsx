import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bichito Kasir",
  description: "Aplikasi Manajemen Bisnis F&B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
