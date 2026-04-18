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

        {/* Col 3: Company */}
        <div className="space-y-2 text-[13px] text-[var(--text-mid)]">
          <p className="font-semibold text-[var(--text-dark)]">Company</p>
          <button
            onClick={() => onNavigate('Home')}
            className="block cursor-pointer transition hover:text-[var(--text-dark)]"
          >
            Home
          </button>
          <p className="cursor-pointer transition hover:text-[var(--text-dark)]">
            Our Story
          </p>
          <p className="cursor-pointer transition hover:text-[var(--text-dark)]">
            The Workshop
          </p>
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
