"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker } from "./ColorPicker";
import { motion, AnimatePresence } from "framer-motion";

interface GradientControlsProps {
  enabled: boolean;
  direction: string;
  color1: string;
  color2: string;
  onEnabledChange: (value: boolean) => void;
  onDirectionChange: (value: string) => void;
  onColor1Change: (value: string) => void;
  onColor2Change: (value: string) => void;
}

export function GradientControls({
  enabled,
  direction,
  color1,
  color2,
  onEnabledChange,
  onDirectionChange,
  onColor1Change,
  onColor2Change,
}: GradientControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="gradient-toggle"
          checked={enabled}
          onCheckedChange={onEnabledChange}
        />
        <Label htmlFor="gradient-toggle">Enable Gradient Background</Label>
      </div>

      <AnimatePresence>
        {enabled && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2">
              <Label>Gradient Direction</Label>
              <Select value={direction} onValueChange={onDirectionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to right">Horizontal</SelectItem>
                  <SelectItem value="to bottom">Vertical</SelectItem>
                  <SelectItem value="to bottom right">Diagonal</SelectItem>
                  <SelectItem value="to top right">Reverse Diagonal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Color 1"
                value={color1}
                onChange={onColor1Change}
              />
              <ColorPicker
                label="Color 2"
                value={color2}
                onChange={onColor2Change}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
