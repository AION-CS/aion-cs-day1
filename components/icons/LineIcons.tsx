import type { IconKey } from "@/lib/routes";

/**
 * Single-colour line icons. Every glyph is stroke-only on a 24x24 grid using
 * currentColor, so one accent (or ink) drives them all and none carries
 * photographic weight. No fills, no gradients.
 */

type P = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// --- Card + concept glyphs --------------------------------------------------

function Coins({ className }: P) {
  return (
    <svg {...base} className={className}>
      <ellipse cx="9" cy="7.5" rx="5" ry="2.3" />
      <path d="M4 7.5v4c0 1.3 2.2 2.3 5 2.3s5-1 5-2.3v-4" />
      <path d="M14 12.5c.9.3 2 .5 3 .5 2.8 0 5-1 5-2.3" />
      <ellipse cx="17" cy="10.7" rx="5" ry="2.3" />
      <path d="M12 15.5c0 1.3 2.2 2.3 5 2.3s5-1 5-2.3v-4" />
    </svg>
  );
}

function Factory({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20V12l4-2.5V12l4-2.5V12l4-2.5V12l4-2.5V20H4Z" />
      <path d="M17 9V5.5h2V9" />
      <path d="M4 20h16" />
    </svg>
  );
}

function RecycleLoop({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4.5a7.5 7.5 0 1 0 7.5 7.5" />
      <path d="M20 4.5v4.4h-4.4" />
    </svg>
  );
}

function Gavel({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M8 9.5 13 4.5l3 3-5 5Z" />
      <path d="M11 12.5 6.5 17a1.8 1.8 0 0 1-2.6-2.5L8.5 10" />
      <path d="M13.5 15 20 21" transform="translate(-2 -2)" />
      <path d="M14 20h6" />
    </svg>
  );
}

function Supplier({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 8.5 12 5l8.5 3.5L12 12 3.5 8.5Z" />
      <path d="M3.5 8.5v7L12 19l8.5-3.5v-7" />
      <path d="M12 12v7" />
      <path d="M14.5 15.8l2 2 3.5-3.5" transform="translate(0 -3.2)" />
    </svg>
  );
}

function Shield({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5 19 6v5.5c0 4-3 7-7 9-4-2-7-5-7-9V6l7-2.5Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function Target({ className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.8" />
      <circle cx="12" cy="12" r="1.4" />
    </svg>
  );
}

function CertificateIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="9.5" r="5.5" />
      <path d="M9 20.5 10 14.8M15 20.5 14 14.8" />
      <path d="M9.6 9.5l1.8 1.8 3-3.6" />
    </svg>
  );
}

function LinkIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M8 12 6.3 13.7a3.3 3.3 0 0 0 4.6 4.6L12.6 16.6" />
      <path d="M16 12l1.7-1.7a3.3 3.3 0 0 0-4.6-4.6L11.4 7.4" />
    </svg>
  );
}

function Layers({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16 9 4.5 9-4.5" />
    </svg>
  );
}

// --- Day 11: one glyph per inefficiency category (Route 1, Section E) -------

function Blueprint({ className }: P) {
  return (
    <svg {...base} className={className}>
      <rect x="3.2" y="4.5" width="17.6" height="15" rx="1.6" />
      <path d="M3.2 9.5h17.6" />
      <path d="M9 9.5v10" />
      <path d="M13 14h7.8" />
    </svg>
  );
}

function Database({ className }: P) {
  return (
    <svg {...base} className={className}>
      <ellipse cx="12" cy="6" rx="7.2" ry="2.6" />
      <path d="M4.8 6v12c0 1.44 3.22 2.6 7.2 2.6s7.2-1.16 7.2-2.6V6" />
      <path d="M4.8 12c0 1.44 3.22 2.6 7.2 2.6s7.2-1.16 7.2-2.6" />
    </svg>
  );
}

