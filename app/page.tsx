import { AlbumDisplay } from "@/components/AlbumDisplay";
import { SearchInput } from "@/components/SearchInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Album } from "@/shared/types";
import axios, { AxiosResponse } from "axios";
import { Disc3, Search } from "lucide-react";

type HomeProps = {
  searchParams: Promise<{ search?: string }>;
};

type SpotifySearchResults = {
  albums: {
    items: Album[];
  };
};

async function getData(
  search: string | undefined
): Promise<AxiosResponse<SpotifySearchResults> | undefined> {
  if (!search) {
    return;
  }

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

  let spotifySearchResults: AxiosResponse<SpotifySearchResults>;
  try {
    spotifySearchResults = await axios.get<SpotifySearchResults>(
      "https://api.spotify.com/v1/search",
      {
        params: {
          q: search,
          type: "album",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }

  return spotifySearchResults;
}

export default async function Home({ searchParams }: HomeProps) {
  const awaitedSearchParams = await searchParams;
  const data = await getData(awaitedSearchParams.search);
  const hasResults = data && data.data.albums.items.length > 0;

  return (
    <div className="from-background to-muted/50 min-h-screen bg-gradient-to-b px-4 py-8 md:px-8 lg:px-12">
      <main className="mx-auto max-w-7xl">
        <Card className="bg-background/80 overflow-hidden border-none backdrop-blur-sm">
          <CardHeader className="bg-background/95 border-b px-6 py-6 md:px-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <Disc3 className="text-primary h-8 w-8" />
                <CardTitle className="text-2xl font-bold tracking-tight md:text-3xl">
                  Album Poster Generator
                </CardTitle>
              </div>
              <ModeToggle />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-muted/30 border-b px-6 py-8 md:px-8">
              <SearchInput />
            </div>

            <div className="p-6 md:p-8">
              {!awaitedSearchParams.search ? (
                <EmptyInitialState />
              ) : !hasResults ? (
                <NoResultsState query={awaitedSearchParams.search} />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {data.data.albums.items.map((album, index) => (
                    <AlbumDisplay key={album.id || index} album={album} />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <footer className="text-muted-foreground mt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} Album Poster Generator. Powered by
            Spotify API.
          </p>
        </footer>
      </main>
    </div>
  );
}

function EmptyInitialState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search
        className="text-muted-foreground/60 h-16 w-16"
        strokeWidth={1.5}
      />
      <h3 className="mt-6 text-xl font-medium">Search for an album</h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        Enter an album title above to discover album artwork and generate custom
        posters
      </p>
    </div>
  );
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search
        className="text-muted-foreground/60 h-16 w-16"
        strokeWidth={1.5}
      />
      <h3 className="mt-6 text-xl font-medium">No results found</h3>
      <p className="text-muted-foreground mt-2 max-w-md">
        We couldn&apos;t find any albums matching &apos;{query}&apos;. Try a
        different search term.
      </p>
    </div>
  );
}
