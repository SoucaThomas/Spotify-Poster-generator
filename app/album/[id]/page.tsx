import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlbumPosterGenerator } from "@/components/AlbumPosterGenerator";
import { getAlbumDetails } from "@/app/actionts/spotify";

interface SegmentParams {
  id: string;
}

interface PageProps {
  params: Promise<SegmentParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<SegmentParams>;
// }): Promise<Metadata> {
//   const { id } = await params;
//   const album = await getAlbumDetails(id);

//   return {
//     title: album ? `Album Poster: ${album.name}` : "Album Not Found",
//   };
// }

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
