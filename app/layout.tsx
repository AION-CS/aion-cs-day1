import type { Metadata } from "next";
import "@/styles/globals.css";
import { COURSE } from "@/lib/routes";
import { TopBar } from "@/components/chrome/TopBar";
import { Footer } from "@/components/chrome/Footer";
import { ParticipantStrip } from "@/components/chrome/ParticipantStrip";
import { StoreHydrator } from "@/components/chrome/StoreHydrator";
import { MentorBar } from "@/components/chrome/MentorBar";
import { GlossaryPanel } from "@/components/chrome/GlossaryPanel";

export const metadata: Metadata = {
  title: `${COURSE.site} — ${COURSE.title}`,
  description:
    "Self-study companion for Customer Retention & Buying Behaviour in B2B IT Sales: study material, two working documents and a live evidence board.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <StoreHydrator />
        <MentorBar />
        <TopBar />
        <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 pb-8 md:px-6">
          <ParticipantStrip />
          {children}
        </main>
        <Footer />
        <GlossaryPanel />
      </body>
    </html>
  );
}
