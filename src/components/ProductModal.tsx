import { useState, useEffect, useLayoutEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import type { Product, CustomizableTable, TableOption, ProductVariations } from "../types/catalog";
import { useCartStore } from "../stores/useCartStore";

const PRODUCT_IMAGE_PLACEHOLDER = "/images/wooden-cabinet.png";

const hasValidImageUrl = (url?: string | null) => Boolean(url?.trim());

const preloadImage = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Unable to preload image: ${src}`));
    image.src = src;
  });

export interface ProductModalData {
  product: Product | CustomizableTable;
  variations: ProductVariations;
}

interface ProductModalProps {
  data: ProductModalData | null;
  onClose: () => void;
}

export function ProductModal({ data, onClose }: ProductModalProps) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayImage, setDisplayImage] = useState<string>("");
  const [displayImageProductId, setDisplayImageProductId] = useState<string | null>(null);
  const [imageTransition, setImageTransition] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(() => new Set());

  const product = data?.product ?? null;
  const productImages = useMemo(() => product?.images ?? [], [product?.images]);
  const productColorVariants = useMemo(
    () => product?.colorVariants?.filter((variant) => variant.isActive) ?? [],
    [product?.colorVariants],
  );
  const catalogueColorOptions = useMemo(
    () =>
      productColorVariants.map((variant) => {
        const previewImage =
          productImages.find((image) => image.colorVariantId === variant.id)?.secureUrl ?? "";

        return {
          id: variant.id,
          name: variant.name,
          priceModifier: 0,
          layerUrl: previewImage,
          hex: variant.hex,
        };
      }),
    [productColorVariants, productImages],
  );
  const colorOptions =
    data?.variations.colorOptions.length ? data.variations.colorOptions : catalogueColorOptions;
  const sizeOptions = data?.variations.sizeOptions ?? [];

  const hasColors = colorOptions.length > 0;
  const hasSizes = sizeOptions.length > 0;

  // Reset selections when product changes
  useEffect(() => {
    if (!product) return;
    setDisplayImage("");
    setDisplayImageProductId(null);
    setImageTransition(false);
    setCurrentImageIndex(0);
    setFailedImageIds(new Set());
    // Don't auto-select — let user choose explicitly
    setSelectedColorId(null);
    setSelectedSizeId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const validImages = useMemo(
    () =>
      productImages.filter(
        (image) => hasValidImageUrl(image.secureUrl) && !failedImageIds.has(image.id),
      ),
    [failedImageIds, productImages],
  );
  const generalImages = useMemo(
    () => validImages.filter((image) => !image.colorVariantId),
    [validImages],
  );
  const selectedColorImages = useMemo(
    () =>
      selectedColorId
        ? validImages.filter((image) => image.colorVariantId === selectedColorId)
        : [],
    [selectedColorId, validImages],
  );
  const fallbackImageArray = useMemo(
    () => {
      if (!product) return [];

      const fallbackUrl = hasValidImageUrl(product.image)
        ? product.image.trim()
        : PRODUCT_IMAGE_PLACEHOLDER;

      return [
        {
          id: `${product.id}-fallback`,
          productId: product.id,
          colorVariantId: null,
          secureUrl: fallbackUrl,
          altText: product.name,
          sortOrder: 0,
          isPrimary: true,
        },
      ];
    },
    [product],
  );
  const activeImages =
    selectedColorImages.length > 0
      ? selectedColorImages
      : generalImages.length > 0
        ? generalImages
        : fallbackImageArray;
  const currentImage = activeImages[currentImageIndex] ?? activeImages[0] ?? null;
  const currentImageUrl =
    currentImage?.secureUrl?.trim() ||
    (hasValidImageUrl(product?.image) ? product!.image.trim() : PRODUCT_IMAGE_PLACEHOLDER);
  const currentImageAlt = currentImage?.altText ?? product?.name ?? "Product image";
  const imageSrc =
    displayImageProductId === product?.id && displayImage ? displayImage : currentImageUrl;
  const showImageArrows = activeImages.length > 1;

  useEffect(() => {
    if (currentImageIndex < activeImages.length) return;
    setCurrentImageIndex(0);
  }, [activeImages.length, currentImageIndex]);

  const switchToImage = useCallback(
    async (nextIndex: number, nextImages = activeImages) => {
      const nextImage = nextImages[nextIndex] ?? nextImages[0];
      const nextImageUrl =
        nextImage?.secureUrl?.trim() ||
        (hasValidImageUrl(product?.image) ? product!.image.trim() : PRODUCT_IMAGE_PLACEHOLDER);

      if (nextImageUrl === imageSrc && nextIndex === currentImageIndex) return;

      try {
        await preloadImage(nextImageUrl);
      } catch {
        if (nextImage && !nextImage.id.endsWith("-fallback")) {
          setFailedImageIds((failedIds) => {
            const nextFailedIds = new Set(failedIds);
            nextFailedIds.add(nextImage.id);
            return nextFailedIds;
          });
        }
      }

      setCurrentImageIndex(nextIndex);
      setDisplayImage(nextImageUrl);
      setDisplayImageProductId(product?.id ?? null);
      setImageTransition(true);
      window.setTimeout(() => setImageTransition(false), 120);
    },
    [activeImages, currentImageIndex, imageSrc, product],
  );

  // Handle color selection → image switch (toggle off if already selected)
  const handleColorSelect = useCallback(
    (option: TableOption) => {
      const isDeselecting = selectedColorId === option.id;
      const nextSelectedColorId = isDeselecting ? null : option.id;
      const nextSelectedColorImages = nextSelectedColorId
        ? validImages.filter((image) => image.colorVariantId === nextSelectedColorId)
        : [];
      const nextActiveImages =
        nextSelectedColorImages.length > 0
          ? nextSelectedColorImages
          : generalImages.length > 0
            ? generalImages
            : fallbackImageArray;

      setSelectedColorId(nextSelectedColorId);
      setCurrentImageIndex(0);
      void switchToImage(0, nextActiveImages);
    },
    [fallbackImageArray, generalImages, selectedColorId, switchToImage, validImages],
  );

  const goPreviousImage = useCallback(() => {
    if (activeImages.length <= 1) return;
    const nextIndex = currentImageIndex === 0 ? activeImages.length - 1 : currentImageIndex - 1;
    void switchToImage(nextIndex);
  }, [activeImages.length, currentImageIndex, switchToImage]);

  const goNextImage = useCallback(() => {
    if (activeImages.length <= 1) return;
    const nextIndex = currentImageIndex === activeImages.length - 1 ? 0 : currentImageIndex + 1;
    void switchToImage(nextIndex);
  }, [activeImages.length, currentImageIndex, switchToImage]);

  const handleImageError = useCallback(() => {
    if (currentImage && currentImage.id.endsWith("-fallback")) {
      setDisplayImage(PRODUCT_IMAGE_PLACEHOLDER);
      setDisplayImageProductId(product?.id ?? null);
      return;
    }

    if (currentImage) {
      setFailedImageIds((failedIds) => {
        const nextFailedIds = new Set(failedIds);
        nextFailedIds.add(currentImage.id);
        return nextFailedIds;
      });
    }

    const remainingImageCount = activeImages.filter(
      (image) => image.id !== currentImage?.id,
    ).length;

    if (remainingImageCount > 0) {
      setCurrentImageIndex((current) =>
        current >= remainingImageCount ? 0 : current,
      );
      return;
    }

    setCurrentImageIndex(0);
    setDisplayImage(PRODUCT_IMAGE_PLACEHOLDER);
    setDisplayImageProductId(product?.id ?? null);
  }, [activeImages, currentImage, product?.id]);

  // Ref to persist the scroll position across effect re-fires
  const scrollYRef = useRef(0);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPreviousImage();
      if (e.key === "ArrowRight") goNextImage();
    };
    if (data) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [data, goNextImage, goPreviousImage, onClose]);

  // Scroll-lock: useLayoutEffect prevents the visual flash of scrolling to top
  useLayoutEffect(() => {
    if (!data) return;

    // Capture scroll position BEFORE applying fixed positioning
    scrollYRef.current = window.scrollY;

    document.body.style.overflow = "hidden";
    // iOS Safari needs this to prevent background scroll
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollYRef.current}px`;

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [data]);

  if (!data || !product) return null;

  const selectedColor = colorOptions.find((o) => o.id === selectedColorId);
  const selectedSize = sizeOptions.find((o) => o.id === selectedSizeId);

  const colorModifier = selectedColor?.priceModifier ?? 0;
  const sizeModifier = selectedSize?.priceModifier ?? 0;
  const estimatedTotal = product.basePrice + colorModifier + sizeModifier;

  // Build config summary
  const configParts: string[] = [];
  if (selectedColor) configParts.push(selectedColor.name);
  if (selectedSize) configParts.push(selectedSize.name);
  if (product.dimensions) configParts.push(product.dimensions);

  let sectionNumber = 1;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in-backdrop"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto relative w-full max-w-[1080px] max-h-[90vh] overflow-y-auto overscroll-contain rounded-2xl bg-[var(--bg-cream)] shadow-[0_32px_80px_rgba(44,34,24,0.2)] animate-modal-enter"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--text-dark)]/80 text-white transition hover:bg-[var(--text-dark)]"
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="grid lg:grid-cols-[1.2fr_1fr] max-h-[90vh]">
            {/* ═══ LEFT — Image Panel ═══ */}
            <div className="relative flex flex-col bg-[#f2ece4]">
              {/* Main product image */}
              <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 min-h-[240px] lg:min-h-[480px]">
                <img
                  src={imageSrc}
                  alt={currentImageAlt}
                  onError={handleImageError}
                  className={`max-h-[400px] w-full object-contain transition-opacity duration-200 ${
                    imageTransition ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
                  }`}
                />

                {showImageArrows && (
                  <>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goPreviousImage();
                      }}
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[var(--text-dark)] shadow-md backdrop-blur-sm transition hover:bg-white"
                      aria-label="Previous image"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        goNextImage();
                      }}
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[var(--text-dark)] shadow-md backdrop-blur-sm transition hover:bg-white"
                      aria-label="Next image"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                    <div className="absolute right-6 top-6 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold text-[var(--text-mid)] shadow-sm backdrop-blur-sm">
                      {currentImageIndex + 1} / {activeImages.length}
                    </div>
                  </>
                )}

                {/* Image action icons */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-sm">
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-mid)] transition hover:bg-[var(--bg-cream)] hover:text-[var(--text-dark)]" title="Zoom" onClick={() => alert('Zoom feature coming soon.')}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
                    </svg>
                  </button>
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-mid)] transition hover:bg-[var(--bg-cream)] hover:text-[var(--text-dark)]" title="360° View" onClick={() => alert('360° View feature coming soon.')}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 2a10 10 0 110 20 10 10 0 010-20z" /><path d="M2 12h20" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Config summary bar */}
              <div className="border-t border-[var(--border-warm)] bg-white/60 px-6 py-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
                      Current Configuration
                    </p>
                    <p className="mt-0.5 text-[15px] font-semibold text-[var(--text-dark)]">
                      {product.name}
                      {configParts.length > 0 && (
                        <span className="ml-2 text-[13px] font-normal text-[var(--text-mid)]">
                          · {configParts.join(" · ")}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
                      Estimated Total
                    </p>
                    <p className="font-display text-[28px] font-semibold text-[var(--text-dark)] leading-tight">
                      ₱{estimatedTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ RIGHT — Configuration Panel ═══ */}
            <div className="lg:overflow-y-auto lg:max-h-[90vh]">
              <div className="p-6 lg:p-8 space-y-6">
                {/* Product header */}
                <div>
                  <h2 className="font-display text-[28px] leading-tight text-[var(--text-dark)] lg:text-[32px]">
                    {product.name}
                  </h2>
                  {product.description && (
                    <p className="mt-2 text-[14px] leading-[1.7] text-[var(--text-mid)]">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* ── COLOR Section ── */}
                {hasColors && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--text-dark)]">
                        {sectionNumber++}. Color
                      </p>
                      {selectedColor && (
                        <p className="text-[12px] font-semibold text-[#a0522d]">
                          Selected: {selectedColor.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      {colorOptions.map((option) => {
                        const isActive = selectedColorId === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleColorSelect(option)}
                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                              isActive
                                ? "border-[var(--text-dark)] bg-white shadow-sm ring-1 ring-[var(--text-dark)]/10"
                                : "border-[var(--border-card)] bg-white/60 hover:border-[var(--text-mid)] hover:bg-white"
                            }`}
                          >
                            {/* Color swatch */}
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--border-card)] bg-[var(--bg-cream)]">
                              {option.layerUrl ? (
                                <img
                                  src={option.layerUrl}
                                  alt={option.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : option.hex ? (
                                <div
                                  className="h-full w-full"
                                  style={{ backgroundColor: option.hex }}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--text-mid)]">
                                  ●
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-[var(--text-dark)]">
                                {option.name}
                              </p>
                              {option.priceModifier > 0 && (
                                <p className="text-[11px] text-[var(--text-mid)]">
                                  +₱{option.priceModifier.toLocaleString()}
                                </p>
                              )}
                            </div>
                            {isActive && (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white flex-shrink-0">
                                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── SIZE Section ── */}
                {hasSizes && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--text-dark)]">
                        {sectionNumber++}. Size
                      </p>
                      {selectedSize && (
                        <p className="text-[12px] font-semibold text-[#a0522d]">
                          Selected: {selectedSize.name}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((option) => {
                        const isActive = selectedSizeId === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setSelectedSizeId(selectedSizeId === option.id ? null : option.id)}
                            className={`rounded-xl border px-5 py-3 text-center transition ${
                              isActive
                                ? "border-[var(--text-dark)] bg-[var(--text-dark)]/5 shadow-sm ring-1 ring-[var(--text-dark)]/10"
                                : "border-[var(--border-card)] bg-white/60 hover:border-[var(--text-mid)] hover:bg-white"
                            }`}
                          >
                            <p className={`text-[13px] font-semibold ${isActive ? "text-[var(--text-dark)]" : "text-[var(--text-mid)]"}`}>
                              {option.name}
                            </p>
                            {option.priceModifier > 0 && (
                              <p className="mt-0.5 text-[10px] text-[var(--text-mid)]">
                                +₱{option.priceModifier.toLocaleString()}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── No Variations Message ── */}
                {!hasColors && !hasSizes && (
                  <div className="space-y-3">
                    {product.dimensions && (
                      <div className="flex items-center gap-2 text-[13px] text-[var(--text-mid)]">
                        <span>📐</span>
                        <span>{product.dimensions}</span>
                      </div>
                    )}
                    <p className="text-[15px] font-semibold text-[var(--text-dark)]">
                      ₱{product.basePrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                {/* ── Price Breakdown (when variations exist) ── */}
                {(hasColors || hasSizes) && (
                  <div className="space-y-1.5 rounded-xl border border-[var(--border-card)] bg-white p-4">
                    <div className="flex justify-between text-[12px] text-[var(--text-mid)]">
                      <span>Base price</span>
                      <span>₱{product.basePrice.toLocaleString()}</span>
                    </div>
                    {selectedColor && colorModifier > 0 && (
                      <div className="flex justify-between text-[12px] text-[var(--text-mid)]">
                        <span>+ {selectedColor.name}</span>
                        <span>+₱{colorModifier.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedSize && sizeModifier > 0 && (
                      <div className="flex justify-between text-[12px] text-[var(--text-mid)]">
                        <span>+ {selectedSize.name}</span>
                        <span>+₱{sizeModifier.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-[var(--border-warm)] pt-1.5">
                      <div className="flex justify-between text-[14px] font-semibold text-[var(--text-dark)]">
                        <span>Total</span>
                        <span>₱{estimatedTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CTA Buttons ── */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B4513] px-6 py-4 text-[14px] font-bold text-white shadow-md transition hover:bg-[#6d350f] hover:shadow-lg active:scale-[0.98]"
                    onClick={() => {
                      const addItem = useCartStore.getState().addItem;
                      const openCart = useCartStore.getState().openCart;
                      addItem({
                        id: selectedColor ? `${product.id}:${selectedColor.id}` : product.id,
                        name: selectedColor ? `${product.name} - ${selectedColor.name}` : product.name,
                        image_url: currentImageUrl || product.image,
                        price: estimatedTotal,
                        category: product.category,
                        cta_label: hasColors || hasSizes ? "Confirm Selection" : "Add to Bag",
                      });
                      onClose();
                      openCart();
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 5h2l2.3 10.2a1 1 0 001 .8h8.9a1 1 0 001-.8L20 8H7" />
                      <circle cx="10" cy="19" r="1.2" /><circle cx="17" cy="19" r="1.2" />
                    </svg>
                    {hasColors || hasSizes ? "Confirm Selection" : "Add to Bag"}
                  </button>
                  <div className="flex items-center justify-center gap-6">
                    <button type="button" className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text-mid)] transition hover:text-[var(--text-dark)]" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!'))}>
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                      </svg>
                      Share Configuration
                    </button>
                    <button type="button" className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--text-mid)] transition hover:text-[var(--text-dark)]" onClick={() => alert('Spec sheet download coming soon.')}>
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      Spec Sheet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
