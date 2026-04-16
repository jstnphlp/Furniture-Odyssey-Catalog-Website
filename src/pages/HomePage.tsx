import { useMemo } from "react";
import { useCatalogStore } from "../stores/useCatalogStore";
import { MiniCard } from "../components/MiniCard";
import { RuleMotif } from "../components/RuleMotif";

export function HomePage() {
  const products = useCatalogStore((state) => state.products);

  /* Curate 4 items for the horizontal pick row */
  const curatorPicks = useMemo(() => {
    const picks = [
      products.find((p) => p.id === "chair-002"), // Sage Wing
      products.find((p) => p.id === "home-001"),   // Curator's Divius
      products.find((p) => p.id === "table-001"),  // Heirloom Dining
      products.find((p) => p.id === "home-002"),   // Odyssey Hutton
    ].filter(Boolean);
    return picks.length >= 4 ? picks : [...products].slice(0, 4);
  }, [products]);

  const heroImg1 = products.find((p) => p.id === "home-001")?.image ?? "/images/wooden-cabinet.png";
  const heroImg2 = products.find((p) => p.id === "chair-002")?.image ?? "/images/chair-sage.png";
  const materialImg = "/images/craftsman.png";
  const sideboardImg = "/images/modern-sideboard.png";

  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════ */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="animate-fade-in-up">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--secondary)]">
            A New Way to Sit
          </p>
          <h1 className="font-display text-[46px] leading-[1.06] text-[var(--text-dark)] sm:text-[60px]">
            Sculpting{" "}
            <span className="italic text-[var(--primary)]">Silence</span>
          </h1>
          <p className="mt-5 max-w-lg text-[14px] leading-[1.7] text-[var(--text-mid)]">
            Discover the harmony between form and living craft.
            Every piece is designed to bring a sense of quiet
            permanence to your contemporary sanctuary.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="primary-btn" id="hero-explore-btn">
              Explore the Collection
            </button>
            <button type="button" className="secondary-btn" id="hero-story-btn">
              Our Story
            </button>
          </div>
        </div>

        {/* Layered image composition */}
        <div className="relative min-h-[400px]">
          <img
            src={heroImg1}
            alt="Artisanal writing desk"
            className="absolute right-0 top-0 h-[320px] w-[82%] rounded-2xl object-cover shadow-[0_16px_48px_rgba(44,34,24,0.14)]"
          />
          <img
            src={heroImg2}
            alt="Sage lounge chair"
            className="absolute -bottom-2 left-0 h-[220px] w-[56%] -rotate-2 rounded-2xl object-cover shadow-[0_14px_36px_rgba(44,34,24,0.2)]"
          />
        </div>
      </section>

      {/* ═══ RULE MOTIF ═════════════════════════════ */}
      <RuleMotif />

      {/* ═══ THE DIGITAL CURATOR'S PICK ═════════════ */}
      <section id="curators-pick">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-mid)]">
              a daily focus on modern, distinctive classics, handcrafted furniture and more.
            </p>
            <h2 className="font-display text-[32px] leading-tight text-[var(--text-dark)] sm:text-[36px]">
              The Digital Curator&apos;s Pick
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" className="icon-button" aria-label="Previous">
              &#8592;
            </button>
            <button type="button" className="icon-button" aria-label="Next">
              &#8594;
            </button>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {curatorPicks.map((product) =>
            product ? (
              <MiniCard key={product.id} product={product} cta="Quick Shop" />
            ) : null,
          )}
        </div>
      </section>

      {/* ═══ HONEST MATERIALS ═══════════════════════ */}
      <section className="grid items-center gap-10 lg:grid-cols-2" id="honest-materials">
        <div>
          <h2 className="font-display text-[34px] leading-[1.12] text-[var(--text-dark)] sm:text-[40px]">
            Honest Materials.{" "}
            <span className="italic text-[var(--primary)]">
              Eternal Design.
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-[14px] leading-[1.7] text-[var(--text-mid)]">
            We believe furniture should tell a story worth repeating. In a world of disposable convenience, our
            "Honest Material" movement — where the wood grain is
            embraced and the visible construction provides testament to
            the artisan&apos;s touch.
          </p>
          <p className="mt-4 max-w-lg text-[13px] leading-[1.7] text-[var(--text-mid)]">
            Every piece at Furniture Odyssey is crafted to ensure the
            finest for us, preserving all of nature&apos;s warmth for your home&apos;s
            next chapter.
          </p>
          <button type="button" className="text-link mt-6 block">
            Browse the Craftsmanship →
          </button>
        </div>

        <div className="relative">
          <img
            src={materialImg}
            alt="Craftsman finishing wood"
            className="h-[380px] w-full rounded-2xl object-cover"
          />
          {/* Floating quote card */}
          <aside className="absolute -bottom-6 right-6 max-w-[240px] rounded-xl bg-white p-5 shadow-[0_16px_36px_rgba(44,34,24,0.12)]">
            <p className="font-display text-[15px] italic leading-snug text-[var(--text-dark)]">
              "Every grain tells a story of patient hands."
            </p>
          </aside>
        </div>
      </section>

      {/* ═══ BOTTOM EDITORIAL ═══════════════════════ */}
      <section className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <img
          src={sideboardImg}
          alt="Odyssey Hutton sideboard"
          className="h-[340px] w-full rounded-2xl object-cover"
        />
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-mid)]">
            Featured Story
          </p>
          <h2 className="font-display text-[30px] leading-tight text-[var(--text-dark)]">
            From Workshop{" "}
            <span className="italic text-[var(--primary)]">to Sanctuary</span>
          </h2>
          <p className="mt-4 max-w-lg text-[14px] leading-[1.7] text-[var(--text-mid)]">
            Follow the journey of a single slab of oak as it transforms from raw
            timber into a dining table designed to last for generations.
          </p>
          <button type="button" className="text-link mt-5 block">
            Read the Story →
          </button>
        </div>
      </section>
    </>
  );
}
