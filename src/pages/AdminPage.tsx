import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "../lib/client";
import { useAdminStore } from "../stores/useAdminStore";
import { useCatalogStore } from "../stores/useCatalogStore";
import { usePageContentStore } from "../stores/usePageContentStore";
import { isCustomizableTable } from "../types/catalog";
import type { Product, CustomizableTable, TableOption } from "../types/catalog";

const supabase = createClient();
const HOMEPAGE_FEATURE_MARKER = "__homepage_featured__";
const MAX_HOMEPAGE_FEATURED = 4;
type OptionGroup = "Top" | "Legs" | "Base";

interface TagItem {
  id: string;
  name: string;
}

const STATIC_IMAGE_SEED_PRODUCTS = [
  {
    id: "seed-chair-artisan-lounge",
    name: "Artisan Lounge Chair",
    category: "Chairs" as const,
    base_price: 4200,
    image: "/images/chair-artisan-lounge.png",
    description: "Hand-finished lounge chair with a sculpted profile.",
    dimensions: "74W x 82D x 88H cm",
  },
  {
    id: "seed-chair-modern-dining",
    name: "Modern Dining Chair",
    category: "Chairs" as const,
    base_price: 3600,
    image: "/images/chair-modern-dining.png",
    description: "A refined dining chair designed for everyday comfort.",
    dimensions: "52W x 57D x 82H cm",
  },
  {
    id: "seed-chair-sage",
    name: "Sage Accent Chair",
    category: "Chairs" as const,
    base_price: 3900,
    image: "/images/chair-sage.png",
    description: "Soft contours and plush upholstery in a calming tone.",
    dimensions: "70W x 78D x 86H cm",
  },
  {
    id: "seed-dining-chair",
    name: "Heritage Dining Chair",
    category: "Chairs" as const,
    base_price: 3300,
    image: "/images/dining-chair.png",
    description: "Classic proportions with sturdy handcrafted detailing.",
    dimensions: "50W x 56D x 84H cm",
  },
  {
    id: "seed-ember-lounge",
    name: "Ember Lounge",
    category: "Chairs" as const,
    base_price: 4500,
    image: "/images/ember-lounge.png",
    description: "A low, inviting lounge silhouette for relaxed spaces.",
    dimensions: "78W x 84D x 80H cm",
  },
  {
    id: "seed-white-stool",
    name: "White Counter Stool",
    category: "Chairs" as const,
    base_price: 2400,
    image: "/images/white-stool.png",
    description: "Minimal counter-height stool with a clean modern form.",
    dimensions: "44W x 44D x 66H cm",
  },
  {
    id: "seed-console-table",
    name: "Console Table",
    category: "Tables" as const,
    base_price: 6100,
    image: "/images/console-table.png",
    description: "Slim profile table suited for entryways and galleries.",
    dimensions: "140W x 38D x 80H cm",
  },
  {
    id: "seed-hero-table",
    name: "Hero Dining Table",
    category: "Tables" as const,
    base_price: 9800,
    image: "/images/hero-table.png",
    description: "Statement dining table crafted for warm gatherings.",
    dimensions: "200W x 95D x 76H cm",
  },
  {
    id: "seed-pedestal-table",
    name: "Pedestal Table",
    category: "Tables" as const,
    base_price: 7600,
    image: "/images/pedestal-table.png",
    description: "Balanced pedestal form with generous surface area.",
    dimensions: "120W x 120D x 74H cm",
  },
  {
    id: "seed-modern-sideboard",
    name: "Modern Sideboard",
    category: "Tables" as const,
    base_price: 8400,
    image: "/images/modern-sideboard.png",
    description: "Versatile storage sideboard with minimalist lines.",
    dimensions: "180W x 45D x 78H cm",
  },
  {
    id: "seed-wooden-cabinet",
    name: "Wooden Cabinet",
    category: "Tables" as const,
    base_price: 8900,
    image: "/images/wooden-cabinet.png",
    description: "Solid wood cabinet built for timeless interiors.",
    dimensions: "160W x 48D x 82H cm",
  },
  {
    id: "seed-hero-chair",
    name: "Hero Lounge Chair",
    category: "Chairs" as const,
    base_price: 4300,
    image: "/images/hero-chair.png",
    description: "Hero-piece lounge chair with tailored upholstery.",
    dimensions: "76W x 82D x 88H cm",
  },
  {
    id: "seed-cloud-modular",
    name: "Cloud Modular",
    category: "Collections" as const,
    base_price: 12400,
    image: "/images/cloud-modular.png",
    description: "Modular seating composition for flexible living rooms.",
    dimensions: "Variable configuration",
  },
  {
    id: "seed-craftsman-story",
    name: "Craftsman Editorial",
    category: "Collections" as const,
    base_price: 1200,
    image: "/images/craftsman.png",
    description: "Editorial showcase highlighting artisan workshop process.",
    dimensions: "Gallery piece",
  },
  {
    id: "seed-portrait-art",
    name: "Portrait Art Piece",
    category: "Collections" as const,
    base_price: 2100,
    image: "/images/portrait-art.png",
    description: "Curated framed portrait to complete living spaces.",
    dimensions: "90W x 4D x 120H cm",
  },
  {
    id: "seed-shelf-decor",
    name: "Shelf Decor Set",
    category: "Collections" as const,
    base_price: 1400,
    image: "/images/shelf-decor.png",
    description: "Decorative shelf objects for layered styling.",
    dimensions: "Assorted set",
  },
  {
    id: "seed-wood-grain",
    name: "Wood Grain Collection",
    category: "Collections" as const,
    base_price: 1700,
    image: "/images/wood-grain.png",
    description: "Material study panel celebrating natural wood textures.",
    dimensions: "120W x 3D x 80H cm",
  },
];

type Tab = "prices" | "availability" | "content";
type ContentPage = "home" | "chairs" | "tables" | "collections";

/* ═══════════════════════════════════════════════════════
   Variation Editor — reusable Color/Size option manager
   ═══════════════════════════════════════════════════════ */

interface VariationEntry {
  tempId: string;
  name: string;
  priceModifier: string;
  layerUrl: string;
  imageFile: File | null;
}

interface VariationState {
  enableColors: boolean;
  enableSizes: boolean;
  colors: VariationEntry[];
  sizes: VariationEntry[];
}

const emptyVariationState: VariationState = {
  enableColors: false,
  enableSizes: false,
  colors: [],
  sizes: [],
};

