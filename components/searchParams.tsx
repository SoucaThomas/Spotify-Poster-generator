import { parseAsString, createLoader } from "nuqs";

export const loadSearchParams = createLoader({
  search: parseAsString.withDefault(""),
});
