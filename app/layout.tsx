import type { Metadata } from "next";
import "@/styles/globals.css";
import { CASE } from "@/lib/routes";
import { TopBar } from "@/components/chrome/TopBar";
import { Footer } from "@/components/chrome/Footer";

export const metadata: Metadata = {
  title: `AION Green IT — ${CASE.module}`,
  description:
    "Energy-efficient software and green coding principles — the learner working companion for Day 10.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-canvas">
        <TopBar />
        <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 md:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
