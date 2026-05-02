"use client";

import { openConvaiWidget } from "@/components/ConvaiWidget";

const tiers = [
  {
    name: "Small",
    size: "5 × 5",
    sqft: "≈ 25 sq ft",
    price: 59,
    fits: "Boxes, small furniture, seasonal items.",
    popular: false,
  },
  {
    name: "Medium",
    size: "10 × 10",
    sqft: "≈ 100 sq ft",
    price: 129,
    fits: "1-bedroom apartment with bed, couch, and boxes.",
    popular: true,
  },
  {
    name: "Large",
    size: "10 × 20",
    sqft: "≈ 200 sq ft",
    price: 229,
    fits: "2–3 bedroom house contents.",
    popular: false,
  },
  {
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
    <section id="pricing" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Pricing
          </h2>
          <p className="mt-3 text-lg text-muted">
            Month-to-month. First month free with a 6-month commit. Climate
            control adds $30/month on any size.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <li
              key={t.name}
              className={`relative rounded-lg border p-6 shadow-sm ${
                t.popular
                  ? "border-accent bg-warm"
                  : "border-black/5 bg-white"
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 right-4 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-ink">{t.name}</h3>
              <p className="text-sm text-muted">
                {t.size} · {t.sqft}
              </p>
              <p className="mt-4">
                <span className="text-3xl font-bold text-ink">${t.price}</span>
                <span className="text-sm text-muted"> / month</span>
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">{t.fits}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={openConvaiWidget}
            className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-accent-hover"
          >
            Not sure which size? Ask our AI
          </button>
        </div>
      </div>
    </section>
  );
}
