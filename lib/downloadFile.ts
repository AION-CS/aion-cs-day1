/**
 * Every route's export is a real file download (JSON + HTML) rather than a
 * window.print() flow — deliberately, per the "raw data for grading, formatted
 * report for reading" requirement. No library involved: a Blob, an object URL,
 * and a throwaway anchor click.
 */
export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const slugify = (v: string) =>
  v.trim().toLowerCase().replace(/\s+/g, "-").replace(/[\\/:*?"<>|]+/g, "-");

/**
 * `{taskNumber}-{name}-day11-{levels}task{taskNumber}` e.g. `1-muchson-day11-l1l2task1`.
 *
 * The leading number is the task's number *within its route*. `levels` lists
 * every curriculum level that route covers, in order — Day 11 merged L1 and L2
 * into Route 1, so that route exports as `l1l2task1` and Route 2 (L3 alone) as
 * `l3task1`. Passing the levels rather than hardcoding the string keeps the
 * filename tied to the route's actual scope (CURRICULUM-GUIDE.md §7).
 */
export function exportFilename(
  name: string,
  levels: readonly number[],
  taskNumber: number,
): string {
  const who = slugify(name) || "learner";
  const lvl = levels.map((l) => `l${l}`).join("");
  return `${taskNumber}-${who}-day11-${lvl}task${taskNumber}`;
}
