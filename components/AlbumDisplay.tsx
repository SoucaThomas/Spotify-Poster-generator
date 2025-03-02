"use client";

import { redirect } from "next/navigation";
import { Card, CardHeader } from "./ui/card";
import Image from "next/image";
import { Album } from "@/shared/types";

interface AlbumDisplayProps {
  album: Album;
}

export function AlbumDisplay({ album }: AlbumDisplayProps) {
  return (
    <>
      <Card
        className="mx-auto flex aspect-square w-5/6 flex-col items-center gap-4 p-4 shadow-2xl"
        onClick={() => redirect(`/album/${album.id}`)}
      >
        <CardHeader>
          <Image
            src={album.images[0].url}
            alt={album.name}
            className="h-full w-full object-contain"
            height={200}
            width={200}
          />
        </CardHeader>

        <p className="overflow-hidden text-center text-2xl">{album.name}</p>
      </Card>
    </>
  );
}
