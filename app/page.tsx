import { AlbumGrid } from "@/components/albumGrid";
import { SearchParamsType } from "@/shared/types";
import { getUserGeneratedAlbums, searchForAlbums } from "./actionts/spotify";
import { HeroSection } from "@/components/HeroSection";

type HomeProps = {
  searchParams: SearchParamsType;
};

export default async function Home({ searchParams }: HomeProps) {
  const awaitedSearchParams = await searchParams;
  const awaitedSearchParamsString = awaitedSearchParams.search || "";

  const data = await searchForAlbums(awaitedSearchParamsString);

  console.log("searchParams", awaitedSearchParamsString);

  const userGenerated = await getUserGeneratedAlbums();

  return (
    <main className="from-background to-background/90 min-h-screen bg-gradient-to-b">
      <section className="container mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <HeroSection albums={data} />

        <div className="animate-in fade-in-50 mt-16 duration-1000">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Last used to generate by users
            </h2>
          </div>

          <AlbumGrid albums={userGenerated} />
        </div>
      </section>
    </main>
  );
}
