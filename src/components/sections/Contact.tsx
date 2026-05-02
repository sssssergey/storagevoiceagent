"use client";

import { openConvaiWidget } from "@/components/ConvaiWidget";

export default function Contact() {
  return (
    <section className="bg-brand-deep py-20 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to talk?
            </h2>
            <p className="mt-3 max-w-xl text-lg text-white/80">
              Our AI assistant is the fastest way to get a quote. It can also
              book you a 15-minute call with a real person.
            </p>
            <button
              type="button"
              onClick={openConvaiWidget}
              className="mt-8 inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-accent-hover"
            >
              Talk to our AI assistant
            </button>
          </div>
          <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-white/60">Phone</dt>
              <dd className="mt-1 text-base font-semibold">(555) 123-7890</dd>
            </div>
            <div>
              <dt className="text-white/60">Address</dt>
              <dd className="mt-1 text-base font-semibold">
                2400 Industrial Way
                <br />
                Springfield, IL 62704
              </dd>
            </div>
            <div>
              <dt className="text-white/60">Office hours</dt>
              <dd className="mt-1 text-base font-semibold">
                Mon–Fri 9–6
                <br />
                Sat 9–4 · Sun closed
              </dd>
            </div>
            <div>
              <dt className="text-white/60">Gate access</dt>
              <dd className="mt-1 text-base font-semibold">24 / 7 every day</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
