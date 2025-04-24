import { Album } from "@prisma/client";

export type SearchParamsType = Promise<{ search?: string }>;

export interface SpotifyApiResponse {
  albums: {
    items: SpotifyApiResponseAlbum[];
  };
}

export interface SpotifyApiResponseAlbum {
  id: string;
  totalTracks: number;
  externalUrls: { spotify: string };
  spotifyId: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  releaseDate: string;
  artists: { name: string }[];
  type: string;
  uri: string;
  releaseDatePrecision: string;
  label: string;
  popularity: number;
}
