/**
 * /test/stripe — Production Stripe smoke-test page.
 * NOINDEX — internal use only.
 */
import type { Metadata } from "next";
import { StripeTestForm } from "./StripeTestForm";

export const metadata: Metadata = {
  title: "Stripe smoke test",
  robots: { index: false, follow: false },
};

export default function StripeTestPage() {
  return (
    <main className="min-h-screen bg-bone flex items-center justify-center p-6">
      <StripeTestForm />
    </main>
  );
}
