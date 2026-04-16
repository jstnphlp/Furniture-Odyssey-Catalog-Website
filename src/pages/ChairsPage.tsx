import { useMemo } from "react";
import { useCatalogStore } from "../stores/useCatalogStore";
import { MiniCard } from "../components/MiniCard";
import { Badge } from "../components/Badge";
import { FilterBar } from "../components/FilterBar";
import { RuleMotif } from "../components/RuleMotif";

export function ChairsPage() {
  const products = useCatalogStore((state) => state.products);
  const chairs = useMemo(
    () => products.filter((p) => p.category === "Chairs"),
    [products],
  );

  const featured = chairs[0]; // Heritage Grey Lounge Set
  const secondary = chairs[1]; // Sage Wing
  const gridItems = useMemo(
    () => chairs.slice(1).concat(chairs).slice(0, 6),
    [chairs],
  );

  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════ */}
      <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end" id="chairs-hero">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-mid)]">
            The Seat You Deserve
          </p>
          <h1 className="font-display text-[48px] leading-[1.06] text-[var(--text-dark)] sm:text-[56px]">
            Sculpted{" "}
            <span className="italic text-[var(--primary)]">Comfort.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-[1.7] text-[var(--text-mid)]">
            Discover sculpted silhouettes, classic designs and tactile
            fabrics — from artisanal studios to your sanctuary.
            In a chair, every piece is a sanctuary of its own.
          </p>
        </div>
        <FilterBar labels={["Time by Material", "Named Arrivals"]} />
      </section>

      <RuleMotif />

      {/* ═══ FEATURED SPOTLIGHT ═════════════════════ */}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" id="chairs-featured">
        {/* Large featured card */}
        {featured && (
          <article className="warm-card group">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={featured.image}
                alt={featured.name}
                className="h-80 w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {featured.badge && (
                <div className="absolute left-3 top-3">
                  <Badge
                    label={featured.badge}
                    tone={featured.badgeTone ?? "warm"}
                  />
                </div>
              )}
              {/* Price overlay */}
              <div className="absolute right-4 top-4">
                <span className="rounded-lg bg-white/90 px-3 py-1.5 text-[14px] font-semibold text-[var(--text-dark)] shadow-sm backdrop-blur-sm">
                  ₱{featured.basePrice.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
                Proprietary
              </p>
              <h2 className="mt-1 font-display text-[26px] leading-tight text-[var(--text-dark)]">
                {featured.name}
              </h2>
              <p className="mt-3 max-w-xl text-[13px] leading-[1.7] text-[var(--text-mid)]">
                {featured.description}
              </p>
              <button type="button" className="text-link mt-4">
                View Product Details →
              </button>
            </div>
          </article>
        )}

        {/* Right column: secondary card + artisan blurb */}
        <div className="flex flex-col gap-5">
          {secondary && (
            <MiniCard product={secondary} cta="Configure pieces" />
          )}

          {/* Artisan's Touch editorial blurb */}
          <article className="warm-card bg-[#FDF5EB]">
            <h3 className="font-display text-[26px] leading-tight text-[var(--text-dark)]">
              The Artisan&apos;s Touch
            </h3>
            <p className="mt-3 text-[13px] leading-[1.7] text-[var(--text-mid)]">
              Each leather surface is individually tooled, every joint is
              hand-sanded and oil-sealed, preserving the timber's grain and warmth
              for decades.
            </p>
          </article>
        </div>
      </section>

      <RuleMotif />

      {/* ═══ CHAIRS GRID ═══════════════════════════ */}
      <section id="chairs-grid">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-[30px] text-[var(--text-dark)]">
            Full Collection
          </h2>
          <button type="button" className="secondary-btn">
            View Catalog
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((item, index) => (
            <MiniCard
              key={`${item.id}-grid-${index}`}
              product={item}
              cta="Quick Shop"
            />
          ))}
        </div>
      </section>
    </>
  );
}
