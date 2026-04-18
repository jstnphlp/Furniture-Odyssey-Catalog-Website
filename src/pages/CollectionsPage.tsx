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

export function CollectionsPage() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("section, field_key, field_value")
        .eq("page", "collections");

      if (error) {
        console.error("Failed to fetch collections page content", error);
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
      .channel("collections-content-live")
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
        <button type="button" className="primary-btn" id="collections-cta">     
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

      <LiveCatalog category="Collections" />

      <RuleMotif />
    </>
  );
}
