"use server";

import { prisma } from "@/prisma/prisma";
import {
  SpotifyApiGetAlbumResponse,
  SpotifyApiSearchAlbumsResponse,
} from "@/shared/types";
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
  }

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
          limit: 6,
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

export async function getUserGeneratedAlbums(): Promise<Album[]> {
  const userGeneratedAlbums = await prisma.generated.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      album: true,
    },
  });

  const uniqueAlbumsMap = new Map<string, (typeof userGeneratedAlbums)[0]>();

  userGeneratedAlbums.forEach((generatedAlbum) => {
    if (!uniqueAlbumsMap.has(generatedAlbum.album.id)) {
      uniqueAlbumsMap.set(generatedAlbum.album.id, generatedAlbum);
    }
  });

  const uniqueAlbums = Array.from(uniqueAlbumsMap.values())
    .slice(0, 6)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const albums = uniqueAlbums.map((generatedAlbum) => {
    return {
      id: generatedAlbum.album.id,
      name: generatedAlbum.album.name,
      artists: generatedAlbum.album.artists,
      releaseDate: generatedAlbum.album.releaseDate,
      totalTracks: generatedAlbum.album.totalTracks,
      spotifyId: generatedAlbum.album.spotifyId,
      images: generatedAlbum.album.images,
      uri: generatedAlbum.album.uri,
    } as Album;
  });

  return albums;
}

export async function getAlbumDetails(id: string): Promise<Album | undefined> {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Failed to fetch Spotify token");
    }

    const albumResponse = await axios
      .get<SpotifyApiGetAlbumResponse>(
        `https://api.spotify.com/v1/albums/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((error) => {
        console.error("Error fetching album details:", error);
        throw error;
      });

    const albumResponseData = albumResponse.data;

    const album: Album = {
      id: albumResponseData.id,
      name: albumResponseData.name,
      artists: albumResponseData.artists.map((artist) => artist.name),
      releaseDate: albumResponseData.release_date,
      totalTracks: albumResponseData.total_tracks,
      spotifyId: albumResponseData.id,
      images: albumResponseData.images.map((image) => image.url),
      uri: albumResponseData.uri,
      externalUrls: [albumResponseData.external_urls.spotify],
      tracks: albumResponseData.tracks.items.map(
        (track) => track.name as string
      ),
      type: albumResponseData.album_type,
      label: albumResponseData.label || "Unknown Label",
      popularity: albumResponseData.popularity || -1,
      releaseDatePrecision: albumResponseData.release_date_precision,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    if (!album) {
      throw new Error("Album not found");
    }

    return Promise.resolve(album);
  } catch (error) {
    console.error("Error fetching album details:", error);
  }
}
