import { SectionRail } from "@/components/chrome/SectionRail";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriA, MateriB } from "@/components/materi/Materi";
import { Task1 } from "@/components/task1/Task1";
import { Task2 } from "@/components/task2/Task2";
import { ResetRoute } from "@/components/ui/ResetRoute";

export const metadata = { title: "Route 1 · Level 1 + Level 2 — Retention Lab · Day 1" };

export default function Route1() {
  return (
    <div className="space-y-8 pt-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">Route 1 · Level 1 · Knowledge → Level 2 · Application</p>
        <h1>Diagnose the file, then calculate the re-tender</h1>
      </header>
      <SuggestedOrderBanner />
      <SectionRail />
      <MateriA />
      <Task1 />
      <MateriB />
      <Task2 />
      <ResetRoute />
    </div>
  );
}
