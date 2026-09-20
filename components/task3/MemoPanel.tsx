"use client";

import { useState } from "react";
import { DOC_CSS, memoBody } from "@/lib/exportDoc";
import { l3Blocks } from "@/lib/l3";
import { usePersisted } from "@/store/usePersisted";

/** The memo, assembling itself in reading order (summary first) while the questions are answered in another order. */
function MemoDoc() {
  const p = usePersisted();
  const done = Object.values(l3Blocks(p)).filter(Boolean).length;
  return (
    <>
      <div className="flex items-baseline justify-between gap-2 border-b border-line px-3 py-2">
        <p className="smallcaps">Your memo, live</p>
        <p className="tnum text-caption text-ash">{done} of 6 blocks complete</p>
      </div>
      <div className="max-h-[calc(100vh-11rem)] overflow-auto p-3 text-[13px]">
        <style dangerouslySetInnerHTML={{ __html: DOC_CSS }} />
        <div className="doc" dangerouslySetInnerHTML={{ __html: memoBody(p) }} />
      </div>
    </>
  );
}

/** Desktop: the right-hand half of the split screen. */
export function MemoSide() {
  return (
    <aside aria-label="Live memo" className="hidden lg:block">
      <div className="card sticky top-32 overflow-hidden">
        <MemoDoc />
      </div>
    </aside>
  );
}

/** Mobile and tablet: a sticky, tap-to-expand strip at the bottom of the screen. */
export function MemoStrip() {
  const [open, setOpen] = useState(false);
  const p = usePersisted();
  const done = Object.values(l3Blocks(p)).filter(Boolean).length;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden print:hidden">
      {open && (
        <div className="card mx-2 mb-1 max-h-[65vh] overflow-hidden shadow-lg">
          <MemoDoc />
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 border-t border-line bg-ink px-4 py-2.5 text-caption font-semibold text-paper"
      >
        <span>Live memo</span>
        <span className="tnum font-normal opacity-80">{done} of 6 blocks · {open ? "Close" : "Open"}</span>
      </button>
    </div>
  );
}
