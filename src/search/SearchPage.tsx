import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiSearchLine, RiCloseLine } from "react-icons/ri";
import { useSearch } from "./useSearch"; // ✅ update path as needed

// -----------------------------
// Types
// -----------------------------
interface SearchItem {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
  __type?: string;
}

type GroupedResults = Record<string, SearchItem[]>;

// -----------------------------
// Hooks
// -----------------------------
function useQueryParam(name: string): string {
  const { search } = useLocation();
  return new URLSearchParams(search).get(name) || "";
}

// Highlight utility
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${safe})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        re.test(p) ? (
          <mark
            key={i}
            className="bg-yellow-200 rounded px-0.5"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

// -----------------------------
// Main Component
// -----------------------------
export default function SearchPage() {
  const initialQ = useQueryParam("q");
  const { q, setQ, grouped, loading, count } = useSearch(initialQ);

  const navigate = useNavigate();

  // Flatten grouped results
  const results: SearchItem[] = useMemo(() => {
    const arr: SearchItem[] = [];
    Object.entries(grouped as GroupedResults).forEach(([type, items]) => {
      if (!Array.isArray(items)) return;
      items.forEach((it) =>
        arr.push({
          ...it,
          __type: type,
        })
      );
    });
    return arr;
  }, [grouped]);

  // Keyboard navigation
  const [active, setActive] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Reset active when results change
  useEffect(() => {
    setActive(results.length ? 0 : -1);
  }, [results.length]);

  // Keyboard handler
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      if (results.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter") {
        if (active >= 0 && results[active]) {
          const item = results[active];
          if (item.url) navigate(item.url);
        }
      } else if (e.key === "Escape") {
        setActive(-1);
      }
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [results, active, navigate]);

  // Scroll active item into view
  useEffect(() => {
    if (active < 0) return;
    const id = results[active]?.id;
    const node = id ? itemRefs.current[id] : null;
    if (node) {
      node.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [active, results]);

  const clearQ = () => {
    setQ("");
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-24">
      {/* Search bar */}
      <div className="relative">
        <RiSearchLine className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search medicines, labs, pharmacies, doctors..."
          aria-label="Search"
          className="w-full rounded-full pl-12 pr-10 py-3 text-gray-900 bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-base"
        />
        {q && (
          <button
            onClick={clearQ}
            aria-label="Clear search"
            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions */}
      {q && (
        <div className="mt-3 bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2 text-sm text-gray-500 border-b">
            {loading
              ? "Searching…"
              : `${count ?? results.length} result${
                  (count ?? results.length) !== 1 ? "s" : ""
                }`}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 && !loading ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No results found
              </div>
            ) : (
              results.map((it, idx) => {
                const isActive = idx === active;
                return (
                  <a
                    key={it.id}
                    href={it.url}
                    ref={(node) => {
                      itemRefs.current[it.id] = node;
                    }}
                    onMouseEnter={() => setActive(idx)}
                    className={`flex justify-between items-center px-4 py-3 ${
                      isActive ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-50`}
                  >
                    <div className="text-sm text-gray-900 truncate">
                      <Highlight text={it.title} query={q} />
                    </div>
                    <span className="ml-4 text-xs text-gray-500 px-2 py-1 rounded-full bg-gray-100">
                      {it.__type?.toUpperCase()}
                    </span>
                  </a>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
