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

export function ChairsPage() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("section, field_key, field_value")
        .eq("page", "chairs");

      if (error) {
        console.error("Failed to fetch chairs page content", error);
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
      .channel("chairs-content-live")
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
        <FilterBar labels={["Time by Material", "Named Arrivals"]} />
      </section>

      <RuleMotif />

      <LiveCatalog category="Chairs" />
    </>
  );
}
