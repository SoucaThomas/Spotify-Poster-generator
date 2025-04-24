"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlbumCardProps {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year?: string;
  className?: string;
}

export function AlbumCard({
  title,
  artist,
  coverUrl,
  year,
  className,
}: AlbumCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group bg-card/30 relative overflow-hidden rounded-xl backdrop-blur-sm transition-all duration-300 ease-in-out",
        isHovered ? "scale-[1.03] shadow-xl" : "shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={coverUrl}
          alt={`${title} by ${artist}`}
          width={300}
          height={300}
          className={cn(
            "h-full w-full object-cover transition-transform duration-700 ease-in-out",
            isHovered ? "scale-110" : ""
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300",
            isHovered ? "opacity-100" : ""
          )}
        >
          <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between">
            <button className="bg-primary text-primary-foreground flex h-12 w-12 translate-y-10 transform items-center justify-center rounded-full opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <Play className="ml-1 h-5 w-5" />
            </button>
            <button className="bg-background/80 text-foreground hover:bg-background flex h-12 w-12 translate-y-10 transform items-center justify-center rounded-full opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 text-lg leading-tight font-semibold">
          {title}
        </h3>
        <p className="text-muted-foreground mt-1">{artist}</p>
        {year && (
          <p className="text-muted-foreground/70 mt-1 text-sm">{year}</p>
        )}
      </div>
    </div>
  );
}
