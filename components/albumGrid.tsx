"use client";

import Link from "next/link";
import { AlbumCard } from "./albumCard";
import { Album } from "@prisma/client";
import { cn } from "@/lib/utils";

interface AlbumGridProps {
  albums: Album[];
  className?: string;
  searchQuery?: string;
  isFocused?: boolean;
}

export function AlbumGrid({ albums, className }: AlbumGridProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in-50 grid min-h-[24vh] grid-cols-1 gap-6 duration-500 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {albums.map((album) => (
        <Link href={`/album/${album.id}`} key={album.id}>
          <AlbumCard
            id={album.id}
            title={album.name}
            artist={album.artists?.[0] ?? "Unknown Artist"}
            year={album.releaseDate}
            coverUrl={album.images?.[0] || "/placeholder.png"}
          />
        </Link>
      ))}
    </div>
  );
}
