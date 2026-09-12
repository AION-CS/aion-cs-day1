"use client";

import { useMemo } from "react";
import { useRoute3 } from "./useRoute3";
import {
  CASE_BRIEF,
  DRIVERS,
  GUIDING_DECISIONS,
  THRESHOLDS,
  TEST_DEVICES,
  REASON_CODES,
  RACI_DECISIONS,
  RACI_ROLES,
  ROLES,
  TRADE_OFFS,
  REVIEW_INDICATORS,
  CADENCES,
  BOARD_CHALLENGES,
  type RoleId,
} from "@/lib/route3";

export type ProposalData = {
  name: string;
  date: string;
  caseReference: string;
  drivers: string[];
  decisions: { position: number; letter: string; label: string }[];
  resolution: string;
  rule: { label: string; value: string }[];
  bench: { n: number; outcome: string; reason: string; mark: string | null }[];
  iterations: number;
  exceptionPath: string;
  reasonCodes: string[];
  raci: { decision: string; accountable: string | null; responsible: string[]; consulted: string[]; informed: string[] }[];
  escalation: { technician: number; teamLead: number };
  tradeoffs: { label: string; owner: string | null; stated: string | null }[];
  review: { indicator: string; cadence: string | null }[];
  trigger: string;
  challenges: { role: string; response: string | null; note: string }[];
  commitment: string;
};

const roleLabel = (id?: RoleId | string) => ROLES.find((r) => r.id === id)?.label ?? null;

export function useProposalData(): ProposalData {
  const r3 = useRoute3();

  return useMemo(() => {
    const decisions = r3.pickedDecisions
      .map((id) => {
        const d = GUIDING_DECISIONS.find((x) => x.id === id)!;
        return { position: r3.order[id] ?? 0, letter: d.letter, label: d.label };
      })
      .filter((d) => d.position > 0)
      .sort((a, b) => a.position - b.position);

    const rule = THRESHOLDS.map((t) => ({
      label: t.label,
      value: t.options.find((o) => o.id === r3.thresholds[t.key])?.label ?? "—",
    }));

    const bench = TEST_DEVICES.map((d) => {
      const res = r3.outcomes[d.id];
      return {
        n: d.n,
        outcome: res ? res.outcome : "—",
        reason: res ? res.reason : "rule incomplete",
        mark: r3.marks[d.id] ?? null,
      };
    });

    const raci = RACI_DECISIONS.map((d) => {
      const letters = (want: string) =>
        RACI_ROLES.filter((role) => r3.raci[`${d.id}:${role}`] === want).map((role) => roleLabel(role) ?? role);
      return {
        decision: d.label,
        accountable: letters("A")[0] ?? null,
        responsible: letters("R"),
        consulted: letters("C"),
        informed: letters("I"),
      };
    });

    return {
      name: r3.name || "Learner",
      date: new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }),
      caseReference: CASE_BRIEF.company,
      drivers: r3.pickedDrivers.map((id) => DRIVERS.find((d) => d.id === id)?.label ?? id),
      decisions,
      resolution: r3.resolution,
      rule,
      bench,
      iterations: r3.iterations,
      exceptionPath: r3.exceptionPath,
      reasonCodes: r3.pickedCodes.map((id) => REASON_CODES.find((c) => c.id === id)?.label ?? id),
      raci,
      escalation: {
        technician: r3.outcomeCounts.repair + r3.outcomeCounts.retire,
        teamLead: r3.outcomeCounts.escalate,
      },
      tradeoffs: TRADE_OFFS.map((t) => ({
        label: t.label,
        owner: roleLabel(r3.tradeoffOwner[t.id]),
        stated: t.options.find((o) => o.id === r3.tradeoffDefault[t.id])?.label ?? null,
      })),
      review: r3.pickedIndicators.map((id) => ({
        indicator: REVIEW_INDICATORS.find((i) => i.id === id)?.label ?? id,
        cadence: CADENCES.find((c) => c.id === r3.cadence[id])?.label ?? null,
      })),
      trigger: r3.trigger,
      challenges: BOARD_CHALLENGES.map((c) => ({
        role: c.role,
        response: c.options.find((o) => o.id === r3.challenge[c.id])?.label ?? null,
        note: r3.challengeNote[c.id] ?? "",
      })),
      commitment: r3.commitment,
    };
  }, [r3]);
}
