"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface PosterStyle {
  id: string;
  name: string;
  description: string;
  defaults: {
    titleSize: number;
    showArtists: boolean;
    showYear: boolean;
    titleFont: string;
    textColor: string;
    backgroundColor: string;
    gradientEnabled: boolean;
    imageOpacity: number;
    imageScale: number;
    borderWidth: number;
    padding: number;
    layout: string;
    showTracks: boolean;
    [key: string]: any;
  };
}

interface PosterPresetProps {
  styles: PosterStyle[];
  value: string;
  onValueChange: (value: string) => void;
}

export function PosterPreset({
  styles,
  value,
  onValueChange,
}: PosterPresetProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="grid gap-3"
    >
      {styles.map((style, index) => (
        <motion.div
          key={style.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Label
            className={cn(
              "bg-card hover:bg-accent/50 cursor-pointer rounded-lg border p-4 transition-colors",
              value === style.id && "border-primary bg-accent"
            )}
          >
            <RadioGroupItem value={style.id} className="sr-only" />
            <div className="flex flex-col gap-1">
              <span className="font-medium">{style.name}</span>
              <span className="text-muted-foreground text-sm">
                {style.description}
              </span>
            </div>
          </Label>
        </motion.div>
      ))}
    </RadioGroup>
  );
}
