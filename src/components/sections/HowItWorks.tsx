const steps = [
  {
    n: "01",
    title: "Talk to our assistant",
    body: "It asks what you're storing and walks you through the right size — boxes, beds, the lot.",
    note: "Avg. 5 min",
  },
  {
    n: "02",
    title: "Book a consultation",
    body: "Pick a fifteen-minute slot. A real person rings to lock in the details and answer questions.",
    note: "Same week",
  },
  {
    n: "03",
    title: "Move in promptly",
    body: "Sign paperwork, receive a gate code, and start moving in — usually within three days.",
    note: "≤ 72 hours",
  },
];

export default function HowItWorks() {
  return (
    <section id="process" className="border-t border-rule bg-warm">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              <span className="text-ink">— 03</span>
              <span className="ml-3">Process</span>
            </div>
            <h2 className="mt-6 font-serif text-5xl sm:text-6xl leading-[0.95] tracking-[-0.02em] text-brand-deep">
              From enquiry to{" "}
              <em className="italic">keys</em>,
              <br />in under a week.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-[1.6] text-muted">
            No high-pressure sales pitch. Three short steps and we&apos;re done.
          </p>
        </header>

        <ol className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-8 sm:divide-x sm:divide-rule">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={`relative ${i > 0 ? "sm:pl-8" : ""}`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-7xl sm:text-8xl leading-none text-brand-deep/15 tabular">
                  {s.n}
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-accent">
                  {s.note}
                </span>
              </div>
              <h3 className="mt-6 font-serif text-2xl sm:text-3xl leading-tight text-brand-deep">
                {s.title}
              </h3>
              <p className="mt-3 text-sm sm:text-[15px] leading-[1.6] text-muted max-w-xs">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
