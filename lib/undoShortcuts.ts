import type { KeyboardEvent } from "react";

/**
 * Ctrl/⌘+Z and Ctrl/⌘+Shift+Z (or Ctrl+Y) for one placement exercise.
 *
 * Attached as `onKeyDown` on the exercise's own wrapper rather than on the
 * document, so the Signal Board and the ranking matrix — two histories on one
 * page — can never undo each other. Ignored while the learner is typing: inside
 * a text field the browser's own text undo is the one they mean.
 */
export function undoRedoKeyHandler(onUndo: () => void, onRedo: () => void) {
  return (e: KeyboardEvent<HTMLElement>) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const target = e.target as HTMLElement;
    if (target.closest("textarea, [contenteditable='true'], input[type='text'], input:not([type])")) return;
    const key = e.key.toLowerCase();
    if (key === "z" && !e.shiftKey) {
      e.preventDefault();
      onUndo();
    } else if ((key === "z" && e.shiftKey) || key === "y") {
      e.preventDefault();
      onRedo();
    }
  };
}
