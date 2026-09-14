"use client";

import { useState } from "react";
import { Redo, Undo } from "@/components/icons/LineIcons";

/**
 * Visible undo/redo for a placement exercise (CLAUDE.md #5), paired with the
 * keyboard handler in lib/undoShortcuts.ts. The buttons stay clickable at a
 * stack boundary and say so, rather than going dead.
 */
export function UndoRedoControls({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  const [noop, setNoop] = useState<string | null>(null);

  const flash = (text: string) => {
    setNoop(text);
    window.setTimeout(() => setNoop(null), 1400);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span aria-live="polite" className="text-micro text-ash">
        {noop}
      </span>
      <button
        type="button"
        onClick={() => (canUndo ? onUndo() : flash("Nothing to undo yet."))}
        aria-keyshortcuts="Control+Z Meta+Z"
        className="inline-flex items-center gap-1 rounded-lg border border-line bg-paper px-2 py-1 text-micro font-semibold text-ash transition-colors duration-150 hover:text-ink"
      >
        <Undo className="h-3.5 w-3.5" /> Undo
      </button>
      <button
        type="button"
        onClick={() => (canRedo ? onRedo() : flash("Nothing to redo."))}
        aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z"
        className="inline-flex items-center gap-1 rounded-lg border border-line bg-paper px-2 py-1 text-micro font-semibold text-ash transition-colors duration-150 hover:text-ink"
      >
        <Redo className="h-3.5 w-3.5" /> Redo
      </button>
      <span className="hidden text-micro text-ash sm:inline">Ctrl/⌘+Z · Ctrl/⌘+Shift+Z</span>
    </div>
  );
}
