import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { getLegalPage } from "@/sanity/lib/queries";
import { PortableTextBody } from "@/components/brand/PortableTextBody";
import { SITE } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getLegalPage("terms");
  if (data?.seo?.seoTitle) {
    return buildMetadata({ title: data.seo.seoTitle, description: data.seo.seoDescription ?? undefined, path: "/legal/terms" });
  }
  return buildMetadata({ title: "General Terms & Conditions", description: "General Terms and Conditions — Concept Studio Martina Rink UG. Version 1.0, January 2025.", path: "/legal/terms" });
}

export default async function TermsPage() {
  const data = await getLegalPage("terms");

  return (
    <article className="bg-cream pt-32 md:pt-40 pb-24">
      <div className="container-read">
        <h1 className="font-[family-name:var(--font-display)] text-[40px] text-ink mb-2">
          General Terms &amp; Conditions
        </h1>
        <p className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-2">
          {data?.updatedAt
            ? `Last updated: ${new Date(data.updatedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`
            : "Version 1.0 — January 2025"}
        </p>
        <p className="text-[13px] text-ink-quiet mb-12">
          Concept Studio Martina Rink UG (haftungsbeschränkt) &middot; Steinkreuzstr. 26b, 76228 Karlsruhe, Germany
        </p>

        {data?.body && data.body.length > 0 ? (
          <PortableTextBody value={data.body} />
        ) : (
          <div className="space-y-10 text-[16px] leading-[1.75] text-ink-soft">

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">1. Basic Rules and Scope</h2>
              <p className="mb-3">1.1. These General Terms and Conditions (&ldquo;GTC&rdquo;) apply to all contractual relationships between Concept Studio Martina Rink UG (haftungsbeschränkt), Steinkreuzstrasse 26b, 76228 Karlsruhe (&ldquo;Coach&rdquo; or &ldquo;Provider&rdquo;) and its clients, unless otherwise agreed in writing.</p>
              <p className="mb-3">1.2. By booking coaching services, the client accepts these GTC.</p>
              <p>1.3. Deviating client terms do not become part of the contract unless the Coach expressly agrees in writing.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">2. Coaching Services</h2>
              <p className="mb-3">2.1. The Coach provides: (i) individual time-limited coaching sessions; (ii) coaching packages (a predefined number of sessions over a set period); and/or (iii) coaching events, seminars, and workshops.</p>
              <p className="mb-3">2.2. Life coaching supports personal development, goal achievement, and quality of life. The process is solution- and future-oriented, based on a partnership dialogue between coach and client.</p>
              <p className="mb-3">2.3. Life coaching is not psychotherapy and does not replace psychotherapeutic or psychiatric treatment. The Coach makes no diagnoses and gives no promises of healing. Where signs of mental illness appear, the Coach refers the client to appropriate specialists.</p>
              <p>2.4. Coaching requires active client participation. The Provider makes no guarantees as to specific outcomes. Success depends largely on the client&rsquo;s own initiative and willingness to reflect and implement.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">3. Conclusion of Contract</h2>
              <p className="mb-3">3.1. The contract is concluded upon signing of an individual coaching contract, or when the client submits a booking request (offer) and the Coach confirms it (acceptance).</p>
              <p className="mb-3">3.2. Bookings may be made via the website, email, or verbally.</p>
              <p className="mb-3">3.3. The Provider confirms bookings in text form (e.g. email).</p>
              <p>3.4. On receipt of the booking confirmation, the client undertakes to complete and return the enclosed questionnaire before the first session.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">4. Services and Availability</h2>
              <p className="mb-3">4.1. Coaching is delivered in person, by telephone, or online as agreed.</p>
              <p className="mb-3">4.2. Fixed availability times are agreed for each client. In cases of unforeseen events (sudden illness, force majeure), the Provider&rsquo;s temporary unavailability does not constitute a breach of contract.</p>
              <p>4.3. The Provider aims to respond to messages promptly but cannot guarantee immediate responses.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">5. Remuneration and Payment</h2>
              <p className="mb-3">5.1. Fees are as stated on the website or as quoted individually.</p>
              <p className="mb-3">5.2. Payment is made in advance by PayPal or bank transfer.</p>
              <p className="mb-3">5.3. Instalment payments require express Provider consent and are available in justified exceptional cases.</p>
              <p className="mb-3">5.4–5.8. Package bookings are effective upon full payment confirmation and Provider booking confirmation. Standard processing time for bank transfers is 3–4 working days.</p>
              <p className="mb-3">5.9. All prices include statutory VAT where applicable.</p>
              <p>5.10–5.12. Late payment: after 14 calendar days of default, the Coach may suspend services. After a written reminder and further 7–14 day grace period, the Coach may terminate the contract extraordinarily.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">6. Cancellations and Missed Appointments</h2>
              <p className="mb-3">6.1. Appointments are made by mutual agreement.</p>
              <p className="mb-3">6.2. Appointments may be cancelled or postponed free of charge up to 48 hours before the start.</p>
              <p className="mb-3">6.3. Cancellations or no-shows with less than 48 hours&rsquo; notice are considered as sessions provided. No refund or free rescheduling applies.</p>
              <p>6.4. If the Coach cancels for unforeseen reasons, an alternative appointment is arranged at no additional cost.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">7. Termination</h2>
              <p className="mb-3">7.1. After a booking confirmation for an individual session, cancellation by the client is excluded, subject to statutory consumer withdrawal rights.</p>
              <p className="mb-3">7.2. Coaching packages already commenced may be terminated with one month&rsquo;s notice to the end of the current month. Notice must be given in text form. Payments already made are non-refundable.</p>
              <p>7.3. The Coach reserves the right to terminate extraordinarily for good cause (e.g. repeated late payment, inappropriate behaviour). Unused services are reimbursed on a pro-rata basis.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">8. Liability</h2>
              <p className="mb-3">8.1. The Provider is not liable for damages except those based on proven intentional or grossly negligent breaches of duty.</p>
              <p className="mb-3">8.2. Liability for simple negligence is excluded unless material contractual obligations are violated, in which case it is limited to typical foreseeable damage.</p>
              <p className="mb-3">8.3. The Coach accepts no liability for decisions or actions taken by the client on the basis of the coaching process.</p>
              <p>8.4. Liability is limited to the fee paid for the respective coaching session.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">9. Website Content</h2>
              <p className="mb-3">9.1. Website content is provided for information purposes only. The Provider assumes no liability for accuracy, completeness, or currency.</p>
              <p>9.2. The Provider accepts no liability for the content of linked third-party sites.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">10. Intellectual Property</h2>
              <p className="mb-3">10.1. All website content and coaching materials are protected by copyright. The Provider retains all rights.</p>
              <p className="mb-3">10.2. Content may not be reproduced or distributed without express written consent.</p>
              <p>10.3. Clients receive a non-exclusive, non-transferable, time-limited licence for personal use of materials provided.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">11. Confidentiality and Data Protection</h2>
              <p className="mb-3">11.1. All information exchanged during the coaching relationship is treated confidentially by both parties. Disclosure to third parties requires prior written consent.</p>
              <p className="mb-3">11.2. The obligation of confidentiality ceases if: there is a legal obligation to disclose; a judicial order requires disclosure; the information is already in the public domain; or disclosure is necessary to enforce justified claims.</p>
              <p>11.3. Personal data is processed in accordance with the GDPR. See the separate{" "}
                <Link href="/legal/privacy" className="text-plum underline underline-offset-4">Privacy Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">12. Right of Withdrawal (Consumers)</h2>
              <p className="mb-3">12.1. Consumers who have concluded the contract online, by telephone, or by other distance communication means have a statutory right of withdrawal of 14 days from conclusion of the contract.</p>
              <p className="mb-3">12.2. To exercise the right of withdrawal, notify us in text form (e.g. email) to{" "}
                <a href={`mailto:${SITE.email}`} className="text-plum underline underline-offset-4">{SITE.email}</a>.
              </p>
              <p className="mb-3">12.3. The complete cancellation policy and withdrawal form are available at{" "}
                <Link href="/legal/cancellation" className="text-plum underline underline-offset-4">/legal/cancellation</Link>.
              </p>
              <p>12.4. Refunds are made within 14 days via the original payment method. Where services commenced during the withdrawal period, a proportionate amount is due.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">13. Jurisdiction</h2>
              <p className="mb-3">13.1. For consumers in Germany, statutory jurisdiction provisions apply.</p>
              <p className="mb-3">13.2. For consumers in Spain, claims may be brought in the courts of the client&rsquo;s domicile or in Karlsruhe.</p>
              <p>13.3. For commercial clients, exclusive jurisdiction is Karlsruhe, Germany.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">14. Governing Law</h2>
              <p>German law applies. Where the client is a consumer in Spain, mandatory Spanish consumer protection provisions remain unaffected. This English text is a translation for convenience; the original German version prevails in the event of any inconsistency.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">15. Severability</h2>
              <p>The invalidity of individual provisions does not affect the validity of the contract as a whole. Invalid provisions are replaced by the nearest legally effective equivalent.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-display)] text-[22px] text-ink mb-4">16. Amendments</h2>
              <p>The Provider reserves the right to amend these GTC with six weeks&rsquo; written notice to clients. If no objection is raised within the notice period, the amended GTC are deemed accepted.</p>
            </section>

          </div>
        )}
      </div>
    </article>
  );
}
