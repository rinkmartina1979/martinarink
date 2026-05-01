import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getLegalPage } from "@/sanity/lib/queries";
import { PortableTextBody } from "@/components/brand/PortableTextBody";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getLegalPage("privacy");
  if (data?.seo?.seoTitle) {
    return buildMetadata({ title: data.seo.seoTitle, description: data.seo.seoDescription ?? undefined, path: "/legal/privacy" });
  }
  return buildMetadata({ title: "Privacy Policy", description: "Privacy policy and data protection (GDPR/DSGVO) for martinarink.com.", path: "/legal/privacy" });
}

export default async function PrivacyPage() {
  const data = await getLegalPage("privacy");

  return (
    <article className="bg-cream pt-32 md:pt-40 pb-24">
      <div className="container-read">
        <h1 className="font-[family-name:var(--font-display)] text-[40px] text-ink mb-2">
          Privacy Policy
        </h1>
        <p className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-12">
          {data?.updatedAt
            ? `Last updated: ${new Date(data.updatedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`
            : "Last updated: April 2026"}
        </p>

        {/* Render Sanity body if available, otherwise show safe hardcoded fallback */}
        {data?.body && data.body.length > 0 ? (
          <PortableTextBody value={data.body} />
        ) : (
          <div className="space-y-8 text-[16px] leading-[1.75] text-ink-soft">
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
                What we collect
              </h2>
              <p>
                When you complete the private assessment, your written responses
                are collected via Tally.so. Your email address is collected via
                the assessment, the newsletter, or any contact form, and used to
                send correspondence. Booking information is collected via Calendly
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
                <li>Brevo — email correspondence and list management</li>
                <li>Calendly — booking calendar</li>
                <li>Stripe — payment processing (if applicable)</li>
                <li>Resend — transactional email notifications</li>
                <li>Vercel Analytics — anonymised usage analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mb-3">
                Your rights under GDPR/DSGVO
              </h2>
              <p>
                You have the right to access, correct, delete, or export your
                data, and to object to processing. Write to{" "}
                <a href="mailto:contact@martinarink.com" className="text-plum underline">
                  contact@martinarink.com
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
        )}
      </div>
    </article>
  );
}
