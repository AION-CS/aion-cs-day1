import Link from "next/link";

export const metadata = { title: "Route 2 · Level 3 · Management decision" };

export default function Route2() {
  return (
    <div className="space-y-6 pt-6">
      <div className="card space-y-3 p-6">
        <p className="smallcaps text-accent">Route 2 · Level 3 · Management decision</p>
        <h1>Built in the next release.</h1>
        <p className="max-w-prose text-body text-ash">
          Route 2 will ask you to decide and defend a retention move as a decision memo, building the report next to the
          exercises. It will quote back what you filed in Route 1: your Task 1 verdict, your Task 2 figures and your
          recommendation.
        </p>
        <Link href="/route-1/" className="btn-primary inline-flex">
          Go to Route 1
        </Link>
      </div>
    </div>
  );
}
