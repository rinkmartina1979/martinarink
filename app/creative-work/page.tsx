import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { ScriptAccent } from "@/components/brand/ScriptAccent";

export const metadata: Metadata = {
  title: "Creative Work — Martina Rink",
  description:
    "Three books. People of Deutschland, Isabella Blow, and Fashion Germany — the publishing work of Martina Rink.",
};

// ── Interior spread gallery ────────────────────────────────────────────────────
function SpreadGallery({
  images,
}: {
  images: { src: string; width: number; height: number; alt: string }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {images.map((img) => (
        <div key={img.src} className="relative bg-bone overflow-hidden">
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            className="w-full h-auto object-contain"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
}

// ── Event photo strip ──────────────────────────────────────────────────────────
function EventStrip({
  images,
  credit,
}: {
  images: { src: string; width: number; height: number; alt: string }[];
  credit?: string;
}) {
  return (
    <div className="mt-12">
      {credit && (
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4 font-[family-name:var(--font-body)]">
          Photo credit: {credit}
        </p>
      )}
      <div
        className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "thin" }}
      >
        {images.map((img) => (
          <div
            key={img.src}
            className="flex-shrink-0 snap-start relative overflow-hidden bg-bone"
            style={{ width: 300, height: 200 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section title band ─────────────────────────────────────────────────────────
function BookBand({
  title,
  year,
  publisher,
}: {
  title: string;
  year: string;
  publisher?: string;
}) {
  return (
    <div className="bg-aubergine py-7 px-6">
      <div className="container-content flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-8">
        <h2
          className="font-[family-name:var(--font-display)] text-[32px] md:text-[44px]
                     tracking-[-0.01em] leading-tight text-cream"
        >
          {title}
        </h2>
        <div className="flex items-center gap-4">
          <span className="h-px w-8 bg-pink/60" aria-hidden />
          <span className="text-[10px] uppercase tracking-[0.28em] text-cream/50 font-[family-name:var(--font-body)]">
            {year}
            {publisher ? ` · ${publisher}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CreativeWorkPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-aubergine pt-32 md:pt-44 pb-20 md:pb-28">
        <div className="container-content max-w-4xl">
          <Eyebrow className="text-cream/50">Published Work</Eyebrow>
          <h1
            className="mt-6 font-[family-name:var(--font-display)]
                       text-[56px] md:text-[88px] lg:text-[104px]
                       leading-[0.96] tracking-[-0.025em] text-cream"
          >
            Creative
            <br />
            <em className="italic">work.</em>
          </h1>
          <div className="mt-6 flex items-center gap-5">
            <span className="h-px w-16 bg-pink/50" aria-hidden />
            <ScriptAccent className="text-[2rem] text-pink leading-none">
              three books.
            </ScriptAccent>
          </div>
          <p
            className="mt-10 text-[17px] leading-[1.75] text-cream/65 max-w-[560px]
                        font-[family-name:var(--font-body)]"
          >
            Three books written and photographed across two decades — a body of work
            on identity, fashion, and the culture that shapes both.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          01 — PEOPLE OF DEUTSCHLAND
      ══════════════════════════════════════════════════════ */}
      <BookBand title="People of Deutschland" year="2023" publisher="Spiegel Bestseller" />

      <section className="bg-cream section-pad">
        <div className="container-content">

          {/* Cover + intro */}
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">

            <div className="md:col-span-4 lg:col-span-3">
              <div className="shadow-xl">
                <Image
                  src="/images/creative-work/pod-1.png"
                  alt="People of Deutschland — book cover by Martina Rink"
                  width={1414}
                  height={2000}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 90vw, 320px"
                  priority
                />
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center">
              <p className="text-[11px] uppercase tracking-[0.26em] text-ink-quiet mb-6 font-[family-name:var(--font-body)]">
                Photography · Thomas Rafalzyk
              </p>
              <blockquote
                className="font-[family-name:var(--font-display)] text-[24px] md:text-[28px]
                           leading-[1.35] text-ink italic mb-8 max-w-[540px]"
              >
                &ldquo;85 Menschen. 85 Geschichten. Ein Buch über unser Land — und wer wir
                sind.&rdquo;
              </blockquote>
              <p className="text-[16px] leading-[1.8] text-ink-soft max-w-[540px] font-[family-name:var(--font-body)]">
                Eighty-five people. Eighty-five stories from across Germany — musicians,
                founders, athletes, artists, and the quietly extraordinary. Shot in black and
                white, written with precision. A portrait of a country through the people who
                define it.
              </p>
              <p className="mt-5 text-[16px] leading-[1.8] text-ink-soft max-w-[540px] font-[family-name:var(--font-body)]">
                Published 2023. <em>Spiegel</em> Bestseller.
              </p>
            </div>
          </div>

          {/* Interior spreads */}
          <div className="mt-16">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6 font-[family-name:var(--font-body)]">
              Inside the book
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-bone overflow-hidden">
                <Image
                  src="/images/creative-work/pod-2.png"
                  alt="People of Deutschland — interior spread"
                  width={2667}
                  height={1563}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="bg-bone overflow-hidden">
                <Image
                  src="/images/creative-work/pod-3.png"
                  alt="People of Deutschland — interior spread"
                  width={3508}
                  height={2481}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="bg-bone overflow-hidden">
                <Image
                  src="/images/creative-work/pod-4.jpg"
                  alt="People of Deutschland — interior spread"
                  width={2000}
                  height={1125}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          </div>

          {/* Launch photos */}
          <EventStrip
            credit="Thomas Rafalzyk"
            images={[
              { src: "/images/creative-work/pod-5.jpg",  width: 1200, height: 800,  alt: "People of Deutschland launch" },
              { src: "/images/creative-work/pod-6.jpg",  width: 1200, height: 800,  alt: "People of Deutschland launch" },
              { src: "/images/creative-work/pod-7.jpg",  width: 1808, height: 1194, alt: "People of Deutschland launch" },
              { src: "/images/creative-work/pod-8.png",  width: 1900, height: 1182, alt: "People of Deutschland launch" },
              { src: "/images/creative-work/pod-9.jpg",  width: 5500, height: 3667, alt: "People of Deutschland launch" },
              { src: "/images/creative-work/pod-10.png", width: 1742, height: 1200, alt: "People of Deutschland launch" },
            ]}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          02 — ISABELLA BLOW
      ══════════════════════════════════════════════════════ */}
      <BookBand title="Isabella Blow" year="2010" publisher="Thames & Hudson" />

      <section className="bg-bone section-pad">
        <div className="container-content">

          {/* Cover + intro — reversed */}
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">

            {/* Text left */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center md:order-1 order-2">
              <p className="text-[11px] uppercase tracking-[0.26em] text-ink-quiet mb-6 font-[family-name:var(--font-body)]">
                Photography · Dafydd Jones
              </p>
              <blockquote
                className="font-[family-name:var(--font-display)] text-[22px] md:text-[26px]
                           leading-[1.4] text-ink italic mb-4 max-w-[520px]"
              >
                &ldquo;Few book launches have drummed up as much excitement as Martina
                Rink&rsquo;s <em>Isabella Blow.</em>&rdquo;
              </blockquote>
              <p className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet mb-8 font-[family-name:var(--font-body)]">
                Evening Standard, 2010
              </p>
              <p className="text-[16px] leading-[1.8] text-ink-soft max-w-[520px] font-[family-name:var(--font-body)]">
                The definitive portrait of fashion&rsquo;s most singular muse. Written by
                Martina Rink — Isabella Blow&rsquo;s personal assistant — this is the book
                that could only come from someone who was in the room: the dinners, the
                fittings, the private conversations.
              </p>
              <p className="mt-5 text-[16px] leading-[1.8] text-ink-soft max-w-[520px] font-[family-name:var(--font-body)]">
                Published by Thames &amp; Hudson, 2010.
              </p>
            </div>

            {/* Cover right */}
            <div className="md:col-span-5 lg:col-span-4 md:order-2 order-1">
              <div className="shadow-xl max-w-[320px] md:max-w-none">
                <Image
                  src="/images/creative-work/blow-3.jpg"
                  alt="Isabella Blow — book by Martina Rink, Thames & Hudson"
                  width={896}
                  height={1273}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 320px, (max-width: 1024px) 40vw, 380px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Interior spreads */}
          <div className="mt-16">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6 font-[family-name:var(--font-body)]">
              Inside the book
            </p>
            <SpreadGallery
              images={[
                { src: "/images/creative-work/blow-1.png", width: 1280, height: 947, alt: "Isabella Blow — interior pages" },
                { src: "/images/creative-work/blow-2.png", width: 1280, height: 751, alt: "Isabella Blow — interior pages" },
              ]}
            />
          </div>

          {/* Launch photos */}
          <EventStrip
            credit="Dafydd Jones"
            images={[
              { src: "/images/creative-work/blow-4.jpg",  width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-5.jpg",  width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-6.jpg",  width: 426, height: 640, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-7.jpg",  width: 426, height: 640, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-8.jpg",  width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-9.jpg",  width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-10.jpg", width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-11.jpg", width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-12.jpg", width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-13.jpg", width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-14.jpg", width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-15.jpg", width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-16.jpg", width: 426, height: 640, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-17.jpg", width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-18.jpg", width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-19.jpg", width: 640, height: 426, alt: "Isabella Blow book launch" },
              { src: "/images/creative-work/blow-20.jpg", width: 640, height: 426, alt: "Isabella Blow book launch" },
            ]}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          03 — FASHION GERMANY
      ══════════════════════════════════════════════════════ */}
      <BookBand title="Fashion Germany" year="2014" />

      <section className="bg-cream section-pad">
        <div className="container-content">

          {/* Cover + intro */}
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">

            <div className="md:col-span-4 lg:col-span-3">
              <div className="shadow-xl">
                <Image
                  src="/images/creative-work/fashion-1.png"
                  alt="Fashion Germany — book by Martina Rink"
                  width={1064}
                  height={960}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 90vw, 320px"
                  priority
                />
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center">
              <blockquote
                className="font-[family-name:var(--font-display)] text-[22px] md:text-[26px]
                           leading-[1.4] text-ink italic mb-4 max-w-[540px]"
              >
                &ldquo;The book&rsquo;s encyclopedic entries are illustrated with numerous
                beautiful colour images — followers of contemporary fashion will enjoy this
                title.&rdquo;
              </blockquote>
              <p className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet mb-8 font-[family-name:var(--font-body)]">
                New York Journal of Books, 2014
              </p>
              <p className="text-[16px] leading-[1.8] text-ink-soft max-w-[540px] font-[family-name:var(--font-body)]">
                An encyclopedic portrait of German fashion — the photographers, designers,
                editors, models, and stylists who built an industry the world watches without
                always naming. Short interviews, essays, and hundreds of images collected into
                a single definitive volume.
              </p>
              <p className="mt-5 text-[16px] leading-[1.8] text-ink-soft max-w-[540px] font-[family-name:var(--font-body)]">
                Published 2014.
              </p>
            </div>
          </div>

          {/* Interior spreads */}
          <div className="mt-16">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6 font-[family-name:var(--font-body)]">
              Inside the book
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-bone overflow-hidden">
                <Image
                  src="/images/creative-work/fashion-2.png"
                  alt="Fashion Germany — interior spread"
                  width={1280}
                  height={747}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="bg-bone overflow-hidden">
                <Image
                  src="/images/creative-work/fashion-3.png"
                  alt="Fashion Germany — interior spread"
                  width={1836}
                  height={1226}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Content photos */}
          <EventStrip
            images={[
              { src: "/images/creative-work/fashion-4.jpg",  width: 768, height: 1087, alt: "Fashion Germany" },
              { src: "/images/creative-work/fashion-5.jpg",  width: 700, height: 467,  alt: "Fashion Germany" },
              { src: "/images/creative-work/fashion-6.jpg",  width: 500, height: 442,  alt: "Fashion Germany" },
              { src: "/images/creative-work/fashion-7.jpg",  width: 633, height: 481,  alt: "Fashion Germany" },
              { src: "/images/creative-work/fashion-8.jpg",  width: 640, height: 427,  alt: "Fashion Germany" },
              { src: "/images/creative-work/fashion-9.jpg",  width: 541, height: 481,  alt: "Fashion Germany" },
              { src: "/images/creative-work/fashion-11.jpg", width: 441, height: 480,  alt: "Fashion Germany" },
              { src: "/images/creative-work/fashion-12.jpg", width: 640, height: 461,  alt: "Fashion Germany" },
              { src: "/images/creative-work/fashion-13.jpg", width: 640, height: 465,  alt: "Fashion Germany" },
            ]}
          />
        </div>
      </section>

      {/* ── CLOSING ─────────────────────────────────────────── */}
      <section className="bg-aubergine py-20 md:py-28">
        <div className="container-content max-w-2xl text-center mx-auto">
          <ScriptAccent className="block text-[3rem] text-pink mb-6">
            the work continues.
          </ScriptAccent>
          <p className="text-[16px] leading-[1.8] text-cream/65 font-[family-name:var(--font-body)]">
            Three published books. Two decades of editorial work. The thread running
            through all of it — the same one running through the private work now —
            is a fascination with what women do when they stop performing and start
            choosing.
          </p>
        </div>
      </section>
    </>
  );
}
