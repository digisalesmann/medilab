import type { SearchDoc } from "./types";
import {
  products,
  labTests,
  topDoctors,
  deals,
  brands,
  categories,
  mockPharmacies
} from "../data/mockData";

const slugify = (s = "") =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function buildSearchDocs(): SearchDoc[] {
  const out: SearchDoc[] = [];

  (products || []).forEach((p: any, i: number) => {
    const title = p.title || p.name || `product-${i}`;
    out.push({
      id: `p:${p.id ?? i}`,
      type: "product",
      title,
      subtitle: p.brand || "",
      url: `/product/${slugify(title)}`,
      keywords: [p.brand, ...(p.tags || [])].filter(Boolean),
    });
  });

  (labTests || []).forEach((t: any, i: number) => {
    const title = t.title || t.name || `lab-${i}`;
    out.push({
      id: `l:${t.id ?? i}`,
      type: "labtest",
      title,
      subtitle: t.desc || "",
      url: `/lab-tests/${t.slug || slugify(title)}`,
      keywords: [
        t.sampleType,
        ...(t.parameters || []).flatMap((g: any) => g.items || []),
      ].filter(Boolean),
    });
  });

  (topDoctors || []).forEach((d: any, i: number) => {
    out.push({
      id: `d:${d.id ?? i}`,
      type: "doctor",
      title: d.name,
      subtitle: d.specialty,
      url: `/doctor/${d.id}/${slugify(`${d.name}-${d.specialty}`)}`,
      keywords: [d.hospital, d.location, ...(d.languages || [])].filter(Boolean),
    });
  });

  (deals || []).forEach((x: any, i: number) => {
    const title = x.title || x.name || `deal-${i}`;
    out.push({
      id: `deal:${x.id ?? i}`,
      type: "deal",
      title,
      subtitle: "Deal",
      url: `/product/${slugify(title)}`,
    });
  });

  (mockPharmacies || []).forEach((ph, i) => {
  out.push({
    id: `pharmacy:${ph.id ?? i}`,
    type: "pharmacy",
    title: ph.name,
    subtitle: ph.location || "",
    url: `/pharmacy/${ph.id}`,
    keywords: [ph.location].filter((x): x is string => Boolean(x)),
  });
});

  (brands || []).forEach((b: any, i: number) => {
    out.push({
      id: `brand:${i}`,
      type: "brand",
      title: b.name,
      url: `/brand/${slugify(b.name)}`,
      keywords: ["brand"],
    });
  });

  (categories || []).forEach((c: any, i: number) => {
    out.push({
      id: `cat:${i}`,
      type: "category",
      title: c.label,
      url: `/search?category=${encodeURIComponent(c.label)}`,
      keywords: ["category"],
    });
  });

  return out;
}