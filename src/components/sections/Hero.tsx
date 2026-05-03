"use client";

import { openConvaiWidget } from "@/components/ConvaiWidget";
import HeroScene from "@/components/HeroScene";

export default function Hero() {
  return (
    <section className="relative bg-warm">
      <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-12 gap-y-14 gap-x-10 items-start">
          {/* LEFT — copy column */}
          <div className="col-span-12 lg:col-span-6 lg:pt-10">
            <h1
              className="font-display text-ink leading-[0.96] tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.6rem, 5.6vw, 4.6rem)" }}
            >
              <span
                className="rise inline-block"
                style={{ animationDelay: "60ms" }}
              >
                We move goods that
              </span>
              <br />
              <span
                className="rise inline-block"
                style={{ animationDelay: "180ms" }}
              >
                keep your business
              </span>
              <br />
              <span
                className="rise inline-block"
                style={{ animationDelay: "300ms" }}
              >
                moving.
              </span>
            </h1>

            <p
              className="rise mt-7 max-w-md text-[15.5px] leading-[1.6] text-muted"
              style={{ animationDelay: "440ms" }}
            >
              We combine smart workflows, real-time tracking, and a team that
              actually picks up the phone. From pallet storage to last-mile
              delivery, we make sure your products get where they need to go —
              fast, safe, and stress-free.
            </p>

            <div
              className="rise mt-9 flex items-center gap-6"
              style={{ animationDelay: "560ms" }}
            >
              <button
                type="button"
                onClick={openConvaiWidget}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[14px] font-medium text-white transition-all hover:bg-accent-hover active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(30,199,115,0.55)]"
              >
                Get a Quote
                <span
                  aria-hidden
                  className="grid h-5 w-5 place-items-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5"
                >
                  <svg width="9" height="9" viewBox="0 0 8 8" fill="none">
                    <path
                      d="M1 4h6m0 0L4 1m3 3L4 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <a
                href="#process"
                className="group inline-flex items-center gap-2 text-[14px] font-medium text-ink"
              >
                Track a Shipment
                <span
                  aria-hidden
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </div>

            {/* Social proof */}
            <div
              className="rise mt-12 flex items-center gap-3"
              style={{ animationDelay: "700ms" }}
            >
              <div className="flex -space-x-2.5">
                <Avatar bg="#dccdb2" initials="LM" />
                <Avatar bg="#bcc7d4" initials="JR" />
                <Avatar bg="#cbc0a8" initials="AK" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
                  10+ K Users
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  trusted across the UK
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — aerial warehouse + floating UI cards */}
          <div className="col-span-12 lg:col-span-6">
            <div className="rise" style={{ animationDelay: "240ms" }}>
              <HeroScene />
            </div>
          </div>
        </div>

        {/* Subtle base indicator */}
        <div
          className="rise mt-16 flex items-center justify-between text-[10.5px] uppercase tracking-[0.22em] text-muted/80 font-mono"
          style={{ animationDelay: "900ms" }}
        >
          <span aria-hidden>↓ continue</span>
          <span>EC1 · London · since 2009</span>
        </div>
      </div>
    </section>
  );
}

function Avatar({ bg, initials }: { bg: string; initials: string }) {
  return (
    <div
      className="grid h-9 w-9 place-items-center rounded-full ring-2 ring-warm font-display text-[11px] font-semibold tracking-tight text-ink/80"
      style={{ background: bg }}
    >
      {initials}
    </div>
  );
}
