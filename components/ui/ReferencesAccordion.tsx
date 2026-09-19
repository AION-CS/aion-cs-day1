import { REFERENCES, REFERENCE_ORDER } from "@/data/references";
import type { RefKey } from "@/data/references";

/** The block's own reference list — the union of what its cards cite, in the supplied order. */
export function ReferencesAccordion({ block, keys }: { block: "A" | "B"; keys: RefKey[] }) {
  const set = new Set(keys);
  const ordered = REFERENCE_ORDER.filter((k) => set.has(k));
  return (
    <details id={`refs-${block}`} className="card p-4">
      <summary className="cursor-pointer font-semibold text-ink">
        References · Materi {block} <span className="font-normal text-ash">({ordered.length})</span>
      </summary>
      <ul className="mt-3 space-y-2 text-caption text-ash">
        {ordered.map((k) => (
          <li key={k} id={`ref-${block}-${k}`} className="rounded-md p-1 pl-2">
            {REFERENCES[k].full}
          </li>
        ))}
      </ul>
    </details>
  );
}
