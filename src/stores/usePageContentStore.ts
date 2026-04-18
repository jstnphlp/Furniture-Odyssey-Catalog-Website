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
    const compositeId = `${page}-${section}-${key}`;

    // Upsert: try update first, then insert
    const { error: upsertError } = await supabase
      .from("page_content")
      .upsert(
        {
          id: compositeId,
          page,
          section,
          field_key: key,
          field_value: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

    if (upsertError) {
      console.error("Failed to update page content:", upsertError.message);
      return false;
    }

    // Update local state
    const k = makeKey(page, section, key);
    set((state) => ({
      content: { ...state.content, [k]: value },
    }));

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
