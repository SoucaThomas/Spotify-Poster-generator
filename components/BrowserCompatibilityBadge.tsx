"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BrowserCompatibilityBadge() {
  const [isVisible, setIsVisible] = useState(true);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Check if the browser is Safari
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );
    setIsSafari(isSafariBrowser);
  }, []);

  if (!isVisible || !isSafari) return null;

  return (
    <div className="animate-fade-in fixed right-4 bottom-4 z-50 max-w-xs">
      <div className="flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-3 text-amber-800 shadow-lg dark:bg-amber-900/90 dark:text-amber-100">
        <div className="flex-1">
          <p className="text-sm font-medium">
            Downloading the posters may not work on the first try. Please use a
            different browser for a better experience.{" "}
            <a
              href="https://github.com/tsayen/dom-to-image?tab=readme-ov-file#browsers"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Learn more
            </a>
            .
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full text-amber-800 hover:bg-amber-200 hover:text-amber-900 dark:text-amber-100 dark:hover:bg-amber-800"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  );
}
