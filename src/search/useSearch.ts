import { useState, useEffect, useRef } from "react";
import api from "../utils/api";

export interface Drug {
  id: string | number;
  brandName: string;
  genericName: string;
  manufacturer?: string;
  description?: string;
  source?: string;
  PharmacyStock?: { pharmacyId: string; quantity: number }[];
}

export function useSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setCount(0);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchResults(query.trim());
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query]);

  async function fetchResults(q: string) {
    try {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);

      const res = await api.get(`/drugs/search`, {
        params: { q, limit: 20 },
        signal: controller.signal,
      });

      const items = res.data?.items || res.data || [];
      setResults(items);
      setCount(items.length);
      setError(null);
    } catch (err: any) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
      setError(err.message || "Search failed");
      setResults([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }

  return { query, setQuery, results, loading, error, count };
}
