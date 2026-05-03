export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-deep text-warm/70 border-t border-warm/10">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-xl font-semibold tracking-tight text-warm">CRW</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm/55">
            Storage · EC1
          </span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm/50">
          © {year} CRW Storage Ltd. — Provost St, London EC1V 3SF
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm/50">
          51.5283° N, 0.0892° W
        </p>
      </div>
    </footer>
  );
}
