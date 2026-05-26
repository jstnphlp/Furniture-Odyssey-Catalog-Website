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
  content: Record<string, string>;
  rows: PageContentField[];
  isLoading: boolean;

  loadContent: () => Promise<void>;
  getField: (page: string, section: string, key: string, fallback: string) => string;
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
}));
