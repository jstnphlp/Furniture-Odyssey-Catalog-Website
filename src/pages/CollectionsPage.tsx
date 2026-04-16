import { useMemo } from "react";
import { useCatalogStore } from "../stores/useCatalogStore";
import { MiniCard } from "../components/MiniCard";
import { Badge } from "../components/Badge";
import { FilterBar } from "../components/FilterBar";
import { RuleMotif } from "../components/RuleMotif";

export function CollectionsPage() {
  const products = useCatalogStore((state) => state.products);
  const collections = useMemo(
    () => products.filter((p) => p.category === "Collections"),
    [products],
  );

  const featured = collections[0]; // The Ember Lounge
  const secondary = collections[1]; // Oak & Taper Table
  const miniItems = collections.slice(2, 5); // Arched Carver, Cloud Modular, Driftwood Shelf

  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════ */}
      <section
        className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center"
        id="collections-hero"
      >
        <div className="animate-fade-in-up">
          <h1 className="font-display text-[46px] leading-[1.06] text-[var(--text-dark)] sm:text-[58px]">
            Curating Your{" "}
            <em className="not-italic italic text-[var(--primary)]">
              Sanctuary
            </em>
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-[1.7] text-[var(--text-mid)]">
            Explore our latest ensemble of curated finished pieces,
            designed to bring quiet elegance and enduring warmth.
            <br />
            A luxury curation of your home.
          </p>
        </div>
        <button type="button" className="primary-btn" id="collections-cta">
          View Catalog
        </button>
      </section>

      {/* Filter pills */}
      <div className="-mt-14">
        <FilterBar
          labels={["Antiques", "Pieces", "Tables", "New Arrivals"]}
        />
      </div>

      <RuleMotif />

      {/* ═══ FEATURED EDITORIAL CARD ════════════════ */}
      <section
        className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]"
        id="collections-featured"
      >
        {/* Large dark featured card */}
        {featured && (
          <article className="group relative overflow-hidden rounded-2xl">
            <img
              src={featured.image}
              alt={featured.name}
              className="h-[380px] w-full object-cover brightness-[0.65] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute left-4 top-4 z-10">
              <Badge label="FEATURED" tone="warm" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-[#1a110acc] to-transparent p-6">
              <h2 className="text-[22px] font-semibold text-white">
                {featured.name}
              </h2>
              <p className="mt-1 text-[14px] text-white/80">
                ₱{featured.basePrice.toLocaleString()}
              </p>
            </div>
          </article>
        )}

        {/* Secondary card */}
        {secondary && (
          <MiniCard product={secondary} cta="View Details" />
        )}
      </section>

      {/* ═══ MINI GRID ═════════════════════════════ */}
      {miniItems.length > 0 && (
        <section
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          id="collections-mini-grid"
        >
          {miniItems.map((item) => (
            <MiniCard key={item.id} product={item} cta="Quick Shop" />
          ))}
        </section>
      )}

      <RuleMotif />

      {/* ═══ SOUL OF THE ODYSSEY ═══════════════════ */}
      <section
        className="grid items-center gap-10 lg:grid-cols-2"
        id="soul-section"
      >
        <div className="overflow-hidden rounded-2xl">
          <img
            src="/images/craftsman.png"
            alt="Craftsman in workshop"
            className="h-[380px] w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-display text-[34px] leading-[1.1] text-[var(--text-dark)] sm:text-[40px]">
            The Soul of the{" "}
            <span className="italic text-[var(--primary)]">Odyssey</span>
          </h3>
          <p className="mt-5 max-w-lg text-[14px] leading-[1.7] text-[var(--text-mid)]">
            Our pieces are more than furniture: they are stories told
            through grain and texture. Every joint is hand-shaped, every
            surface is an endlessly nuanced surface that you intuitively know here is
            a masterpiece of durability and refinement.
          </p>
          <ul className="mt-6 space-y-3 text-[13px] text-[var(--text-mid)]">
            <li className="flex items-center gap-2">
              <span className="text-lg text-[var(--tertiary)]">&#10003;</span>
              Sustainably Sourced
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg text-[var(--tertiary)]">&#10003;</span>
              10 Year Guarantee
            </li>
          </ul>
          <button type="button" className="text-link mt-6 block">
            Book an artisan preview →
          </button>
        </div>
      </section>
    </>
  );
}
