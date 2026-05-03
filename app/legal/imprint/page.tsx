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
                Angaben gemäß § 5 TMG
              </h2>
              <p>
                Martina Rink UG (haftungsbeschränkt)
                <br />
                <span className="text-ink-quiet text-[14px]">auch bekannt als: Concept Studio Martina Rink</span>
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
                Registereintrag / Commercial Register
              </h2>
              <p>
                Handelsregister: HRB 21885
                <br />
                Registergericht: Amtsgericht Traunstein
                <br /><br />
                USt-IdNr. (VAT): DE 283558251
                <br />
                Steuernummer: 34/411/11000
                <br />
                Finanzamt Karlsruhe
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Kontakt
              </h2>
              <p>
                Telefon: +49 (0) 172 174 1499
                <br />
                E-Mail:{" "}
                <a
                  href="mailto:contact@martinarink.com"
                  className="text-plum underline underline-offset-4"
                >
                  contact@martinarink.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p>
                Martina Rink
                <br />
                Steinkreuzstr. 26b, 76228 Karlsruhe, Germany
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Literarische Vertretung / Literary Representation
              </h2>
              <p>
                Elisabeth Ruge Agentur GmbH
                <br />
                Rosenthaler Str. 34/35
                <br />
                10178 Berlin, Germany
                <br />
                <br />
                Vertretung: Elisabeth Ruge
                <br />
                E-Mail:{" "}
                <a
                  href="mailto:info@elisabeth-ruge-agentur.de"
                  className="text-plum underline underline-offset-4"
                >
                  info@elisabeth-ruge-agentur.de
                </a>
                <br />
                Telefon: +49 30 2888 406 00
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                EU-Streitschlichtung
              </h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  className="text-plum underline underline-offset-4"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  ec.europa.eu/consumers/odr
                </a>
                <br />
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Verbraucherstreitbeilegung / Universalschlichtungsstelle
              </h2>
              <p>
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Haftung für Inhalte
              </h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                hinweisen.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Haftung für Links
              </h2>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                oder Betreiber der Seiten verantwortlich.
              </p>
            </section>

            <section>
              <h2 className="text-[13px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
                Urheberrecht
              </h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>

          </div>
        )}
      </div>
    </article>
  );
}
