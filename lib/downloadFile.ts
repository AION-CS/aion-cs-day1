/**
 * Route 1's export is a real file download (JSON + HTML), not the
 * window.print() flow the other routes use — deliberately, per this route's
 * "raw data for grading, formatted report for reading" requirement. No
 * library involved: a Blob, an object URL, and a throwaway anchor click.
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
 * `{taskNumber}-{name}-day9-l{level}task{taskNumber}` e.g. `1-muchson-day9-l2task1`.
 * The leading number is the task's number *within its route*, and every route
 * here has exactly one task — so it reads `1` throughout, while `l{level}`
 * identifies which route the file came from.
 */
export function exportFilename(name: string, level: number, taskNumber: number): string {
  const who = slugify(name) || "learner";
  return `${taskNumber}-${who}-day9-l${level}task${taskNumber}`;
}
