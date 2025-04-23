import { Card, CardContent } from "@/components/ui/card";
import { Album } from "@/shared/types";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { AlbumPosterGenerator } from "@/components/AlbumPosterGenerator";

interface SegmentParams {
  id: string;
}

interface PageProps {
  params: Promise<SegmentParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

async function getAlbumDetails(id: string): Promise<Album | null> {
  try {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing Spotify client ID or secret");
    }

    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = tokenResponse.data.access_token;

    const albumResponse = await axios.get(
      `https://api.spotify.com/v1/albums/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return albumResponse.data;
  } catch (error) {
    console.error("Error fetching album details:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<SegmentParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const album = await getAlbumDetails(id);

  return {
    title: album ? `Album Poster: ${album.name}` : "Album Not Found",
  };
}

export default async function GeneratePosterPage({ params }: PageProps) {
  // Make sure params exists before destructuring
  if (!params) {
    throw new Error("Missing required params");
  }

  const { id } = await params;
  const album = await getAlbumDetails(id);

  if (!album) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="mb-4 text-xl font-semibold">Album Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t find the album you&apos;re looking for.
            </p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="from-background to-background/90 min-h-screen bg-gradient-to-b">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card className="bg-background/80 animate-in fade-in-50 border-none shadow-2xl backdrop-blur-sm duration-1000">
          <CardContent className="p-0">
            <AlbumPosterGenerator album={album} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
