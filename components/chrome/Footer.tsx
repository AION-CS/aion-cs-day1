"use client";

import { useState } from "react";
import { COURSE } from "@/lib/routes";
import { MentorModal } from "@/components/chrome/MentorModal";

export function Footer() {
  const [mentor, setMentor] = useState(false);
  return (
    <footer className="mt-16 border-t border-line bg-paper print:hidden">
      <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-6 md:px-6">
        <p className="max-w-prose text-caption text-ash">
          {COURSE.title} — {COURSE.module}. Every company in the cases is fictional, for training use. Your work is
          saved in this browser only; nothing leaves your device.
        </p>
        <button
          type="button"
          onClick={() => setMentor(true)}
          className="text-caption text-ash underline decoration-dotted underline-offset-2 hover:text-ink"
        >
          Mentor
        </button>
      </div>
      {mentor && <MentorModal onClose={() => setMentor(false)} />}
    </footer>
  );
}
