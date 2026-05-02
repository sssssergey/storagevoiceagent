"use client";

import { openConvaiWidget } from "@/components/ConvaiWidget";

export default function Hero() {
  return (
    <section className="bg-brand-deep text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20 sm:py-28 lg:py-32">
        <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white/90">
          Locally owned · Springfield, IL · Since 2009
        </span>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Storage that gets out of your way.
        </h1>
        <p className="max-w-2xl text-lg text-white/80 sm:text-xl">
          Climate-controlled units, 24/7 gated access, and a real person on call.
          Talk to our AI assistant — it&apos;ll size your unit and book a 15-minute
          consultation in under five minutes.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={openConvaiWidget}
            className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Talk to our AI assistant
          </button>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-md border border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            See pricing
          </a>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-white/80 sm:grid-cols-4">
          <div>
            <dt className="text-white/60">Customers</dt>
            <dd className="text-lg font-semibold text-white">4,000+</dd>
          </div>
          <div>
            <dt className="text-white/60">Access</dt>
            <dd className="text-lg font-semibold text-white">24 / 7</dd>
          </div>
          <div>
            <dt className="text-white/60">Climate</dt>
            <dd className="text-lg font-semibold text-white">55–80°F</dd>
          </div>
          <div>
            <dt className="text-white/60">Contracts</dt>
            <dd className="text-lg font-semibold text-white">Month-to-month</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
