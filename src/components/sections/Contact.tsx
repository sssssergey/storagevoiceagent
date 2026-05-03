"use client";

import { openConvaiWidget } from "@/components/ConvaiWidget";

const DETAILS = [
  { label: "Telephone", value: "020 7946 0123" },
  { label: "Yard", value: "14 Provost Street\nLondon EC1V 3SF" },
  { label: "Office hours", value: "Mon–Fri 9–6\nSat 9–4 · Sun closed" },
  { label: "Gate access", value: "24 hours, every day" },
];

export default function Contact() {
  return (
    <section className="relative bg-brand-deep text-warm">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-warm/55">
          <span className="text-warm">— 06</span>
          <span className="ml-3">Get in touch</span>
        </div>

        <div className="mt-10 grid grid-cols-12 gap-y-12 gap-x-6">
          <div className="col-span-12 lg:col-span-7">
            <h2 className="font-serif leading-[0.95] tracking-[-0.02em] text-warm" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
              Right then,<br />
              <em className="italic text-accent">shall we?</em>
            </h2>
            <p className="mt-8 max-w-md text-base sm:text-lg leading-[1.55] text-warm/75">
              Our assistant is the quickest way to a quote. It can also book
              you a fifteen-minute call with a real person at the yard.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={openConvaiWidget}
                className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm"
              >
                Speak to our assistant
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
              <a
                href="tel:+442079460123"
                className="link-line font-mono text-[11px] uppercase tracking-[0.2em] text-warm/80 hover:text-warm"
              >
                Or ring 020 7946 0123
              </a>
            </div>
          </div>

          <dl className="col-span-12 lg:col-span-5 lg:border-l lg:border-warm/15 lg:pl-12 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
            {DETAILS.map((d) => (
              <div key={d.label}>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-warm/55">
                  {d.label}
                </dt>
                <dd className="mt-2 font-serif text-lg leading-snug text-warm whitespace-pre-line">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
