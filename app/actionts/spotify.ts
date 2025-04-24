"use server";

import { SpotifyApiResponse } from "@/shared/types";
import { Album } from "@prisma/client";
import axios, { AxiosResponse } from "axios";

export async function getData(search: string): Promise<Album[]> {
  if (!search) {
    return Promise.reject(new Error("Failed to fetch data from Spotify"));
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

  let spotifySearchResults: AxiosResponse<SpotifyApiResponse>;
  try {
    spotifySearchResults = await axios.get<SpotifyApiResponse>(
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

  const albums = spotifySearchResults.data.albums.items.map(
    (album) =>
      ({
        id: album.id,
        name: album.name,
        artists: album.artists.map((artist) => artist.name),
        releaseDate: album.releaseDate,
        totalTracks: album.totalTracks,
        spotifyId: album.id,
        images: album.images.map((image) => image.url),
        uri: album.uri,
        label: album.label,
        popularity: album.popularity || -1,
      }) as Album
  );

  console.log("Fetched albums from Spotify for query:", search);
  return albums;
}
