"use client";

import type React from "react";

import { Input } from "@/components/ui/input";

import { useQueryState } from "nuqs";
import { useTransition, useCallback, useState } from "react";
import debounce from "lodash.debounce";
import { updateSearch } from "@/app/actionts/searchAction";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  onFocusChange?: (focused: boolean) => void;
}

export function SearchBar({ className, onFocusChange }: SearchBarProps) {
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
    }, 500),
    []
  );

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setInputValue(newQuery);
    setSearch(newQuery);
    debouncedUpdateSearch(newQuery);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      debouncedUpdateSearch(inputValue);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative w-full max-w-2xl", className)}
    >
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        value={search}
        onChange={onSearch}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        placeholder="Search for any album..."
        className="bg-background/95 supports-[backdrop-filter]:bg-background/60 h-12 pl-9 backdrop-blur"
      />
    </form>
  );
}
