export default function HeroScene({ height }: { height?: number }) {
  return (
    <div className="relative w-full select-none">
      {/* Decorative aerial-warehouse tile */}
      <div
        className="relative overflow-hidden rounded-[28px] bg-stage shadow-[0_30px_70px_-30px_rgba(10,10,10,0.25),0_2px_0_0_rgba(255,255,255,0.6)_inset]"
        style={height ? { height } : { aspectRatio: "5 / 6" }}
        aria-label="Aerial view of CRW warehouse with live operations dashboard"
        role="img"
      >
        {/* Warehouse aerial — pure SVG, top-down */}
        <div className="absolute inset-0 slow-pan">
          <svg
            viewBox="0 0 500 600"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            className="block h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="floor" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#dad8d2" />
                <stop offset="100%" stopColor="#c9c6bf" />
              </linearGradient>
              <linearGradient id="aisle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#efece5" />
                <stop offset="100%" stopColor="#dfdbd2" />
              </linearGradient>
              <linearGradient id="rack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbfaf6" />
                <stop offset="100%" stopColor="#ece8de" />
              </linearGradient>
              <linearGradient id="accentRack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8623c" />
                <stop offset="100%" stopColor="#c84a26" />
              </linearGradient>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(10,10,10,0.05)" strokeWidth="0.6" />
              </pattern>
              <radialGradient id="vignette" cx="50%" cy="40%" r="80%">
                <stop offset="60%" stopColor="rgba(10,10,10,0)" />
                <stop offset="100%" stopColor="rgba(10,10,10,0.18)" />
              </radialGradient>
            </defs>

            {/* Floor */}
            <rect width="500" height="600" fill="url(#floor)" />
            <rect width="500" height="600" fill="url(#grid)" />

            {/* Long central aisle */}
            <rect x="200" y="0" width="100" height="600" fill="url(#aisle)" />
            {/* Aisle center stripe (dashed) */}
            <line
              x1="250"
              y1="0"
              x2="250"
              y2="600"
              stroke="#0a0a0a"
              strokeOpacity="0.18"
              strokeWidth="1.2"
              strokeDasharray="6 10"
            />

            {/* LEFT racking rows */}
            {Array.from({ length: 8 }).map((_, i) => {
              const y = 30 + i * 70;
              return (
                <g key={`L${i}`}>
                  <rect
                    x="22"
                    y={y}
                    width="170"
                    height="44"
                    rx="3"
                    fill="url(#rack)"
                    stroke="rgba(10,10,10,0.16)"
                    strokeWidth="0.8"
                  />
                  {/* divider lines for pallets */}
                  {[1, 2, 3, 4].map((d) => (
                    <line
                      key={d}
                      x1={22 + d * 34}
                      y1={y}
                      x2={22 + d * 34}
                      y2={y + 44}
                      stroke="rgba(10,10,10,0.18)"
                      strokeWidth="0.6"
                    />
                  ))}
                  {/* row shadow */}
                  <rect
                    x="22"
                    y={y + 44}
                    width="170"
                    height="3"
                    fill="rgba(10,10,10,0.10)"
                  />
                </g>
              );
            })}

            {/* RIGHT racking rows */}
            {Array.from({ length: 8 }).map((_, i) => {
              const y = 30 + i * 70;
              const isAccent = i === 3;
              return (
                <g key={`R${i}`}>
                  <rect
                    x="308"
                    y={y}
                    width="170"
                    height="44"
                    rx="3"
                    fill={isAccent ? "url(#accentRack)" : "url(#rack)"}
                    stroke="rgba(10,10,10,0.16)"
                    strokeWidth="0.8"
                  />
                  {[1, 2, 3, 4].map((d) => (
                    <line
                      key={d}
                      x1={308 + d * 34}
                      y1={y}
                      x2={308 + d * 34}
                      y2={y + 44}
                      stroke={isAccent ? "rgba(255,255,255,0.35)" : "rgba(10,10,10,0.18)"}
                      strokeWidth="0.6"
                    />
                  ))}
                  <rect
                    x="308"
                    y={y + 44}
                    width="170"
                    height="3"
                    fill="rgba(10,10,10,0.10)"
                  />
                </g>
              );
            })}

            {/* Floor markings — corner ticks at intersections */}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 100 + i * 90;
              return (
                <g key={`mark${i}`} stroke="rgba(10,10,10,0.22)" strokeWidth="1">
                  <line x1="208" y1={y} x2="218" y2={y} />
                  <line x1="282" y1={y} x2="292" y2={y} />
                </g>
              );
            })}

            {/* A solitary forklift/cart silhouette */}
            <g transform="translate(232 420)">
              <rect width="36" height="22" rx="2" fill="#0a0a0a" opacity="0.78" />
              <rect x="6" y="-6" width="24" height="6" rx="1" fill="#1ec773" />
              <circle cx="8" cy="22" r="3" fill="#0a0a0a" />
              <circle cx="28" cy="22" r="3" fill="#0a0a0a" />
            </g>

            {/* Vignette */}
            <rect width="500" height="600" fill="url(#vignette)" />
          </svg>
        </div>

        {/* "Watch our promo" pill */}
        <div className="card-in absolute left-1/2 top-8 -translate-x-1/2" style={{ animationDelay: "750ms" }}>
          <button
            type="button"
            className="group inline-flex items-center gap-2.5 rounded-full bg-warm/95 backdrop-blur-md pl-1.5 pr-4 py-1.5 shadow-[0_8px_24px_-8px_rgba(10,10,10,0.35)] ring-1 ring-black/5"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-warm">
              <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
                <path d="M0.5 0.5L8.5 5L0.5 9.5V0.5Z" fill="currentColor" />
              </svg>
            </span>
            <span className="text-[13px] font-medium text-ink">Watch our promo</span>
          </button>
        </div>

        {/* Vertical social rail on left edge of the image */}
        <div className="card-in absolute left-4 bottom-6 flex flex-col gap-2.5" style={{ animationDelay: "950ms" }}>
          <SocialDot label="LinkedIn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.5h4.56V23H.22V8.5zM8.34 8.5h4.37v1.99h.06c.61-1.16 2.1-2.39 4.32-2.39 4.62 0 5.47 3.04 5.47 7v7.9h-4.56v-7c0-1.67-.03-3.82-2.33-3.82-2.33 0-2.69 1.82-2.69 3.7V23H8.34V8.5z"/></svg>
          </SocialDot>
          <SocialDot label="Facebook">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.75 8.43-4.91 8.43-9.93z"/></svg>
          </SocialDot>
          <SocialDot label="Instagram">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22-.22.56-.48.96-.9 1.38a3.7 3.7 0 0 1-1.38.9c-.42.16-1.06.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.22C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.22-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.95c-3.15 0-3.52.01-4.76.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.26.82-.39.39-.62.76-.82 1.27-.15.39-.33.97-.38 2.04-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.07.23 1.65.38 2.04.2.51.44.88.82 1.27.39.39.76.62 1.26.82.39.15.97.33 2.04.38 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.27-.82.39-.39.62-.76.82-1.27.15-.39.33-.97.38-2.04.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.07-.23-1.65-.38-2.04a3.5 3.5 0 0 0-.82-1.27 3.5 3.5 0 0 0-1.27-.82c-.39-.15-.97-.33-2.04-.38-1.24-.06-1.61-.07-4.76-.07zm0 3.31a4.58 4.58 0 1 1 0 9.16 4.58 4.58 0 0 1 0-9.16zm0 7.55a2.97 2.97 0 1 0 0-5.94 2.97 2.97 0 0 0 0 5.94zm5.83-7.74a1.07 1.07 0 1 1-2.14 0 1.07 1.07 0 0 1 2.14 0z"/></svg>
          </SocialDot>
        </div>

        {/* "Live Warehouse Status" card */}
        <div
          className="card-in absolute right-4 bottom-6 w-[260px] rounded-2xl bg-warm/95 backdrop-blur-md p-4 shadow-[0_24px_48px_-20px_rgba(10,10,10,0.35)] ring-1 ring-black/5"
          style={{ animationDelay: "850ms" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="relative grid place-items-center">
              <span className="h-2 w-2 rounded-full bg-accent pulse-dot" />
            </span>
            <span className="text-[12.5px] font-medium tracking-tight text-ink">
              Live Warehouse Status
            </span>
          </div>

          <ul className="flex flex-col gap-2.5">
            <StatusRow icon={<TruckIcon />} value="98%" label="orders shipped on time" />
            <StatusRow icon={<PalletIcon />} value="4,200" label="pallets in storage" />
            <StatusRow icon={<RouteIcon />} value="27" label="trucks on the road" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function SocialDot({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-full bg-warm/90 text-ink/80 backdrop-blur-md shadow-[0_4px_12px_-4px_rgba(10,10,10,0.35)] ring-1 ring-black/5 transition-colors hover:bg-warm hover:text-ink"
    >
      {children}
    </a>
  );
}

function StatusRow({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink/[0.06] text-ink">
        {icon}
      </span>
      <div className="flex flex-col leading-tight min-w-0">
        <span className="font-display text-[15px] font-semibold tracking-tight text-ink tabular">
          {value}
        </span>
        <span className="text-[11px] text-muted truncate">{label}</span>
      </div>
    </li>
  );
}

function TruckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

function PalletIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="9" rx="1" />
      <path d="M4 14v3M12 14v3M20 14v3" />
      <path d="M2 17h20" />
      <path d="M9 5v9M15 5v9" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <path d="M8 6h6a4 4 0 0 1 0 8h-4a4 4 0 0 0 0 8h6" />
    </svg>
  );
}
