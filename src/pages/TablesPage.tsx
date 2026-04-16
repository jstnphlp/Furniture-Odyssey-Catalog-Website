import { useMemo } from "react";
import { useCatalogStore } from "../stores/useCatalogStore";
import { ProductCard } from "../components/ProductCard";
import { MiniCard } from "../components/MiniCard";
import { Badge } from "../components/Badge";
import { FilterBar } from "../components/FilterBar";
import { RuleMotif } from "../components/RuleMotif";

export function TablesPage() {
  const products = useCatalogStore((state) => state.products);
  const tables = useMemo(
    () => products.filter((p) => p.category === "Tables"),
    [products],
  );

  const featured = tables[0]; // The Heirloom Dining Table
  const secondary = tables[1]; // Orbital Walnut Coffee Table
  const gathering = tables[2]; // The Gathering Island
  const bench = tables[3]; // Artisan Trestle Bench

  return (
    <>
      {/* ═══ HERO — Full-width background image ════ */}
      <section
        className="relative overflow-hidden rounded-2xl"
        id="tables-hero"
      >
        <img
          src="/images/wood-grain.png"
          alt="Close-up of wood grain"
          className="h-[420px] w-full object-cover brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2c2218cc] via-[#2c221866] to-transparent" />
        <div className="absolute inset-0 z-10 flex flex-col justify-center p-8 sm:p-12">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
            The Custom Collection
          </p>
          <h1 className="font-display text-[46px] leading-[1.06] text-white sm:text-[58px]">
            Gathering{" "}
            <em className="text-[var(--primary)]">Redefined.</em>
          </h1>
          <p className="mt-4 max-w-lg text-[14px] leading-[1.7] text-white/80">
            Crafted from solid oak and steel married, our tables are built
            to be the heart of your home. Turn every deliberation
            to your sanctuary.
          </p>
          <div className="mt-6">
            <button type="button" className="primary-btn" id="tables-start-btn">
              Start Gathering
            </button>
          </div>
        </div>

        {/* Floating quote */}
        <aside className="absolute bottom-5 right-5 z-10 hidden max-w-[250px] rounded-xl bg-white/90 p-4 shadow-[0_12px_28px_rgba(44,34,24,0.14)] backdrop-blur-sm md:block">
          <p className="font-display text-[14px] italic leading-snug text-[var(--text-dark)]">
            "Every chair follows a table worth sitting around."
          </p>
        </aside>
      </section>

      {/* ═══ CURATED CATALOG ════════════════════════ */}
      <section id="curated-catalog">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[32px] text-[var(--text-dark)]">
            Curated Catalog
          </h2>
          <FilterBar
            labels={["All Tables", "Dining", "Coffee", "New Arrivals"]}
          />
        </div>

        {/* Featured + Secondary row */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
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
                      tone={featured.badgeTone ?? "teal"}
                    />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
                  Gatherable
                </p>
                <div className="mt-1 flex items-start justify-between gap-3">
                  <h3 className="font-display text-[24px] leading-tight text-[var(--text-dark)]">
                    {featured.name}
                  </h3>
                  <p className="whitespace-nowrap text-[15px] font-semibold text-[var(--text-dark)]">
                    ₱{featured.basePrice.toLocaleString()}
                  </p>
                </div>
                <p className="mt-3 max-w-md text-[13px] leading-[1.7] text-[var(--text-mid)]">
                  {featured.description}
                </p>
                <ul className="mt-3 space-y-1 text-[13px] text-[var(--text-mid)]">
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--tertiary)]">&#10003;</span>
                    Sustainably sourced Oak
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[var(--tertiary)]">&#10003;</span>
                    2 colorways available
                  </li>
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" className="secondary-btn">
                    Customize Dimensions
                  </button>
                  <button type="button" className="text-link">
                    Quick Shop →
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* Right column */}
          <div className="flex flex-col gap-5">
            {secondary && (
              <MiniCard product={secondary} cta="Quick Shop" />
            )}
          </div>
        </div>
      </section>

      <RuleMotif />

      {/* ═══ GATHERING ISLAND FEATURE ══════════════ */}
      {gathering && (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" id="gathering-feature">
          <article className="warm-card group">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={gathering.image}
                alt={gathering.name}
                className="h-72 w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3">
                <Badge label={gathering.badge ?? "BESPOKE"} tone="warm" />
              </div>
              <div className="absolute right-4 top-4">
                <span className="rounded-lg bg-white/90 px-3 py-1.5 text-[14px] font-semibold text-[var(--text-dark)] shadow-sm backdrop-blur-sm">
                  ₱{gathering.basePrice.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
                Customisable ∕ Ⅱ
              </p>
              <h3 className="mt-1 font-display text-[24px] leading-tight text-[var(--text-dark)]">
                {gathering.name}
              </h3>
              <p className="mt-3 max-w-md text-[13px] leading-[1.7] text-[var(--text-mid)]">
                {gathering.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="primary-btn">
                  Configure Your Island
                </button>
              </div>
            </div>
            {bench && (
              <div className="mt-5 flex items-center gap-4 rounded-xl border border-[var(--border-card)] p-3">
                <img
                  src={bench.image}
                  alt={bench.name}
                  className="h-16 w-20 rounded-lg object-cover"
                />
                <div>
                  <p className="text-[13px] font-semibold text-[var(--text-dark)]">
                    {bench.name}
                  </p>
                  <p className="text-[12px] text-[var(--text-mid)]">
                    ₱{bench.basePrice.toLocaleString()}
                  </p>
                </div>
                <button type="button" className="text-link ml-auto text-[12px]">
                  Quick Shop →
                </button>
              </div>
            )}
          </article>

          <div className="space-y-4">
            <img
              src="/images/wood-grain.png"
              alt="Material close-up"
              className="h-[260px] w-full rounded-2xl object-cover"
            />
            <img
              src="/images/craftsman.png"
              alt="Craftsman detail"
              className="h-[200px] w-full rounded-2xl object-cover"
            />
          </div>
        </section>
      )}

      <RuleMotif />

      {/* ═══ YOUR VISION, OUR HANDS ════════════════ */}
      <section
        className="overflow-hidden rounded-2xl bg-[#f0e8df] p-8 sm:p-12"
        id="vision-section"
      >
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-[36px] leading-[1.1] text-[var(--text-dark)] sm:text-[42px]">
              Your vision,{" "}
              <span className="italic text-[var(--primary)]">our hands.</span>
            </h3>
            <p className="mt-5 max-w-lg text-[14px] leading-[1.7] text-[var(--text-mid)]">
              At Furniture Odyssey, we believe a modular table isn't just
              for the dining experience. Every piece is hand-shaped, every
              join is hand-sanded and oiled to preserve that grain character
              you see in the workshop.
            </p>
            <ul className="mt-6 space-y-3 text-[13px] text-[var(--text-mid)]">
              <li className="flex items-center gap-2">
                <span className="text-[var(--tertiary)]">&#10003;</span>
                Material-first recommendations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--tertiary)]">&#10003;</span>
                10 Year Guarantee
              </li>
            </ul>
            <button type="button" className="text-link mt-6 block">
              Book an artisan preview →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/hero-table.png"
              alt="Crafted table"
              className="h-64 w-full rounded-2xl object-cover"
            />
            <img
              src="/images/craftsman.png"
              alt="Craftsman at work"
              className="h-64 w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* ═══ ALL TABLES (ProductCard with configurator) ═══ */}
      {tables.filter((t) => t.isCustomizable).length > 0 && (
        <section id="configure-tables">
          <h2 className="mb-6 font-display text-[30px] text-[var(--text-dark)]">
            Configure a Table
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {tables
              .filter((t) => t.isCustomizable)
              .map((table) => (
                <ProductCard key={table.id} product={table} size="large" />
              ))}
          </div>
        </section>
      )}
    </>
  );
}
