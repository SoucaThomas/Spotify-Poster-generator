import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Album } from "@/shared/types";
import axios from "axios";
import { Disc3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { AlbumPosterGenerator } from "@/components/AlbumPosterGenerator";

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

export default async function GeneratePosterPage({
  params,
}: {
  params: { id: string };
}) {
  const album = await getAlbumDetails(params.id);

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
    <div className="from-background to-muted/50 min-h-screen bg-gradient-to-b px-4 py-8 md:px-8 lg:px-12">
      <main className="mx-auto max-w-7xl">
        <Card className="bg-background/80 overflow-hidden border-none backdrop-blur-sm">
          <CardHeader className="bg-background/95 border-b px-6 py-6 md:px-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <Disc3 className="text-primary h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight md:text-3xl">
                    Create Poster
                  </CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Customize your poster for &apos;{album.name}&apos;
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Search
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <AlbumPosterGenerator album={album} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
