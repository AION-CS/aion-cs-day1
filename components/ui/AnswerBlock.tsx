import type { ReactNode } from "react";

export type BlockKind = "OBJECTIVE" | "JUDGED" | "OBJECTIVE + JUDGED" | "EXPLORATORY";

export function Pill({ kind }: { kind: BlockKind }) {
  if (kind === "OBJECTIVE + JUDGED") {
    return (
      <>
        <Pill kind="OBJECTIVE" />
        <Pill kind="JUDGED" />
      </>
    );
  }
  const cls = kind === "OBJECTIVE" ? "pill-obj" : kind === "EXPLORATORY" ? "pill border-line bg-mist text-ash" : "pill-jdg";
  return (
    <span className={cls} title={kind === "OBJECTIVE" ? "One answer the file or the tables settle." : kind === "EXPLORATORY" ? "Not graded and not exported." : "Your judgement, defended in your own words."}>
      {kind}
    </span>
  );
}

/** The FIND IT line: exact route + widget name as printed on screen + the exact click. */
export function FindIt({ path, analyse = true }: { path: string; analyse?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-caption text-ash">
        <span className="smallcaps mr-1 text-accent">FIND IT</span>· {path}
      </p>
      {analyse && (
        <p className="text-caption italic text-ash">Analyse in the app. Write your result in the answer area below.</p>
      )}
    </div>
  );
}

/** One answer block: heading + pill, FIND IT line, then a separate blank answer area directly beneath. */
export function AnswerBlock({
  id,
  title,
  kind,
  findIt,
  children,
  analyse = true,
}: {
  id?: string;
  title: string;
  kind: BlockKind;
  findIt: string;
  analyse?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="card space-y-3 p-4 md:p-5">
      <header className="flex flex-wrap items-center gap-2">
        <h3>{title}</h3>
        <Pill kind={kind} />
      </header>
      <FindIt path={findIt} analyse={analyse} />
      <div className="space-y-4 border-t border-line pt-3">{children}</div>
    </section>
  );
}
