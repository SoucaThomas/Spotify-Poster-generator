"use client";

import { useState, useRef } from "react";
import type { Album } from "@/shared/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Download,
  RefreshCw,
  Palette,
  Layout,
  Type,
  ImageIcon,
  Sliders,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { PosterPreset } from "./poster/PosterPreset";
import { PosterTemplate } from "./poster/PosterTemplate";
import { ColorPicker } from "./poster/ColorPicker";
import { GradientControls } from "./poster/GradientControls";
import { POSTER_STYLES } from "@/lib/posterStyles";

interface AlbumPosterGeneratorProps {
  album: Album;
}

export function AlbumPosterGenerator({ album }: AlbumPosterGeneratorProps) {
  const [settings, setSettings] = useState(POSTER_STYLES[0].defaults);
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStyleChange = (styleId: string) => {
    const style = POSTER_STYLES.find((s) => s.id === styleId);
    if (style) {
      setSettings(style.defaults);
    }
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;

    try {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        toast({
          title: "Poster Downloaded",
          description: "Your poster has been generated and downloaded.",
        });
      }, 1500);
    } catch (error) {
      console.error("Error generating poster:", error);
      setIsGenerating(false);
      toast({
        title: "Error",
        description: "Failed to generate poster. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Preview */}
      <div className="flex flex-col">
        <h2 className="mb-4 text-lg font-medium">Preview</h2>
        <div className="bg-background/50 relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg border p-4">
          <div ref={posterRef} className="w-full max-w-[400px]">
            <PosterTemplate album={album} settings={settings} />
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            onClick={downloadPoster}
            className="gap-2"
            disabled={isGenerating}
          >
            <Download className="h-4 w-4" />
            Download Poster
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col">
        <h2 className="mb-4 text-lg font-medium">Customize Poster</h2>
        <Tabs defaultValue="style" className="flex-1">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="style">
              <Layout className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Style</span>
            </TabsTrigger>
            <TabsTrigger value="colors">
              <Palette className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Text</span>
            </TabsTrigger>
            <TabsTrigger value="image">
              <ImageIcon className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Image</span>
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Sliders className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="style" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Poster Style</Label>
                <PosterPreset
                  styles={POSTER_STYLES}
                  value={settings.style}
                  onValueChange={(value) => handleStyleChange(value)}
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStyleChange(settings.style)}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Default Style
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="mt-4 space-y-4">
            <ColorPicker
              label="Text Color"
              value={settings.textColor}
              onChange={(value) => updateSetting("textColor", value)}
            />

            <ColorPicker
              label="Background Color"
              value={settings.backgroundColor}
              onChange={(value) => updateSetting("backgroundColor", value)}
              disabled={settings.gradientEnabled}
            />

            <GradientControls
              enabled={settings.gradientEnabled}
              direction={settings.gradientDirection}
              color1={settings.gradientColor1}
              color2={settings.gradientColor2}
              onEnabledChange={(value) =>
                updateSetting("gradientEnabled", value)
              }
              onDirectionChange={(value) =>
                updateSetting("gradientDirection", value)
              }
              onColor1Change={(value) => updateSetting("gradientColor1", value)}
              onColor2Change={(value) => updateSetting("gradientColor2", value)}
            />
          </TabsContent>

          <TabsContent value="typography" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="title-size">
                  Title Size: {settings.titleSize}px
                </Label>
              </div>
              <Slider
                id="title-size"
                min={24}
                max={72}
                step={1}
                value={[settings.titleSize]}
                onValueChange={(value) => updateSetting("titleSize", value[0])}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-artists"
                  checked={settings.showArtists}
                  onCheckedChange={(checked) =>
                    updateSetting("showArtists", checked)
                  }
                />
                <Label htmlFor="show-artists">Show Artists</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-year"
                  checked={settings.showYear}
                  onCheckedChange={(checked) =>
                    updateSetting("showYear", checked)
                  }
                />
                <Label htmlFor="show-year">Show Release Year</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-tracks"
                  checked={settings.showTracks}
                  onCheckedChange={(checked) =>
                    updateSetting("showTracks", checked)
                  }
                />
                <Label htmlFor="show-tracks">Show Track Listing</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="image-opacity">
                  Image Opacity: {settings.imageOpacity}%
                </Label>
              </div>
              <Slider
                id="image-opacity"
                min={0}
                max={100}
                step={5}
                value={[settings.imageOpacity]}
                onValueChange={(value) =>
                  updateSetting("imageOpacity", value[0])
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="image-scale">
                  Image Scale: {settings.imageScale}%
                </Label>
              </div>
              <Slider
                id="image-scale"
                min={50}
                max={150}
                step={5}
                value={[settings.imageScale]}
                onValueChange={(value) => updateSetting("imageScale", value[0])}
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="padding">Padding: {settings.padding}px</Label>
              </div>
              <Slider
                id="padding"
                min={0}
                max={100}
                step={5}
                value={[settings.padding]}
                onValueChange={(value) => updateSetting("padding", value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="border-width">
                  Border Width: {settings.borderWidth}px
                </Label>
              </div>
              <Slider
                id="border-width"
                min={0}
                max={20}
                step={1}
                value={[settings.borderWidth]}
                onValueChange={(value) =>
                  updateSetting("borderWidth", value[0])
                }
              />
            </div>

            {settings.borderWidth > 0 && (
              <ColorPicker
                label="Border Color"
                value={settings.borderColor}
                onChange={(value) => updateSetting("borderColor", value)}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
