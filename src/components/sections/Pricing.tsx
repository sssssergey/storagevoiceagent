"use client";

import { openConvaiWidget } from "@/components/ConvaiWidget";

const tiers = [
  {
    n: "01",
    name: "Small",
    size: "5 × 5",
    sqft: "≈ 25 sq ft",
    price: 59,
    fits: "Boxes, small furniture, seasonal items.",
    popular: false,
  },
  {
    n: "02",
    name: "Medium",
    size: "10 × 10",
    sqft: "≈ 100 sq ft",
    price: 129,
    fits: "A one-bedroom flat — bed, sofa, boxes.",
    popular: true,
  },
  {
    n: "03",
    name: "Large",
    size: "10 × 20",
    sqft: "≈ 200 sq ft",
    price: 229,
    fits: "Two-to-three bedroom house contents.",
    popular: false,
  },
  {
    n: "04",
    name: "Extra Large",
    size: "10 × 30",
    sqft: "≈ 300 sq ft",
    price: 329,
    fits: "Full house plus a vehicle.",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="tariffs" className="border-t border-rule bg-warm">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <header className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-7">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              <span className="text-ink">— 04</span>
              <span className="ml-3">Tariffs</span>
            </div>
            <h2 className="mt-6 font-serif text-5xl sm:text-6xl leading-[0.95] tracking-[-0.02em] text-brand-deep">
              Honest pricing,<br />
              <em className="italic">no</em> small print.
            </h2>
          </div>
          <p className="col-span-12 lg:col-span-5 max-w-md text-sm leading-[1.6] text-muted lg:pb-2">
            Month-to-month by default. First month complimentary on a six-month
            commit. Climate control adds £30 / mo on any size.
          </p>
        </header>

        <div className="mt-16 border-t border-rule-strong">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t, i) => (
              <li
                key={t.n}
                className={`relative flex flex-col p-7 sm:p-8 min-h-[340px]
                  border-b border-rule
                  ${i % 2 === 1 ? "border-l border-rule" : ""}
                  ${i >= 2 ? "lg:border-l lg:border-rule" : ""}
                  lg:border-b-0
                  ${i > 0 ? "lg:border-l lg:border-rule" : ""}
                  ${t.popular ? "bg-cream" : "bg-warm"}
                `}
              >
                {t.popular && (
                  <span className="absolute top-7 right-7 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-hover">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                    Most chosen
                  </span>
                )}

                <div className="flex items-baseline gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
                  <span className="text-ink">{t.n}</span>
                  <span>/ {t.name}</span>
                </div>

                <div className="mt-2 font-mono text-[11px] tracking-wide text-muted">
                  {t.size} &nbsp;·&nbsp; {t.sqft}
                </div>

                <div className="mt-auto pt-12">
                  <p className="font-serif text-6xl leading-none text-brand-deep tabular">
                    <span className="text-3xl align-top mr-1 text-brand-deep/70">£</span>
                    {t.price}
                  </p>
                  <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
                    per month
                  </p>
                  <p className="mt-5 max-w-[20ch] text-sm leading-[1.55] text-muted">
                    {t.fits}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm leading-[1.6] text-muted">
            Not sure which size suits you? Our assistant will sort it in a
            couple of minutes.
          </p>
          <button
            type="button"
            onClick={openConvaiWidget}
            className="group inline-flex items-center gap-3 rounded-full border border-ink bg-transparent px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-warm"
          >
            Ask the assistant
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
