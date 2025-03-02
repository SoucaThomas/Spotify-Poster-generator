import type { PosterStyle } from "@/components/poster/PosterPreset";

export const POSTER_STYLES: PosterStyle[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design with focus on the album art",
    defaults: {
      titleSize: 32,
      showArtists: true,
      showYear: true,
      titleFont: "'Inter', sans-serif",
      textColor: "#000000",
      backgroundColor: "#ffffff",
      gradientEnabled: false,
      imageOpacity: 100,
      imageScale: 100,
      borderWidth: 0,
      padding: 40,
      layout: "centered",
      showTracks: true,
      style: "minimal",
    },
  },
];
