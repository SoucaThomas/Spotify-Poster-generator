"use client";

import { Album } from "@prisma/client";
import { motion } from "framer-motion";

interface PosterTemplateProps {
  album: Album;
  settings: {
    titleSize: number;
    titleFont: string;
    textColor: string;
    backgroundColor: string;
    gradientEnabled?: boolean;
    gradientDirection?: string;
    gradientColor1?: string;
    gradientColor2?: string;
    imageOpacity: number;
    imageScale: number;
    borderWidth: number;
    borderColor?: string;
    padding: number;
    showArtists?: boolean;
    showYear?: boolean;
    showTracks?: boolean;
  };
}

export function PosterTemplate({ album, settings }: PosterTemplateProps) {
  const background = settings.gradientEnabled
    ? `linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2})`
    : settings.backgroundColor;

  return (
    <motion.div
      className="relative overflow-hidden rounded-md shadow-lg"
      style={{
        height: "700px",
        aspectRatio: "1 / 1.414",
        backgroundColor: settings.backgroundColor,
        background,
        padding: `${settings.padding}px`,
        border:
          settings.borderWidth > 0
            ? `${settings.borderWidth}px solid ${settings.borderColor}`
            : "none",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Album Image */}
      <motion.div
        className="relative mb-3 aspect-square w-full"
        initial={{ scale: 0.9, opacity: 0, y: 0 }}
        animate={{
          scale: settings.imageScale / 100,
          opacity: settings.imageOpacity / 100,
        }}
        transition={{ duration: 0.5 }}
      >
        {album.images?.[0] && (
          /// Unfortunalty we have to use the img tag here bacause dom-to-image doesn't support next/image
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={album.images[0] || "/placeholder.svg"}
            alt={album.name}
            className="object-cover shadow-2xl"
            sizes="(max-width: 768px) 100vw, 4400px"
            // fill
            // priority
          />
        )}
      </motion.div>

      {/* Album Info */}
      <motion.div layout className="relative z-10 space-y-1">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-1">
            <motion.h1
              layout
              className="font-bold break-words"
              style={{
                color: settings.textColor,
                fontSize: `${settings.titleSize}px`,
                fontFamily: settings.titleFont,
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {album.name}
            </motion.h1>

            {settings.showYear && album.releaseDate && (
              <motion.p
                layout
                className="text-sm"
                style={{ color: settings.textColor }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {new Date(album.releaseDate).getFullYear()}
              </motion.p>
            )}
          </div>

          {settings.showArtists && album.artists && (
            <motion.p
              layout
              className="text-xl"
              style={{ color: settings.textColor }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {album.artists.map((artist) => artist).join(", ")}
            </motion.p>
          )}
        </div>

        {settings.showTracks && album.tracks && (
          <motion.div
            layout
            className="mt-2 flex flex-wrap items-center justify-center gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {album.tracks.map((track, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-1 text-sm"
                style={{ color: settings.textColor }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <span>{track}</span>
                <span>{index !== (album.tracks?.length ?? 0) - 1 && "|"}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
