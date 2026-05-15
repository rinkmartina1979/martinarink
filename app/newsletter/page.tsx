import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { buildMetadata, breadcrumbSchema } from "@/lib/metadata";
import { getNewsletterPage } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getNewsletterPage();
  if (data?.seo?.seoTitle) {
    return buildMetadata({
      title: data.seo.seoTitle,
      description: data.seo.seoDescription ?? undefined,
      path: "/newsletter",
    });
  }
  return buildMetadata({
    title: "The Sober Muse Letter",
    description:
      "A letter, once a week. For the woman who reads carefully. Identity, leadership, the examined life. Read by a small number of women.",
    path: "/newsletter",
  });
}

export default async function NewsletterPage() {
  const data = await getNewsletterPage();

  const headline =
    data?.headline ?? "A letter, once a week. For the woman who reads carefully.";
  const subheadline = data?.subheadline ?? null;
  const trustNote = data?.trustNote ?? null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([{ name: "Newsletter", path: "/newsletter" }]),
          ),
        }}
      />
      <section className="bg-cream pt-32 md:pt-40 pb-16">
        <div className="container-content grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-7">
            <Eyebrow withLine>The Sober Muse Letter</Eyebrow>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[56px] leading-tight text-ink">
              {headline}
            </h1>
            {subheadline && (
              <p className="mt-6 text-[18px] leading-[1.75] text-ink-soft">
                {subheadline}
              </p>
            )}
            <div className="mt-10 space-y-5 text-[17px] leading-[1.75] text-ink-soft">
              {data?.bodyCopy ? (
                data.bodyCopy.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <>
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
                </>
              )}
            </div>
            {trustNote && (
              <p className="mt-6 text-[14px] text-ink-quiet">
                {trustNote}
              </p>
            )}
          </div>
          <div className="md:col-span-5 md:sticky md:top-32">
            <div className="relative aspect-[3/4] bg-bone overflow-hidden">
              <Image
                src="/images/portraits/martina-garden-pink.jpg"
                alt="Martina Rink — The Sober Muse Letter"
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover object-center"
              />
            </div>
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
