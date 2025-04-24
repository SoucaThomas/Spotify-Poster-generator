"use client";

import Link from "next/link";
import { Music, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background/70 border-border/40 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <Music className="text-primary h-6 w-6" />
            <span className="from-primary bg-gradient-to-r to-indigo-500 bg-clip-text text-xl font-bold text-transparent">
              Posterify
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
