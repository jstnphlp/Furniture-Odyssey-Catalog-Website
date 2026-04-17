import { FilterBar } from "../components/FilterBar";
import { RuleMotif } from "../components/RuleMotif";
import { LiveCatalog } from "../components/LiveCatalog";

export function CollectionsPage() {
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

      <LiveCatalog category="Collections" />

      <RuleMotif />
    </>
  );
}

