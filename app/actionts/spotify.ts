"use server";

import { SpotifySearchResults } from "@/shared/types";
import axios, { AxiosResponse } from "axios";

export async function getData(
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

  console.log("Spotify Search Results:", spotifySearchResults.data);
  return spotifySearchResults;
}
