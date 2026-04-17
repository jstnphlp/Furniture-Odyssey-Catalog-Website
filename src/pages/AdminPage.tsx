import { useState, useMemo } from "react";
import { createClient } from "../lib/client";
import { useAdminStore } from "../stores/useAdminStore";

const supabase = createClient();
import { useCatalogStore } from "../stores/useCatalogStore";
import { isCustomizableTable } from "../types/catalog";
import type { Product, CustomizableTable } from "../types/catalog";

type Tab = "prices" | "availability" | "content";

export function AdminPage() {
  const adminEmail = useAdminStore((s) => s.adminEmail);
  const logout = useAdminStore((s) => s.logout);
  const products = useCatalogStore((s) => s.products);
  const addProduct = useCatalogStore((s) => s.addProduct);
  const removeProduct = useCatalogStore((s) => s.removeProduct);
  const updateProduct = useCatalogStore((s) => s.updateProduct);
  const updateTableOption = useCatalogStore((s) => s.updateTableOption);
  const toggleOptionAvailability = useCatalogStore(
    (s) => s.toggleOptionAvailability,
  );

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formState, setFormState] = useState<{
    name: string;
    description: string;
    dimensions: string;
    basePrice: string;
  }>({ name: "", description: "", dimensions: "", basePrice: "" });
  const [saveFlash, setSaveFlash] = useState<string | null>(null);

  const configurableTables = useMemo(
    () => products.filter(isCustomizableTable) as CustomizableTable[],
    [products],
  );

  const allProducts = products;

  const flash = (id: string) => {
    setSaveFlash(id);
    setTimeout(() => setSaveFlash(null), 1200);
  };

  const startEditing = (p: Product | CustomizableTable) => {
    setEditingProduct(p.id);
    setFormState({
      name: p.name,
      description: p.description ?? "",
      dimensions: p.dimensions ?? "",
      basePrice: String(p.basePrice),
    });
  };

  const saveEditing = () => {
    if (!editingProduct) return;
    updateProduct(editingProduct, {
      name: formState.name,
      description: formState.description,
      dimensions: formState.dimensions,
      basePrice: Number(formState.basePrice) || 0,
    });
    flash(editingProduct);
    setEditingProduct(null);
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
      addProduct({
        id: newId,
        name: newProductState.name,
        description: newProductState.description,
        dimensions: newProductState.dimensions,
        basePrice: Number(newProductState.basePrice) || 0,
        category: newProductState.category,
        image: publicUrlData.publicUrl,
        isCustomizable: false,
        isHomepageFeatured: false,
      });

      setNewProductState({
        name: "",
        description: "",
        dimensions: "",
        basePrice: "",
        category: "Chairs",
        imageFile: null,
      });
      setIsAddingProduct(false);
      flash(newId);
    } catch (err: any) {
      alert("Error adding product: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "prices", label: "Price Modifiers", icon: "₱" },
    { key: "availability", label: "Availability", icon: "◉" },
    { key: "content", label: "Content", icon: "✎" },
  ];

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
                              updateTableOption(table.id, group, opt.id, {
                                priceModifier: Number(e.target.value) || 0,
                              });
                              flash(`${table.id}-${opt.id}`);
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
                              toggleOptionAvailability(table.id, group, opt.id);
                              flash(opt.id);
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-[var(--text-mid)]">
              Edit product name, description, dimensions, and base price.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const images = [
                    "chair-artisan-lounge.png",
                    "chair-modern-dining.png",
                    "chair-sage.png",
                    "cloud-modular.png",
                    "console-table.png",
                    "craftsman.png",
                    "dining-chair.png",
                    "ember-lounge.png",
                    "hero-chair.png",
                    "hero-table.png",
                    "modern-sideboard.png",
                    "pedestal-table.png",
                    "portrait-art.png",
                    "shelf-decor.png",
                    "white-stool.png",
                    "wooden-cabinet.png"
                  ];
                  let added = 0;
                  images.forEach((img, i) => {
                    // Skip if already in the products list
                    if (products.some(p => p.image.includes(img))) return;
                    
                    const name = img.split('.')[0].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    const isChair = name.toLowerCase().includes('chair') || name.toLowerCase().includes('lounge') || name.toLowerCase().includes('stool');
                    const isTable = name.toLowerCase().includes('table') || name.toLowerCase().includes('sideboard') || name.toLowerCase().includes('cabinet');
                    
                    addProduct({
                      id: `seed-${Date.now()}-${i}`,
                      name: name,
                      description: `Imported from local files`,
                      dimensions: "Standard",
                      basePrice: 299 + i * 50,
                      category: isChair ? 'Chairs' : isTable ? 'Tables' : 'Collections',
                      image: `/images/${img}`,
                      isCustomizable: false,
                      isHomepageFeatured: false,
                    });
                    added++;
                  });
                  alert(`Imported ${added} new local image products!`);
                }}
                className="secondary-btn text-[12px]"
              >
                Import Local Images
              </button>
              <button
                type="button"
                onClick={() => setIsAddingProduct(true)}
                className="primary-btn text-[12px]"
              >
                + Add Product
              </button>
            </div>
          </div>

          {isAddingProduct && (
            <div className="rounded-xl border border-green-300 bg-green-50/50 p-5 space-y-3">
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
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddProduct}
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
          )}

          {allProducts.map((p) => {
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
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[16px] font-semibold text-[var(--text-dark)]">
                            {p.name}
                          </h3>
                          <span className="rounded-full bg-[var(--bg-cream)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--text-mid)]">
                            {p.category}
                          </span>
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
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditing(p)}
                          className="secondary-btn shrink-0 text-[12px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete ${p.name}?`,
                              )
                            ) {
                              removeProduct(p.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 text-[11px] font-bold uppercase tracking-wider text-right"
                        >
                          Delete
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
                          updateProduct(p.id, {
                            isHomepageFeatured: !p.isHomepageFeatured,
                          });
                          flash(p.id);
                        }}
                        className={`relative h-6 w-10 rounded-full transition-colors ${
                          p.isHomepageFeatured ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            p.isHomepageFeatured ? "left-[18px]" : "left-[2px]"
                          }`}
                        />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
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
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveEditing}
                        className="primary-btn text-[12px]"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
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
      )}
    </div>
  );
}
