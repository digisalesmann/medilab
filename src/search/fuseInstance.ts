import Fuse from "fuse.js";
import type { SearchDoc } from "./types";

export function createFuse(docs: SearchDoc[]) {
  return new Fuse<SearchDoc>(docs, {
    keys: [
      { name: "title",    weight: 0.6 },
      { name: "subtitle", weight: 0.2 },
      { name: "keywords", weight: 0.2 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    includeScore: true,
    useExtendedSearch: true,
  });
}