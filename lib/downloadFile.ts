import { CASE } from "@/lib/routes";

/**
 * Plain file download — a Blob, an object URL, and a throwaway anchor click.
 * No library involved. Kept for any day that still wants a raw-data export
 * alongside a report; Day 13's two routes export PDF only (see
 * `printHtmlDocument` below).
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

/**
 * Prints a route's print-ready HTML report — "Save as PDF" in the resulting
 * dialog produces the export. No PDF library: same window.print() mechanism
 * day3 through day6 used before it was dropped in favour of a JSON download
 * (CLAUDE.md §9: no PDF libraries, window.print()-based export only).
 *
 * Renders into a hidden same-page iframe rather than `window.open()` — a
 * popup can be silently blocked by the browser (and reliably is, under some
 * automated/CDP-driven clicks), where an iframe never triggers a popup
 * blocker at all. `document.title` is set for the duration of the print call
 * because most browsers seed the "Save as PDF" filename from the *top-level*
 * page's title, not the iframe's.
 */
export function printHtmlDocument(filename: string, html: string) {
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  if (!win) {
    iframe.remove();
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();

  const originalTitle = document.title;
  document.title = filename;

  let printed = false;
  const triggerPrint = () => {
    if (printed) return;
    printed = true;
    win.focus();
    win.print();
    document.title = originalTitle;
    window.setTimeout(() => iframe.remove(), 1000);
  };
  if (win.document.readyState === "complete") {
    triggerPrint();
  } else {
    iframe.addEventListener("load", triggerPrint, { once: true });
    window.setTimeout(triggerPrint, 400);
  }
}

const slugify = (v: string) =>
  v.trim().toLowerCase().replace(/\s+/g, "-").replace(/[\\/:*?"<>|]+/g, "-");

/**
 * `{taskNumber}-{name}-day{day}-{levels}task{taskNumber}` e.g. `1-muchson-day14-l1task1`.
 *
 * The leading number is the task's number *within its route*. `levels` lists
 * every curriculum level that route covers, in order — Route 1 merges L1 and
 * L2, so it exports as `l1l2task1`, and Route 2 (L3 alone) as `l3task1`. The
 * day number is read from the route registry rather than hardcoded, so a day
 * folder copied forward cannot keep exporting under the previous day's name
 * (CURRICULUM-GUIDE.md §7).
 */
export function exportFilename(
  name: string,
  levels: readonly number[],
  taskNumber: number,
): string {
  const who = slugify(name) || "learner";
  const lvl = levels.map((l) => `l${l}`).join("");
  return `${taskNumber}-${who}-day${CASE.day}-${lvl}task${taskNumber}`;
}
