"use client";

import Link from "next/link";
import { useHydrated } from "@/lib/store";
import { useRouteUnlocked } from "@/lib/routeGating";
import { ROUTES } from "@/lib/routes";
import { Info } from "@/components/icons/LineIcons";

/**
 * Never blocks access — every route is always explorable. If the previous
 * route's export hasn't been submitted yet, shows a non-blocking heads-up
 * recommending the intended order instead of hiding the page.
 */
export function RouteGate({ routeN, children }: { routeN: 2 | 3; children: React.ReactNode }) {
  const hydrated = useHydrated();
  const unlocked = useRouteUnlocked(routeN);
  const prevRoute = ROUTES[routeN - 2];

  return (
    <>
      {hydrated && !unlocked && (
        <div className="mb-10 flex items-start gap-3 rounded-xl border border-line bg-canvas p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-ash" />
          <p className="text-caption text-ash">
            Suggested order: {" "}
            <Link href={prevRoute.href} className="font-semibold text-ink underline underline-offset-2">
              {prevRoute.tag}
            </Link>{" "}
            first. This route is written to stand on its own — every concept it needs is taught here, so nothing is
            missing if you start at this one.
          </p>
        </div>
      )}
      {children}
    </>
  );
}
