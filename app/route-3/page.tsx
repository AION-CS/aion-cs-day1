import Link from "next/link";

export const metadata = { title: "Route 3 · Level 3 · Management decision" };

export default function Route3() {
  return (
    <div className="space-y-6 pt-6">
      <div className="card space-y-3 p-6">
        <p className="smallcaps text-accent">Route 3 · Level 3 · Management decision</p>
        <h1>Built in the next release.</h1>
        <p className="max-w-prose text-body text-ash">
          Route 3 will ask you to decide and defend a retention move as a decision memo, building the report next to the
          exercises. It will quote back what you filed in Routes 1 and 2: your Task 1 verdict, your Task 2 figures and your
          recommendation.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/route-1/" className="btn-primary">
            Go to Route 1
          </Link>
          <Link href="/route-2/" className="btn-ghost">
            Go to Route 2
          </Link>
        </div>
      </div>
    </div>
  );
}
