import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getLegalPage } from "@/sanity/lib/queries";
import { PortableTextBody } from "@/components/brand/PortableTextBody";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getLegalPage("imprint");
  if (data?.seo?.seoTitle) {
    return buildMetadata({ title: data.seo.seoTitle, description: data.seo.seoDescription ?? undefined, path: "/legal/imprint" });
  }
  return buildMetadata({ title: "Impressum", description: "Impressum — required legal information per German Telemediengesetz §5 TMG. Martina Rink, Karlsruhe.", path: "/legal/imprint" });
}

export default async function ImprintPage() {
  const data = await getLegalPage("imprint");

  return (
    <article className="bg-cream pt-32 md:pt-40 pb-24">
      <div className="container-read">
        <h1 className="font-[family-name:var(--font-display)] text-[40px] text-ink mb-12">
          Impressum
        </h1>

        {/* Render Sanity body if available, otherwise show safe hardcoded fallback */}
        {data?.body && data.body.length > 0 ? (
          <PortableTextBody value={data.body} />
        ) : (
          <div className="space-y-10 text-[16px] leading-[1.75] text-ink-soft">

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Pursuant to § 5 TMG (Telemediengesetz)
              </h2>
              <p>
                Concept Studio Martina Rink UG (haftungsbeschränkt)
                <br /><br />
                Steinkreuzstr. 26b
                <br />
                76228 Karlsruhe
                <br />
                Germany
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Commercial Register
              </h2>
              <p>
                Registration number: HRB 21885
                <br />
                Registry court: Amtsgericht Traunstein
                <br /><br />
                VAT identification number: DE 283558251
                <br />
                Tax number: 34/411/11000
                <br />
                Tax office: Finanzamt Karlsruhe
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Contact
              </h2>
              <p>
                Telephone: +49 (0) 172 174 1499
                <br />
                E-mail:{" "}
                <a
                  href="mailto:contact@martinarink.com"
                  className="text-rose-btn underline underline-offset-4"
                >
                  contact@martinarink.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Responsible for content pursuant to § 18 (2) MStV
              </h2>
              <p>
                Martina Rink
                <br />
                Steinkreuzstr. 26b, 76228 Karlsruhe, Germany
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Literary Representation
              </h2>
              <p>
                Elisabeth Ruge Agentur GmbH
                <br />
                Rosenthaler Str. 34/35
                <br />
                10178 Berlin, Germany
                <br />
                <br />
                Representative: Elisabeth Ruge
                <br />
                E-mail:{" "}
                <a
                  href="mailto:info@elisabeth-ruge-agentur.de"
                  className="text-rose-btn underline underline-offset-4"
                >
                  info@elisabeth-ruge-agentur.de
                </a>
                <br />
                Telephone: +49 30 2888 406 00
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                EU Dispute Resolution
              </h2>
              <p>
                The European Commission provides an online dispute resolution
                platform:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  className="text-rose-btn underline underline-offset-4"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  ec.europa.eu/consumers/odr
                </a>
                <br />
                Our e-mail address can be found in the contact section above.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Consumer Dispute Resolution
              </h2>
              <p>
                We are neither willing nor obliged to participate in dispute
                resolution proceedings before a consumer arbitration board.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Liability for Content
              </h2>
              <p>
                As a service provider, we are responsible for our own content
                on these pages in accordance with § 7 (1) TMG and general law.
                Under §§ 8 to 10 TMG, however, we are not obliged to monitor
                transmitted or stored third-party information or to investigate
                circumstances that indicate illegal activity.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Liability for Links
              </h2>
              <p>
                Our website contains links to external third-party websites
                over whose content we have no control. We therefore accept no
                liability for that external content. The respective provider or
                operator of the linked pages is always responsible for their
                content.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Copyright
              </h2>
              <p>
                The content and works on these pages created by the site
                operator are subject to German copyright law. Reproduction,
                editing, distribution, and any form of use beyond the limits of
                copyright law require the written consent of the respective
                author or creator.
              </p>
            </section>

          </div>
        )}
      </div>
    </article>
  );
}
