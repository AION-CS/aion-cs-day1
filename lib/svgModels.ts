import { BIN_SHORT, BINS, RECORDS, RECORD_BY_ID } from "@/data/kesslerDossier";
import type { Bin, RecordId } from "@/data/kesslerDossier";
import { KESSLER_ROLES, MOTIVE_FEATURE, MOTIVE_LABEL } from "@/data/motives";
import type { MotiveId, RoleKey } from "@/data/motives";

/**
 * Geometry shared by the on-screen React SVGs and the static SVG strings in the
 * exported note, so the document always shows the picture the participant saw.
 */

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Word-wrap into lines of at most `n` characters. */
export function wrap(text: string, n: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > n && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

// --- Evidence board ---------------------------------------------------------

/**
 * solid = an observed record filed in a category
 * hatch = an interpretation filed in a category (a claim standing where evidence should)
 * open  = an observed record set aside in the Interpretation bin
 * grey  = an interpretation filed as an interpretation
 */
export type SegKind = "solid" | "hatch" | "open" | "grey";
export type Seg = { id: RecordId; kind: SegKind };
export type Column = { bin: Bin; label: string; segs: Seg[] };

export function boardColumns(placements: Record<RecordId, Bin | null>): Column[] {
  return BINS.map((b) => ({
    bin: b.id,
    label: BIN_SHORT[b.id],
    segs: RECORDS.filter((r) => placements[r.id] === b.id).map((r) => {
      const inInterp = b.id === "interpretation";
      const kind: SegKind = r.observed ? (inInterp ? "open" : "solid") : inInterp ? "grey" : "hatch";
      return { id: r.id, kind };
    }),
  }));
}

export const BOARD = { w: 560, h: 318, base: 262, colW: 104, left: 20, segH: 25, gap: 3, barW: 76 };

export const colX = (i: number) => BOARD.left + i * BOARD.colW + (BOARD.colW - BOARD.barW) / 2;
export const segY = (i: number) => BOARD.base - (i + 1) * (BOARD.segH + BOARD.gap) + BOARD.gap;

export const SEG_STYLE: Record<SegKind, { fill: string; stroke: string; dash?: string; text: string }> = {
  solid: { fill: "#2F5D62", stroke: "#1F3F43", text: "#FFFFFF" },
  hatch: { fill: "url(#{P})", stroke: "#8A5A0B", text: "#1F2328" },
  open: { fill: "#FFFEFA", stroke: "#59606A", dash: "4 3", text: "#59606A" },
  grey: { fill: "#8B9098", stroke: "#59606A", text: "#FFFFFF" },
};

export const BOARD_LEGEND = [
  { kind: "solid" as SegKind, text: "Solid — an observed record" },
  { kind: "hatch" as SegKind, text: "Hatched — an interpretation filed as if it were evidence" },
  { kind: "open" as SegKind, text: "Outline — an observed record set aside" },
];

export function evidenceBoardSvg(placements: Record<RecordId, Bin | null>, uid = "exp"): string {
  const cols = boardColumns(placements);
  const pid = `hatch-${uid}`;
  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOARD.w} ${BOARD.h}" role="img" aria-labelledby="eb-t-${uid} eb-d-${uid}" style="width:100%;max-width:560px;height:auto">`,
    `<title id="eb-t-${uid}">Evidence board</title>`,
    `<desc id="eb-d-${uid}">Five columns showing how many records the participant filed in each bin. Solid segments are observed records, hatched segments are interpretations filed as evidence.</desc>`,
    `<defs><pattern id="${pid}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#FBF0D6"/><line x1="0" y1="0" x2="0" y2="7" stroke="#8A5A0B" stroke-width="2.4"/></pattern></defs>`,
    `<line x1="${BOARD.left}" x2="${BOARD.w - BOARD.left}" y1="${BOARD.base + 2}" y2="${BOARD.base + 2}" stroke="#59606A" stroke-width="1.2"/>`,
  );
  cols.forEach((c, i) => {
    const x = colX(i);
    c.segs.forEach((s, j) => {
      const st = SEG_STYLE[s.kind];
      parts.push(
        `<rect x="${x}" y="${segY(j)}" width="${BOARD.barW}" height="${BOARD.segH}" rx="3" fill="${st.fill.replace("{P}", pid)}" stroke="${st.stroke}" stroke-width="1.4"${st.dash ? ` stroke-dasharray="${st.dash}"` : ""}/>`,
        `<text x="${x + BOARD.barW / 2}" y="${segY(j) + 17}" text-anchor="middle" font-size="13" font-weight="700" fill="${st.text}" font-family="system-ui,sans-serif">${s.id}</text>`,
      );
    });
    parts.push(
      `<text x="${x + BOARD.barW / 2}" y="${BOARD.base + 22}" text-anchor="middle" font-size="13" font-weight="600" fill="#1F2328" font-family="system-ui,sans-serif">${esc(c.label)}</text>`,
      `<text x="${x + BOARD.barW / 2}" y="${BOARD.base + 40}" text-anchor="middle" font-size="12" fill="#59606A" font-family="system-ui,sans-serif">${c.segs.length}</text>`,
    );
  });
  parts.push("</svg>");
  return parts.join("");
}

