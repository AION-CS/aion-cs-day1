"use client";

import { useMemo } from "react";
import { useRoute3 } from "./useRoute3";
import { SKYBRIDGE_EVIDENCE, DECISION_NODES, LEVERS, HORIZONS, PROPOSAL_ROLES, HELIX } from "@/lib/route3";

export type ManagementReportData = {
  name: string;
  date: string;
  caseReference: string;
  architectureByNode: { node: string; items: string[] }[];
  chosenLevers: { text: string; reason: string }[];
  roadmap: { horizon: string; levers: string[] }[];
  firstMove: string;
  firstMoveJustify: string;
  strategicRelevance: string;
  guidingDecisions: string[];
  prioritizationLogic: string;
  tradeoffs: string[];
  firstMeasure: string;
  firstMeasureJustify: string;
  roles: { label: string; approves: string; reviews: string }[];
  decideNow: string;
  waitingMeans: string;
};

/** Joins Route 3's state to the case content to assemble the live Management Proposal. */
export function useManagementReportData(): ManagementReportData {
  const r3 = useRoute3();

  return useMemo(() => {
    const architectureByNode = DECISION_NODES.map((n) => ({
      node: n.label,
      items: SKYBRIDGE_EVIDENCE.filter((it) => r3.stage2Node[it.id] === n.id).map((it) => it.text),
    })).filter((g) => g.items.length > 0);

    const chosenLevers = r3.stage3Selected.map((id) => ({
      text: LEVERS.find((l) => l.id === id)?.text ?? id,
      reason: r3.stage3Reason[id] ?? "",
    }));

    const roadmap = HORIZONS.map((h) => ({
      horizon: h.label,
      levers: r3.stage4Levers.filter((l) => r3.stage4Horizon[l.id] === h.id).map((l) => l.text),
    })).filter((g) => g.levers.length > 0);

    return {
      name: r3.name || "Learner",
      date: new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }),
      caseReference: HELIX.company,
      architectureByNode,
      chosenLevers,
      roadmap,
      firstMove: LEVERS.find((l) => l.id === r3.firstMove)?.text ?? "",
      firstMoveJustify: r3.firstMoveJustify,
      strategicRelevance: r3.strategicRelevance,
      guidingDecisions: r3.guidingDecisions.filter((d) => d.trim()),
      prioritizationLogic: r3.prioritizationLogic,
      tradeoffs: r3.tradeoffs.filter((t) => t.trim()),
      firstMeasure: r3.firstMeasure,
      firstMeasureJustify: r3.firstMeasureJustify,
      roles: PROPOSAL_ROLES.map((role) => ({
        label: role.label,
        approves: r3.roleFields[role.id]?.approves ?? "",
        reviews: r3.roleFields[role.id]?.reviews ?? "",
      })),
      decideNow: r3.decideNow,
      waitingMeans: r3.waitingMeans,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r3]);
}
