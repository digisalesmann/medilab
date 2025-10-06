// src/search/useSearch.ts
import { useEffect, useState } from "react";

export interface Drug {
  id: number;
  ndc?: string;
  brandName?: string;
  genericName?: string;
  manufacturer?: string;
  PharmacyStock?: { quantity: number }[];
}

export function useSearch(initialQuery: string = "") {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // skip empty search
    if (!query.trim()) {
      setResults([]);
      setCount(0);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:5000/api/drugs/search?q=${encodeURIComponent(query)}`,
          { signal }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setResults(data.items || []);
        setCount(data.total || data.items?.length || 0);
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // debounce typing
    const timeout = setTimeout(fetchResults, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return { query, setQuery, results, loading, error, count };
}
