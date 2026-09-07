const INK = "#16191D";
const ASH = "#5E6670";
const ACCENT = "#0E7A5A";
const ACCENT_SOFT = "#E7F2EC";

type Benefit = { id: string; label: string; detail: string; icon: (p: { color: string }) => JSX.Element };

function IconScale({ color }: { color: string }) {
  return (
    <path
      d="M12 4v3M8 7h8M8 7l-2.5 6a2.5 2.5 0 0 0 5 0L8 7Zm8 0l-2.5 6a2.5 2.5 0 0 0 5 0L16 7ZM7 20h10"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
function IconFlex({ color }: { color: string }) {
  return (
    <path
      d="M4 12c2-4 6-6 8-6M12 6l-2-2m2 2-2 2M20 12c-2 4-6 6-8 6m0 0 2 2m-2-2 2-2"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
function IconSpeed({ color }: { color: string }) {
  return (
    <path
      d="M12 20a8 8 0 1 1 8-8M12 20v-3M4.5 9 7 10.5M19.5 9 17 10.5M12 12l4-4"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
function IconEffort({ color }: { color: string }) {
  return (
    <path
      d="M6 20V10l6-5 6 5v10M6 20h12M10 20v-6h4v6"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
function IconStandard({ color }: { color: string }) {
  return (
    <g stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="6" height="6" rx="1" />
      <rect x="13" y="5" width="6" height="6" rx="1" />
      <rect x="5" y="13" width="6" height="6" rx="1" />
      <rect x="13" y="13" width="6" height="6" rx="1" />
    </g>
  );
}
function IconAvailability({ color }: { color: string }) {
  return (
    <path
      d="M12 3.5 19 6v5.5c0 4-3 7-7 9-4-2-7-5-7-9V6l7-2.5Z M9 12l2 2 4-4"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

const BENEFITS: Benefit[] = [
  { id: "scalability", label: "Scalability & Elasticity", detail: "Capacity grows or shrinks with real demand.", icon: IconScale },
  { id: "flexibility", label: "Flexibility", detail: "A broad service catalogue, combined without new procurement.", icon: IconFlex },
  { id: "provisioning", label: "Faster Provisioning", detail: "Minutes, not weeks, to a running resource.", icon: IconSpeed },
  { id: "effort", label: "Lower Own-Infrastructure Effort", detail: "No space, cooling, or refresh cycles to manage.", icon: IconEffort },
  { id: "standardisation", label: "Standardisation", detail: "Consistent, repeatable configurations.", icon: IconStandard },
  { id: "availability", label: "High Availability", detail: "Workloads run across locations, with managed failover.", icon: IconAvailability },
];

/** Block 1 — six-icon grid, one per core corporate cloud benefit. */
export function CloudBenefitsGridSvg() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {BENEFITS.map((b) => {
        const Icon = b.icon;
        return (
          <div key={b.id} className="flex flex-col items-center gap-2 rounded-xl border border-line p-4 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: ACCENT_SOFT }}>
              <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
                <Icon color={ACCENT} />
              </svg>
            </span>
            <p className="text-caption font-semibold text-ink">{b.label}</p>
            <p className="text-micro text-ash">{b.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
