import { Album } from "@prisma/client";

export type SearchParamsType = Promise<{ search?: string }>;

export interface SpotifyApiSearchAlbumsResponse {
  albums: {
    items: SpotifyApiSearchAlbumsResponseAlbum[];
  };
}

export interface SpotifyApiSearchAlbumsResponseAlbum {
  id: string;
  total_tracks: number;
  external_urls: { spotify: string };
  album_type: string;
  href: string;
  available_markets: string[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  artists: { name: string }[];
}

export interface SpotifyApiGetAlbumResponse {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: {
    name: string;
    href: string;
    id: string;
    type: string;
    uri: string;
  }[];
  tracks: {
    href: string;
    items: {
      track_number: number;
      name: string;
      id: string;
      uri: string;
      external_urls: { spotify: string };
      available_markets: string[];
      artists: {
        name: string;
        href: string;
        id: string;
        type: string;
        uri: string;
      }[];
      is_local: boolean;
      type: string;
      duration_ms: number;
      is_playable: boolean;
      disc_number: number;
      external_ids: { isrc: string };
    }[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
  label: string;
  popularity: number;
}
