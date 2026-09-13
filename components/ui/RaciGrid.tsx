"use client";

import clsx from "clsx";

export type RaciCell = "" | "R" | "A" | "C" | "I";

const CYCLE: RaciCell[] = ["", "R", "A", "C", "I"];

export const nextCell = (current: RaciCell): RaciCell =>
  CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];

export type RaciRow = { id: string; label: string };
export type RaciRole = { id: string; name: string; short: string; canBindCapacity?: boolean };

export type RowViolation = { rowId: string; kind: "manyA" | "noA" | "noR" | "authority"; text: string };

/**
 * The interactive RACI grid, shared between the material that teaches it and
 * the exercise that assesses it — same component, different source of truth.
 *
 * It validates structure only and never proposes an assignment (CLAUDE.md #4):
 * more than one Accountable, none at all, no Responsible, and an Accountable
 * who cannot bind capacity for a row that needs it. The last one is phrased as
 * a question rather than a correction, because more than one grid defends.
 */
export function RaciGrid({
  rows,
  roles,
  value,
  onCycle,
  onReset,
  /** Rows where the Accountable must be able to bind capacity. */
  capacityRows = [],
  showCapacity = true,
  labels,
  idPrefix,
}: {
  rows: RaciRow[];
  roles: RaciRole[];
  value: (rowId: string, roleId: string) => RaciCell;
  onCycle: (rowId: string, roleId: string, next: RaciCell) => void;
  onReset?: () => void;
  capacityRows?: string[];
  /**
   * Print "can / cannot bind capacity" under each role. On in the material,
   * where it is the thing being taught; off in the exercise, where printing it
   * would turn the authority question into a lookup.
   */
  showCapacity?: boolean;
  labels: { manyA: string; noA: string; noR: string; authority: string };
  idPrefix: string;
}) {
  const violations = validate(rows, roles, value, capacityRows, labels);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse">
          <thead>
            <tr>
              <th className="w-[42%] border-b border-line pb-2 pr-3 text-left text-micro font-semibold uppercase tracking-wide text-ash">
                Decision object
              </th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  title={role.name}
                  className="border-b border-line px-1 pb-2 text-center text-micro font-semibold text-ash"
                >
                  <span className="block text-ink">{role.short}</span>
                  {showCapacity && (
                    <span className="block font-normal">
                      {role.canBindCapacity ? "can bind capacity" : "cannot bind capacity"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rowViolations = violations.filter((v) => v.rowId === row.id);
              return (
                <tr key={row.id} id={`${idPrefix}-row-${row.id}`} className="scroll-mt-24 align-top">
                  <td className="border-b border-line/70 py-2 pr-3">
                    <p className="text-caption text-ink">{row.label}</p>
                    {rowViolations.map((v) => (
                      <p
                        key={v.kind}
                        className={clsx(
                          "mt-1 rounded-lg px-2 py-1 text-micro",
                          v.kind === "authority"
                            ? "bg-warn/10 text-warn"
                            : "bg-danger/10 text-danger",
                        )}
                      >
                        {v.text}
                      </p>
                    ))}
                  </td>
                  {roles.map((role) => {
                    const cell = value(row.id, role.id);
                    return (
                      <td key={role.id} className="border-b border-line/70 px-1 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => onCycle(row.id, role.id, nextCell(cell))}
                          aria-label={`${row.label} — ${role.name}: ${cell || "blank"}. Click to cycle.`}
                          className={clsx(
                            "h-9 w-9 rounded-lg border text-caption font-bold transition-colors duration-150",
                            cell === "A"
                              ? "border-accent bg-accent text-paper"
                              : cell === "R"
                                ? "border-accent/50 bg-accentSoft text-accent"
                                : cell === "C"
                                  ? "border-line bg-mist text-ink"
                                  : cell === "I"
                                    ? "border-line bg-canvas text-ash"
                                    : "border-dashed border-line bg-paper text-ash hover:border-ash",
                          )}
                        >
                          {cell || "·"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-micro text-ash">
          Click a cell to cycle it: blank → R → A → C → I. Exactly one A per row.
        </p>
        {onReset && (
          <button type="button" onClick={onReset} className="btn-ghost">
            Reset grid
          </button>
        )}
      </div>
    </div>
  );
}

/** Structure-only validation. Never proposes an assignment. */
export function validate(
  rows: RaciRow[],
  roles: RaciRole[],
  value: (rowId: string, roleId: string) => RaciCell,
  capacityRows: string[],
  labels: { manyA: string; noA: string; noR: string; authority: string },
): RowViolation[] {
  const out: RowViolation[] = [];
  for (const row of rows) {
    const cells = roles.map((role) => ({ role, cell: value(row.id, role.id) }));
    const filled = cells.filter((c) => c.cell !== "");
    if (filled.length === 0) continue; // an untouched row is not yet a violation

    const accountable = cells.filter((c) => c.cell === "A");
    const responsible = cells.filter((c) => c.cell === "R");

    if (accountable.length > 1) out.push({ rowId: row.id, kind: "manyA", text: labels.manyA });
    if (accountable.length === 0) out.push({ rowId: row.id, kind: "noA", text: labels.noA });
    if (responsible.length === 0) out.push({ rowId: row.id, kind: "noR", text: labels.noR });
    if (
      accountable.length === 1 &&
      capacityRows.includes(row.id) &&
      !accountable[0].role.canBindCapacity
    ) {
      out.push({ rowId: row.id, kind: "authority", text: labels.authority });
    }
  }
  return out;
}
