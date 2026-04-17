import { FilterBar } from "../components/FilterBar";
import { RuleMotif } from "../components/RuleMotif";
import { LiveCatalog } from "../components/LiveCatalog";

export function ChairsPage() {
  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════ */}
      <section
        className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"
        id="chairs-hero"
      >
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-mid)]">
            The Seat You Deserve
          </p>
          <h1 className="font-display text-[48px] leading-[1.06] text-[var(--text-dark)] sm:text-[56px]">
            Sculpted{" "}
            <span className="italic text-[var(--primary)]">Comfort.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-[1.7] text-[var(--text-mid)]">
            Discover sculpted silhouettes, classic designs and tactile fabrics —
            from artisanal studios to your sanctuary. In a chair, every piece is
            a sanctuary of its own.
          </p>
        </div>
        <FilterBar labels={["Time by Material", "Named Arrivals"]} />
      </section>

      <RuleMotif />

      <LiveCatalog category="Chairs" />
    </>
  );
}
