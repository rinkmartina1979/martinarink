"use client";

import { useEffect, useRef } from "react";
import { trackFunnel } from "@/lib/analytics/events";

/**
 * Fires deposit_paid once on mount. Renders nothing.
 *
 * Only ever rendered by app/book/schedule/page.tsx inside the branch that
 * has already verified payment_status === 'paid' server-side via Stripe —
 * this component never performs its own verification.
 */
export function DepositPaidTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackFunnel("deposit_paid");
  }, []);

  return null;
}
