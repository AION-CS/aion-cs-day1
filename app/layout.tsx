import type { Metadata } from "next";
import "@/styles/globals.css";
import { CASE } from "@/lib/routes";
import { TopBar } from "@/components/chrome/TopBar";
import { Footer } from "@/components/chrome/Footer";

export const metadata: Metadata = {
  title: `AION Green IT — ${CASE.module}`,
  description:
    "Innovations for the sustainable IT of tomorrow — sustainable innovation, artificial intelligence and the circular economy. The learner working companion for Day 15.",
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
