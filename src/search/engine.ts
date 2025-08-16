// src/search/engine.ts
import Fuse from "fuse.js";
import type { SearchDoc } from "./types";
import { buildSearchDocs } from "./buildIndex";

let fuse: Fuse<SearchDoc> | null = null;
let docs: SearchDoc[] | null = null;

function getFuse() {
  if (!fuse) {
    docs = buildSearchDocs();
    fuse = new Fuse(docs, {
      includeScore: true,
      threshold: 0.35,
      keys: [
        "title",
        "subtitle",
        "keywords",
      ],
    });
  }
  return fuse;
}

// Suggest top-N docs for a query (used by Home dropdown)
export function suggest(query: string, limit = 8): SearchDoc[] {
  const q = query.trim();
  if (!q) return [];
  const f = getFuse();
  return f.search(q, { limit }).map((r) => r.item);
}

// Optional: quick boolean check for “any hits?”
export function hasMatch(query: string): boolean {
  return suggest(query, 1).length > 0;
}