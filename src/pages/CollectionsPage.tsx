import { useCallback } from "react";
import { FilterBar } from "../components/FilterBar";
import { RuleMotif } from "../components/RuleMotif";
import { LiveCatalog } from "../components/LiveCatalog";
import { usePageContentStore } from "../stores/usePageContentStore";

export function CollectionsPage() {
  const getField = usePageContentStore((s) => s.getField);

  const c = useCallback((section: string, key: string, fallback: string) =>
    getField("collections", section, key, fallback), [getField]);

  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════ */}
      <section
        className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center"
        id="collections-hero"
      >
        <div className="animate-fade-in-up">
          <h1 className="font-display text-[46px] leading-[1.06] text-[var(--text-dark)] sm:text-[58px]">
            {c("hero", "title", "Curating Your")}{" "}
            <em className="not-italic italic text-[var(--primary)]">
              {c("hero", "italic", "Sanctuary")}
            </em>
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-[1.7] text-[var(--text-mid)]">
            {c("hero", "description", "Explore our latest ensemble of curated finished pieces, designed to bring quiet elegance and enduring warmth. A luxury curation of your home.")}
          </p>
        </div>
        <button
          type="button"
          className="primary-btn"
          id="collections-cta"
          onClick={() => {
            document.getElementById('collections-catalog')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {c("hero", "btn_label", "View Catalog")}
        </button>
      </section>

      {/* Filter pills */}
      <div className="-mt-14">
        <FilterBar
          labels={["Antiques", "Pieces", "Tables", "New Arrivals"]}
        />
      </div>

      <RuleMotif />

      <div id="collections-catalog">
        <LiveCatalog category="Collections" />
      </div>

      <RuleMotif />
    </>
  );
}
