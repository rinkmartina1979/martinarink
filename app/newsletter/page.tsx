import { Eyebrow } from "@/components/brand/Eyebrow";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "The Sober Muse Letter",
  description:
    "A letter, once a week. For the woman who reads carefully. Identity, leadership, the examined life. Read by a small number of women.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <>
      <section className="bg-cream pt-32 md:pt-40 pb-16">
        <div className="container-content max-w-2xl mx-auto text-center">
          <Eyebrow className="justify-center" withLine>
            The Sober Muse Letter
          </Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[60px] leading-tight text-ink">
            A letter, once a week. For the woman who reads carefully.
          </h1>
          <div className="mt-10 space-y-5 text-[17px] leading-[1.75] text-ink-soft text-left">
            <p>
              I write about identity, leadership, and the examined life. About
              what high-achieving women use alcohol for — and what they discover
              when they stop. About the particular loneliness of external
              success. About coming home to yourself.
            </p>
            <p>
              It is not a newsletter. It is a correspondence. It goes to a small
              number of women. It never tries to sell you anything until the
              moment it makes sense to.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream pb-24">
        <div className="container-content">
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
