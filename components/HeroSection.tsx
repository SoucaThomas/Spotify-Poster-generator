"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchBar } from "./searchBar";
import { Album } from "@prisma/client";
import { AlbumGrid } from "./albumGrid";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroSectionProps {
  searchQuery?: string;
  albums: Album[];
}

export const HeroSection = ({ searchQuery, albums }: HeroSectionProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isSearching = (searchQuery ?? "").length > 0;
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "relative flex max-h-[60vh] min-h-[80vh] items-center justify-center transition-all duration-700 lg:min-h-[60vh]",
        isMobile ? "" : isSearching || isSearching ? "min-h-[20vh]" : ""
      )}
    >
      <div
        className={cn(
          "animate-in fade-in-50 flex flex-col items-center space-y-6 text-center transition-all duration-700",
          isMobile
            ? ""
            : isSearchFocused || isSearching || isSearching
              ? "-translate-y-32 transform"
              : ""
        )}
      >
        <h1
          className={cn(
            "text-4xl font-bold tracking-tight transition-all duration-500 sm:text-5xl md:text-6xl",
            isMobile
              ? ""
              : isSearchFocused || isSearching || isSearching
                ? "scale-75 opacity-0"
                : ""
          )}
        >
          Create Beautiful Art from your
          <span className="bg-gradient-to-r from-[#9b87f5] to-purple-500 bg-clip-text pl-2 text-transparent">
            Favorite Music
          </span>
        </h1>
        <p
          className={cn(
            "text-muted-foreground max-w-3xl text-xl transition-opacity duration-500",
            isMobile
              ? ""
              : isSearchFocused || isSearching || isSearching
                ? "opacity-0"
                : "opacity-100"
          )}
        >
          Transform your most loved albums into stunning visual art pieces.
          Start by searching for any album below.
        </p>
        <SearchBar
          className={cn(
            "mt-8 w-full max-w-2xl transform transition-all duration-500",
            isMobile
              ? ""
              : isSearching || isSearchFocused || isSearching
                ? "-mt-32"
                : ""
          )}
          onFocusChange={setIsSearchFocused}
        />

        {albums.length > 0 ? (
          <div
            className={cn(
              "w-full transition-opacity duration-500",
              isMobile
                ? "opacity-100"
                : isSearching || isSearchFocused
                  ? "opacity-100"
                  : "opacity-0"
            )}
          >
            <AlbumGrid
              albums={albums}
              className={cn(
                "mt-8 w-full grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
                isMobile ? "" : "transform transition-transform duration-500"
              )}
              searchQuery={searchQuery}
            />
          </div>
        ) : (
          isSearching && (
            <p className="text-muted-foreground mt-8 text-center">
              No albums found. Try refining your search.
            </p>
          )
        )}
      </div>
    </div>
  );
};
