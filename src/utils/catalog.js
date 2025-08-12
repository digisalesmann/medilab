// src/utils/catalog.js
export const slugify = (s = "") =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const flattenInventory = (inv) => {
  if (!inv) return [];
  if (Array.isArray(inv)) return inv;
  if (typeof inv === "object") {
    return Object.entries(inv).flatMap(([cat, arr]) =>
      Array.isArray(arr) ? arr.map((it) => ({ ...it, category: it.category || cat })) : []
    );
  }
  return [];
};

export function getProductLink(tile, pharmacies) {
  const targetSlug = slugify(tile.slug || tile.name || tile.title || "");
  if (!targetSlug) return "/";

  for (const p of pharmacies || []) {
    const inv = flattenInventory(p.inventory);
    const hit =
      inv.find((it) => slugify(it?.name) === targetSlug) ||
      inv.find((it) => slugify(it?.title) === targetSlug) ||
      inv.find((it) => slugify(it?.sku) === targetSlug);
    if (hit) return `/product/${p.id}/${targetSlug}`;
  }
  // fallback: open first pharmacy with same category, or just home
  return "/";
}
