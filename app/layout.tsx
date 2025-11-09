import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import BackToTopButton from "@/components/back-to-top";
import { Toaster } from "sonner";
import Chatbot from "@/components/chatbot";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ecommerce Store",
    template: "%s | Ecommerce Store",
  },
  description: "The best ecommerce store",
  openGraph: {
    title: "Ecommerce Store",
    description: "The best ecommerce store",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://ecommerce-store.com",
    siteName: "Ecommerce Store",
    images: [
      {
        url: "https://ecommerce-store.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          <SessionProvider>
            <ThemeProvider
              defaultTheme="system"
              attribute="class"
              enableSystem
              disableTransitionOnChange
              storageKey="theme"
            >
              <NavBar />

              <main className="flex-grow">
                {" "}
                {/* Thêm pt-16 (64px) để tránh bị navbar che */}
                {children}
                <Toaster richColors position="bottom-right" />
                <Chatbot />
              </main>
              <BackToTopButton />
              <Footer />
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </Suspense>
  );
}
//app/layout.tsx
