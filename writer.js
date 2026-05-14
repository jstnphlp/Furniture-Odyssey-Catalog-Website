const fs = require('fs');

fs.writeFileSync('src/pages/ChairsPage.tsx', \import { useMemo } from "react";
import { useCatalogStore } from "../stores/useCatalogStore";
import { FilterBar } from "../components/FilterBar";
import { RuleMotif } from "../components/RuleMotif";
import { CatalogGrid } from "../components/CatalogGrid";

export function ChairsPage() {
  const products = useCatalogStore((state) => state.products);
  const chairs = useMemo(
    () => products.filter((p) => p.category === "Chairs"),
    [products]
  );

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end" id="chairs-hero">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-mid)]">
            The Seat You Deserve
          </p>
          <h1 className="font-display text-[48px] leading-[1.06] text-[var(--text-dark)] sm:text-[56px]">
            Sculpted <span className="italic text-[var(--primary)]">Comfort.</span>
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

      <section id="chairs-grid">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[32px] text-[var(--text-dark)]">
            Full Collection
          </h2>
        </div>
        <CatalogGrid items={chairs} />
      </section>
    </>
  );
}\, 'utf8');

fs.writeFileSync('src/pages/TablesPage.tsx', \import { useMemo } from "react";
import { useCatalogStore } from "../stores/useCatalogStore";
import { FilterBar } from "../components/FilterBar";
import { CatalogGrid } from "../components/CatalogGrid";

export function TablesPage() {
  const products = useCatalogStore((state) => state.products);
  const tables = useMemo(
    () => products.filter((p) => p.category === "Tables"),
    [products]
  );

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl" id="tables-hero">
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
            Gathering <em className="text-[var(--primary)]">Redefined.</em>
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
        <aside className="absolute bottom-5 right-5 z-10 hidden max-w-[250px] rounded-xl bg-white/90 p-4 shadow-[0_12px_28px_rgba(44,34,24,0.14)] backdrop-blur-sm md:block">
          <p className="font-display text-[14px] italic leading-snug text-[var(--text-dark)]">
            "Every chair follows a table worth sitting around."
          </p>
        </aside>
      </section>

      <section id="curated-catalog" className="mt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[32px] text-[var(--text-dark)]">
            Curated Catalog
          </h2>
          <FilterBar labels={["All Tables", "Dining", "Coffee", "New Arrivals"]} />
        </div>
        <CatalogGrid items={tables} />
      </section>
    </>
  );
}\, 'utf8');

fs.writeFileSync('src/pages/CollectionsPage.tsx', \import { useMemo } from "react";
import { useCatalogStore } from "../stores/useCatalogStore";
import { FilterBar } from "../components/FilterBar";
import { RuleMotif } from "../components/RuleMotif";
import { CatalogGrid } from "../components/CatalogGrid";

export function CollectionsPage() {
  const products = useCatalogStore((state) => state.products);
  const collections = useMemo(
    () => products.filter((p) => p.category === "Collections"),
    [products]
  );

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center" id="collections-hero">
        <div className="animate-fade-in-up">
          <h1 className="font-display text-[46px] leading-[1.06] text-[var(--text-dark)] sm:text-[58px]">
            Curating Your <em className="not-italic italic text-[var(--primary)]">Sanctuary</em>
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

      <div className="-mt-14">
        <FilterBar labels={["Antiques", "Pieces", "Tables", "New Arrivals"]} />
      </div>

      <RuleMotif />

      <section id="collections-catalog">
        <CatalogGrid items={collections} />
      </section>

      <RuleMotif />

      <section className="grid items-center gap-10 lg:grid-cols-2" id="soul-section">
        <div className="overflow-hidden rounded-2xl">
          <img
            src="/images/craftsman.png"
            alt="Craftsman in workshop"
            className="h-[380px] w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-display text-[34px] leading-[1.1] text-[var(--text-dark)] sm:text-[40px]">
            The Soul of the <span className="italic text-[var(--primary)]">Odyssey</span>
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
            Book an artisan preview ->
          </button>
        </div>
      </section>
    </>
  );
}\, 'utf8');
