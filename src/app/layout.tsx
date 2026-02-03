import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Using better fonts as requested
import "./globals.css";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "CodeVisualizer - Master Tech Interviews",
  description: "Interactive visualization platform for DSA, React, Next.js, and Node.js interview preparation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-white dark:bg-slate-900 transition-colors duration-300`}
      >
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
