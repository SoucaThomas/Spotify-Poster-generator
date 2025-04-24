import { prisma } from "@/prisma/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Generated Poster:", body.album.name, " - ", body.album.label);

    // Save the album to the database
    await prisma.album.upsert({
      where: { id: body.album.id },
      update: body.album,
      create: body.album,
    });

    // Create a generated record
    await prisma.generated.create({
      data: {
        albumId: body.album.id,
        generatedImage: body.image,
        settings: body.settings,
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
