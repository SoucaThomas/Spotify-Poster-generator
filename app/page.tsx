import { AlbumGrid } from "@/components/albumGrid";
import { SearchBar } from "@/components/searchBar";
import { SearchParamsType } from "@/shared/types";
import { getData } from "./actionts/spotify";
import { prisma } from "@/prisma/prisma";
import { Album } from "@prisma/client";

type HomeProps = {
  searchParams: SearchParamsType;
};

export default async function Home({ searchParams }: HomeProps) {
  const awaitedSearchParams = await searchParams;
  const awaitedSearchParamsString = awaitedSearchParams.search || "";

  const data = await getData(awaitedSearchParamsString);

  return (
    <main className="from-background to-background/90 min-h-screen bg-gradient-to-b">
      <section className="container mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="animate-in fade-in-50 slide-in-from-bottom-10 mb-12 flex flex-col items-center space-y-6 text-center duration-700">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Turn your favorite albums into
            <span className="from-primary bg-gradient-to-r to-purple-500 bg-clip-text pl-2 text-transparent">
              stunning posters
            </span>
          </h1>
          <p className="text-muted-foreground max-w-3xl text-xl">
            Search for any album on Spotify and create beautiful, custom posters
            that showcase your music taste.
          </p>
          <SearchBar className="mt-8" />
        </div>

        <div className="animate-in fade-in-50 mt-16 duration-1000">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              {awaitedSearchParamsString
                ? `Results for "${awaitedSearchParamsString}"`
                : "Generated Posters by Posterify"}
            </h2>
          </div>

          <AlbumGrid albums={data} />
        </div>
      </section>
    </main>
  );
}
