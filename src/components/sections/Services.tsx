const services = [
  {
    title: "Personal storage",
    body: "Boxes, furniture, seasonal gear. Sizes from 5×5 closet to full-house 10×30.",
  },
  {
    title: "Business storage",
    body: "Inventory, archived files, equipment. Bulk-rate plans available for 3+ units.",
  },
  {
    title: "Climate-controlled",
    body: "Kept 55–80°F year-round with humidity managed. For electronics, wood, photos.",
  },
  {
    title: "Vehicle & RV",
    body: "Outdoor and covered options at our north location. Boats, RVs, project cars.",
  },
];

export default function Services() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            What we store
          </h2>
          <p className="mt-3 text-lg text-muted">
            Four categories, all on the same gated, monitored property.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <li
              key={s.title}
              className="rounded-lg border border-black/5 bg-warm p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
