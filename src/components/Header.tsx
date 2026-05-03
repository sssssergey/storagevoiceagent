"use client";

import { openConvaiWidget } from "@/components/ConvaiWidget";

const NAV = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#storage" },
  { label: "Industries", href: "#process" },
  { label: "Pricing", href: "#tariffs" },
  { label: "About Us", href: "#help" },
  { label: "Blog", href: "#help" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-warm/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <a href="#" className="flex items-center gap-2 group">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-[10px] bg-ink text-warm font-display text-[13px] font-bold tracking-tight"
          >
            C
          </span>
          <span className="font-display text-[1.35rem] font-semibold tracking-[-0.04em] text-ink leading-none">
            CRW Storage
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-[14px] text-ink/75">
          {NAV.map((item, i) => (
            <a
              key={`${item.label}-${i}`}
              href={item.href}
              className={`transition-colors hover:text-ink ${
                i === 0 ? "font-medium text-ink" : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openConvaiWidget}
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-medium text-warm transition-all hover:bg-ink/85 active:scale-[0.98]"
          >
            Contact us
            <span
              aria-hidden
              className="grid h-4 w-4 place-items-center rounded-full bg-warm/15 text-warm transition-transform group-hover:translate-x-0.5"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 4h6m0 0L4 1m3 3L4 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
