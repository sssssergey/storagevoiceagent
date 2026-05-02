const faqs = [
  {
    q: "Can I access my unit at night?",
    a: "Yes — gated access is 24/7 with your personal entry code. The office is staffed weekdays 9–6 and Saturdays 9–4.",
  },
  {
    q: "Do I need insurance?",
    a: "Some kind of coverage is required. You can use ours ($12/month) or your existing homeowner's or renter's policy if it covers off-site storage.",
  },
  {
    q: "How do I pay?",
    a: "Autopay via credit card or ACH bank transfer. We don't accept cash on-site.",
  },
  {
    q: "What if I move out before my term is up?",
    a: "Month-to-month means just 30 days written notice. On a 6-month commit, the move-in special is forfeited if you leave early — but no early-termination fee.",
  },
  {
    q: "Do you have boxes and supplies onsite?",
    a: "Yes — boxes, packing tape, bubble wrap, mattress covers, and locks are at the office.",
  },
  {
    q: "Do you store boats and RVs?",
    a: "Yes, at our north location. Pricing depends on length — ask the sales rep when they call.",
  },
  {
    q: "What does climate-controlled actually mean?",
    a: "We hold the unit between 55 and 80°F year-round, with humidity managed. Recommended for electronics, wood furniture, photos, documents, and instruments.",
  },
  {
    q: "How do I get my gate code?",
    a: "By email after move-in paperwork is signed and your first payment clears.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-warm py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Frequently asked
        </h2>
        <ul className="mt-10 divide-y divide-black/10 rounded-lg border border-black/5 bg-white">
          {faqs.map((f) => (
            <li key={f.q}>
              <details className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-ink">
                  {f.q}
                  <span className="ml-4 text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