// --- Motive map -------------------------------------------------------------

export const MMAP = { w: 600, h: 336, roleX: 6, roleW: 176, roleH: 58, featX: 380, featW: 214, featH: 58 };
export const roleY = (i: number) => 8 + i * 80;
export const FEATURE_ORDER: MotiveId[] = ["security", "efficiency", "status", "innovation"];
export const featY = (m: MotiveId) => 8 + FEATURE_ORDER.indexOf(m) * 80;

export function connectorPath(roleIndex: number, motive: MotiveId): string {
  const x1 = MMAP.roleX + MMAP.roleW;
  const y1 = roleY(roleIndex) + MMAP.roleH / 2;
  const x2 = MMAP.featX;
  const y2 = featY(motive) + MMAP.featH / 2;
  const mid = (x1 + x2) / 2;
  return `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`;
}

export function motiveMapSvg(motives: Record<RoleKey, MotiveId | null>, uid = "exp"): string {
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MMAP.w} ${MMAP.h}" role="img" aria-labelledby="mm-t-${uid} mm-d-${uid}" style="width:100%;max-width:600px;height:auto">`,
    `<title id="mm-t-${uid}">Motive map</title>`,
    `<desc id="mm-d-${uid}">Four Kessler buying-committee roles, each connected to the offer feature matching the motive the participant chose. A dashed connector ends in an empty node.</desc>`,
  ];
  KESSLER_ROLES.forEach((r, i) => {
    const m = motives[r.key];
    if (m) {
      const empty = !!MOTIVE_FEATURE[m].empty;
      parts.push(
        `<path d="${connectorPath(i, m)}" fill="none" stroke="${empty ? "#A4472A" : "#0F6B6B"}" stroke-width="2.4"${empty ? ' stroke-dasharray="6 5"' : ""}/>`,
      );
    }
  });
  KESSLER_ROLES.forEach((r, i) => {
    const m = motives[r.key];
    parts.push(
      `<rect x="${MMAP.roleX}" y="${roleY(i)}" width="${MMAP.roleW}" height="${MMAP.roleH}" rx="6" fill="#FFFEFA" stroke="#59606A" stroke-width="1.4"/>`,
      `<text x="${MMAP.roleX + 10}" y="${roleY(i) + 24}" font-size="14" font-weight="700" fill="#1F2328" font-family="system-ui,sans-serif">${esc(r.name.length > 20 ? "Produktions-IT" : r.name)}</text>`,
      `<text x="${MMAP.roleX + 10}" y="${roleY(i) + 44}" font-size="12" fill="#59606A" font-family="system-ui,sans-serif">${esc(m ? MOTIVE_LABEL[m] : "no motive chosen")}</text>`,
    );
  });
  FEATURE_ORDER.forEach((m) => {
    const f = MOTIVE_FEATURE[m];
    const lines = wrap(f.label, 27).slice(0, 3);
    parts.push(
      `<rect x="${MMAP.featX}" y="${featY(m)}" width="${MMAP.featW}" height="${MMAP.featH}" rx="6" fill="${f.empty ? "#FFFEFA" : "#DFEEEB"}" stroke="${f.empty ? "#A4472A" : "#0F6B6B"}" stroke-width="1.4"${f.empty ? ' stroke-dasharray="5 4"' : ""}/>`,
      ...lines.map(
        (l, k) =>
          `<text x="${MMAP.featX + 10}" y="${featY(m) + 21 + k * 16}" font-size="12.5" fill="#1F2328" font-family="system-ui,sans-serif">${esc(l)}</text>`,
      ),
    );
  });
  parts.push("</svg>");
  return parts.join("");
}

export { RECORD_BY_ID };
