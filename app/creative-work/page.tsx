import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PlumButton } from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";
import { buildMetadata, bookSchema, breadcrumbSchema } from "@/lib/metadata";
import { getCreativeWorkPage } from "@/sanity/lib/queries";

const BOOKS = [
  bookSchema({
    name: "People of Deutschland",
    publisher: "Prestel Verlag",
    publicationYear: "2022",
    imagePath: "/images/books/people-of-deutschland-cover.png",
    description:
      "A Spiegel Bestseller exploring identity, belonging, and what it means to be German today — through 45 portraits and conversations.",
    isbn: "978-3791388458",
  }),
  bookSchema({
    name: "Isabella Blow — A Life in Fashion",
    publisher: "Prestel Verlag",
    publicationYear: "2014",
    imagePath: "/images/books/isabella-blow-cover.png",
    description:
      "An intimate portrait of fashion legend Isabella Blow, written by her personal assistant and one of the only people granted close access to her life and archive.",
    isbn: "978-3791349336",
  }),
  bookSchema({
    name: "Fashion Germany",
    publisher: "Prestel Verlag",
    publicationYear: "2020",
    imagePath: "/images/books/fashion-germany-cover.png",
    description:
      "A definitive volume on contemporary German fashion — the designers, houses, and creative movements shaping a new generation of style.",
    isbn: "978-3791385969",
  }),
];

const BREADCRUMBS = breadcrumbSchema([
  { name: "Creative Work", path: "/creative-work" },
]);

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCreativeWorkPage();
  if (data?.seo?.seoTitle) {
    return buildMetadata({
      title: data.seo.seoTitle,
      description: data.seo.seoDescription ?? undefined,
      path: "/creative-work",
    });
  }
  return buildMetadata({
    title: "Creative Work",
    description:
      "A selection of Martina Rink's editorial and creative work — People of Deutschland, Isabella Blow, and Fashion Germany.",
    path: "/creative-work",
  });
}

