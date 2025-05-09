import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PostHogProvider } from "../components/PostHogProvider";
import { Navbar } from "@/components/navbar";
import { BrowserCompatibilityBadge } from "@/components/BrowserCompatibilityBadge";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Posterify - Spotify Album Poster Generator",
  description: "Create beautiful posters from your favorite Spotify albums",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/public/logo.svg" />
        </head>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <PostHogProvider>
              <NuqsAdapter>
                <Navbar />
                {children}
                <BrowserCompatibilityBadge />
              </NuqsAdapter>
            </PostHogProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
