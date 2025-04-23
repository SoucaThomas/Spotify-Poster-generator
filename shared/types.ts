export interface Album {
  id: string;
  name: string;
  artists?: Array<{
    name: string;
    id: string;
  }>;
  images?: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date?: string;
  tracks?: {
    items: Array<{
      id: string;
      name: string;
      duration_ms: number;
      track_number: number;
    }>;
  };
}

export type SpotifySearchResults = {
  albums: {
    items: Album[];
  };
};

export type SearchParamsType = Promise<{ search?: string }>;
