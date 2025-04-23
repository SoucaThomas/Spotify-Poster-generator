"use client";

import type React from "react";

import { Input } from "@/components/ui/input";

import { useQueryState } from "nuqs";
import { useTransition, useCallback, useState } from "react";
import debounce from "lodash.debounce";
import { updateSearch } from "@/app/actionts/searchAction";
import { Loader2, Search } from "lucide-react";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
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

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setInputValue(newQuery);
    setSearch(newQuery);
    debouncedUpdateSearch(newQuery);
  };

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search for any album..."
          className="bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full border-2 py-6 pr-4 pl-10 text-base transition-colors focus-visible:ring-2"
          value={inputValue}
          onChange={onSearch}
        />
        {isPending && (
          <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
        )}
      </div>
    </div>
  );
}
