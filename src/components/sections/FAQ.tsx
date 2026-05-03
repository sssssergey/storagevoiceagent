const faqs = [
  {
    q: "Can I access my unit at night?",
    a: "Yes — gated access is twenty-four hours with a personal entry code. The office is staffed weekdays 9–6 and Saturdays 9–4.",
  },
  {
    q: "Do I need insurance?",
    a: "Some kind of cover is required. You can use ours (£10 / month) or your existing contents policy if it covers off-site storage.",
  },
  {
    q: "How do I pay?",
    a: "Direct Debit or card on autopay. We don't take cash on-site.",
  },
  {
    q: "What if I move out before my term is up?",
    a: "Month-to-month means thirty days' written notice. On a six-month commit the move-in special is forfeited if you leave early — but no early-termination fee.",
  },
  {
    q: "Do you sell boxes and supplies on-site?",
    a: "Yes — boxes, packing tape, bubble wrap, mattress covers and locks are available at the office.",
  },
  {
    q: "Do you store boats and motors?",
    a: "Yes, at our north yard. Pricing depends on length — please ask the sales rep when they ring.",
  },
  {
    q: "What does climate-controlled actually mean?",
    a: "We hold the unit between 13 and 27°C year-round, with humidity managed. Recommended for electronics, wood furniture, photos, documents and instruments.",
  },
  {
    q: "How do I get my gate code?",
    a: "By email after move-in paperwork is signed and your first payment clears.",
  },
];

export default function FAQ() {
  return (
    <section id="help" className="border-t border-rule bg-warm">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="grid grid-cols-12 gap-y-10 gap-x-6">
          <header className="col-span-12 lg:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              <span className="text-ink">— 05</span>
              <span className="ml-3">Common questions</span>
            </div>
            <h2 className="mt-6 font-serif text-5xl sm:text-6xl leading-[0.95] tracking-[-0.02em] text-brand-deep">
              Frequently<br />
              <em className="italic">asked</em>.
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-[1.6] text-muted">
              Eight quick answers. Anything else, ring or speak to our
              assistant.
            </p>
          </header>

          <ul className="col-span-12 lg:col-span-8 lg:border-l lg:border-rule lg:pl-12 border-t border-rule-strong lg:border-t-0">
            {faqs.map((f, i) => (
              <li key={f.q} className="border-b border-rule">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 sm:py-7">
                    <div className="flex items-baseline gap-5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted tabular pt-1">
                        Q.{String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl leading-tight text-brand-deep">
                        {f.q}
                      </h3>
                    </div>
                    <span
                      aria-hidden
                      className="font-serif text-3xl leading-none text-accent transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-7 pl-16 sm:pl-[5.5rem] pr-10 max-w-2xl text-sm sm:text-[15px] leading-[1.65] text-muted">
                    {f.a}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
