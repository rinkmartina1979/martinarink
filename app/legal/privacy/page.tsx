import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy policy and data protection (GDPR/DSGVO) for martinarink.com.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="bg-cream pt-32 md:pt-40 pb-24">
      <div className="container-read">
        <h1 className="font-[family-name:var(--font-display)] text-[40px] text-ink mb-2">
          Privacy Policy
        </h1>
        <p className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-12">
          Last updated: April 2026 — DRAFT pending legal review
        </p>

        <div className="space-y-8 text-[16px] leading-[1.75] text-ink-soft">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
              What we collect
            </h2>
            <p>
              When you complete the private assessment, your written responses
              are collected via Tally.so. Your email address is collected via
              the assessment, the newsletter, or any contact form, and used to
              send correspondence. Booking information is collected via Cal.com
              when you book a consultation. Payment information is processed
              securely by Stripe.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
              Third-party processors
            </h2>
            <p>This site uses the following data processors:</p>
            <ul className="mt-3 space-y-1 list-disc pl-6">
              <li>Vercel — hosting and edge network</li>
              <li>Sanity — content management</li>
              <li>Kit — email correspondence</li>
              <li>Tally.so — assessment forms</li>
              <li>Cal.com — booking calendar</li>
              <li>Stripe — payment processing</li>
              <li>Resend — transactional email</li>
              <li>Google Analytics 4 — anonymised analytics</li>
              <li>Microsoft Clarity — session analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
              Your rights under GDPR/DSGVO
            </h2>
            <p>
              You have the right to access, correct, delete, or export your
              data, and to object to processing. Write to{" "}
              <a href="mailto:hello@martinarink.com" className="text-wine underline">
                hello@martinarink.com
              </a>
              . We respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
              Cookies
            </h2>
            <p>
              This site uses cookies for functionality and, where consented,
              analytics. You may adjust your preferences via the cookie banner.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
