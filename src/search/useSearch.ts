import { useEffect, useMemo, useRef, useState } from "react";
import { buildSearchDocs } from "./buildIndex";
import { createFuse } from "./fuseInstance";
import type { SearchDoc } from "./types";

export function useSearch(initialQuery = "") {
  // build once (safe with refs)
  const docsRef = useRef<SearchDoc[] | null>(null);
  const fuseRef = useRef<ReturnType<typeof createFuse> | null>(null);
  const debounceRef = useRef<number | null>(null);

  if (!docsRef.current) {
    docsRef.current = buildSearchDocs();
    fuseRef.current = createFuse(docsRef.current);
  }

  const [q, setQ] = useState(initialQuery);
  const [results, setResults] = useState<SearchDoc[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = window.setTimeout(() => {
      const fuse = fuseRef.current!;
      const raw = fuse.search(q.trim(), { limit: 50 });
      setResults(raw.map((r) => r.item));
      setLoading(false);
    }, 220);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [q]);

  const grouped = useMemo(() => {
    const g: Record<string, SearchDoc[]> = {};
    for (const r of results) (g[r.type] ||= []).push(r);
    return g;
  }, [results]);

  return { q, setQ, results, grouped, loading, count: results.length };
}