export interface Album {
  name: string;
  id: string;
  images: Array<{ url: string }>;
  artists: Array<{ name: string }>;
  release_date: string;
}
