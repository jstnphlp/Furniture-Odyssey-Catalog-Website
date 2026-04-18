import type { PageKey } from './SiteNav';

interface SiteFooterProps {
  brandName?: string;
  onNavigate: (page: PageKey) => void;
}

export function SiteFooter({
  brandName = "Furniture Odyssey",
  onNavigate,
}: SiteFooterProps) {
  return (
    <footer
      className="mt-24 border-t border-[var(--border-warm)] bg-white/60"
      id="site-footer"
    >
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Col 1: Brand */}
        <div>
          <button
            onClick={() => onNavigate('Home')}
            className="font-display text-xl text-[var(--text-dark)] hover:opacity-75 transition-opacity"
          >
            {brandName}
          </button>
          <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-mid)]">
            Quiet permanence for contemporary sanctuaries.
          </p>
        </div>

        {/* Col 2: Shop */}
        <div className="space-y-2 text-[13px] text-[var(--text-mid)]">
          <p className="font-semibold text-[var(--text-dark)]">Shop</p>
          <button
            onClick={() => onNavigate('Chairs')}
            className="block cursor-pointer transition hover:text-[var(--text-dark)]"
          >
            Chairs
          </button>
          <button
            onClick={() => onNavigate('Tables')}
            className="block cursor-pointer transition hover:text-[var(--text-dark)]"
          >
            Tables
          </button>
          <button
            onClick={() => onNavigate('Collections')}
            className="block cursor-pointer transition hover:text-[var(--text-dark)]"
          >
            Collections
          </button>
        </div>

        {/* Col 3: Contacts */}
        <div className="space-y-3 text-[13px] text-[var(--text-mid)]">
          <p className="font-semibold text-[var(--text-dark)] uppercase tracking-wider text-[11px]">Contacts</p>
          <a
            href="https://www.facebook.com/DHomeMNL"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition hover:text-[#b97f50]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="font-medium">Furniture Odyssey</span>
          </a>
        </div>

        {/* Col 4: Newsletter */}
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <p className="text-[13px] font-semibold text-[var(--text-dark)]">
            Newsletter
          </p>
          <input
            type="email"
            placeholder="Your email"
            className="w-full rounded-lg border border-[var(--border-card)] bg-white px-3 py-2.5 text-[13px] outline-none transition focus:border-[var(--primary)]"
            id="newsletter-email"
          />
          <button type="submit" className="primary-btn w-full">
            Subscribe
          </button>
        </form>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border-warm)]">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-5 text-[11px] text-[var(--text-mid)]">
          <p>© 2026 {brandName}. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer transition hover:text-[var(--text-dark)]">
              Privacy Policy
            </span>
            <span className="cursor-pointer transition hover:text-[var(--text-dark)]">
              Terms of Use
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
