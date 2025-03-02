import { AlbumDisplay } from "@/components/AlbumDisplay";
import { SearchInput } from "@/components/SearchInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Album } from "@/shared/types";
import axios, { AxiosResponse } from "axios";

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

  return (
    <div className="m-auto h-full items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex h-full w-full max-w-screen-xl flex-col items-center gap-8 sm:items-start">
        <Card className="flex h-full w-full p-0 shadow-2xl">
          <CardContent className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-8">
              <CardTitle className="text-2xl">Album Poster Generator</CardTitle>
              <ModeToggle />
            </CardHeader>
            <CardContent className="mt-0 flex flex-grow flex-col items-center overflow-auto pt-0">
              <SearchInput />

              <div className="mt-2 grid grid-cols-3 gap-4 overflow-auto p-4">
                {data ? (
                  <>
                    {data.data.albums.items.map((album, index) => (
                      <AlbumDisplay key={index} album={album} />
                    ))}
                  </>
                ) : (
                  <>Search from a album</>
                )}
              </div>
            </CardContent>
          </CardContent>
        </Card>
      </main>
      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6"></footer>
    </div>
  );
}
