"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryState } from "nuqs";
import { useTransition, useCallback, useState } from "react";
import debounce from "lodash.debounce";
import { updateSearch } from "@/app/actionts/searchAction";
import { Search, Loader2 } from "lucide-react";

export function SearchInput() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(search || "");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateSearch = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    debounce((query: string) => {
      startTransition(async () => {
        await updateSearch();
      });
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setInputValue(newQuery);
    setSearch(newQuery);
    debouncedUpdateSearch(newQuery);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Label
        htmlFor="album-search"
        className="mb-2 block text-base font-medium"
      >
        Search for an album
      </Label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {isPending ? (
            <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
          ) : (
            <Search className="text-muted-foreground h-5 w-5" />
          )}
        </div>
        <Input
          id="album-search"
          className="pl-10"
          placeholder="Enter album title..."
          value={inputValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