function Drive({ className }: P) {
  return (
    <svg {...base} className={className}>
      <rect x="3.2" y="4.2" width="17.6" height="5.4" rx="1.5" />
      <rect x="3.2" y="14.4" width="17.6" height="5.4" rx="1.5" />
      <path d="M6.6 6.9h.01M6.6 17.1h.01" />
      <path d="M10 6.9h6.4M10 17.1h6.4" />
    </svg>
  );
}

function Network({ className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="4.8" r="2.3" />
      <circle cx="5" cy="18.4" r="2.3" />
      <circle cx="19" cy="18.4" r="2.3" />
      <path d="M10.6 6.7 6.2 16.3M13.4 6.7l4.4 9.6M7.3 18.4h9.4" />
    </svg>
  );
}

function Cycle({ className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.3" />
      <path d="M12 7.4V12l3.1 1.9" />
      <path d="M19.6 8.6h-3.4V5.2" />
    </svg>
  );
}

function Gauge({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M3.9 17.5a9 9 0 1 1 16.2 0" />
      <path d="M12 17.5 16 10.6" />
      <circle cx="12" cy="17.5" r="1.3" />
    </svg>
  );
}

// --- Day 13: network, IoT and 5G glyphs ------------------------------------

/** A radio mast with two pairs of emission arcs — 5G and mobile radio access. */
function Antenna({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M12 10.5 8 21M12 10.5 16 21M9.4 17.2h5.2" />
      <circle cx="12" cy="8.8" r="1.6" />
      <path d="M8.3 5.2a5.2 5.2 0 0 0 0 7.2M15.7 5.2a5.2 5.2 0 0 1 0 7.2" />
      <path d="M5.6 2.8a8.8 8.8 0 0 0 0 12M18.4 2.8a8.8 8.8 0 0 1 0 12" />
    </svg>
  );
}

/** A small housed sensor transmitting — one connected IoT device. */
function Sensor({ className }: P) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="11" width="10" height="9.5" rx="2" />
      <circle cx="8" cy="15.75" r="1.8" />
      <path d="M16 8.6a3.4 3.4 0 0 1 3.4 3.4" />
      <path d="M15.5 5.5a6.5 6.5 0 0 1 6.5 6.5" />
    </svg>
  );
}

// --- Day 13: the six-area diagnostic framework's User Behaviour tile -------

/** A single person, head and shoulders — what people do differently. */
function Person({ className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="7.2" r="3.4" />
      <path d="M5 20v-1.6c0-3 3.1-5.4 7-5.4s7 2.4 7 5.4V20" />
    </svg>
  );
}

// --- Day 15: AI compute as its own assessment lens -------------------------

/** A processor die with pins — the compute an AI use case actually consumes. */
function Chip({ className }: P) {
  return (
    <svg {...base} className={className}>
      <rect x="7" y="7" width="10" height="10" rx="1.6" />
      <rect x="10.2" y="10.2" width="3.6" height="3.6" rx="0.6" />
      <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
    </svg>
  );
}

// --- Day 15 L2/L3: prioritisation and management-decision material --------

/** A compass — a bearing to steer by when the map itself is incomplete. */
function Compass({ className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M14.8 9.2 L13 13 L9.2 14.8 L11 11 Z" />
      <path d="M12 3.2v1.6M12 19.2v1.6M3.2 12h1.6M19.2 12h1.6" />
    </svg>
  );
}

/** A four-spoke radar outline — the seven-dimension scoring instrument, simplified. */
function RadarIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <polygon points="12,4 19,9.5 16.5,18 7.5,18 5,9.5" />
      <polygon points="12,8 15.4,10.6 14.2,15 9.8,15 8.6,10.6" />
      <path d="M12 4v4M19 9.5l-3.6 1.1M16.5 18l-2.3-3M7.5 18l2.3-3M5 9.5l3.6 1.1" />
    </svg>
  );
}

