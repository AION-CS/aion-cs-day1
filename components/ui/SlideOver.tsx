"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { Close } from "@/components/icons/LineIcons";

/**
 * A reference panel that slides in from the right, over the task, so a learner
 * can consult a material diagram without losing their place. Portalled to
 * <body> so no transformed ancestor can trap its fixed positioning.
 *
 * Escape and the backdrop close it; focus moves into the panel on open and back
 * to the opener on close. While closed it is `invisible`, so nothing inside it
 * can be tabbed to. The slide is a CSS transition (reduced-motion safe).
 */
export function SlideOver({
  open,
  onClose,
  kicker,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  kicker?: string;
  title: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panel = useRef<HTMLDivElement | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      setVisible(true);
      opener.current = document.activeElement as HTMLElement | null;
      const focus = window.setTimeout(() => panel.current?.focus(), 30);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") close.current();
      };
      document.addEventListener("keydown", onKey);
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.clearTimeout(focus);
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = overflow;
        opener.current?.focus?.();
      };
    }
    const hide = window.setTimeout(() => setVisible(false), 320);
    return () => window.clearTimeout(hide);
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={clsx("fixed inset-0 z-50", open ? "pointer-events-auto" : "pointer-events-none", !visible && "invisible")}
      aria-hidden={!open}
    >
      <div
        className={clsx("absolute inset-0 bg-ink/40 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={clsx(
          "absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-paper shadow-lg outline-none transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            {kicker && <p className="text-micro font-semibold uppercase tracking-wide text-accent">{kicker}</p>}
            <h2 className="text-h3 text-ink">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the reference"
            className="shrink-0 rounded-lg border border-line p-1.5 text-ash transition-colors duration-150 hover:text-ink"
          >
            <Close className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{visible ? children : null}</div>
      </div>
    </div>,
    document.body,
  );
}
