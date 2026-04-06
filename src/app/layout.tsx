import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthProvider>
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
