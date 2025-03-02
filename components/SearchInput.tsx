"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryState } from "nuqs";
import { useTransition, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { updateSearch } from "@/app/actionts/searchAction";

export function SearchInput() {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [, startTransition] = useTransition();

  const debouncedUpdateSearch = useCallback(
    debounce((query: string) => {
      startTransition(async () => {
        await updateSearch();
      });
    }, 300),
    [startTransition]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearch(newQuery);
    debouncedUpdateSearch(newQuery);
  };

  useEffect(() => {
    if (search) {
      debouncedUpdateSearch(search);
    }
  }, [search, debouncedUpdateSearch]);

  return (
    <>
      <Label className="pb-4 text-2xl">Album Title</Label>
      <Input
        className="w-1/2"
        placeholder="Enter album title"
        value={search || ""}
        onChange={handleChange}
      />
    </>
  );
}
