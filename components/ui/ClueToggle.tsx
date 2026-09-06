"use client";

import { useState } from "react";
import { Help } from "@/components/icons/LineIcons";

/** A guiding question, never the answer — hidden behind a click so it stays a clue, not a giveaway. */
export function ClueToggle({ clue }: { clue: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-micro font-semibold text-accent hover:text-accentHi"
      >
        <Help className="h-3.5 w-3.5" />
        {open ? "Hide clue" : "Show clue"}
      </button>
      {open && <p className="reveal-in mt-1 rounded-lg border border-accent/25 bg-accentSoft px-2.5 py-1.5 text-micro text-ink">{clue}</p>}
    </div>
  );
}
