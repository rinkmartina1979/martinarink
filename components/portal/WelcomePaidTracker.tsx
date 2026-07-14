"use client";

import { useEffect, useRef } from "react";
import { trackFunnel } from "@/lib/analytics/events";

interface WelcomePaidTrackerProps {
  variantKey: string | null;
}

/**
 * Fires balance_paid once on mount. Renders nothing.
 *
 * Only ever rendered by app/members/[token]/welcome/page.tsx inside the
 * branch that has already verified the Stripe session server-side — this
 * component never performs its own verification.
 */
export function WelcomePaidTracker({ variantKey }: WelcomePaidTrackerProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackFunnel("balance_paid", { variantKey: variantKey ?? undefined });
  }, [variantKey]);

  return null;
}
