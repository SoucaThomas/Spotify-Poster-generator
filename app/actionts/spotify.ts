"use server";

import { SpotifyApiSearchAlbumsResponse } from "@/shared/types";
import { Album } from "@prisma/client";
import axios, { AxiosResponse } from "axios";

const getToken = async () => {
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

  return token;
};

export async function searchForAlbums(searchQuery: string): Promise<Album[]> {
  if (!searchQuery) {
    return [];
  } else {
    const token = await getToken();
    if (!token) {
      throw new Error("Failed to fetch Spotify token");
    }

    // Using the searchQuery we fetch spotify albums

    let spotifySearchResults: AxiosResponse<SpotifyApiSearchAlbumsResponse>;
    try {
      spotifySearchResults = await axios.get<SpotifyApiSearchAlbumsResponse>(
        "https://api.spotify.com/v1/search",
        {
          params: {
            q: searchQuery,
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
          releaseDate: album.release_date,
          totalTracks: album.total_tracks,
          spotifyId: album.id,
          images: album.images.map((image) => image.url),
          uri: album.uri,
        }) as Album
    );

    console.log("Fetched albums from Spotify for query:", searchQuery);
    return albums;
  }
}

export async function getAlbumDetails(id: string): Promise<Album | undefined> {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Failed to fetch Spotify token");
    }

    const albumResponse = await axios
      .get(`https://api.spotify.com/v1/albums/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.error("Error fetching album details:", error);
        throw error;
      });

    console.log("Fetched album details from Spotify:", albumResponse.data);

    const album = albumResponse.data as Album;

    if (!album) {
      throw new Error("Album not found");
    }

    return Promise.resolve(album);
  } catch (error) {
    console.error("Error fetching album details:", error);
  }
}
