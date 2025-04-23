"use client";

import Link from "next/link";
import { AlbumCard } from "./albumCard";
import { SpotifySearchResults } from "@/shared/types";

interface AlbumGridProps {
  data: SpotifySearchResults;
}

export function AlbumGrid({ data }: AlbumGridProps) {
  if (!data) return null;

  const albums = data.albums.items;

  return (
    <>
      {albums.length > 0 ? (
        <div className="animate-in fade-in-50 grid grid-cols-1 gap-6 duration-500 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {albums.map((album) => (
            <Link href={`/album/${album.id}`} key={album.id}>
              <AlbumCard
                id={album.id}
                title={album.name}
                artist={album.artists?.[0]?.name ?? "Unknown Artist"}
                year={album.release_date}
                coverUrl={album.images?.[0]?.url ?? ""}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h3 className="mb-2 text-xl font-medium">No albums found</h3>
          <p className="text-muted-foreground">
            Try searching for something else
          </p>
        </div>
      )}
    </>
  );
}
