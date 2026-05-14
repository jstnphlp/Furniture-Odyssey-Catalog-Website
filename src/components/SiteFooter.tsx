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

        {/* Col 4: Showroom */}
        <div className="space-y-3">
          <p className="text-[13px] font-semibold text-[var(--text-dark)] uppercase tracking-wider text-[11px]">
            Visit our showroom at
          </p>
          <a
            href="https://www.google.com/maps/place/4774+Sampaguita,+Maynila,+1709+Kalakhang+Maynila/@14.4894802,121.0400177,19z/data=!3m1!4b1!4m6!3m5!1s0x3397cf1b155bdf5d:0x22a8dae78ace0f39!8m2!3d14.4894802!4d121.0406614!16s%2Fg%2F11d_2j37fn?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[13px] leading-relaxed text-[var(--text-mid)] transition hover:text-[#b97f50]"
          >
            4774 Sampaguita, Marimar Village, Parañaque City, Metro Manila
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border-warm)]">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-5 text-[11px] text-[var(--text-mid)]">
          <p>© 2026 {brandName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://shopbeyond.ink/digital-services#webservice"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[var(--text-dark)]"
            >
              Developed by beyond.ink
            </a>
            <button type="button" className="cursor-pointer transition hover:text-[var(--text-dark)]" onClick={() => alert('Privacy Policy coming soon.')}>
              Privacy Policy
            </button>
            <button type="button" className="cursor-pointer transition hover:text-[var(--text-dark)]" onClick={() => alert('Terms of Use coming soon.')}>
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
