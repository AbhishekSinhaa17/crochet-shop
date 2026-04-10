import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Strokes of Craft – Handmade Crochet Products",
    template: "%s | Strokes of Craft",
  },
  description:
    "Discover unique handmade crochet products. Amigurumi, home decor, accessories, and custom orders crafted with love.",
  keywords: [
    "crochet",
    "handmade",
    "amigurumi",
    "crochet shop",
    "handmade gifts",
    "custom crochet",
  ],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Strokes of Craft",
  },
};

import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import SyncManager from "@/components/SyncManager";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col transition-colors duration-300 font-sans" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <AuthProvider>
              <SyncManager />
              <ErrorBoundary>
                <LayoutWrapper>{children}</LayoutWrapper>
              </ErrorBoundary>
            </AuthProvider>
          </QueryProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "#333",
                color: "#fff",
                fontSize: "14px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
