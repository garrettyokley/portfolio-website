import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Garrett Yokley",
  description: "Interactive Linux terminal portfolio - Systems Administrator passionate about DevOps, automation, and emerging technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/tux.png" type="image/png" />
        <link rel="shortcut icon" href="/tux.png" type="image/png" />
        <link rel="apple-touch-icon" href="/tux.png" />
      </head>
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
