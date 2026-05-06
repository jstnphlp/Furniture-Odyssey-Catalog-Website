import { create } from "zustand";
import { createClient } from "../lib/client";

const supabase = createClient();

export interface PageContentField {
  id: string;
  page: string;
  section: string;
  field_key: string;
  field_value: string;
}

interface PageContentState {
  /** Map of "page-section-field_key" → field_value */
  content: Record<string, string>;
  /** Raw rows from DB for id lookups */
  rows: PageContentField[];
  isLoading: boolean;

  loadContent: () => Promise<void>;
  getField: (page: string, section: string, key: string, fallback: string) => string;
  updateField: (page: string, section: string, key: string, value: string) => Promise<boolean>;
  uploadImage: (file: File) => Promise<string | null>;
}

const makeKey = (page: string, section: string, key: string) =>
  `${page}--${section}--${key}`;

export const usePageContentStore = create<PageContentState>((set, get) => ({
  content: {},
  rows: [],
  isLoading: false,

  loadContent: async () => {
    set({ isLoading: true });

    const { data, error } = await supabase
      .from("page_content")
      .select("*")
      .order("page", { ascending: true });

    if (error) {
      console.error("Failed to load page content:", error.message);
      set({ isLoading: false });
      return;
    }

    const contentMap: Record<string, string> = {};
    for (const row of data ?? []) {
      contentMap[makeKey(row.page, row.section, row.field_key)] = row.field_value;
    }

    set({
      content: contentMap,
      rows: (data ?? []) as PageContentField[],
      isLoading: false,
    });
  },

  getField: (page, section, key, fallback) => {
    const k = makeKey(page, section, key);
    return get().content[k] ?? fallback;
  },

  updateField: async (page, section, key, value) => {
    // Look up the existing row's actual ID to handle seed data with
    // different ID formats (e.g. "home-curators-eyebrow" vs "home-curators_pick-eyebrow")
    const existingRow = get().rows.find(
      (r) => r.page === page && r.section === section && r.field_key === key,
    );
    const rowId = existingRow?.id ?? `${page}-${section}-${key}`;

    const payload = {
      id: rowId,
      page,
      section,
      field_key: key,
      field_value: value,
      updated_at: new Date().toISOString(),
    };

    // Upsert using the actual row ID
    const { error: upsertError } = await supabase
      .from("page_content")
      .upsert(payload, { onConflict: "id" });

    if (upsertError) {
      console.error("Failed to update page content:", upsertError.message);
      return false;
    }

    // Update local state — both content map and rows array
    const k = makeKey(page, section, key);
    set((state) => {
      const nextRows = existingRow
        ? state.rows.map((r) => (r.id === rowId ? { ...r, field_value: value } : r))
        : [...state.rows, { id: rowId, page, section, field_key: key, field_value: value }];
      return {
        content: { ...state.content, [k]: value },
        rows: nextRows,
      };
    });

    return true;
  },

  uploadImage: async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `page-content-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Failed to upload image:", uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  },
}));
