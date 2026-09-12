"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { CASE_STORY, NARRATOR } from "@/lib/route1";
import { scrollToAndFlash } from "@/lib/scrollToAndFlash";
import { ArrowRight, Close } from "@/components/icons/LineIcons";

/**
 * The case brief as a narrated sequence: one scene at a time, click to advance.
 * A story lands a situation in a way a wall of brief text does not — but it is
 * never the only way in, so the written brief stays right below it and nothing
 * downstream is gated on having watched this.
 *
 * Art is dropped into /public/story/ under the filenames in lib/route1.ts. Any
 * file that isn't there yet renders as a labelled placeholder naming the exact
 * path it wants, so the player is usable before the art exists.
 */
export function CaseStory() {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);

  const beat = CASE_STORY[i];
  const isLast = i === CASE_STORY.length - 1;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((v) => Math.min(v + 1, CASE_STORY.length - 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(v - 1, 0));
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accentSoft/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-micro font-semibold uppercase tracking-wide text-accent">Before you start</p>
            <p className="mt-1 text-body font-semibold text-ink">How UrbanByte ended up here</p>
            <p className="mt-1 text-caption text-ash">
              {CASE_STORY.length} scenes · about 2 minutes · told by {NARRATOR.name}, {NARRATOR.role}
            </p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="btn-accent">
            Read the story
          </button>
        </div>
        <p className="mt-3 text-micro text-ash">
          Prefer to skim? The written brief is right below — the story covers the same facts.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <p className="text-micro font-semibold uppercase tracking-wide text-accent">
          How UrbanByte ended up here · {i + 1} of {CASE_STORY.length}
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex items-center gap-1 text-micro text-ash transition-colors duration-150 hover:text-ink"
        >
          <Close className="h-3.5 w-3.5" /> Close
        </button>
      </div>

      <SceneImage key={beat.id} src={beat.imageSrc} alt={beat.imageAlt} chapter={beat.chapter} n={i + 1} />

      <div className="reveal-in flex gap-3 px-4 py-4">
        {beat.speaker && <NarratorAvatar />}
        <div className={clsx("flex-1", beat.speaker && "rounded-2xl rounded-tl-sm bg-canvas p-3")}>
          {beat.speaker && <p className="text-micro font-semibold text-accent">{beat.speaker}</p>}
          <p className={clsx("text-body text-ink", beat.speaker && "mt-0.5")}>{beat.text}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
        <div className="flex items-center gap-1.5">
          {CASE_STORY.map((b, idx) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Scene ${idx + 1}: ${b.chapter}`}
              aria-current={idx === i}
              className={clsx(
                "h-2 rounded-full transition-all duration-200",
                idx === i ? "w-6 bg-accent" : "w-2 bg-line hover:bg-ash",
              )}
            />
          ))}
          <span className="ml-2 text-micro text-ash">{beat.chapter}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setI((v) => Math.max(v - 1, 0))}
            className={clsx(
              "rounded-lg border border-line px-3 py-1.5 text-micro font-semibold transition-colors duration-150",
              i === 0 ? "text-ash/50" : "text-ink hover:border-ash",
            )}
          >
            ← Back
          </button>
          {isLast ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                scrollToAndFlash("r1-walk", "ref");
              }}
              className="btn-accent inline-flex items-center gap-1.5"
            >
              Start the walkthrough <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={() => setI((v) => v + 1)} className="btn-accent">
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Scene art with a graceful fallback: until the file exists, show what belongs there. */
function SceneImage({ src, alt, chapter, n }: { src: string; alt: string; chapter: string; n: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="relative flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 border-y border-dashed border-line bg-canvas px-6 text-center">
        <p className="text-micro font-semibold uppercase tracking-wide text-ash">
          Scene {n} · {chapter}
        </p>
        <p className="max-w-md text-caption text-ash">{alt}</p>
        <code className="rounded-md border border-line bg-paper px-2 py-1 text-micro text-ash">{src}</code>
        <p className="text-micro text-ash">Drop the image at that path and it appears here automatically.</p>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized images; a plain img keeps this dependency-free
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="aspect-[16/9] w-full border-y border-line object-cover"
    />
  );
}

/** Narrator cut-out when the art exists, initials disc when it doesn't. */
function NarratorAvatar() {
  const [failed, setFailed] = useState(false);
  const initials = NARRATOR.name
    .split(" ")
    .map((p) => p[0])
    .join("");

  if (failed) {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-caption font-semibold text-paper">
        {initials}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- see SceneImage
    <img
      src={NARRATOR.portraitSrc}
      alt={`${NARRATOR.name}, ${NARRATOR.role}`}
      onError={() => setFailed(true)}
      className="h-14 w-14 shrink-0 rounded-full object-cover object-top"
    />
  );
}
