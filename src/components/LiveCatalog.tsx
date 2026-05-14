import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "../lib/client";
import type { ProductCategory, TableOption } from "../types/catalog";
import type { ProductModalData } from "./ProductModal";
import { ProductModal } from "./ProductModal";
import { FilterBar } from "./FilterBar";
import { useCartStore } from "../stores/useCartStore";
import { ProgressiveImage } from "./ProgressiveImage";

interface LiveCatalogProps {
  category: ProductCategory;
}

const supabase = createClient();
const HOMEPAGE_FEATURE_MARKER = "__homepage_featured__";

interface CatalogItem {
  id: string;
  name: string;
  category: ProductCategory;
  basePrice: number;
  image: string;
  description?: string;
  dimensions?: string;
  badge?: string;
  badgeTone?: string;
  isCustomizable: boolean;
  features: string[];
  colorwaysCount?: number;
  ctaLabel?: string;
  isFeatured: boolean;
  colorOptions: TableOption[];
  sizeOptions: TableOption[];
  tagNames: string[];
}

export function LiveCatalog({ category }: LiveCatalogProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState<ProductModalData | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchItems(showLoader = true) {
      if (showLoader) setLoading(true);

      // Fetch products, Color/Size options, and tag assignments in parallel
      const [{ data: productData }, { data: optionData }, { data: tagAssignmentData }] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("category", category)
          .order("created_at", { ascending: true }),
        supabase
          .from("table_options")
          .select("*")
          .in("option_group", ["Color", "Size"])
          .order("created_at", { ascending: true }),
        supabase
          .from("product_tag_assignments")
          .select("product_id, tags(name)")
      ]);

      if (productData && isMounted) {
        // Group options by product_id
        const optionsByProduct = new Map<string, { color: TableOption[]; size: TableOption[] }>();
        for (const opt of optionData ?? []) {
          if (!optionsByProduct.has(opt.product_id)) {
            optionsByProduct.set(opt.product_id, { color: [], size: [] });
          }
          const mapped: TableOption = {
            id: opt.id,
            name: opt.name,
            priceModifier: Number(opt.price_modifier ?? 0),
            layerUrl: opt.layer_url ?? "",
            available: opt.available ?? true,
            incompatibleWith: [],
          };
          if (opt.option_group === "Color") {
            optionsByProduct.get(opt.product_id)!.color.push(mapped);
          } else if (opt.option_group === "Size") {
            optionsByProduct.get(opt.product_id)!.size.push(mapped);
          }
        }

        // Group tag names by product_id
        const tagsByProduct = new Map<string, string[]>();
        for (const assignment of tagAssignmentData ?? []) {
          const productId = assignment.product_id;
          const tagName = (assignment as any).tags?.name;
          if (!tagName) continue;
          if (!tagsByProduct.has(productId)) {
            tagsByProduct.set(productId, []);
          }
          tagsByProduct.get(productId)!.push(tagName);
        }

        const fetched: CatalogItem[] = productData.map((d: any) => ({
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
          features: Array.isArray(d.features)
            ? d.features.filter((f: string) => f !== HOMEPAGE_FEATURE_MARKER)
            : [],
          colorwaysCount: d.colorways_count,
          ctaLabel: d.cta_label,
          isFeatured: d.is_featured ?? false,
          colorOptions: optionsByProduct.get(d.id)?.color ?? [],
          sizeOptions: optionsByProduct.get(d.id)?.size ?? [],
          tagNames: tagsByProduct.get(d.id) ?? [],
        }));

        setItems(fetched);
      }
      if (isMounted) setLoading(false);
    }

    void fetchItems();

    let fetchTimeout: ReturnType<typeof setTimeout>;

    const channel = supabase
      .channel(`live-catalog-${category}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products", filter: `category=eq.${category}` },
        () => {
          clearTimeout(fetchTimeout);
          fetchTimeout = setTimeout(() => {
            void fetchItems(false);
          }, 800);
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "product_tag_assignments" },
        () => {
          clearTimeout(fetchTimeout);
          fetchTimeout = setTimeout(() => {
            void fetchItems(false);
          }, 800);
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tags" },
        () => {
          clearTimeout(fetchTimeout);
          fetchTimeout = setTimeout(() => {
            void fetchItems(false);
          }, 800);
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      clearTimeout(fetchTimeout);
      void supabase.removeChannel(channel);
    };
  }, [category]);

  // Reset tag filter when category changes
  useEffect(() => {
    setActiveTag(null);
  }, [category]);

  const openModal = useCallback((item: CatalogItem) => {
    setModalData({
      product: {
        id: item.id,
        name: item.name,
        category: item.category,
        basePrice: item.basePrice,
        image: item.image,
        description: item.description,
        dimensions: item.dimensions,
        badge: item.badge,
        badgeTone: item.badgeTone as any,
        isCustomizable: item.isCustomizable,
        features: item.features,
        colorwaysCount: item.colorwaysCount,
        ctaLabel: item.ctaLabel,
      },
      variations: {
        colorOptions: item.colorOptions,
        sizeOptions: item.sizeOptions,
      },
    });
  }, []);

  const closeModal = useCallback(() => setModalData(null), []);

  const addItem = useCartStore((s) => s.addItem);
  const openCartDrawer = useCartStore((s) => s.openCart);

  const addToCart = useCallback((item: CatalogItem) => {
    addItem({
      id: item.id,
      name: item.name,
      image_url: item.image,
      price: item.basePrice,
      category: item.category,
      cta_label: item.ctaLabel || "Add to Bag",
    });
    openCartDrawer();
  }, [addItem, openCartDrawer]);

  // Compute unique tag names for this category's products
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const item of items) {
      for (const tag of item.tagNames) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }, [items]);

  // Filter items by active tag
  const filteredItems = useMemo(() => {
    if (!activeTag) return items;
    return items.filter((item) => item.tagNames.includes(activeTag));
  }, [items, activeTag]);

  // Arrange items into layout rows
  const arranged: CatalogItem[] = [];
  const featuredItems = [...filteredItems.filter((i) => i.isFeatured)];
  const normalItems = [...filteredItems.filter((i) => !i.isFeatured)];

  let patternIndex = 0;
  while (featuredItems.length > 0 || normalItems.length > 0) {
    const isFeaturedSlot = patternIndex % 5 === 0;

    if (isFeaturedSlot) {
      if (featuredItems.length > 0) {
        arranged.push(featuredItems.shift()!);
      } else if (normalItems.length > 0) {
        arranged.push(normalItems.shift()!);
      }
    } else {
      if (normalItems.length > 0) {
        arranged.push(normalItems.shift()!);
      } else if (featuredItems.length > 0) {
        arranged.push(featuredItems.shift()!);
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

  const rows: { type: string; items: CatalogItem[] }[] = [];
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

  // Variation indicator dots
  const VariationBadge = ({ item }: { item: CatalogItem }) => {
    const hasVariations = item.colorOptions.length > 0 || item.sizeOptions.length > 0;
    if (!hasVariations) return null;
    return (
      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 backdrop-blur-sm shadow-sm">
        {item.colorOptions.length > 0 && (
          <div className="flex items-center gap-0.5">
            {item.colorOptions.slice(0, 3).map((c) => (
              <div key={c.id} className="h-3 w-3 rounded-full border border-white/60 overflow-hidden">
                {c.layerUrl ? (
                  <img src={c.layerUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-[var(--text-mid)]" />
                )}
              </div>
            ))}
            {item.colorOptions.length > 3 && (
              <span className="text-[8px] font-bold text-[var(--text-mid)]">+{item.colorOptions.length - 3}</span>
            )}
          </div>
        )}
        {item.sizeOptions.length > 0 && (
          <span className="text-[8px] font-bold text-[var(--text-mid)]">
            {item.sizeOptions.length} sizes
          </span>
        )}
      </div>
    );
  };

  // Tag pills shown on product cards
  const TagPills = ({ item }: { item: CatalogItem }) => {
    if (item.tagNames.length === 0) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-1">
        {item.tagNames.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[var(--bg-cream)] border border-[var(--border-warm)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-mid)]"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Filter Bar */}
      {availableTags.length > 0 && (
        <div className="mb-6">
          <FilterBar
            labels={availableTags}
            activeLabel={activeTag}
            onFilterChange={setActiveTag}
          />
        </div>
      )}

      {/* Empty state for filtered results */}
      {filteredItems.length === 0 && activeTag && (
        <div className="py-16 text-center">
          <p className="font-display text-[20px] text-[var(--text-mid)]">
            No products tagged "{activeTag}" in this category.
          </p>
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className="mt-4 text-link"
          >
            Clear filter →
          </button>
        </div>
      )}

      <div className="space-y-6">
        {rows.map((row, rowIndex) => {
          if (row.type === "featured-row") {
            const featured = row.items[0];
            const secondary = row.items[1];

            const gridCols = secondary
              ? "lg:grid-cols-[1.8fr_1.2fr]"
              : "lg:grid-cols-1";

            return (
              <div key={`row-${rowIndex}`} className={`grid gap-6 ${gridCols}`}>
                {/* Featured */}
                {featured && (
                  <div
                    className="warm-card group flex flex-col justify-between cursor-pointer"
                    onClick={() => openModal(featured)}
                  >
                    <div>
                      <div className="relative overflow-hidden rounded-[14px] pt-[56.25%]">
                        <ProgressiveImage
                          src={featured.image}
                          alt={featured.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="eager"
                        />
                        {featured.badge && (
                          <div className="absolute left-4 top-4 rounded-full bg-[#008784] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-sm">
                            {featured.badge}
                          </div>
                        )}
                        <VariationBadge item={featured} />
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
                        <TagPills item={featured} />
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                      <button
                        type="button"
                        className="rounded-full border-2 border-[#2C2218] bg-transparent px-5 py-2 text-[13px] font-bold text-[#2C2218] transition-colors hover:bg-[#2C2218] hover:text-white"
                        onClick={(e) => { e.stopPropagation(); openModal(featured); }}
                      >
                        {featured.ctaLabel || "View product"}
                      </button>
                      <button
                        type="button"
                        className="text-[13px] font-bold text-[var(--text-mid)] transition-colors hover:text-[#008784]"
                        onClick={(e) => { e.stopPropagation(); addToCart(featured); }}
                      >
                        Quick Shop
                      </button>
                    </div>
                  </div>
                )}

                {/* Secondary */}
                {secondary && (
                  <div
                    className="warm-card group flex flex-col justify-between cursor-pointer"
                    onClick={() => openModal(secondary)}
                  >
                    <div>
                      <div className="relative overflow-hidden rounded-[14px] pt-[75%]">
                        <ProgressiveImage
                          src={secondary.image}
                          alt={secondary.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="eager"
                        />
                        {secondary.badge && (
                          <div className="absolute left-3 top-3 rounded-full bg-[#008784] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                            {secondary.badge}
                          </div>
                        )}
                        <VariationBadge item={secondary} />
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <h4 className="text-[16px] font-semibold text-[#2C2218]">
                          {secondary.name}
                        </h4>
                        <p className="whitespace-nowrap text-[15px] font-semibold text-[#2C2218]">
                          ₱{secondary.basePrice?.toLocaleString()}
                        </p>
                      </div>
                      <TagPills item={secondary} />
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="text-[13px] font-bold text-[var(--text-mid)] transition-colors hover:text-[#008784]"
                        onClick={(e) => { e.stopPropagation(); addToCart(secondary); }}
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
                {row.items.map((gridItem) => (
                  <div
                    key={gridItem.id}
                    className="warm-card group flex flex-col justify-between cursor-pointer"
                    onClick={() => openModal(gridItem)}
                  >
                    <div>
                      <div className="relative overflow-hidden rounded-[14px] pt-[100%]">
                        <ProgressiveImage
                          src={gridItem.image}
                          alt={gridItem.name}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {gridItem.badge && (
                          <div className="absolute left-3 top-3 rounded-full bg-[#008784] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                            {gridItem.badge}
                          </div>
                        )}
                        <VariationBadge item={gridItem} />
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <h4 className="text-[16px] font-semibold text-[#2C2218]">
                          {gridItem.name}
                        </h4>
                        <p className="whitespace-nowrap text-[15px] font-semibold text-[#2C2218]">
                          ₱{gridItem.basePrice?.toLocaleString()}
                        </p>
                      </div>
                      <TagPills item={gridItem} />
                    </div>
                    <div className="mt-5">
                      <button
                        type="button"
                        className="w-full rounded-lg bg-[#2C2218] px-4 py-2.5 text-center text-[13px] font-bold text-white transition-colors hover:bg-black"
                        onClick={(e) => { e.stopPropagation(); addToCart(gridItem); }}
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

      {/* Product Modal */}
      <ProductModal data={modalData} onClose={closeModal} />
    </>
  );
}
