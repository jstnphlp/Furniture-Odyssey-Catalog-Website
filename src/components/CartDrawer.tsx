import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { useCartStore } from "../stores/useCartStore";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const currentTotalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const currentTotalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isEmpty = currentTotalItems === 0;

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      closeCart();
    }, 250);
  }, [closeCart]);

  // Escape key + body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    const scrollY = window.scrollY;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm ${
          isClosing ? "animate-fade-out-backdrop" : "animate-fade-in-backdrop"
        }`}
        onClick={handleClose}
        aria-label="Close cart"
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-[#FFF9F0] shadow-[−16px_0_48px_rgba(44,34,24,0.15)] sm:w-[420px] ${
          isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-[var(--border-warm)] px-6 py-5">
          <h2 className="font-display text-[22px] font-semibold text-[var(--text-dark)]">
            Your Cart
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-mid)] transition hover:bg-[var(--border-warm)] hover:text-[var(--text-dark)]"
            aria-label="Close cart"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <svg viewBox="0 0 24 24" className="mb-4 h-16 w-16 text-[var(--border-warm)]" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M3 5h2l2.3 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7" />
              <circle cx="10" cy="19" r="1.2" />
              <circle cx="17" cy="19" r="1.2" />
            </svg>
            <p className="font-display text-[18px] text-[var(--text-mid)]">
              Your cart is empty.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 text-[13px] font-semibold text-[var(--text-mid)] underline underline-offset-4 transition hover:text-[var(--text-dark)]"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          /* Cart items */
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
            {items.map((item, index) => (
              <div key={item.id}>
                {index > 0 && (
                  <div className="my-4 border-t border-[var(--border-warm)]" />
                )}
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-[60px] w-[60px] flex-shrink-0 rounded-lg bg-[var(--bg-cream)] object-contain object-center"
                  />

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <p className="text-[14px] font-semibold leading-snug text-[var(--text-dark)] truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-mid)]">
                      {item.category}
                    </p>

                    {/* Quantity stepper */}
                    <div className="mt-1 flex items-center gap-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-l-md border border-[var(--border-warm)] bg-white text-[13px] font-semibold text-[var(--text-mid)] transition hover:bg-[var(--bg-cream)] hover:text-[var(--text-dark)]"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        −
                      </button>
                      <span className="flex h-7 w-8 items-center justify-center border-y border-[var(--border-warm)] bg-white text-[13px] font-semibold text-[var(--text-dark)]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-r-md border border-[var(--border-warm)] bg-white text-[13px] font-semibold text-[var(--text-mid)] transition hover:bg-[var(--bg-cream)] hover:text-[var(--text-dark)]"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <p className="text-[14px] font-semibold text-[var(--text-dark)]">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] font-medium text-[var(--text-mid)] underline underline-offset-2 transition hover:text-[#C05A3E]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer (only when items exist) ── */}
        {!isEmpty && (
          <div className="border-t border-[var(--border-warm)] px-6 py-5">
            {/* Subtotal */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[var(--text-dark)]">
                Subtotal
              </span>
              <span className="text-[16px] font-semibold text-[var(--text-dark)]">
                ₱{currentTotalPrice.toLocaleString()}
              </span>
            </div>

            {/* Checkout via Messenger */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C05A3E] px-6 py-3.5 text-[14px] font-bold text-white shadow-md transition hover:bg-[#a94d35] hover:shadow-lg active:scale-[0.98]"
              onClick={() => {
                const lines = items.map(
                  (item) =>
                    `• ${item.name} (${item.category}) — Qty: ${item.quantity} — ₱${(item.price * item.quantity).toLocaleString()}`,
                );
                const message = [
                  "Hi! I'd like to place an order from Furniture Odyssey:",
                  "",
                  ...lines,
                  "",
                  `Subtotal: ₱${currentTotalPrice.toLocaleString()}`,
                  "",
                  "Thank you!",
                ].join("\n");
                const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const base = isMobile
                  ? "https://m.me/DHomeMNL"
                  : "https://www.facebook.com/messages/t/DHomeMNL";
                const url = `${base}?text=${encodeURIComponent(message)}`;
                window.open(url, "_blank", "noopener");
              }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.17 7.21V22l3.03-1.64c.84.23 1.74.34 2.8.34 5.64 0 10-4.13 10-9.7S17.64 2 12 2z" />
              </svg>
              Order via Messenger
            </button>

            {/* Continue browsing */}
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full text-center text-[13px] font-semibold text-[var(--text-mid)] transition hover:text-[var(--text-dark)]"
            >
              or Continue Browsing
            </button>
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}
