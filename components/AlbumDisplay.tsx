"use client";

import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Music, User } from "lucide-react";
import { Album } from "@prisma/client";

interface AlbumDisplayProps {
  album: Album;
}

export function AlbumDisplay({ album }: AlbumDisplayProps) {
  console.log("AlbumDisplay", album);

  const router = useRouter();
  const imageUrl = "https://i.scdn.co/image/" + album.images[0];

  console.log("Image URL:", imageUrl);

  return (
    <Card
      className="group hover:ring-primary/20 overflow-hidden transition-all duration-300 hover:shadow-lg hover:ring-1"
      onClick={() => router.push(`/album/${album.id}`)}
    >
      <div className="bg-muted relative aspect-square overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={album.name}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="bg-muted flex h-full items-center justify-center">
            <Music className="text-muted-foreground/40 h-16 w-16" />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="line-clamp-1 font-medium">{album.name}</h3>

        <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
          <User className="h-3.5 w-3.5" />
          <span className="line-clamp-1">
            {album.artists?.map((artist) => artist).join(", ") ||
              "Unknown Artist"}
          </span>
        </div>

        {album.releaseDate && (
          <p className="text-muted-foreground mt-1 text-xs">
            {new Date(album.releaseDate).getFullYear()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