function makeEntry(): VariationEntry {
  return {
    tempId: `ve-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    name: "",
    priceModifier: "0",
    layerUrl: "",
    imageFile: null,
  };
}

function VariationEditor({
  state,
  onChange,
}: {
  state: VariationState;
  onChange: (next: VariationState) => void;
}) {
  const update = (partial: Partial<VariationState>) =>
    onChange({ ...state, ...partial });

  const updateColor = (idx: number, patch: Partial<VariationEntry>) => {
    const next = [...state.colors];
    next[idx] = { ...next[idx], ...patch };
    update({ colors: next });
  };

  const updateSize = (idx: number, patch: Partial<VariationEntry>) => {
    const next = [...state.sizes];
    next[idx] = { ...next[idx], ...patch };
    update({ sizes: next });
  };

  return (
    <div className="space-y-4 rounded-xl border border-[var(--border-card)] bg-[#faf7f3] p-4">
      <h4 className="text-[13px] font-bold uppercase tracking-wider text-[var(--text-dark)]">
        🎨 Product Variations
      </h4>

      {/* ── Color Toggle ── */}
      <div className="flex items-center justify-between rounded-lg border border-[var(--border-card)] bg-white p-3">
        <div>
          <p className="text-[12px] font-semibold text-[var(--text-dark)]">
            Enable Color Variations
          </p>
          <p className="text-[10px] text-[var(--text-mid)]">
            Add color options with optional images and price modifiers
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const next = !state.enableColors;
            update({
              enableColors: next,
              colors: next && state.colors.length === 0 ? [makeEntry()] : state.colors,
            });
          }}
          className={`relative h-6 w-10 rounded-full transition-colors ${
            state.enableColors ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform ${
              state.enableColors ? "left-[18px]" : "left-[2px]"
            }`}
          />
        </button>
      </div>

      {/* ── Color Entries ── */}
      {state.enableColors && (
        <div className="space-y-2 pl-2">
          {state.colors.map((entry, idx) => (
            <div
              key={entry.tempId}
              className="flex flex-wrap items-start gap-2 rounded-lg border border-[var(--border-card)] bg-white p-3"
            >
              <div className="flex-1 min-w-[120px]">
                <label className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
                  Color Name
                </label>
                <input
                  type="text"
                  value={entry.name}
                  onChange={(e) => updateColor(idx, { name: e.target.value })}
                  placeholder="e.g. White Oak"
                  className="w-full rounded-md border border-[var(--border-card)] bg-white px-2 py-1.5 text-[12px] outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div className="w-[100px]">
                <label className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
                  + Price
                </label>
                <input
                  type="number"
                  value={entry.priceModifier}
                  onChange={(e) => updateColor(idx, { priceModifier: e.target.value })}
                  className="w-full rounded-md border border-[var(--border-card)] bg-white px-2 py-1.5 text-[12px] outline-none focus:border-[var(--primary)]"
                  min="0"
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
                  Color Image
                </label>
                <div className="flex items-center gap-2">
                  {/* Thumbnail */}
                  {(entry.imageFile || entry.layerUrl) && (
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded border border-[var(--border-card)]">
                      <img
                        src={entry.imageFile ? URL.createObjectURL(entry.imageFile) : entry.layerUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateColor(idx, { imageFile: e.target.files?.[0] ?? null })}
                    className="w-full rounded-md border border-[var(--border-card)] bg-white px-2 py-1 text-[10px] outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => update({ colors: state.colors.filter((_, i) => i !== idx) })}
                className="mt-4 text-[11px] font-bold text-red-500 hover:text-red-700"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update({ colors: [...state.colors, makeEntry()] })}
            className="rounded-md border border-dashed border-[var(--border-warm)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-mid)] transition hover:bg-white hover:text-[var(--text-dark)]"
          >
            + Add Color Option
          </button>
        </div>
      )}

      {/* ── Size Toggle ── */}
      <div className="flex items-center justify-between rounded-lg border border-[var(--border-card)] bg-white p-3">
        <div>
          <p className="text-[12px] font-semibold text-[var(--text-dark)]">
            Enable Size Variations
          </p>
          <p className="text-[10px] text-[var(--text-mid)]">
            Add size options (e.g. Small, Medium, Large)
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const next = !state.enableSizes;
            update({
              enableSizes: next,
              sizes: next && state.sizes.length === 0 ? [makeEntry()] : state.sizes,
            });
          }}
          className={`relative h-6 w-10 rounded-full transition-colors ${
            state.enableSizes ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform ${
              state.enableSizes ? "left-[18px]" : "left-[2px]"
            }`}
          />
        </button>
      </div>

      {/* ── Size Entries ── */}
      {state.enableSizes && (
        <div className="space-y-2 pl-2">
          {state.sizes.map((entry, idx) => (
            <div
              key={entry.tempId}
              className="flex items-center gap-2 rounded-lg border border-[var(--border-card)] bg-white p-3"
            >
              <div className="flex-1">
                <label className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
                  Size Name
                </label>
                <input
                  type="text"
                  value={entry.name}
                  onChange={(e) => updateSize(idx, { name: e.target.value })}
                  placeholder="e.g. 120cm"
                  className="w-full rounded-md border border-[var(--border-card)] bg-white px-2 py-1.5 text-[12px] outline-none focus:border-[var(--primary)]"
                />
              </div>
              <div className="w-[100px]">
                <label className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
                  + Price
                </label>
                <input
                  type="number"
                  value={entry.priceModifier}
                  onChange={(e) => updateSize(idx, { priceModifier: e.target.value })}
                  className="w-full rounded-md border border-[var(--border-card)] bg-white px-2 py-1.5 text-[12px] outline-none focus:border-[var(--primary)]"
                  min="0"
                />
              </div>
              <button
                type="button"
                onClick={() => update({ sizes: state.sizes.filter((_, i) => i !== idx) })}
                className="mt-4 text-[11px] font-bold text-red-500 hover:text-red-700"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update({ sizes: [...state.sizes, makeEntry()] })}
            className="rounded-md border border-dashed border-[var(--border-warm)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-mid)] transition hover:bg-white hover:text-[var(--text-dark)]"
          >
            + Add Size Option
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Section Field Editor — reusable inline field editor
   ═══════════════════════════════════════════════════════ */

function SectionFieldEditor({
  label,
  hint,
  value,
  type = "text",
  onSave,
}: {
  label: string;
  hint?: string;
  value: string;
  type?: "text" | "textarea";
  onSave: (value: string) => Promise<boolean>;
}) {
  const [localValue, setLocalValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState(false);
  const dirty = localValue !== value;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(localValue);
    setSaving(false);
    if (ok) {
      setFlash(true);
      setTimeout(() => setFlash(false), 1200);
    }
  };

  return (
    <div
      className={`rounded-lg border p-3 transition ${
        flash
          ? "border-green-400 bg-green-50"
          : "border-[var(--border-card)] bg-white"
      }`}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
          {label}
        </label>
        {hint && (
          <span className="text-[10px] text-[var(--text-mid)] opacity-60">
            — {hint}
          </span>
        )}
      </div>
      {type === "textarea" ? (
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-[var(--border-card)] bg-[var(--bg-cream)] px-3 py-2 text-[13px] leading-relaxed text-[var(--text-dark)] outline-none focus:border-[var(--primary)]"
        />
      ) : (
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className="w-full rounded-lg border border-[var(--border-card)] bg-[var(--bg-cream)] px-3 py-2 text-[13px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]"
        />
      )}
      {dirty && (
        <button
          type="button"
          onClick={() => { void handleSave(); }}
          disabled={saving}
          className="mt-2 rounded-md bg-green-600 px-3 py-1 text-[11px] font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Section Image Editor — image preview + upload
   ═══════════════════════════════════════════════════════ */

function SectionImageEditor({
  label,
  hint,
  currentUrl,
  onSave,
}: {
  label: string;
  hint?: string;
  currentUrl: string;
  onSave: (url: string) => Promise<boolean>;
}) {
  const [uploading, setUploading] = useState(false);
  const [flash, setFlash] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadImage = usePageContentStore((s) => s.uploadImage);

  useEffect(() => {
    setPreviewUrl(currentUrl);
  }, [currentUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      setPreviewUrl(url);
      const ok = await onSave(url);
      if (ok) {
        setFlash(true);
        setTimeout(() => setFlash(false), 1200);
      }
    } else {
      alert("Failed to upload image.");
    }
    setUploading(false);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      className={`rounded-lg border p-3 transition ${
        flash
          ? "border-green-400 bg-green-50"
          : "border-[var(--border-card)] bg-white"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
          {label}
        </label>
        {hint && (
          <span className="text-[10px] text-[var(--text-mid)] opacity-60">
            — {hint}
          </span>
        )}
      </div>
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div className="h-[80px] w-[120px] flex-shrink-0 overflow-hidden rounded-lg border border-[var(--border-card)] bg-[var(--bg-cream)]">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--text-mid)]">
              No image
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => { void handleFileChange(e); }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-md border border-[var(--border-card)] bg-[var(--bg-cream)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-dark)] transition hover:bg-[var(--border-warm)] disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Change Image"}
          </button>
          <p className="mt-1 text-[10px] text-[var(--text-mid)]">
            JPG, PNG, WebP. Max 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Section Card — groups fields under a section header
   ═══════════════════════════════════════════════════════ */

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] overflow-hidden">
      {/* Section header */}
      <div className="border-b border-[var(--border-card)] bg-gradient-to-r from-[#f5ede4] to-[var(--bg-card)] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[18px]">{icon}</span>
          <h3 className="font-display text-[18px] text-[var(--text-dark)]">
            {title}
          </h3>
        </div>
        {description && (
          <p className="mt-0.5 text-[11px] text-[var(--text-mid)]">
            {description}
          </p>
        )}
      </div>
      {/* Fields */}
      <div className="space-y-3 p-5">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Tag Chip Selector — toggleable chips for assigning tags
   ═══════════════════════════════════════════════════════ */

function TagChipSelector({
  allTags,
  selectedTagIds,
  onToggle,
  onCreateTag,
}: {
  allTags: TagItem[];
  selectedTagIds: Set<string>;
  onToggle: (tagId: string) => void;
  onCreateTag?: (name: string) => Promise<void>;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const handleCreate = async () => {
    if (!newTagName.trim() || !onCreateTag) {
      setIsCreating(false);
      return;
    }
    await onCreateTag(newTagName);
    setNewTagName("");
    setIsCreating(false);
  };

  return (
    <div className="space-y-2">
      <label className="mb-0.5 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
        🏷️ Tags
      </label>
      <div className="flex flex-wrap items-center gap-1.5">
        {allTags.length === 0 && !isCreating && (
          <span className="text-[11px] text-[var(--text-mid)] italic mr-2">
            No tags yet.
          </span>
        )}
        {allTags.map((tag) => {
          const isSelected = selectedTagIds.has(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggle(tag.id)}
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                isSelected
                  ? "border-[var(--text-dark)] bg-[var(--text-dark)] text-white"
                  : "border-[var(--border-card)] bg-white text-[var(--text-mid)] hover:border-[var(--text-dark)] hover:text-[var(--text-dark)]"
              }`}
            >
              {isSelected && "✓ "}{tag.name}
            </button>
          );
        })}
        {onCreateTag && (
          isCreating ? (
            <div className="flex items-center gap-1 rounded-full border border-[var(--text-dark)] bg-white px-2 py-0.5 ml-1">
              <input
                type="text"
                autoFocus
                placeholder="Tag name..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleCreate();
                  } else if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewTagName("");
                  }
                }}
                className="w-24 bg-transparent text-[11px] font-semibold outline-none placeholder:font-normal"
              />
              <button
                type="button"
                onClick={() => void handleCreate()}
                className="text-[11px] font-bold text-[var(--text-dark)] hover:scale-110 transition-transform"
              >
                ✓
              </button>
              <button
                type="button"
                onClick={() => { setIsCreating(false); setNewTagName(""); }}
                className="text-[11px] font-bold text-[var(--text-mid)] hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="ml-1 rounded-full border border-dashed border-[var(--text-mid)] px-3 py-1 text-[11px] font-semibold text-[var(--text-mid)] hover:border-[var(--text-dark)] hover:text-[var(--text-dark)] transition"
            >
              + New Tag
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Product List — filtered by category, with edit/delete
   ═══════════════════════════════════════════════════════ */

function ProductListSection({
  category,
  products,
  editingProduct,
  formState,
  setFormState,
  savingProductId,
  deletingProductId,
  saveFlash,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onDeleteProduct,
  onToggleHomepageFeature,
  isHomepageFeatured,
  editImageFile,
  setEditImageFile,
  editImageUploading,
  editVariations,
  setEditVariations,
  allTags,
  editTagIds,
  onToggleEditTag,
  productTagMap,
  onCreateTag,
}: {
  category: "Chairs" | "Tables" | "Collections";
  products: (Product | CustomizableTable)[];
  editingProduct: string | null;
  formState: { name: string; description: string; dimensions: string; basePrice: string };
  setFormState: React.Dispatch<React.SetStateAction<{ name: string; description: string; dimensions: string; basePrice: string }>>;
  savingProductId: string | null;
  deletingProductId: string | null;
  saveFlash: string | null;
  onStartEditing: (p: Product | CustomizableTable) => void;
  onSaveEditing: () => Promise<void>;
  onCancelEditing: () => void;
  onDeleteProduct: (p: Product | CustomizableTable) => Promise<void>;
  onToggleHomepageFeature: (p: Product | CustomizableTable) => Promise<void>;
  isHomepageFeatured: (p: Product | CustomizableTable) => boolean;
  editImageFile: File | null;
  setEditImageFile: (f: File | null) => void;
  editImageUploading: boolean;
  editVariations: VariationState;
  setEditVariations: (v: VariationState) => void;
  allTags: TagItem[];
  editTagIds: Set<string>;
  onToggleEditTag: (tagId: string) => void;
  productTagMap: Map<string, string[]>;
  onCreateTag: (name: string) => Promise<void>;
}) {
  const filtered = products.filter((p) => p.category === category);

  if (filtered.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border-warm)] p-6 text-center">
        <p className="text-[13px] text-[var(--text-mid)]">
          No {category.toLowerCase()} products yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-[10px] text-red-500">DEBUG: Total products in store: {products.length}, Filtered for {category}: {filtered.length}</div>
      {filtered.map((p) => {
        const isEditing = editingProduct === p.id;
        return (
          <div
            key={p.id}
            className={`rounded-xl border bg-[var(--bg-card)] p-5 transition ${
              saveFlash === p.id
                ? "border-green-400 bg-green-50"
                : "border-[var(--border-card)]"
            }`}
          >
            {!isEditing ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Product thumbnail */}
                    {p.image && (
                      <div className="h-[56px] w-[56px] flex-shrink-0 overflow-hidden rounded-lg border border-[var(--border-card)]">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[16px] font-semibold text-[var(--text-dark)]">
                          {p.name}
                        </h3>
                        {p.isCustomizable && (
                          <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[10px] font-bold text-white">
                            CONFIGURABLE
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] text-[var(--text-mid)]">
                        {p.description || "No description"}
                      </p>
                      <div className="mt-2 flex gap-4 text-[12px] text-[var(--text-mid)]">
                        <span>₱{p.basePrice.toLocaleString()}</span>
                        {p.dimensions && <span>📐 {p.dimensions}</span>}
                      </div>
                      {/* Display assigned tags */}
                      {(productTagMap.get(p.id) ?? []).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {(productTagMap.get(p.id) ?? []).map((tagName) => (
                            <span
                              key={tagName}
                              className="rounded-full bg-[var(--bg-cream)] border border-[var(--border-warm)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-mid)]"
                            >
                              {tagName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onStartEditing(p)}
                      className="secondary-btn shrink-0 text-[12px]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void onDeleteProduct(p);
                      }}
                      disabled={deletingProductId === p.id}
                      className="text-red-500 hover:text-red-700 text-[11px] font-bold uppercase tracking-wider text-right"
                    >
                      {deletingProductId === p.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg border border-[var(--border-card)] bg-white p-3">
                  <div>
                    <p className="text-[12px] font-semibold text-[var(--text-dark)]">
                      Feature on Homepage
                    </p>
                    <p className="text-[11px] text-[var(--text-mid)]">
                      Show this product in "The Digital Curator's Pick"
                      section.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      void onToggleHomepageFeature(p);
                    }}
                    className={`relative h-6 w-10 rounded-full transition-colors ${
                      isHomepageFeatured(p) ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        isHomepageFeatured(p) ? "left-[18px]" : "left-[2px]"
                      }`}
                    />
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {/* Image preview & change */}
                <div className="flex items-start gap-4">
                  <div className="h-[80px] w-[80px] flex-shrink-0 overflow-hidden rounded-lg border border-[var(--border-card)] bg-[var(--bg-cream)]">
                    {p.image ? (
                      <img
                        src={editImageFile ? URL.createObjectURL(editImageFile) : p.image}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--text-mid)]">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditImageFile(e.target.files ? e.target.files[0] : null)
                      }
                      className="w-full rounded-lg border bg-white px-3 py-1.5 text-[12px] outline-none"
                    />
                    {editImageFile && (
                      <p className="mt-1 text-[10px] text-green-600 font-semibold">
                        New image selected — will upload on save
                      </p>
                    )}
                    {editImageUploading && (
                      <p className="mt-1 text-[10px] text-amber-600 font-semibold">
                        Uploading image...
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-[var(--border-card)] bg-white px-3 py-2 text-[14px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
                    Description
                  </label>
                  <textarea
                    value={formState.description}
                    onChange={(e) =>
                      setFormState((s) => ({
                        ...s,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full resize-none rounded-lg border border-[var(--border-card)] bg-white px-3 py-2 text-[13px] leading-relaxed text-[var(--text-dark)] outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
                      Dimensions
                    </label>
                    <input
                      type="text"
                      value={formState.dimensions}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          dimensions: e.target.value,
                        }))
                      }
                      placeholder="e.g. 220W × 95D × 76H cm"
                      className="w-full rounded-lg border border-[var(--border-card)] bg-white px-3 py-2 text-[13px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
                      Base Price (₱)
                    </label>
                    <input
                      type="number"
                      value={formState.basePrice}
                      onChange={(e) =>
                        setFormState((s) => ({
                          ...s,
                          basePrice: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-[var(--border-card)] bg-white px-3 py-2 text-[13px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]"
                      min="0"
                    />
                  </div>
                </div>

                {/* Tag Selector */}
                <TagChipSelector
                  allTags={allTags}
                  selectedTagIds={editTagIds}
                  onToggle={onToggleEditTag}
                  onCreateTag={async (name) => {
                    await onCreateTag(name);
                  }}
                />

                {/* Variation Editor */}
                <VariationEditor state={editVariations} onChange={setEditVariations} />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      void onSaveEditing();
                    }}
                    disabled={savingProductId === p.id || editImageUploading}
                    className="primary-btn text-[12px]"
                  >
                    {savingProductId === p.id
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={onCancelEditing}
                    className="secondary-btn text-[12px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN ADMIN PAGE
   ═══════════════════════════════════════════════════════ */

export function AdminPage() {
  const adminEmail = useAdminStore((s) => s.adminEmail);
  const logout = useAdminStore((s) => s.logout);
  const products = useCatalogStore((s) => s.products);
  const setProducts = useCatalogStore((s) => s.setProducts);
  const addProduct = useCatalogStore((s) => s.addProduct);
  const removeProduct = useCatalogStore((s) => s.removeProduct);
  const updateProduct = useCatalogStore((s) => s.updateProduct);
  const updateTableOption = useCatalogStore((s) => s.updateTableOption);

  // Page content store
  const pageContent = usePageContentStore();
  const getField = pageContent.getField;
  const updateField = pageContent.updateField;

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSeedingCatalog, setIsSeedingCatalog] = useState(false);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [newProductState, setNewProductState] = useState<{
    name: string;
    description: string;
    dimensions: string;
    basePrice: string;
    category: "Chairs" | "Tables" | "Collections";
    imageFile: File | null;
  }>({
    name: "",
    description: "",
    dimensions: "",
    basePrice: "",
    category: "Chairs",
    imageFile: null,
  });

  const [activeTab, setActiveTab] = useState<Tab>("prices");
  const [contentPage, setContentPage] = useState<ContentPage>("home");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formState, setFormState] = useState<{
    name: string;
    description: string;
    dimensions: string;
    basePrice: string;
  }>({ name: "", description: "", dimensions: "", basePrice: "" });
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [saveFlash, setSaveFlash] = useState<string | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImageUploading, setEditImageUploading] = useState(false);
  const [editVariations, setEditVariations] = useState<VariationState>(emptyVariationState);
  const [newProductVariations, setNewProductVariations] = useState<VariationState>(emptyVariationState);

  // ── Tag Management State ──
  const [allTags, setAllTags] = useState<TagItem[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [editTagIds, setEditTagIds] = useState<Set<string>>(new Set());
  const [newProductTagIds, setNewProductTagIds] = useState<Set<string>>(new Set());
  const [productTagMap, setProductTagMap] = useState<Map<string, string[]>>(new Map());

  const addFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAddingProduct && addFormRef.current) {
      addFormRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isAddingProduct]);

  const configurableTables = useMemo(
    () => products.filter(isCustomizableTable) as CustomizableTable[],
    [products],
  );

  const allProducts = products;

  // Load catalog
  useEffect(() => {
    let mounted = true;

    const loadAdminCatalog = async () => {
      setIsCatalogLoading(true);

      const [
        { data: productRows, error: productsError },
        { data: optionRows, error: optionsError },
      ] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("table_options")
          .select("*")
          .order("created_at", { ascending: true }),
      ]);

      if (!mounted) return;

      if (productsError || optionsError) {
        setIsCatalogLoading(false);
        alert(
          `Failed to load admin catalog: ${productsError?.message ?? optionsError?.message}`,
        );
        return;
      }

      const groupedOptions = new Map<
        string,
        { Top: TableOption[]; Legs: TableOption[]; Base: TableOption[] }
      >();

      for (const option of optionRows ?? []) {
        const group = option.option_group as OptionGroup;
        if (!groupedOptions.has(option.product_id)) {
          groupedOptions.set(option.product_id, {
            Top: [],
            Legs: [],
            Base: [],
            Color: [],
            Size: [],
          } as any);
        }

        const g = groupedOptions.get(option.product_id)!;
        if (!g[group]) g[group] = [];
        
        g[group].push({
          id: option.id,
          name: option.name,
          priceModifier: Number(option.price_modifier ?? 0),
          layerUrl: option.layer_url,
          available: option.available ?? true,
          incompatibleWith: [],
        });
      }

      const mappedProducts = (productRows ?? []).map((row: any) => {
        const features = Array.isArray(row.features) ? row.features : [];
        const baseProduct: Product = {
          id: row.id,
          name: row.name,
          category: row.category,
          basePrice: Number(row.base_price ?? 0),
          image: row.image,
          description: row.description ?? undefined,
          dimensions: row.dimensions ?? undefined,
          badge: row.badge ?? undefined,
          badgeTone: row.badge_tone ?? undefined,
          isCustomizable: Boolean(row.is_customizable),
          features,
          colorwaysCount: row.colorways_count ?? undefined,
          ctaLabel: row.cta_label ?? undefined,
          isHomepageFeatured: features.includes(HOMEPAGE_FEATURE_MARKER),
        };

        if (baseProduct.isCustomizable && row.category === "Tables") {
          return {
            ...baseProduct,
            category: "Tables",
            isCustomizable: true,
            options: groupedOptions.get(row.id) ?? {
              Top: [],
              Legs: [],
              Base: [],
            },
          } as CustomizableTable;
        }

        return baseProduct;
      });

      setProducts(mappedProducts);
      setIsCatalogLoading(false);
    };

    void loadAdminCatalog();

    return () => {
      mounted = false;
    };
  }, [setProducts]);

  // Load tags and product-tag assignments
  useEffect(() => {
    const loadTags = async () => {
      const [{ data: tagRows }, { data: assignmentRows }] = await Promise.all([
        supabase.from("tags").select("*").order("name", { ascending: true }),
        supabase.from("product_tag_assignments").select("product_id, tag_id, tags(name)"),
      ]);

      if (tagRows) {
        setAllTags(tagRows.map((r: any) => ({ id: r.id, name: r.name })));
      }

      if (assignmentRows) {
        const pMap = new Map<string, string[]>();
        for (const a of assignmentRows) {
          const pid = a.product_id;
          const tagName = (a as any).tags?.name;
          if (!tagName) continue;
          if (!pMap.has(pid)) pMap.set(pid, []);
          pMap.get(pid)!.push(tagName);
        }
        setProductTagMap(pMap);
      }
    };
    void loadTags();
  }, []);

  const handleCreateTag = async () => {
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    const id = `tag-${trimmed.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const { error } = await supabase.from("tags").insert({ id, name: trimmed });
    if (error) {
      alert(`Failed to create tag: ${error.message}`);
      return;
    }
    setAllTags((prev) => [...prev, { id, name: trimmed }].sort((a, b) => a.name.localeCompare(b.name)));
    setNewTagName("");
  };

  const handleCreateTagInline = async (name: string, isEditing: boolean) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = `tag-${trimmed.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const { error } = await supabase.from("tags").insert({ id, name: trimmed });
    if (error) {
      alert(`Failed to create tag: ${error.message}`);
      return;
    }
    setAllTags((prev) => [...prev, { id, name: trimmed }].sort((a, b) => a.name.localeCompare(b.name)));
    
    // Automatically select it
    if (isEditing) {
      setEditTagIds((prev) => new Set([...prev, id]));
    } else {
      setNewProductTagIds((prev) => new Set([...prev, id]));
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    const confirmed = window.confirm("Delete this tag? It will be removed from all products.");
    if (!confirmed) return;
    const { error } = await supabase.from("tags").delete().eq("id", tagId);
    if (error) {
      alert(`Failed to delete tag: ${error.message}`);
      return;
    }
    setAllTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  const toggleEditTag = (tagId: string) => {
    setEditTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
  };

  const toggleNewProductTag = (tagId: string) => {
    setNewProductTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
  };

  const saveTagAssignments = async (productId: string, tagIds: Set<string>) => {
    // Delete existing assignments
    await supabase.from("product_tag_assignments").delete().eq("product_id", productId);
    // Insert new ones
    if (tagIds.size > 0) {
      const rows = Array.from(tagIds).map((tagId) => ({ product_id: productId, tag_id: tagId }));
      const { error } = await supabase.from("product_tag_assignments").insert(rows);
      if (error) {
        console.error("Failed to save tag assignments:", error.message);
      }
    }
    // Update local map
    const tagNames = Array.from(tagIds)
      .map((tid) => allTags.find((t) => t.id === tid)?.name)
      .filter(Boolean) as string[];
    setProductTagMap((prev) => {
      const next = new Map(prev);
      next.set(productId, tagNames);
      return next;
    });
  };

  const flash = (id: string) => {
    setSaveFlash(id);
    setTimeout(() => setSaveFlash(null), 1200);
  };

  const startEditing = async (p: Product | CustomizableTable) => {
    setEditingProduct(p.id);
    setEditImageFile(null);
    setFormState({
      name: p.name,
      description: p.description ?? "",
      dimensions: p.dimensions ?? "",
      basePrice: String(p.basePrice),
    });

    // Load existing Color/Size variations for this product
    const [{ data: existingOpts }, { data: existingTagAssignments }] = await Promise.all([
      supabase
        .from("table_options")
        .select("*")
        .eq("product_id", p.id)
        .in("option_group", ["Color", "Size"])
        .order("created_at", { ascending: true }),
      supabase
        .from("product_tag_assignments")
        .select("tag_id")
        .eq("product_id", p.id),
    ]);

    const colors: VariationEntry[] = [];
    const sizes: VariationEntry[] = [];
    for (const opt of existingOpts ?? []) {
      const entry: VariationEntry = {
        tempId: opt.id,
        name: opt.name,
        priceModifier: String(opt.price_modifier ?? 0),
        layerUrl: opt.layer_url ?? "",
        imageFile: null,
      };
      if (opt.option_group === "Color") colors.push(entry);
      else if (opt.option_group === "Size") sizes.push(entry);
    }

    setEditVariations({
      enableColors: colors.length > 0,
      enableSizes: sizes.length > 0,
      colors,
      sizes,
    });

    // Load existing tag assignments
    setEditTagIds(new Set((existingTagAssignments ?? []).map((a: any) => a.tag_id)));
  };

  const saveEditing = async () => {
    if (!editingProduct) return;

    const productToEdit = products.find((p) => p.id === editingProduct);
    if (!productToEdit) return;

    setSavingProductId(editingProduct);

    let imageUrl = productToEdit.image;

    // Upload new image if selected
    if (editImageFile) {
      setEditImageUploading(true);
      const fileExt = editImageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, editImageFile);

      if (uploadError) {
        setEditImageUploading(false);
        setSavingProductId(null);
        alert(`Failed to upload image: ${uploadError.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
      setEditImageUploading(false);
    }

    const nextBasePrice = Number(formState.basePrice) || 0;
    const payload = {
      id: productToEdit.id,
      name: formState.name.trim(),
      category: productToEdit.category,
      base_price: nextBasePrice,
      image: imageUrl,
      description: formState.description,
      dimensions: formState.dimensions,
      is_customizable: productToEdit.isCustomizable,
      features: Array.isArray(productToEdit.features)
        ? productToEdit.features
        : [],
      updated_at: new Date().toISOString(),
    };

    // Delay upsert to end to trigger realtime broadcast correctly after assignments save

    updateProduct(editingProduct, {
      name: payload.name,
      description: formState.description,
      dimensions: formState.dimensions,
      basePrice: nextBasePrice,
      image: imageUrl,
    });
    // ── Save variations ──
    await saveVariationsForProduct(editingProduct, editVariations);

    // ── Save tag assignments ──
    await saveTagAssignments(editingProduct, editTagIds);

    const { error: upsertError } = await supabase
      .from("products")
      .upsert(payload, { onConflict: "id" });

    if (upsertError) {
      setSavingProductId(null);
      alert(`Failed to save product: ${upsertError.message}`);
      return;
    }

    flash(editingProduct);
    setEditingProduct(null);
    setEditImageFile(null);
    setEditVariations(emptyVariationState);
    setEditTagIds(new Set());
    setSavingProductId(null);
  };

  /** Upload variation color images and upsert all Color/Size options */
  const saveVariationsForProduct = async (
    productId: string,
    vars: VariationState,
  ) => {
    // Delete existing Color/Size options for this product
    await supabase
      .from("table_options")
      .delete()
      .eq("product_id", productId)
      .in("option_group", ["Color", "Size"]);

    const rows: any[] = [];

    // Process colors
    if (vars.enableColors) {
      for (const entry of vars.colors) {
        if (!entry.name.trim()) continue;
        let layerUrl = entry.layerUrl;

        // Upload new image if provided
        if (entry.imageFile) {
          const fileExt = entry.imageFile.name.split(".").pop();
          const fileName = `var-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const { error: uploadErr } = await supabase.storage
            .from("product-images")
            .upload(fileName, entry.imageFile);
          if (!uploadErr) {
            const { data: urlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(fileName);
            layerUrl = urlData.publicUrl;
          }
        }

        rows.push({
          id: `opt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          product_id: productId,
          option_group: "Color",
          name: entry.name.trim(),
          price_modifier: Number(entry.priceModifier) || 0,
          layer_url: layerUrl || "",
          available: true,
        });
      }
    }

    // Process sizes
    if (vars.enableSizes) {
      for (const entry of vars.sizes) {
        if (!entry.name.trim()) continue;
        rows.push({
          id: `opt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          product_id: productId,
          option_group: "Size",
          name: entry.name.trim(),
          price_modifier: Number(entry.priceModifier) || 0,
          layer_url: "",
          available: true,
        });
      }
    }

    if (rows.length > 0) {
      const { error: insertErr } = await supabase
        .from("table_options")
        .insert(rows);
      if (insertErr) {
        console.error("Failed to save variations:", insertErr.message);
        alert(`Warning: product saved but variations failed: ${insertErr.message}`);
      }
    }
  };

  const handleDeleteProduct = async (p: Product | CustomizableTable) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${p.name}?`,
    );
    if (!confirmed) return;

    setDeletingProductId(p.id);

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", p.id);

    if (deleteError) {
      setDeletingProductId(null);
      alert(`Failed to delete product: ${deleteError.message}`);
      return;
    }

    removeProduct(p.id);
    setDeletingProductId(null);
  };

  const handlePriceModifierChange = async (
    productId: string,
    group: OptionGroup,
    optionId: string,
    nextPriceModifier: number,
  ) => {
    const normalized = Number.isFinite(nextPriceModifier)
      ? nextPriceModifier
      : 0;

    const { error: optionUpdateError } = await supabase
      .from("table_options")
      .update({ price_modifier: normalized })
      .eq("id", optionId)
      .eq("product_id", productId);

    if (optionUpdateError) {
      alert(`Failed to update price modifier: ${optionUpdateError.message}`);
      return;
    }

    updateTableOption(productId, group, optionId, {
      priceModifier: normalized,
    });
    flash(`${productId}-${optionId}`);
  };

  const handleOptionAvailabilityToggle = async (
    productId: string,
    group: OptionGroup,
    optionId: string,
    currentAvailable: boolean,
  ) => {
    const nextAvailable = !currentAvailable;

    const { error: availabilityError } = await supabase
      .from("table_options")
      .update({ available: nextAvailable })
      .eq("id", optionId)
      .eq("product_id", productId);

    if (availabilityError) {
      alert(`Failed to update availability: ${availabilityError.message}`);
      return;
    }

    updateTableOption(productId, group, optionId, {
      available: nextAvailable,
    });
    flash(optionId);
  };

  const handleAddProduct = async () => {
    if (!newProductState.name || !newProductState.imageFile) {
      alert("Please provide both a name and an image file.");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = newProductState.imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, newProductState.imageFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const newId = `prod-${Date.now()}`;
      const payload = {
        id: newId,
        name: newProductState.name.trim(),
        category: newProductState.category,
        base_price: Number(newProductState.basePrice) || 0,
        image: publicUrlData.publicUrl,
        description: newProductState.description,
        dimensions: newProductState.dimensions,
        is_customizable: false,
        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from("products")
        .insert(payload);

      if (insertError) {
        // Best-effort cleanup: avoid orphaned files when DB insert fails.
        await supabase.storage.from("product-images").remove([filePath]);
        throw insertError;
      }

      addProduct({
        id: newId,
        name: payload.name,
        description: newProductState.description,
        dimensions: newProductState.dimensions,
        basePrice: payload.base_price,
        category: newProductState.category,
        image: publicUrlData.publicUrl,
        isCustomizable: false,
        isHomepageFeatured: false,
      });

      // Save variations for the new product
      await saveVariationsForProduct(newId, newProductVariations);

      // Save tag assignments for the new product
      await saveTagAssignments(newId, newProductTagIds);

      setNewProductState({
        name: "",
        description: "",
        dimensions: "",
        basePrice: "",
        category: "Chairs",
        imageFile: null,
      });
      setNewProductVariations(emptyVariationState);
      setNewProductTagIds(new Set());
      setIsAddingProduct(false);
      flash(newId);
    } catch (err: any) {
      alert("Error adding product: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSeedStaticCatalog = async () => {
    setIsSeedingCatalog(true);

    try {
      const seedIds = STATIC_IMAGE_SEED_PRODUCTS.map((item) => item.id);
      const { data: existingRows, error: existingError } = await supabase
        .from("products")
        .select("id")
        .in("id", seedIds);

      if (existingError) {
        throw existingError;
      }

      const existingIds = new Set((existingRows ?? []).map((row) => row.id));
      const rowsToInsert = STATIC_IMAGE_SEED_PRODUCTS.filter(
        (row) => !existingIds.has(row.id),
      ).map((row) => ({
        ...row,
        is_customizable: false,
      }));

      if (rowsToInsert.length === 0) {
        alert("All static products already exist in the database.");
        return;
      }

      const { error: insertError } = await supabase
        .from("products")
        .insert(rowsToInsert);

      if (insertError) {
        throw insertError;
      }

      alert(
        `Added ${rowsToInsert.length} static products to the database. Reload the catalog pages to see them.`,
      );
    } catch (err: any) {
      alert(`Failed to seed static products: ${err.message}`);
    } finally {
      setIsSeedingCatalog(false);
    }
  };

  const isHomepageFeaturedFn = (p: Product | CustomizableTable) => {
    const fromFlag = p.isHomepageFeatured ?? false;
    const fromFeatures =
      Array.isArray(p.features) && p.features.includes(HOMEPAGE_FEATURE_MARKER);
    return fromFlag || fromFeatures;
  };

  const handleToggleHomepageFeature = async (
    p: Product | CustomizableTable,
  ) => {
    const currentFeatures = Array.isArray(p.features) ? p.features : [];
    const currentlyFeatured = isHomepageFeaturedFn(p);

    if (!currentlyFeatured) {
      const featuredCount = products.filter((item) =>
        isHomepageFeaturedFn(item),
      ).length;
      if (featuredCount >= MAX_HOMEPAGE_FEATURED) {
        alert(`You can only feature up to ${MAX_HOMEPAGE_FEATURED} products.`);
        return;
      }
    }

    const nextFeatures = currentlyFeatured
      ? currentFeatures.filter((f) => f !== HOMEPAGE_FEATURE_MARKER)
      : [...new Set([...currentFeatures, HOMEPAGE_FEATURE_MARKER])];

    const { data: updatedRows, error: updateError } = await supabase
      .from("products")
      .update({ features: nextFeatures })
      .eq("id", p.id)
      .select("id");

    if (updateError) {
      alert(`Failed to update homepage feature: ${updateError.message}`);
      return;
    }

    if (!updatedRows || updatedRows.length === 0) {
      alert(
        "Could not save homepage feature setting. Database update is blocked by RLS policy.",
      );
      return;
    }

    updateProduct(p.id, {
      isHomepageFeatured: !currentlyFeatured,
      features: nextFeatures,
    });
    flash(p.id);
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "prices", label: "Price Modifiers", icon: "₱" },
    { key: "availability", label: "Availability", icon: "◉" },
    { key: "content", label: "Content", icon: "✎" },
  ];

  /* ── Tag Manager Section (rendered inside Content tab) ── */
  const renderTagManager = () => (
    <SectionCard
      icon="🏷️"
      title="Tag Manager"
      description="Create and manage global tags for product filtering"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { void handleCreateTag(); } }}
          placeholder="New tag name..."
          className="flex-1 rounded-lg border border-[var(--border-card)] bg-[var(--bg-cream)] px-3 py-2 text-[13px] text-[var(--text-dark)] outline-none focus:border-[var(--primary)]"
        />
        <button
          type="button"
          onClick={() => { void handleCreateTag(); }}
          className="primary-btn text-[12px]"
        >
          + Add Tag
        </button>
      </div>
      {allTags.length === 0 ? (
        <p className="mt-3 text-[12px] text-[var(--text-mid)] italic">
          No tags yet. Create one above.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1.5 rounded-full border border-[var(--border-card)] bg-white px-3 py-1.5"
            >
              <span className="text-[12px] font-semibold text-[var(--text-dark)]">
                {tag.name}
              </span>
              <button
                type="button"
                onClick={() => { void handleDeleteTag(tag.id); }}
                className="text-[11px] font-bold text-red-400 hover:text-red-600 transition"
                title="Delete tag"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );

  const contentPages: { key: ContentPage; label: string; icon: string }[] = [
    { key: "home", label: "Home", icon: "🏠" },
    { key: "chairs", label: "Chairs", icon: "🪑" },
    { key: "tables", label: "Tables", icon: "🪵" },
    { key: "collections", label: "Collections", icon: "🎨" },
  ];

  /* Helper to create save handler for content fields */
  const makeFieldSaver = (page: string, section: string, key: string) => {
    return async (value: string) => {
      return await updateField(page, section, key, value);
    };
  };

  /* ── Add Product form (used in each page's product section) ── */
  const renderAddProductForm = (defaultCategory: "Chairs" | "Tables" | "Collections") => {
    if (!isAddingProduct) return null;

    // Sync category to default when opening
    if (newProductState.category !== defaultCategory && !newProductState.name) {
      setNewProductState((s) => ({ ...s, category: defaultCategory }));
    }

    return (
      <div ref={addFormRef} className="rounded-xl border border-green-300 bg-green-50/50 p-5 space-y-3">
        <h3 className="font-display text-[20px] text-green-800">
          Add New Product
        </h3>
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
            Name
          </label>
          <input
            type="text"
            value={newProductState.name}
            onChange={(e) =>
              setNewProductState((s) => ({ ...s, name: e.target.value }))
            }
            className="w-full rounded-lg border bg-white px-3 py-2 text-[14px] outline-none"
            placeholder="e.g. Modern Sofa"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
            Category
          </label>
          <select
            value={newProductState.category}
            onChange={(e) =>
              setNewProductState((s) => ({
                ...s,
                category: e.target.value as any,
              }))
            }
            className="w-full rounded-lg border bg-white px-3 py-2 text-[14px] outline-none"
          >
            <option value="Chairs">Chairs</option>
            <option value="Tables">Tables</option>
            <option value="Collections">Collections</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
            Description
          </label>
          <textarea
            value={newProductState.description}
            onChange={(e) =>
              setNewProductState((s) => ({
                ...s,
                description: e.target.value,
              }))
            }
            rows={2}
            className="w-full rounded-lg border bg-white px-3 py-2 text-[13px] outline-none resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
              Dimensions
            </label>
            <input
              type="text"
              value={newProductState.dimensions}
              onChange={(e) =>
                setNewProductState((s) => ({
                  ...s,
                  dimensions: e.target.value,
                }))
              }
              className="w-full rounded-lg border bg-white px-3 py-2 text-[13px] outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
              Base Price
            </label>
            <input
              type="number"
              value={newProductState.basePrice}
              onChange={(e) =>
                setNewProductState((s) => ({
                  ...s,
                  basePrice: e.target.value,
                }))
              }
              className="w-full rounded-lg border bg-white px-3 py-2 text-[13px] outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
            Image File
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProductState((s) => ({
                ...s,
                imageFile: e.target.files ? e.target.files[0] : null,
              }))
            }
            className="w-full rounded-lg border bg-white px-3 py-2 text-[13px] outline-none"
          />
        </div>

        {/* Tag Selector for new product */}
        <TagChipSelector
          allTags={allTags}
          selectedTagIds={newProductTagIds}
          onToggle={toggleNewProductTag}
          onCreateTag={(name) => handleCreateTagInline(name, false)}
        />

        {/* Variation Editor for new product */}
        <VariationEditor state={newProductVariations} onChange={setNewProductVariations} />

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => { void handleAddProduct(); }}
            disabled={isUploading}
            className="primary-btn text-[12px] bg-green-700 hover:bg-green-800 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Save Product"}
          </button>
          <button
            type="button"
            onClick={() => setIsAddingProduct(false)}
            className="secondary-btn text-[12px] bg-white"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6">
        <div>
          <h1 className="font-display text-[32px] text-[var(--text-dark)]">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-[13px] text-[var(--text-mid)]">
            Signed in as{" "}
            <span className="font-semibold text-[var(--primary)]">
              {adminEmail}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            LIVE
          </span>
          <button
            type="button"
            onClick={logout}
            className="secondary-btn text-[12px]"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {(["Chairs", "Tables", "Collections"] as const).map((cat) => (
          <div
            key={cat}
            className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 text-center"
          >
            <p className="text-[28px] font-bold text-[var(--text-dark)]">
              {products.filter((p) => p.category === cat).length}
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
              {cat}
            </p>
          </div>
        ))}
        <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 text-center">
          <p className="text-[28px] font-bold text-[var(--primary)]">
            {configurableTables.length}
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-mid)]">
            Configurable
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 border-b border-[var(--border-warm)] pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-t-lg border border-b-0 px-5 py-3 text-[13px] font-semibold transition ${
              activeTab === tab.key
                ? "border-[var(--border-card)] bg-[var(--bg-card)] text-[var(--text-dark)]"
                : "border-transparent text-[var(--text-mid)] hover:text-[var(--text-dark)]"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {isCatalogLoading && (
        <p className="text-[12px] text-[var(--text-mid)]">
          Syncing admin values from database...
        </p>
      )}

      {/* ═══ TAB: Price Modifiers ═══ */}
      {activeTab === "prices" && (
        <div className="space-y-6">
          <p className="text-[13px] text-[var(--text-mid)]">
            Adjust price modifiers for configurable table components. Changes
            reflect instantly on the storefront.
          </p>
          {configurableTables.map((table) => (
            <div
              key={table.id}
              className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5"
            >
              <h3 className="mb-4 font-display text-[20px] text-[var(--text-dark)]">
                {table.name}
                <span className="ml-2 text-[13px] font-normal text-[var(--text-mid)]">
                  Base: ₱{table.basePrice.toLocaleString()}
                </span>
              </h3>

              {(["Top", "Legs", "Base"] as const).map((group) => (
                <div key={group} className="mb-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
                    {group}
                  </p>
                  <div className="space-y-2">
                    {table.options[group].map((opt) => (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-4 rounded-lg border p-3 transition ${
                          saveFlash === `${table.id}-${opt.id}`
                            ? "border-green-400 bg-green-50"
                            : "border-[var(--border-card)] bg-white"
                        }`}
                      >
                        <span className="min-w-[140px] text-[13px] font-semibold text-[var(--text-dark)]">
                          {opt.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-[var(--text-mid)]">
                            +₱
                          </span>
                          <input
                            type="number"
                            value={opt.priceModifier}
                            onChange={(e) => {
                              void handlePriceModifierChange(
                                table.id,
                                group,
                                opt.id,
                                Number(e.target.value) || 0,
                              );
                            }}
                            className="w-24 rounded-lg border border-[var(--border-card)] bg-[var(--bg-cream)] px-3 py-1.5 text-[14px] font-semibold text-[var(--text-dark)] outline-none focus:border-[var(--primary)]"
                            min="0"
                            step="50"
                          />
                        </div>
                        <span
                          className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            (opt.available ?? true)
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {(opt.available ?? true)
                            ? "AVAILABLE"
                            : "UNAVAILABLE"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ═══ TAB: Availability ═══ */}
      {activeTab === "availability" && (
        <div className="space-y-6">
          <p className="text-[13px] text-[var(--text-mid)]">
            Toggle component availability. Unavailable components are greyed out
            on the storefront configurator.
          </p>
          {configurableTables.map((table) => (
            <div
              key={table.id}
              className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5"
            >
              <h3 className="mb-4 font-display text-[20px] text-[var(--text-dark)]">
                {table.name}
              </h3>

              {(["Top", "Legs", "Base"] as const).map((group) => (
                <div key={group} className="mb-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
                    {group}
                  </p>
                  <div className="space-y-2">
                    {table.options[group].map((opt) => {
                      const isAvailable = opt.available ?? true;
                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center justify-between gap-4 rounded-lg border p-3 transition ${
                            saveFlash === opt.id
                              ? isAvailable
                                ? "border-green-400 bg-green-50"
                                : "border-red-300 bg-red-50"
                              : "border-[var(--border-card)] bg-white"
                          }`}
                        >
                          <div>
                            <span className="text-[14px] font-semibold text-[var(--text-dark)]">
                              {opt.name}
                            </span>
                            {opt.priceModifier > 0 && (
                              <span className="ml-2 text-[12px] text-[var(--text-mid)]">
                                (+₱{opt.priceModifier.toLocaleString()})
                              </span>
                            )}
                            {opt.incompatibleWith &&
                              opt.incompatibleWith.length > 0 && (
                                <span className="ml-2 text-[11px] text-amber-600">
                                  ⚠ Has compatibility restrictions
                                </span>
                              )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              void handleOptionAvailabilityToggle(
                                table.id,
                                group,
                                opt.id,
                                isAvailable,
                              );
                            }}
                            className={`relative h-7 w-12 rounded-full transition-colors ${
                              isAvailable ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                                isAvailable ? "left-[22px]" : "left-0.5"
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ═══ TAB: Content Editor ═══ */}
      {activeTab === "content" && (
        <div className="space-y-6">
          {/* Content sub-navigation */}
          <div className="flex flex-wrap gap-2">
            {contentPages.map((cp) => (
              <button
                key={cp.key}
                type="button"
                onClick={() => {
                  setContentPage(cp.key);
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition ${
                  contentPage === cp.key
                    ? "bg-[var(--text-dark)] text-white shadow-md"
                    : "bg-white border border-[var(--border-card)] text-[var(--text-mid)] hover:text-[var(--text-dark)] hover:border-[var(--text-dark)]"
                }`}
              >
                <span>{cp.icon}</span>
                {cp.label}
              </button>
            ))}
          </div>

          {/* Page loading state */}
          {pageContent.isLoading && (
            <p className="text-[12px] text-[var(--text-mid)]">
              Loading page content...
            </p>
          )}

          {/* ─── HOME PAGE ─── */}
          {contentPage === "home" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-[24px] text-[var(--text-dark)]">
                    Home Page Content
                  </h2>
                  <p className="text-[12px] text-[var(--text-mid)]">
                    Configure all text and images on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSeedStaticCatalog}
                  disabled={isSeedingCatalog}
                  className="secondary-btn text-[12px]"
                >
                  {isSeedingCatalog
                    ? "Seeding DB..."
                    : "Seed Static Images to DB"}
                </button>
              </div>

              {/* Tag Manager */}
              {renderTagManager()}

              {/* Hero Section */}
              <SectionCard
                icon="🎯"
                title="Hero Section"
                description="The main landing area visitors see first"
              >
                <SectionFieldEditor
                  label="Eyebrow Text"
                  hint="Small text above the title"
                  value={getField("home", "hero", "eyebrow", "A New Way to Sit")}
                  onSave={makeFieldSaver("home", "hero", "eyebrow")}
                />
                <SectionFieldEditor
                  label="Title"
                  hint="Main heading text"
                  value={getField("home", "hero", "title", "Sculpting")}
                  onSave={makeFieldSaver("home", "hero", "title")}
                />
                <SectionFieldEditor
                  label="Italic Accent"
                  hint="Styled italic word in the heading"
                  value={getField("home", "hero", "italic", "Silence")}
                  onSave={makeFieldSaver("home", "hero", "italic")}
                />
                <SectionFieldEditor
                  label="Description"
                  hint="Paragraph below the heading"
                  value={getField("home", "hero", "description", "Discover the harmony between form and living craft. Every piece is designed to bring a sense of quiet permanence to your contemporary sanctuary.")}
                  type="textarea"
                  onSave={makeFieldSaver("home", "hero", "description")}
                />
                <div className="grid grid-cols-2 gap-3">
                  <SectionFieldEditor
                    label="Button 1 Label"
                    hint="Primary CTA"
                    value={getField("home", "hero", "btn1_label", "Explore the Collection")}
                    onSave={makeFieldSaver("home", "hero", "btn1_label")}
                  />
                  <SectionFieldEditor
                    label="Button 2 Label"
                    hint="Secondary CTA"
                    value={getField("home", "hero", "btn2_label", "Our Story")}
                    onSave={makeFieldSaver("home", "hero", "btn2_label")}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <SectionImageEditor
                    label="Hero Image 1"
                    hint="Large background image (right side)"
                    currentUrl={getField("home", "hero", "image1", "/images/wooden-cabinet.png")}
                    onSave={makeFieldSaver("home", "hero", "image1")}
                  />
                  <SectionImageEditor
                    label="Hero Image 2"
                    hint="Small overlapping image (left side)"
                    currentUrl={getField("home", "hero", "image2", "/images/chair-sage.png")}
                    onSave={makeFieldSaver("home", "hero", "image2")}
                  />
                </div>
              </SectionCard>

              {/* Curator's Pick */}
              <SectionCard
                icon="⭐"
                title="Curator's Pick Section"
                description="Featured products grid — toggle products from their cards below"
              >
                <SectionFieldEditor
                  label="Eyebrow Text"
                  hint="Small text above the section title"
                  value={getField("home", "curators_pick", "eyebrow", "a daily focus on modern, distinctive classics, handcrafted furniture and more.")}
                  type="textarea"
                  onSave={makeFieldSaver("home", "curators_pick", "eyebrow")}
                />
                <SectionFieldEditor
                  label="Section Title"
                  hint="Heading for the featured products"
                  value={getField("home", "curators_pick", "title", "The Digital Curator's Pick")}
                  onSave={makeFieldSaver("home", "curators_pick", "title")}
                />
              </SectionCard>

              {/* Honest Materials */}
              <SectionCard
                icon="🌿"
                title="Honest Materials Section"
                description="Brand story section with image and quote"
              >
                <SectionFieldEditor
                  label="Title"
                  hint="Main heading text"
                  value={getField("home", "honest_materials", "title", "Honest Materials.")}
                  onSave={makeFieldSaver("home", "honest_materials", "title")}
                />
                <SectionFieldEditor
                  label="Italic Accent"
                  hint="Styled italic text in heading"
                  value={getField("home", "honest_materials", "italic", "Eternal Design.")}
                  onSave={makeFieldSaver("home", "honest_materials", "italic")}
                />
                <SectionFieldEditor
                  label="Description"
                  hint="Primary paragraph"
                  value={getField("home", "honest_materials", "description", "We believe furniture should tell a story worth repeating. In a world of disposable convenience, our \"Honest Material\" movement — where the wood grain is embraced and the visible construction provides testament to the artisan's touch.")}
                  type="textarea"
                  onSave={makeFieldSaver("home", "honest_materials", "description")}
                />
                <SectionFieldEditor
                  label="Secondary Description"
                  hint="Second paragraph below"
                  value={getField("home", "honest_materials", "description2", "Every piece at Furniture Odyssey is crafted to ensure the finest for us, preserving all of nature's warmth for your home's next chapter.")}
                  type="textarea"
                  onSave={makeFieldSaver("home", "honest_materials", "description2")}
                />
                <SectionFieldEditor
                  label="Button Label"
                  hint="Link text at the bottom"
                  value={getField("home", "honest_materials", "btn_label", "Browse the Craftsmanship →")}
                  onSave={makeFieldSaver("home", "honest_materials", "btn_label")}
                />
                <SectionFieldEditor
                  label="Floating Quote"
                  hint="Quote card overlaying the image"
                  value={getField("home", "honest_materials", "quote", "Every grain tells a story of patient hands.")}
                  onSave={makeFieldSaver("home", "honest_materials", "quote")}
                />
                <SectionImageEditor
                  label="Section Image"
                  hint="Craftsman/material photo"
                  currentUrl={getField("home", "honest_materials", "image", "/images/craftsman.png")}
                  onSave={makeFieldSaver("home", "honest_materials", "image")}
                />
              </SectionCard>

              {/* Featured Story */}
              <SectionCard
                icon="📖"
                title="Featured Story Section"
                description="Bottom editorial with image"
              >
                <SectionFieldEditor
                  label="Eyebrow Text"
                  hint="Small label above heading"
                  value={getField("home", "featured_story", "eyebrow", "Featured Story")}
                  onSave={makeFieldSaver("home", "featured_story", "eyebrow")}
                />
                <SectionFieldEditor
                  label="Title"
                  hint="Main heading"
                  value={getField("home", "featured_story", "title", "From Workshop")}
                  onSave={makeFieldSaver("home", "featured_story", "title")}
                />
                <SectionFieldEditor
                  label="Italic Accent"
                  hint="Styled italic portion"
                  value={getField("home", "featured_story", "italic", "to Sanctuary")}
                  onSave={makeFieldSaver("home", "featured_story", "italic")}
                />
                <SectionFieldEditor
                  label="Description"
                  hint="Body text"
                  value={getField("home", "featured_story", "description", "Follow the journey of a single slab of oak as it transforms from raw timber into a dining table designed to last for generations.")}
                  type="textarea"
                  onSave={makeFieldSaver("home", "featured_story", "description")}
                />
                <SectionFieldEditor
                  label="Button Label"
                  hint="Link text"
                  value={getField("home", "featured_story", "btn_label", "Read the Story →")}
                  onSave={makeFieldSaver("home", "featured_story", "btn_label")}
                />
                <SectionImageEditor
                  label="Section Image"
                  hint="Editorial photo (left side)"
                  currentUrl={getField("home", "featured_story", "image", "/images/modern-sideboard.png")}
                  onSave={makeFieldSaver("home", "featured_story", "image")}
                />
              </SectionCard>
            </div>
          )}

          {/* ─── CHAIRS PAGE ─── */}
          {contentPage === "chairs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-[24px] text-[var(--text-dark)]">
                    Chairs Page Content
                  </h2>
                  <p className="text-[12px] text-[var(--text-mid)]">
                    Configure the chairs page hero and manage chair products.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewProductState((s) => ({ ...s, category: "Chairs" }));
                    setIsAddingProduct(true);
                  }}
                  className="primary-btn text-[12px]"
                >
                  + Add Chair
                </button>
              </div>

              {/* Hero Section */}
              <SectionCard
                icon="🎯"
                title="Hero Section"
                description="Top area of the chairs page"
              >
                <SectionFieldEditor
                  label="Eyebrow Text"
                  hint="Small text above title"
                  value={getField("chairs", "hero", "eyebrow", "The Seat You Deserve")}
                  onSave={makeFieldSaver("chairs", "hero", "eyebrow")}
                />
                <SectionFieldEditor
                  label="Title"
                  hint="Main heading"
                  value={getField("chairs", "hero", "title", "Sculpted")}
                  onSave={makeFieldSaver("chairs", "hero", "title")}
                />
                <SectionFieldEditor
                  label="Italic Accent"
                  hint="Styled italic word"
                  value={getField("chairs", "hero", "italic", "Comfort.")}
                  onSave={makeFieldSaver("chairs", "hero", "italic")}
                />
                <SectionFieldEditor
                  label="Description"
                  hint="Paragraph below heading"
                  value={getField("chairs", "hero", "description", "Discover sculpted silhouettes, classic designs and tactile fabrics — from artisanal studios to your sanctuary. In a chair, every piece is a sanctuary of its own.")}
                  type="textarea"
                  onSave={makeFieldSaver("chairs", "hero", "description")}
                />
              </SectionCard>

              {/* Products */}
              <SectionCard
                icon="🛋️"
                title="Chair Products"
                description="All chairs in the catalog"
              >
                {renderAddProductForm("Chairs")}
                <ProductListSection
                  category="Chairs"
                  products={allProducts}
                  editingProduct={editingProduct}
                  formState={formState}
                  setFormState={setFormState}
                  savingProductId={savingProductId}
                  deletingProductId={deletingProductId}
                  saveFlash={saveFlash}
                  onStartEditing={startEditing}
                  onSaveEditing={saveEditing}
                  onCancelEditing={() => {
                    setEditingProduct(null);
                    setEditImageFile(null);
                  }}
                  onDeleteProduct={handleDeleteProduct}
                  onToggleHomepageFeature={handleToggleHomepageFeature}
                  isHomepageFeatured={isHomepageFeaturedFn}
                  editImageFile={editImageFile}
                  setEditImageFile={setEditImageFile}
                  editImageUploading={editImageUploading}
                  editVariations={editVariations}
                  setEditVariations={setEditVariations}
                  allTags={allTags}
                  editTagIds={editTagIds}
                  onToggleEditTag={toggleEditTag}
                  productTagMap={productTagMap}
                  onCreateTag={(name) => handleCreateTagInline(name, true)}
                />
              </SectionCard>
            </div>
          )}

          {/* ─── TABLES PAGE ─── */}
          {contentPage === "tables" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-[24px] text-[var(--text-dark)]">
                    Tables Page Content
                  </h2>
                  <p className="text-[12px] text-[var(--text-mid)]">
                    Configure the tables page hero, catalog section, and manage table products.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewProductState((s) => ({ ...s, category: "Tables" }));
                    setIsAddingProduct(true);
                  }}
                  className="primary-btn text-[12px]"
                >
                  + Add Table
                </button>
              </div>

              {/* Hero Section */}
              <SectionCard
                icon="🎯"
                title="Hero Section"
                description="Full-width hero with background image and overlay text"
              >
                <SectionFieldEditor
                  label="Eyebrow Text"
                  hint="Small text above title"
                  value={getField("tables", "hero", "eyebrow", "The Custom Collection")}
                  onSave={makeFieldSaver("tables", "hero", "eyebrow")}
                />
                <SectionFieldEditor
                  label="Title"
                  hint="Main heading"
                  value={getField("tables", "hero", "title", "Gathering")}
                  onSave={makeFieldSaver("tables", "hero", "title")}
                />
                <SectionFieldEditor
                  label="Italic Accent"
                  hint="Styled italic word"
                  value={getField("tables", "hero", "italic", "Redefined.")}
                  onSave={makeFieldSaver("tables", "hero", "italic")}
                />
                <SectionFieldEditor
                  label="Description"
                  hint="Body text overlay"
                  value={getField("tables", "hero", "description", "Crafted from solid oak and steel married, our tables are built to be the heart of your home. Turn every deliberation to your sanctuary.")}
                  type="textarea"
                  onSave={makeFieldSaver("tables", "hero", "description")}
                />
                <SectionFieldEditor
                  label="Button Label"
                  hint="CTA button on hero"
                  value={getField("tables", "hero", "btn_label", "Start Gathering")}
                  onSave={makeFieldSaver("tables", "hero", "btn_label")}
                />
                <SectionFieldEditor
                  label="Floating Quote"
                  hint="Quote card in bottom-right of hero"
                  value={getField("tables", "hero", "quote", "Every chair follows a table worth sitting around.")}
                  onSave={makeFieldSaver("tables", "hero", "quote")}
                />
                <SectionImageEditor
                  label="Hero Background Image"
                  hint="Full-width background photo"
                  currentUrl={getField("tables", "hero", "image", "/images/wood-grain.png")}
                  onSave={makeFieldSaver("tables", "hero", "image")}
                />
              </SectionCard>

              {/* Curated Catalog */}
              <SectionCard
                icon="📋"
                title="Curated Catalog Section"
                description="Section heading above the product grid"
              >
                <SectionFieldEditor
                  label="Section Title"
                  hint="Heading above the catalog grid"
                  value={getField("tables", "catalog", "title", "Curated Catalog")}
                  onSave={makeFieldSaver("tables", "catalog", "title")}
                />
              </SectionCard>

              {/* Products */}
              <SectionCard
                icon="🪵"
                title="Table Products"
                description="All tables in the catalog"
              >
                {renderAddProductForm("Tables")}
                <ProductListSection
                  category="Tables"
                  products={allProducts}
                  editingProduct={editingProduct}
                  formState={formState}
                  setFormState={setFormState}
                  savingProductId={savingProductId}
                  deletingProductId={deletingProductId}
                  saveFlash={saveFlash}
                  onStartEditing={startEditing}
                  onSaveEditing={saveEditing}
                  onCancelEditing={() => {
                    setEditingProduct(null);
                    setEditImageFile(null);
                  }}
                  onDeleteProduct={handleDeleteProduct}
                  onToggleHomepageFeature={handleToggleHomepageFeature}
                  isHomepageFeatured={isHomepageFeaturedFn}
                  editImageFile={editImageFile}
                  setEditImageFile={setEditImageFile}
                  editImageUploading={editImageUploading}
                  editVariations={editVariations}
                  setEditVariations={setEditVariations}
                  allTags={allTags}
                  editTagIds={editTagIds}
                  onToggleEditTag={toggleEditTag}
                  productTagMap={productTagMap}
                  onCreateTag={(name) => handleCreateTagInline(name, true)}
                />
              </SectionCard>
            </div>
          )}

          {/* ─── COLLECTIONS PAGE ─── */}
          {contentPage === "collections" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-[24px] text-[var(--text-dark)]">
                    Collections Page Content
                  </h2>
                  <p className="text-[12px] text-[var(--text-mid)]">
                    Configure the collections page hero and manage collection items.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewProductState((s) => ({ ...s, category: "Collections" }));
                    setIsAddingProduct(true);
                  }}
                  className="primary-btn text-[12px]"
                >
                  + Add Collection Item
                </button>
              </div>

              {/* Hero Section */}
              <SectionCard
                icon="🎯"
                title="Hero Section"
                description="Top area of the collections page"
              >
                <SectionFieldEditor
                  label="Title"
                  hint="Main heading"
                  value={getField("collections", "hero", "title", "Curating Your")}
                  onSave={makeFieldSaver("collections", "hero", "title")}
                />
                <SectionFieldEditor
                  label="Italic Accent"
                  hint="Styled italic word"
                  value={getField("collections", "hero", "italic", "Sanctuary")}
                  onSave={makeFieldSaver("collections", "hero", "italic")}
                />
                <SectionFieldEditor
                  label="Description"
                  hint="Body text below heading"
                  value={getField("collections", "hero", "description", "Explore our latest ensemble of curated finished pieces, designed to bring quiet elegance and enduring warmth. A luxury curation of your home.")}
                  type="textarea"
                  onSave={makeFieldSaver("collections", "hero", "description")}
                />
                <SectionFieldEditor
                  label="Button Label"
                  hint="CTA button"
                  value={getField("collections", "hero", "btn_label", "View Catalog")}
                  onSave={makeFieldSaver("collections", "hero", "btn_label")}
                />
              </SectionCard>

              {/* Products */}
              <SectionCard
                icon="🎨"
                title="Collection Products"
                description="All items in the collections catalog"
              >
                {renderAddProductForm("Collections")}
                <ProductListSection
                  category="Collections"
                  products={allProducts}
                  editingProduct={editingProduct}
                  formState={formState}
                  setFormState={setFormState}
                  savingProductId={savingProductId}
                  deletingProductId={deletingProductId}
                  saveFlash={saveFlash}
                  onStartEditing={startEditing}
                  onSaveEditing={saveEditing}
                  onCancelEditing={() => {
                    setEditingProduct(null);
                    setEditImageFile(null);
                  }}
                  onDeleteProduct={handleDeleteProduct}
                  onToggleHomepageFeature={handleToggleHomepageFeature}
                  isHomepageFeatured={isHomepageFeaturedFn}
                  editImageFile={editImageFile}
                  setEditImageFile={setEditImageFile}
                  editImageUploading={editImageUploading}
                  editVariations={editVariations}
                  setEditVariations={setEditVariations}
                  allTags={allTags}
                  editTagIds={editTagIds}
                  onToggleEditTag={toggleEditTag}
                  productTagMap={productTagMap}
                  onCreateTag={(name) => handleCreateTagInline(name, true)}
                />
              </SectionCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
