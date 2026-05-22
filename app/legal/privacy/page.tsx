import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getLegalPage } from "@/sanity/lib/queries";
import { PortableTextBody } from "@/components/brand/PortableTextBody";
import { SITE } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getLegalPage("privacy");
  if (data?.seo?.seoTitle) {
    return buildMetadata({ title: data.seo.seoTitle, description: data.seo.seoDescription ?? undefined, path: "/legal/privacy" });
  }
  return buildMetadata({ title: "Privacy Policy", description: "Privacy policy and data protection (GDPR/DSGVO) for martinarink.com — Concept Studio Martina Rink UG.", path: "/legal/privacy" });
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
            : "Last updated: January 2025"}
        </p>

        {data?.body && data.body.length > 0 ? (
          <PortableTextBody value={data.body} />
        ) : (
          <div className="space-y-10 text-[16px] leading-[1.75] text-ink-soft">

            <section>
              <p>
                The protection of personal data is a high priority for us. Below we inform you about
                the processing of your personal data by Concept Studio Martina Rink UG (haftungsbeschränkt)
                in accordance with the Federal Data Protection Act (BDSG) and the General Data Protection
                Regulation (GDPR — Regulation (EU) 2016/679).
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">1. Data Controller</h2>
              <p>Responsible within the meaning of Art. 4 No. 7 GDPR:</p>
              <address className="mt-3 not-italic space-y-1 text-ink-soft">
                <p>Concept Studio Martina Rink UG (haftungsbeschränkt)</p>
                <p>Steinkreuzstr. 26b, 76228 Karlsruhe, Germany</p>
                <p>
                  E-mail:{" "}
                  <a href={`mailto:${SITE.email}`} className="text-plum underline underline-offset-4">
                    {SITE.email}
                  </a>
                </p>
                <p>Phone: +49 172 174 1499</p>
              </address>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">2. Types of Data Collected</h2>
              <ul className="space-y-2 list-disc pl-6">
                <li><strong>Access Data:</strong> IP address, date/time of access, browser type, operating system, referrer URL.</li>
                <li><strong>Communication Data:</strong> Name, email address, telephone number, and message content submitted via contact forms or email.</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent on the website.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">3. Purpose and Legal Basis</h2>
              <p className="mb-3"><strong>a) Website access:</strong> Access data is processed to ensure smooth operation, present content correctly, and optimise the website. Legal basis: Art. 6(1)(f) GDPR (legitimate interest).</p>
              <p><strong>b) Contact:</strong> Communication data is processed to respond to enquiries. Legal basis: Art. 6(1)(a) GDPR (consent) for voluntary provision; Art. 6(1)(b) GDPR (performance of a contract) where the enquiry concerns a cooperation.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">4. Storage and Deletion</h2>
              <p>Personal data is stored only for as long as necessary to achieve the processing purposes or as required by statutory retention obligations.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">5. Disclosure to Third Parties</h2>
              <p className="mb-3">Personal data is not transferred to third parties for purposes other than those described. We share your data only where:</p>
              <ul className="space-y-2 list-disc pl-6">
                <li>You have given express consent (Art. 6(1)(a) GDPR);</li>
                <li>It is necessary for the performance of a contract (Art. 6(1)(b) GDPR);</li>
                <li>There is a legal obligation (Art. 6(1)(c) GDPR); or</li>
                <li>It is necessary for the assertion, exercise or defence of legal claims (Art. 6(1)(f) GDPR).</li>
              </ul>
              <p className="mt-4">This site uses the following data processors: Vercel (hosting), Sanity (content management), Brevo (email), Cal.com (booking), Stripe (payments), Resend (transactional email), Vercel Analytics (anonymised usage).</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">6. International Data Transfers</h2>
              <p>Where data is transferred outside the European Union, we ensure an adequate level of data protection in accordance with Art. 44 ff. GDPR.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">7. Your Rights</h2>
              <p className="mb-3">As a data subject under the GDPR you have the right to:</p>
              <ul className="space-y-2 list-disc pl-6">
                <li>Request information about your personal data processed by us (Art. 15 GDPR);</li>
                <li>Rectification of inaccurate data (Art. 16 GDPR);</li>
                <li>Erasure of your data (Art. 17 GDPR);</li>
                <li>Restriction of processing (Art. 18 GDPR);</li>
                <li>Data portability (Art. 20 GDPR);</li>
                <li>Object to processing (Art. 21 GDPR);</li>
                <li>Withdraw consent at any time without affecting prior lawful processing.</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, write to{" "}
                <a href={`mailto:${SITE.email}`} className="text-plum underline underline-offset-4">
                  {SITE.email}
                </a>
                . We respond within 30 days. You also have the right to lodge a complaint with your
                supervisory authority (in Germany: Landesbeauftragter für Datenschutz und
                Informationsfreiheit Baden-Württemberg).
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">8. Cookies</h2>
              <p>
                This site uses cookies for functionality and, where consented, anonymised analytics.
                You may adjust your preferences via the cookie banner at any time.
              </p>
            </section>

          </div>
        )}
      </div>
    </article>
  );
}
