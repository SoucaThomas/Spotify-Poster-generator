import { prisma } from "@/prisma/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Generated Poster:", body.album.name, " - ", body.album.label);

    const albumToSave = {
      id: body.album.id,
      name: body.album.name,
      artists: body.album.artists.map(
        (artist: { name: string }) => artist.name
      ),
      releaseDate: body.album.releaseDate,
      releaseDatePrecision: body.album.releaseDatePrecision,
      label: body.album.label,
      imageUrl: body.album.images.map((image: { url: string }) => image.url),
    };

    await prisma.generated.create({
      data: {
        Album: albumToSave,
        GeneratedPosterImage: body.image || "",
        Settings: body.settings,
      },
    });
    return new Response(
      JSON.stringify({ message: "Poster logged successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error logging poster:", error);

    return new Response(JSON.stringify({ error: "Failed to log poster" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
