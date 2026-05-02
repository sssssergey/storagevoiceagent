const steps = [
  {
    n: 1,
    title: "Talk to our AI",
    body: "It asks about what you're storing and walks you through the right size.",
  },
  {
    n: 2,
    title: "Book a consult",
    body: "Pick a 15-minute slot. A real person calls you to lock in details.",
  },
  {
    n: 3,
    title: "Move in same week",
    body: "Sign paperwork, get a gate code, and start moving in — usually within 3 days.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-warm py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            How it works
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-lg border border-black/5 bg-white p-6 shadow-sm"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white text-sm font-bold">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
