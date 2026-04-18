import { useEffect, useState } from "react";
import { createClient } from "../lib/client";
import { FilterBar } from "../components/FilterBar";
import { RuleMotif } from "../components/RuleMotif";
import { LiveCatalog } from "../components/LiveCatalog";

const supabase = createClient();

interface PageContentField {
  section: string;
  field_key: string;
  field_value: string;
}

export function TablesPage() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("section, field_key, field_value")
        .eq("page", "tables");

      if (error) {
        console.error("Failed to fetch tables page content", error);
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

    void fetchContent();

    const channel = supabase
      .channel("tables-content-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "page_content" },
        () => { void fetchContent(); },
      )
      .subscribe();

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  const c = (section: string, key: string, fallback: string) =>
    content[`${section}--${key}`] ?? fallback;

  return (
    <>
      {/* ═══ HERO — Full-width background image ════ */}
      <section
        className="relative overflow-hidden rounded-2xl"
        id="tables-hero"
      >
        <img
          src={c("hero", "image", "/images/wood-grain.png")}
          alt="Close-up of wood grain"
          className="h-[420px] w-full object-cover brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2c2218cc] via-[#2c221866] to-transparent" />
        <div className="absolute inset-0 z-10 flex flex-col justify-center p-8 sm:p-12">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
            {c("hero", "eyebrow", "The Custom Collection")}
          </p>
          <h1 className="font-display text-[46px] leading-[1.06] text-white sm:text-[58px]">
            {c("hero", "title", "Gathering")}{" "}
            <em className="text-[var(--primary)]">{c("hero", "italic", "Redefined.")}</em>
          </h1>
          <p className="mt-4 max-w-lg text-[14px] leading-[1.7] text-white/80">
            {c("hero", "description", "Crafted from solid oak and steel married, our tables are built to be the heart of your home. Turn every deliberation to your sanctuary.")}
          </p>
          <div className="mt-6">
            <button type="button" className="primary-btn" id="tables-start-btn">
              {c("hero", "btn_label", "Start Gathering")}
            </button>
          </div>
        </div>

        {/* Floating quote */}
        <aside className="absolute bottom-5 right-5 z-10 hidden max-w-[250px] rounded-xl bg-white/90 p-4 shadow-[0_12px_28px_rgba(44,34,24,0.14)] backdrop-blur-sm md:block">
          <p className="font-display text-[14px] italic leading-snug text-[var(--text-dark)]">
            &ldquo;{c("hero", "quote", "Every chair follows a table worth sitting around.")}&rdquo;
          </p>
        </aside>
      </section>

      {/* ═══ CURATED CATALOG ════════════════════════ */}
      <section id="curated-catalog" className="mt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[32px] text-[var(--text-dark)]">
            {c("catalog", "title", "Curated Catalog")}
          </h2>
          <FilterBar
            labels={["All Tables", "Dining", "Coffee", "New Arrivals"]}
          />
        </div>

        <LiveCatalog category="Tables" />
      </section>

      <RuleMotif />
    </>
  );
}
