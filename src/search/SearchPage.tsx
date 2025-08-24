import React from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "./useSearch";

function useQueryParam(name: string) {
  const { search } = useLocation();
  return new URLSearchParams(search).get(name) || "";
}

export default function SearchPage() {
  const initialQ = useQueryParam("q");
  const { q, setQ, grouped, loading, count } = useSearch(initialQ);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
      <h1 className="text-2xl font-bold mb-4">Search</h1>

      <input
        className="w-full border rounded-lg px-3 py-2 mb-4"
        placeholder="Search everything…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />

      <div className="text-sm text-gray-600 mb-4">
        {loading ? "Searching…" : `${count} results`}
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([type, items]) => (
          <section key={type}>
            <h2 className="text-lg font-semibold mb-2 capitalize">{type}</h2>
            <ul className="divide-y border rounded-lg">
              {items.map((it) => (
                <li key={it.id} className="p-3">
                  <a href={it.url} className="text-emerald-700 hover:underline">
                    {it.title}
                  </a>
                  {it.subtitle && (
                    <span className="text-gray-500 text-sm"> — {it.subtitle}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}