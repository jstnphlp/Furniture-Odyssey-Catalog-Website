import { useEffect, useMemo, useState } from "react";
import { createClient } from "../lib/client";
import type { Product } from "../types/catalog";
import { MiniCard } from "../components/MiniCard";
import { RuleMotif } from "../components/RuleMotif";

const supabase = createClient();
const HOMEPAGE_FEATURE_MARKER = "__homepage_featured__";
const MAX_HOMEPAGE_FEATURED = 4;

interface PageContentField {
  page: string;
  section: string;
  field_key: string;
  field_value: string;
}

const mapDbProduct = (row: any): Product => {
  const rawFeatures = Array.isArray(row.features) ? row.features : [];
  const features = rawFeatures.filter(
    (feature: string) => feature !== HOMEPAGE_FEATURE_MARKER,
  );
  const featuredFromColumn =
    Boolean(row.is_featured) || Boolean(row.is_homepage_featured);

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    basePrice: row.base_price ?? 0,
    image: row.image,
    description: row.description,
    dimensions: row.dimensions,
    badge: row.badge,
    badgeTone: row.badge_tone,
    isCustomizable: row.is_customizable ?? false,
    features,
    colorwaysCount: row.colorways_count,
    ctaLabel: row.cta_label,
    isHomepageFeatured:
      featuredFromColumn || rawFeatures.includes(HOMEPAGE_FEATURE_MARKER),
  };
};

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async (showLoader = true) => {
      if (showLoader) setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch homepage products", error);
        if (showLoader && isMounted) setLoading(false);
        return;
      }

      if (isMounted) {
        setProducts((data ?? []).map(mapDbProduct));
        setLoading(false);
      }
    };

    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .eq("page", "home");

      if (error) {
        console.error("Failed to fetch homepage content", error);
        return;
      }

      if (isMounted) {
        const map: Record<string, string> = {};
        for (const row of (data ?? []) as PageContentField[]) {
          map[`${row.section}--${row.field_key}`] = row.field_value;
        }
        setContent(map);
      }
    };

    void fetchProducts();
    void fetchContent();

    const channel = supabase
      .channel("homepage-products-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          void fetchProducts(false);
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "page_content" },
        () => {
          void fetchContent();
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  /* Helper to get content with fallback */
  const c = (section: string, key: string, fallback: string) =>
    content[`${section}--${key}`] ?? fallback;

  /* Curate items for the horizontal pick row */
  const curatorPicks = useMemo(() => {
    const explicitlyFeatured = products.filter((p) => p.isHomepageFeatured);
    const picks = [...explicitlyFeatured.slice(0, MAX_HOMEPAGE_FEATURED)];
    // Fill up to 4 if needed to maintain design
    if (picks.length < MAX_HOMEPAGE_FEATURED) {
      const others = products.filter((p) => !p.isHomepageFeatured);
      picks.push(...others.slice(0, MAX_HOMEPAGE_FEATURED - picks.length));
    }
    return picks;
  }, [products]);

  const heroImg1 = c("hero", "image1",
    products.find((p) => p.id === "home-001")?.image ??
    "/images/wooden-cabinet.png");
  const heroImg2 = c("hero", "image2",
    products.find((p) => p.id === "chair-002")?.image ??
    "/images/chair-sage.png");
  const materialImg = c("honest_materials", "image", "/images/craftsman.png");
  const sideboardImg = c("featured_story", "image", "/images/modern-sideboard.png");

  if (loading && products.length === 0) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-[380px] rounded-2xl bg-black/5" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-[260px] rounded-2xl bg-black/5" />
          <div className="h-[260px] rounded-2xl bg-black/5" />
          <div className="h-[260px] rounded-2xl bg-black/5" />
          <div className="h-[260px] rounded-2xl bg-black/5" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ═══ HERO ═══════════════════════════════════ */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="animate-fade-in-up">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--secondary)]">
            {c("hero", "eyebrow", "A New Way to Sit")}
          </p>
          <h1 className="font-display text-[46px] leading-[1.06] text-[var(--text-dark)] sm:text-[60px]">
            {c("hero", "title", "Sculpting")}{" "}
            <span className="italic text-[var(--primary)]">{c("hero", "italic", "Silence")}</span>
          </h1>
          <p className="mt-5 max-w-lg text-[14px] leading-[1.7] text-[var(--text-mid)]">
            {c("hero", "description", "Discover the harmony between form and living craft. Every piece is designed to bring a sense of quiet permanence to your contemporary sanctuary.")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="primary-btn" id="hero-explore-btn">
              {c("hero", "btn1_label", "Explore the Collection")}
            </button>
            <button type="button" className="secondary-btn" id="hero-story-btn">
              {c("hero", "btn2_label", "Our Story")}
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
              {c("curators_pick", "eyebrow", "a daily focus on modern, distinctive classics, handcrafted furniture and more.")}
            </p>
            <h2 className="font-display text-[32px] leading-tight text-[var(--text-dark)] sm:text-[36px]">
              {c("curators_pick", "title", "The Digital Curator\u0027s Pick")}
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
      <section
        className="grid items-center gap-10 lg:grid-cols-2"
        id="honest-materials"
      >
        <div>
          <h2 className="font-display text-[34px] leading-[1.12] text-[var(--text-dark)] sm:text-[40px]">
            {c("honest_materials", "title", "Honest Materials.")}{" "}
            <span className="italic text-[var(--primary)]">
              {c("honest_materials", "italic", "Eternal Design.")}
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-[14px] leading-[1.7] text-[var(--text-mid)]">
            {c("honest_materials", "description", "We believe furniture should tell a story worth repeating. In a world of disposable convenience, our \"Honest Material\" movement — where the wood grain is embraced and the visible construction provides testament to the artisan\u0027s touch.")}
          </p>
          <p className="mt-4 max-w-lg text-[13px] leading-[1.7] text-[var(--text-mid)]">
            {c("honest_materials", "description2", "Every piece at Furniture Odyssey is crafted to ensure the finest for us, preserving all of nature\u0027s warmth for your home\u0027s next chapter.")}
          </p>
          <button type="button" className="text-link mt-6 block">
            {c("honest_materials", "btn_label", "Browse the Craftsmanship →")}
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
              &ldquo;{c("honest_materials", "quote", "Every grain tells a story of patient hands.")}&rdquo;
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
            {c("featured_story", "eyebrow", "Featured Story")}
          </p>
          <h2 className="font-display text-[30px] leading-tight text-[var(--text-dark)]">
            {c("featured_story", "title", "From Workshop")}{" "}
            <span className="italic text-[var(--primary)]">{c("featured_story", "italic", "to Sanctuary")}</span>
          </h2>
          <p className="mt-4 max-w-lg text-[14px] leading-[1.7] text-[var(--text-mid)]">
            {c("featured_story", "description", "Follow the journey of a single slab of oak as it transforms from raw timber into a dining table designed to last for generations.")}
          </p>
          <button type="button" className="text-link mt-5 block">
            {c("featured_story", "btn_label", "Read the Story →")}
          </button>
        </div>
      </section>
    </>
  );
}
