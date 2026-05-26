import { useCallback } from "react";
import { RuleMotif } from "../components/RuleMotif";
import { LiveCatalog } from "../components/LiveCatalog";
import { usePageContentStore } from "../stores/usePageContentStore";

export function ChairsPage() {
  const getField = usePageContentStore((s) => s.getField);

  const c = useCallback((section: string, key: string, fallback: string) =>
    getField("chairs", section, key, fallback), [getField]);

  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════ */}
      <section
        className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"
        id="chairs-hero"
      >
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-mid)]">
            {c("hero", "eyebrow", "The Seat You Deserve")}
          </p>
          <h1 className="font-display text-[48px] leading-[1.06] text-[var(--text-dark)] sm:text-[56px]">
            {c("hero", "title", "Sculpted")}{" "}
            <span className="italic text-[var(--primary)]">{c("hero", "italic", "Comfort.")}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[14px] leading-[1.7] text-[var(--text-mid)]">
            {c("hero", "description", "Discover sculpted silhouettes, classic designs and tactile fabrics — from artisanal studios to your sanctuary. In a chair, every piece is a sanctuary of its own.")}
          </p>
        </div>
      </section>

      <RuleMotif />

      <LiveCatalog category="Chairs" pageKey="chairs" />
    </>
  );
}
