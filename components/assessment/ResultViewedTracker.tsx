"use client";

import { useEffect, useRef } from "react";
import { trackAssessment } from "@/lib/analytics/events";

interface ResultViewedTrackerProps {
  archetype: string;
  serviceIntent: string;
  readinessLevel: string;
  privacyNeed: string;
}

/** Fires assessment_result_viewed once on mount. Renders nothing. */
export function ResultViewedTracker({
  archetype,
  serviceIntent,
  readinessLevel,
  privacyNeed,
}: ResultViewedTrackerProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackAssessment("assessment_result_viewed", {
      archetype,
      serviceIntent,
      readinessLevel,
      privacyNeed,
    });
  }, [archetype, serviceIntent, readinessLevel, privacyNeed]);

  return null;
}
