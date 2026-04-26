import { Eyebrow } from "@/components/brand/Eyebrow";
import { GhostButton } from "@/components/brand/GhostButton";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Press & Speaking",
  description:
    "Press information, biography, and speaking enquiries for Martina Rink — Spiegel Bestseller author, former PA to Isabella Blow, private mentor.",
  path: "/press",
});

const TOPICS = [
  "The intelligent woman&rsquo;s guide to re-examining alcohol",
  "Identity in the second half of a serious career",
  "What high-achieving women use to manage a life that has become too successful to complain about",
  "The gap between leadership and inhabiting your own life",
];

export default function PressPage() {
  return (
    <>
      <section className="bg-cream pt-32 md:pt-40 pb-16">
        <div className="container-content max-w-3xl">
          <Eyebrow withLine>Press &amp; Speaking</Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[52px] leading-tight text-ink">
            A voice at the intersection of identity, culture, and the examined
            life.
          </h1>
          <p className="mt-8 text-[17px] leading-[1.75] text-ink-soft">
            Martina Rink is available for press interviews, podcast
            conversations, panel discussions, and keynote engagements on the
            subjects of women&rsquo;s identity, leadership at midlife, the
            intelligent approach to sobriety, and cultural observations on how
            high-achieving women actually live.
          </p>
        </div>
      </section>

      <section className="bg-bone section-pad">
        <div className="container-content max-w-4xl">
          <h2 className="font-[family-name:var(--font-display)] italic text-[36px] text-ink">
            Books.
          </h2>
          <div className="mt-10 space-y-6">
            <div>
              <p className="font-[family-name:var(--font-display)] text-[24px] text-ink">
                People of Deutschland
              </p>
              <p className="mt-2 text-[15px] text-ink-soft">
                A documentary book co-created with [co-creator]. Featured
                extensively in national media.
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-[24px] text-ink">
                Spiegel Bestseller
              </p>
              <p className="mt-2 text-[15px] text-ink-soft">
                [Title — to confirm with Martina]
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="speaking" className="bg-ink section-pad">
        <div className="container-content max-w-3xl">
          <h2 className="font-[family-name:var(--font-display)] italic text-[36px] text-cream">
            Speaking.
          </h2>
          <p className="mt-6 text-[17px] leading-[1.7] text-cream/80">
            Martina speaks for audiences of senior women and the organisations
            that work with them.
          </p>
          <ul className="mt-10 space-y-4 text-[16px] leading-[1.7] text-cream/85">
            {TOPICS.map((topic, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-pink mt-2 select-none">—</span>
                <span dangerouslySetInnerHTML={{ __html: topic }} />
              </li>
            ))}
          </ul>
          <p className="mt-12 text-[16px] text-cream/85">
            For press or speaking enquiries:{" "}
            <a
              href="mailto:hello@martinarink.com"
              className="font-[family-name:var(--font-display)] italic text-pink underline underline-offset-4"
            >
              hello@martinarink.com
            </a>
          </p>
        </div>
      </section>

      <section className="bg-cream section-pad">
        <div className="container-content max-w-3xl">
          <h2 className="font-[family-name:var(--font-display)] text-[28px] text-ink">
            Press materials.
          </h2>
          <div className="mt-8 bg-bone p-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ink-quiet mb-4">
              25-word bio
            </p>
            <p className="text-[16px] leading-[1.7] text-ink-soft">
              Martina Rink is a private mentor, Spiegel Bestseller author, and
              former personal assistant to Isabella Blow. She works with
              executive women on identity and sobriety.
            </p>
          </div>
          <div className="mt-6">
            <GhostButton href="/contact">Download headshot</GhostButton>
          </div>
        </div>
      </section>
    </>
  );
}
