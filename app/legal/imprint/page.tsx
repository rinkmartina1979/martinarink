import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Impressum",
  description: "Impressum — required legal information per German Telemediengesetz §5 TMG.",
  path: "/legal/imprint",
});

export default function ImprintPage() {
  return (
    <article className="bg-cream pt-32 md:pt-40 pb-24">
      <div className="container-read">
        <h1 className="font-[family-name:var(--font-display)] text-[40px] text-ink mb-12">
          Impressum
        </h1>

        <div className="space-y-8 text-[16px] leading-[1.75] text-ink-soft">
          <section>
            <h2 className="text-[14px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              Martina Rink
              <br />
              [Full legal address — confirm with client]
              <br />
              [City, postcode]
              <br />
              Germany
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
              Kontakt
            </h2>
            <p>
              E-Mail:{" "}
              <a href="mailto:hello@martinarink.com" className="text-wine underline">
                hello@martinarink.com
              </a>
              <br />
              Telefon: +49 (0) 172 174 1499
            </p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
              Umsatzsteuer-Identifikationsnummer
            </h2>
            <p>[USt-IdNr — to confirm with client]</p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p>Martina Rink — address as above</p>
          </section>

          <section>
            <h2 className="text-[14px] uppercase tracking-[0.18em] text-ink-quiet mb-3">
              EU-Streitschlichtung
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                className="text-wine underline"
              >
                ec.europa.eu/consumers/odr
              </a>
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
