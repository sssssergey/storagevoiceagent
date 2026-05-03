const services = [
  {
    n: "01",
    title: "Personal storage",
    body: "Boxes, furniture, seasonal kit. Rooms from a 5×5 closet to a full-house 10×30.",
    meta: "From 25 sq ft",
  },
  {
    n: "02",
    title: "Business storage",
    body: "Inventory, archived files, equipment. Bulk tariffs for three rooms or more.",
    meta: "Trade rates",
  },
  {
    n: "03",
    title: "Climate-controlled",
    body: "Held at 13–27°C year-round, humidity managed. For wood, paper, electronics, instruments.",
    meta: "+ £30 / mo",
  },
  {
    n: "04",
    title: "Vehicle & motor",
    body: "Outdoor and covered bays at our north yard. Boats, classics, project cars.",
    meta: "By length",
  },
];

export default function Services() {
  return (
    <section id="storage" className="bg-warm">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <div className="grid grid-cols-12 gap-y-12 gap-x-6">
          <header className="col-span-12 lg:col-span-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              <span className="text-ink">— 02</span>
              <span className="ml-3">Catalogue</span>
            </div>
            <h2 className="mt-6 font-serif text-5xl sm:text-6xl leading-[0.95] tracking-[-0.02em] text-brand-deep">
              What we<br />
              <em className="italic">store</em>.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-[1.55] text-muted">
              Four categories, all on the same gated, monitored site in
              Shoreditch.
            </p>
          </header>

          <ul className="col-span-12 lg:col-span-8 lg:border-l lg:border-rule lg:pl-12">
            {services.map((s, i) => (
              <li
                key={s.n}
                className={`group grid grid-cols-12 gap-x-4 gap-y-2 py-7 sm:py-9 ${
                  i === 0 ? "" : "border-t border-rule"
                }`}
              >
                <div className="col-span-2 sm:col-span-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted pt-1.5">
                  {s.n}
                </div>
                <div className="col-span-10 sm:col-span-7">
                  <h3 className="font-serif text-2xl sm:text-3xl leading-tight text-brand-deep">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm sm:text-[15px] leading-[1.6] text-muted">
                    {s.body}
                  </p>
                </div>
                <div className="col-span-12 sm:col-span-4 flex sm:justify-end items-start sm:items-center pt-1">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink/70 group-hover:text-accent transition-colors">
                    {s.meta}
                    <span className="inline-block ml-2 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