export default async function CreativeWorkPage() {
  const data = await getCreativeWorkPage();

  const eyebrow = data?.eyebrow ?? "Creative Work";
  const heroHeadline =
    data?.heroHeadline ?? "Before the practice, there was an eye.";
  const heroSubheadline =
    data?.heroSubheadline ??
    "A selection of editorial and creative work from the years before this practice took its current form.";
  const introCopy =
    data?.introCopy ??
    "Photography. Fashion. A decade in London, Berlin, and beyond. The work that preceded the work.";

  const pod = data?.peopleOfDeutschland;
  const ib = data?.isabellaBlow;
  const fg = data?.fashionGermany;
  const closing = data?.closingSection;

  return (
    <>
      {/* ─── SCHEMA — three Book entities + breadcrumbs ─────── */}
      {BOOKS.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMBS) }}
      />

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="bg-cream pt-32 md:pt-40 pb-20">
        <div className="container-content max-w-3xl">
          <Eyebrow withLine>{eyebrow}</Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[64px] leading-[1.0] tracking-[-0.015em] text-ink">
            {heroHeadline}
          </h1>
          <p className="mt-8 text-[19px] leading-[1.65] text-ink-soft max-w-[540px]">
            {heroSubheadline}
          </p>
          <p className="mt-6 text-[17px] leading-[1.7] text-ink-soft max-w-[540px]">
            {introCopy}
          </p>
        </div>
      </section>

      {/* ─── ISABELLA BLOW ────────────────────────────────────── */}
      <section className="bg-cream section-pad">
        <div className="container-content">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-6">
              <Eyebrow>{ib?.heading ?? "Isabella Blow"}</Eyebrow>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-[36px] md:text-[48px] leading-[1.1] text-ink">
                {ib?.heading ?? "Isabella Blow"}
              </h2>
              {ib?.body ? (
                <div className="mt-8 space-y-5 text-[17px] leading-[1.7] text-ink-soft">
                  {ib.body.split("\n").filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-8 text-[17px] leading-[1.7] text-ink-soft">
                  Personal assistant to Isabella Blow in London — a period that shaped an understanding of style as a form of identity, of dressing as a declaration of inner life. The most formative years professionally.
                </p>
              )}

              {(ib?.quote || ib?.quoteSource) && (
                <div className="mt-10 border-l-2 border-pink pl-6">
                  {ib.quote && (
                    <blockquote className="font-[family-name:var(--font-display)] italic text-[20px] leading-[1.45] text-ink">
                      &ldquo;{ib.quote}&rdquo;
                    </blockquote>
                  )}
                  {ib.quoteSource && (
                    <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-ink-quiet">
                      — {ib.quoteSource}
                    </p>
                  )}
                </div>
              )}

              {ib?.photoCredit && (
                <p className="mt-8 text-[12px] text-ink-quiet uppercase tracking-[0.15em]">
                  {ib.photoCredit}
                </p>
              )}
            </div>

            <div className="md:col-span-6">
              {ib?.imageGallery && ib.imageGallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {ib.imageGallery.map((img, i) => (
                    <div key={i} className={`bg-sand/20 overflow-hidden ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}>
                      <div className="w-full h-full flex items-center justify-center text-ink-quiet text-[11px] uppercase tracking-[0.15em]">
                        {img.alt || "Image"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {/* Book cover — primary */}
                  <div className="col-span-2 relative aspect-[16/9] bg-bone overflow-hidden">
                    <Image
                      src="/images/portraits/martina-gallery-leopard.jpg"
                      alt="Martina Rink with Isabella Blow — London editorial"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-[50%_25%]"
                    />
                  </div>
                  <div className="relative aspect-square bg-bone overflow-hidden">
                    <Image
                      src="/images/books/isabella-blow-cover.png"
                      alt="Isabella Blow — published biography"
                      fill
                      sizes="25vw"
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="relative aspect-square bg-bone overflow-hidden flex items-end p-4">
                    <p className="text-[13px] text-ink-soft leading-snug italic font-[family-name:var(--font-display)]">
                      &ldquo;She wore hats that could clear a room. Not to be noticed. To exist.&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PEOPLE OF DEUTSCHLAND ───────────────────────────── */}
      <section className="bg-bone section-pad">
        <div className="container-content">
          <div className="max-w-2xl">
            <Eyebrow>
              {pod?.heading ?? "People of Deutschland"}
            </Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[36px] md:text-[48px] leading-[1.1] text-ink">
              {pod?.heading ?? "People of Deutschland"}
            </h2>
            {pod?.body && (
              <div className="mt-8 space-y-5 text-[17px] leading-[1.7] text-ink-soft">
                {pod.body.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
            {!pod?.body && (
              <p className="mt-8 text-[17px] leading-[1.7] text-ink-soft">
                A photographic portrait series documenting contemporary German identity — the faces, the postures, the particular quiet of a country still becoming itself.
              </p>
            )}
          </div>

          {/* Gallery placeholder or images */}
          {pod?.imageGallery && pod.imageGallery.length > 0 ? (
            <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-3">
              {pod.imageGallery.map((img, i) => (
                <div key={i} className="aspect-[3/4] bg-sand/30 overflow-hidden">
                  {/* Images will render via next/image when Sanity is live */}
                  <div className="w-full h-full flex items-center justify-center text-ink-quiet text-[11px] uppercase tracking-[0.15em]">
                    {img.alt || "Image"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { src: "/images/portraits/martina-event-editorial.jpg", label: "Berlin, 2018" },
                { src: "/images/portraits/martina-cafe-editorial.jpg", label: "Hamburg, 2018" },
                { src: "/images/portraits/martina-portrait-pink-blouse.jpg", label: "Munich, 2019" },
                { src: "/images/books/people-of-deutschland-cover.png", label: "Cover" },
                { src: "/images/portraits/martina-home-working.jpg", label: "Frankfurt, 2018" },
                { src: "/images/portraits/martina-event-plum.png", label: "Cologne, 2019" },
              ].map((item, i) => (
                <div key={i} className="relative aspect-[3/4] bg-sand/20 overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>
          )}

          {pod?.photoCredit && (
            <p className="mt-6 text-[12px] text-ink-quiet uppercase tracking-[0.15em]">
              {pod.photoCredit}
            </p>
          )}
        </div>
      </section>

      {/* ─── FASHION GERMANY ──────────────────────────────────── */}
      <section className="bg-ink section-pad">
        <div className="container-content">
          <div className="max-w-2xl mx-auto text-center">
            <Eyebrow className="justify-center">
              <span className="text-cream/60">{fg?.heading ?? "Fashion Germany"}</span>
            </Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[36px] md:text-[48px] leading-[1.1] text-cream">
              {fg?.heading ?? "Fashion Germany"}
            </h2>
            {fg?.body ? (
              <div className="mt-8 space-y-5 text-[17px] leading-[1.7] text-cream/80">
                {fg.body.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <p className="mt-8 text-[17px] leading-[1.7] text-cream/80">
                Editorial work for German fashion publications — a period of close attention to how women present themselves, to the distance between how they look and what they feel.
              </p>
            )}
          </div>

          {fg?.imageGallery && fg.imageGallery.length > 0 ? (
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
              {fg.imageGallery.map((img, i) => (
                <div key={i} className="aspect-[2/3] bg-ink-soft/30 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-cream/30 text-[11px] uppercase tracking-[0.15em]">
                    {img.alt || "Image"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "/images/portraits/martina-glam-portrait.jpg",
                "/images/portraits/martina-floral-dress.jpg",
                "/images/portraits/martina-leopard-lounge.jpg",
                "/images/books/fashion-germany-cover.png",
                "/images/portraits/martina-bw-studio.jpg",
                "/images/portraits/martina-library-pink.jpg",
                "/images/portraits/martina-salon-ibiza.jpg",
                "/images/portraits/martina-night-sky.jpg",
              ].map((src, i) => (
                <div key={i} className="relative aspect-[2/3] bg-ink-soft/30 overflow-hidden">
                  <Image
                    src={src}
                    alt="Fashion Germany — editorial"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>
          )}

          {fg?.quote && (
            <div className="mt-14 max-w-2xl mx-auto text-center">
              <blockquote className="font-[family-name:var(--font-display)] italic text-[22px] leading-[1.45] text-cream/90">
                &ldquo;{fg.quote}&rdquo;
              </blockquote>
              {fg.quoteSource && (
                <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-cream/50">
                  — {fg.quoteSource}
                </p>
              )}
            </div>
          )}

          {fg?.photoCredit && (
            <p className="mt-8 text-center text-[12px] text-cream/40 uppercase tracking-[0.15em]">
              {fg.photoCredit}
            </p>
          )}
        </div>
      </section>

      {/* ─── CLOSING ──────────────────────────────────────────── */}
      <section className="bg-cream section-pad">
        <div className="container-content max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[36px] md:text-[44px] leading-[1.15] text-ink">
            {closing?.heading ?? "The work that led here."}
          </h2>
          <p className="mt-6 text-[17px] leading-[1.7] text-ink-soft">
            {closing?.body ??
              "All of this — the photography, the fashion, the years with Isabella — was preparation. Not for a portfolio, but for a way of seeing. That seeing is now the practice."}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <PlumButton href={closing?.primaryCtaUrl ?? "/about"}>
              {closing?.primaryCtaLabel ?? "Read the full story"}
            </PlumButton>
            <GhostButton href={closing?.secondaryCtaUrl ?? "/work-with-me"}>
              {closing?.secondaryCtaLabel ?? "Work with me"}
            </GhostButton>
          </div>
        </div>
      </section>
    </>
  );
}