/** A trophy — the shiny front an attractive-but-weak option shows first. */
function Trophy({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5.5a2 2 0 0 0 0 4H8M16 5h2.5a2 2 0 0 1 0 4H16" />
      <path d="M12 13v3M9 20h6M10 20c0-2.2.5-3 2-3s2 .8 2 3" />
    </svg>
  );
}

/** A funnel — many initiatives in, a few prioritised decisions out. */
function Funnel({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M4 4h16l-6 8v6l-4 2v-8Z" />
    </svg>
  );
}

/** A clipboard — the management-review stage of a governed decision loop. */
function Clipboard({ className }: P) {
  return (
    <svg {...base} className={className}>
      <rect x="5.5" y="4.5" width="13" height="16" rx="2" />
      <path d="M9 4.5V3.8a1.3 1.3 0 0 1 1.3-1.3h3.4A1.3 1.3 0 0 1 15 3.8v.7" />
      <path d="M8.5 10.5h7M8.5 14h7M8.5 17.5h4.5" />
    </svg>
  );
}

/** A clock — the short/medium/structural time-horizon band picker. */
function ClockIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4V12l3.2 2" />
    </svg>
  );
}

const REGISTRY: Record<IconKey, (p: P) => JSX.Element> = {
  coins: Coins,
  factory: Factory,
  recycleLoop: RecycleLoop,
  gavel: Gavel,
  supplier: Supplier,
  shield: Shield,
  target: Target,
  certificate: CertificateIcon,
  link: LinkIcon,
  layers: Layers,
  blueprint: Blueprint,
  database: Database,
  drive: Drive,
  network: Network,
  cycle: Cycle,
  gauge: Gauge,
  antenna: Antenna,
  sensor: Sensor,
  person: Person,
  chip: Chip,
  compass: Compass,
  radar: RadarIcon,
  trophy: Trophy,
  funnel: Funnel,
  clipboard: Clipboard,
  clock: ClockIcon,
};

export function Icon({ name, className }: { name: IconKey; className?: string }) {
  const C = REGISTRY[name];
  return <C className={className ?? "h-6 w-6"} />;
}

// --- UI utility icons ------------------------------------------------------

export function DragHandle({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <circle cx="9" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Check({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <path d="M5 12.5 10 17 19 7" />
    </svg>
  );
}

export function Lock({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <rect x="5" y="10.5" width="14" height="9" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function ArrowRight({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Close({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-5 w-5"}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Plus({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Help({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.2a2.4 2.4 0 1 1 3.3 2.2c-.7.3-1 .8-1 1.6v.3" />
      <circle cx="11.9" cy="16.4" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Info({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="7.6" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChevronDown({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** Used only by MaterialRefs — marks a chip that jumps back up to the material. */
export function BookOpen({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <path d="M12 7.2v11" />
      <path d="M12 7.2C10.6 6 8.8 5.4 6.2 5.4H4v11h2.2c2.6 0 4.4.6 5.8 1.8" />
      <path d="M12 7.2c1.4-1.2 3.2-1.8 5.8-1.8H20v11h-2.2c-2.6 0-4.4.6-5.8 1.8" />
    </svg>
  );
}

/** Undo / redo affordance on placement exercises (CLAUDE.md standard #5). */
export function Undo({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <path d="M4 9h10.5a4.5 4.5 0 0 1 0 9H9" />
      <path d="M7.5 5.5 4 9l3.5 3.5" />
    </svg>
  );
}

export function Redo({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <path d="M20 9H9.5a4.5 4.5 0 0 0 0 9H15" />
      <path d="M16.5 5.5 20 9l-3.5 3.5" />
    </svg>
  );
}

/** A location pin — kept in the shared icon set for diagrams that mark a place. */
export function Pin({ className }: P) {
  return (
    <svg {...base} className={className ?? "h-4 w-4"}>
      <path d="M12 21s6.5-6.1 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="10.4" r="2.4" />
    </svg>
  );
}
