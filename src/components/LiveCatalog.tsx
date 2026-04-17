import { useEffect, useState } from "react";
import { createClient } from "../lib/client";
import type { ProductCategory } from "../types/catalog";

interface LiveCatalogProps {
  category: ProductCategory;
}

const supabase = createClient();

export function LiveCatalog({ category }: LiveCatalogProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: true });

      if (data) {
        const fetched = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          category: d.category as ProductCategory,
          basePrice: d.base_price,
          image: d.image,
          description: d.description,
          dimensions: d.dimensions,
          badge: d.badge,
          badgeTone: d.badge_tone,
          isCustomizable: d.is_customizable ?? false,
          features: d.features ?? [],
          colorwaysCount: d.colorways_count,
          ctaLabel: d.cta_label,
          isFeatured: d.is_featured ?? false,
        }));
        setItems(fetched);
      }
      setLoading(false);
    }
    fetchItems();
  }, [category]);

  const arranged = [];
  const remaining = [...items];

  const featuredItems = remaining.filter((i) => i.isFeatured);
  const normalItems = remaining.filter((i) => !i.isFeatured);

  let patternIndex = 0;
  while (featuredItems.length > 0 || normalItems.length > 0) {
    const isFeaturedSlot = patternIndex % 5 === 0;

    if (isFeaturedSlot) {
      if (featuredItems.length > 0) {
        arranged.push(featuredItems.shift());
      } else if (normalItems.length > 0) {
        arranged.push(normalItems.shift());
      }
    } else {
      if (normalItems.length > 0) {
        arranged.push(normalItems.shift());
      } else if (featuredItems.length > 0) {
        arranged.push(featuredItems.shift());
      }
    }
    patternIndex++;
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.8fr_1.2fr]">
          <div className="h-[400px] w-full rounded-[14px] bg-black/5" />
          <div className="h-[400px] w-full rounded-[14px] bg-black/5" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-[300px] w-full rounded-[14px] bg-black/5" />
          <div className="h-[300px] w-full rounded-[14px] bg-black/5" />
          <div className="h-[300px] w-full rounded-[14px] bg-black/5" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-[24px] text-[var(--text-mid)]">
          Nothing here yet.
        </p>
      </div>
    );
  }

  const rows = [];
  for (let i = 0; i < arranged.length; ) {
    const position = i % 5;
    if (position === 0) {
      rows.push({ type: "featured-row", items: arranged.slice(i, i + 2) });
      i += 2;
    } else if (position === 2) {
      rows.push({ type: "grid-row", items: arranged.slice(i, i + 3) });
      i += 3;
    }
  }

  return (
    <div className="space-y-6">
      {rows.map((row, rowIndex) => {
        if (row.type === "featured-row") {
          const featured = row.items[0];
          const secondary = row.items[1];

          // If only position 0 exists with no position 1 beside it -> featured card spans full width
          const gridCols = secondary
            ? "lg:grid-cols-[1.8fr_1.2fr]"
            : "lg:grid-cols-1";

          return (
            <div key={`row-${rowIndex}`} className={`grid gap-6 ${gridCols}`}>
              {/* Featured */}
              {featured && (
                <div className="flex flex-col justify-between rounded-[14px] bg-white p-6 shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow">
                  <div>
                    <div className="relative overflow-hidden rounded-[14px] pt-[56.25%]">
                      <img
                        src={featured.image}
                        alt={featured.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {featured.badge && (
                        <div className="absolute left-4 top-4 rounded-full bg-[#008784] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-sm">
                          {featured.badge}
                        </div>
                      )}
                    </div>
                    <div className="mt-5">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-mid)]">
                        {featured.badge || featured.category}
                      </p>
                      <div className="mt-1 flex items-start justify-between gap-4">
                        <h3 className="font-display text-[32px] leading-tight text-[#2C2218]">
                          {featured.name}
                        </h3>
                        <p className="whitespace-nowrap text-[18px] font-semibold text-[#2C2218]">
                          ₱{featured.basePrice?.toLocaleString()}
                        </p>
                      </div>
                      {featured.description && (
                        <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-[var(--text-mid)]">
                          {featured.description}
                        </p>
                      )}
                      {featured.features && featured.features.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {featured.features.map((f: string, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-center text-[13px] text-[var(--text-mid)]"
                            >
                              <span className="mr-2 text-[#008784]">✓</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <button
                      type="button"
                      className="rounded-full border-2 border-[#2C2218] bg-transparent px-5 py-2 text-[13px] font-bold text-[#2C2218] transition-colors hover:bg-[#2C2218] hover:text-white"
                    >
                      {featured.ctaLabel || "View product"}
                    </button>
                    <button
                      type="button"
                      className="text-[13px] font-bold text-[var(--text-mid)] transition-colors hover:text-[#008784]"
                    >
                      Quick Shop
                    </button>
                  </div>
                </div>
              )}

              {/* Secondary */}
              {secondary && (
                <div className="flex flex-col justify-between rounded-[14px] bg-white p-5 shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow">
                  <div>
                    <div className="relative overflow-hidden rounded-[14px] pt-[75%]">
                      <img
                        src={secondary.image}
                        alt={secondary.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {secondary.badge && (
                        <div className="absolute left-3 top-3 rounded-full bg-[#008784] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                          {secondary.badge}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <h4 className="text-[16px] font-semibold text-[#2C2218]">
                        {secondary.name}
                      </h4>
                      <p className="whitespace-nowrap text-[15px] font-semibold text-[#2C2218]">
                        ₱{secondary.basePrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="text-[13px] font-bold text-[var(--text-mid)] transition-colors hover:text-[#008784]"
                    >
                      Quick Shop
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        }

        if (row.type === "grid-row") {
          return (
            <div
              key={`row-${rowIndex}`}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {row.items.map((gridItem: any) => (
                <div
                  key={gridItem.id}
                  className="flex flex-col justify-between rounded-[14px] bg-white p-5 shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="relative overflow-hidden rounded-[14px] pt-[100%]">
                      <img
                        src={gridItem.image}
                        alt={gridItem.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {gridItem.badge && (
                        <div className="absolute left-3 top-3 rounded-full bg-[#008784] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                          {gridItem.badge}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <h4 className="text-[16px] font-semibold text-[#2C2218]">
                        {gridItem.name}
                      </h4>
                      <p className="whitespace-nowrap text-[15px] font-semibold text-[#2C2218]">
                        ₱{gridItem.basePrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      className="w-full rounded-lg bg-[#2C2218] px-4 py-2.5 text-center text-[13px] font-bold text-white transition-colors hover:bg-black"
                    >
                      {gridItem.ctaLabel || "Add to Bag"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
}
