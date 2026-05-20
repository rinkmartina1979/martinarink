import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { PlumButton } from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";

export const metadata: Metadata = {
  title: "Creative Work — Martina Rink",
  description:
    "Three books written across two decades — People of Deutschland, Isabella Blow, Fashion Germany. The publishing archive of Martina Rink.",
};

// ─────────────────────────────────────────────────────────────────────────────
// AMAZON ICON — inline SVG, 16×16
// ─────────────────────────────────────────────────────────────────────────────
function AmazonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      className="opacity-80 flex-shrink-0"
    >
      <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.699-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.052-.872-1.238-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095V6.45c0-.7.054-1.528-.357-2.133-.355-.539-1.038-.763-1.637-.763-1.113 0-2.11.571-2.352 1.752-.05.265-.243.524-.507.537l-2.84-.307c-.238-.053-.502-.246-.434-.612C6.387 2.386 8.567 1.5 11.051 1.5c1.28 0 2.956.341 3.972 1.31 1.28 1.196 1.157 2.793 1.157 4.532v4.103c0 1.233.511 1.775 .991 2.44.17.239.206.525-.008.701-.538.449-1.494 1.283-2.02 1.75l.001-.041z"/>
      <path d="M20.483 18.524c-2.222 1.648-5.447 2.526-8.222 2.526-3.889 0-7.391-1.439-10.04-3.826-.207-.188-.023-.444.227-.298 2.859 1.662 6.396 2.666 10.048 2.666 2.463 0 5.17-.512 7.662-1.569.377-.16.693.246.325.501z"/>
      <path d="M21.484 17.364c-.283-.363-1.874-.172-2.587-.087-.218.026-.25-.163-.056-.299 1.266-.889 3.346-.633 3.587-.335.243.301-.063 2.389-1.252 3.385-.182.152-.355.071-.275-.129.267-.667.865-2.172.583-2.535z"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK COVER STAGE — large, padded, bg-bone, never cropped
// ─────────────────────────────────────────────────────────────────────────────
function CoverStage({
  src,
  width,
  height,
  alt,
  priority = false,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="bg-bone p-10 md:p-12 lg:p-14 flex items-center justify-center">
      <div
        className="relative w-full"
        style={{ maxHeight: 560 }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="w-full h-auto object-contain max-h-[560px]"
          style={{ filter: "drop-shadow(0 18px 35px rgba(30,27,23,0.13))" }}
          sizes="(min-width: 1024px) 30vw, 80vw"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPREAD — publication interior pages, never cropped
// ─────────────────────────────────────────────────────────────────────────────
function Spread({
  src,
  width,
  height,
  alt,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
}) {
  return (
    <div className="bg-[#F9F7F4] p-4 md:p-6">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto object-contain"
        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION LABEL — above "Inside the book" / "At the launch"
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="h-px w-8 bg-pink" aria-hidden />
      <p className="text-[10px] uppercase tracking-[0.28em] text-ink-quiet font-[family-name:var(--font-body)]">
        {children}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOSAIC GALLERY — editorial asymmetric grid, replaces uniform strip
// layout "A": 1 large feature + 2 medium + 3 small (6 photos)
// layout "B": 1 feature + 4 grid (5 photos)
// layout "C": 1 feature + 2 medium + scroll overflow for the rest
// ─────────────────────────────────────────────────────────────────────────────
type GalleryImage = { src: string; width: number; height: number; alt: string };

function EditorialGallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  const [hero, ...rest] = images;

  // Clamp to reasonable editorial count
  const supporting = rest.slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Row 1 — hero + two medium */}
      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4">
        {/* Feature */}
        <div className="relative overflow-hidden bg-bone aspect-[4/3] group">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(min-width: 1280px) 55vw, (min-width: 768px) 60vw, 100vw"
          />
        </div>

        {/* Two stacked mediums */}
        <div className="grid grid-rows-2 gap-4">
          {supporting.slice(0, 2).map((img) => (
            <div key={img.src} className="relative overflow-hidden bg-bone group">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 35vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — up to 4 equal columns */}
      {supporting.length > 2 && (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(supporting.length - 2, 4)}, 1fr)`,
          }}
        >
          {supporting.slice(2, 6).map((img) => (
            <div
              key={img.src}
              className="relative overflow-hidden bg-bone aspect-[3/2] group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Row 3 — remaining overflow, up to 4 more */}
      {supporting.length > 6 && (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(supporting.length - 6, 4)}, 1fr)`,
          }}
        >
          {supporting.slice(6, 10).map((img) => (
            <div
              key={img.src}
              className="relative overflow-hidden bg-bone aspect-[3/2] group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOK BAND — section title divider
// ─────────────────────────────────────────────────────────────────────────────
function BookBand({
  id,
  title,
  year,
  publisher,
}: {
  id: string;
  title: string;
  year: string;
  publisher?: string;
}) {
  return (
    <div id={id} className="bg-aubergine border-b border-cream/10 scroll-mt-20">
      <div className="container-content py-7">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
          <h2
            className="font-[family-name:var(--font-display)] leading-tight tracking-[-0.02em] text-cream"
            style={{ fontSize: "clamp(2rem, 3.5vw, 4rem)" }}
          >
            {title}
          </h2>
          <span className="text-[10px] uppercase tracking-[0.28em] text-cream/45 font-[family-name:var(--font-body)]">
            {year}
            {publisher ? ` · ${publisher}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function CreativeWorkPage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className="bg-aubergine pt-32 md:pt-40 lg:pt-44 pb-24 md:pb-28 lg:pb-32">
        <div className="container-content max-w-7xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-pink" aria-hidden />
            <p className="text-[10px] uppercase tracking-[0.32em] text-cream/50 font-[family-name:var(--font-body)]">
              Published work
            </p>
          </div>

          {/* H1 */}
          <h1
            className="font-[family-name:var(--font-display)] leading-[0.88] tracking-[-0.04em] text-cream"
            style={{ fontSize: "clamp(4rem,8vw,9rem)" }}
          >
            Creative
            <br />
            <em className="italic">work.</em>
          </h1>

          {/* Script accent */}
          <div className="mt-5 flex items-center gap-5">
            <span className="h-px w-14 bg-pink/40" aria-hidden />
            <ScriptAccent className="text-[1.75rem] text-pink/80 leading-none">
              three books.
            </ScriptAccent>
          </div>

          {/* Body */}
          <p className="mt-10 text-[17px] leading-[1.8] text-cream/72 max-w-xl font-[family-name:var(--font-body)]">
            Three books written and photographed across two decades — a body of
            work on identity, fashion, and the culture that shapes both.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROJECT INDEX
      ══════════════════════════════════════════════════════ */}
      <nav
        aria-label="Books on this page"
        className="bg-cream border-y border-sand/40 sticky top-[72px] md:top-[80px] z-30"
      >
        <div className="container-content max-w-7xl">
          <div className="flex overflow-x-auto gap-0 scrollbar-none">
            {[
              { href: "#people-of-deutschland", label: "People of Deutschland", year: "2023" },
              { href: "#isabella-blow",          label: "Isabella Blow",          year: "2010" },
              { href: "#fashion-germany",         label: "Fashion Germany",        year: "2014" },
            ].map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 text-[11px] uppercase
                            tracking-[0.18em] text-ink-quiet font-[family-name:var(--font-body)]
                            hover:text-ink hover:bg-bone transition-colors duration-200
                            ${i < 2 ? "border-r border-sand/40" : ""}`}
              >
                <span className="text-pink/60 text-[9px]">0{i + 1}</span>
                {item.label}
                <span className="text-ink-quiet/50">{item.year}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          01 — PEOPLE OF DEUTSCHLAND
      ══════════════════════════════════════════════════════ */}
      <BookBand
        id="people-of-deutschland"
        title="People of Deutschland"
        year="2023"
        publisher="Spiegel Bestseller"
      />

      <section className="bg-cream py-16 md:py-20 lg:py-24">
        <div className="container-content max-w-7xl">

          {/* Intro — cover left, text right */}
          <div className="grid lg:grid-cols-[0.4fr_0.6fr] gap-10 lg:gap-16 items-start">

            <CoverStage
              src="/images/creative-work/pod-1.png"
              width={1414}
              height={2000}
              alt="People of Deutschland — book cover by Martina Rink"
              priority
            />

            <div className="flex flex-col justify-center lg:py-8">
              <p className="text-[10px] uppercase tracking-[0.26em] text-ink-quiet mb-6 font-[family-name:var(--font-body)]">
                Photography · Thomas Rafalzyk
              </p>
              <blockquote
                className="font-[family-name:var(--font-display)] italic text-ink
                           leading-[1.3] mb-8"
                style={{ fontSize: "clamp(1.25rem,2.2vw,1.875rem)" }}
              >
                &ldquo;85 Menschen. 85 Geschichten. Ein Buch über unser Land — und
                wer wir sind.&rdquo;
              </blockquote>
              <p className="text-[17px] leading-[1.8] text-ink-soft max-w-[580px] font-[family-name:var(--font-body)]">
                Eighty-five people. Eighty-five stories from across Germany —
                musicians, founders, athletes, artists, and the quietly
                extraordinary. Shot in black and white, written with precision.
                A portrait of a country through the people who define it.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-ink-soft max-w-[580px] font-[family-name:var(--font-body)]">
                Published 2023. <em>Spiegel</em> Bestseller.
              </p>
            </div>
          </div>

          {/* Spreads */}
          <div className="mt-16 md:mt-20">
            <SectionLabel>Inside the book</SectionLabel>
            <div className="grid md:grid-cols-3 gap-4">
              <Spread src="/images/creative-work/pod-2.png" width={2667} height={1563} alt="People of Deutschland — interior spread" />
              <Spread src="/images/creative-work/pod-3.png" width={3508} height={2481} alt="People of Deutschland — interior spread" />
              <Spread src="/images/creative-work/pod-4.jpg" width={2000} height={1125} alt="People of Deutschland — interior spread" />
            </div>
          </div>

          {/* Gallery */}
          <div className="mt-16 md:mt-20">
            <SectionLabel>At the launch · Photo credit Thomas Rafalzyk</SectionLabel>
            <EditorialGallery
              images={[
                { src: "/images/creative-work/pod-9.jpg",  width: 5500, height: 3667, alt: "People of Deutschland launch event" },
                { src: "/images/creative-work/pod-7.jpg",  width: 1808, height: 1194, alt: "People of Deutschland launch event" },
                { src: "/images/creative-work/pod-8.png",  width: 1900, height: 1182, alt: "People of Deutschland launch event" },
                { src: "/images/creative-work/pod-5.jpg",  width: 1200, height: 800,  alt: "People of Deutschland launch event" },
                { src: "/images/creative-work/pod-6.jpg",  width: 1200, height: 800,  alt: "People of Deutschland launch event" },
                { src: "/images/creative-work/pod-10.png", width: 1742, height: 1200, alt: "People of Deutschland launch event" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          02 — ISABELLA BLOW
      ══════════════════════════════════════════════════════ */}
      <BookBand
        id="isabella-blow"
        title="Isabella Blow"
        year="2010"
        publisher="Thames & Hudson"
      />

      <section className="bg-bone py-16 md:py-20 lg:py-24">
        <div className="container-content max-w-7xl">

          {/* Intro — text left, cover right */}
          <div className="grid lg:grid-cols-[0.6fr_0.4fr] gap-10 lg:gap-16 items-start">

            <div className="flex flex-col justify-center lg:py-8 lg:order-1 order-2">
              <p className="text-[10px] uppercase tracking-[0.26em] text-ink-quiet mb-6 font-[family-name:var(--font-body)]">
                Photography · Dafydd Jones
              </p>
              <blockquote
                className="font-[family-name:var(--font-display)] italic text-ink
                           leading-[1.3] mb-4"
                style={{ fontSize: "clamp(1.15rem,2vw,1.625rem)" }}
              >
                &ldquo;Few book launches have drummed up as much excitement as
                Martina Rink&rsquo;s <em>Isabella Blow.</em>&rdquo;
              </blockquote>
              <p className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet mb-8 font-[family-name:var(--font-body)]">
                Evening Standard, 2010
              </p>
              <p className="text-[17px] leading-[1.8] text-ink-soft max-w-[580px] font-[family-name:var(--font-body)]">
                The definitive portrait of fashion&rsquo;s most singular muse.
                Written by Martina Rink — Isabella Blow&rsquo;s personal
                assistant — this is the book that could only come from someone
                who was in the room: the dinners, the fittings, the private
                conversations.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-ink-soft max-w-[580px] font-[family-name:var(--font-body)]">
                Published by Thames &amp; Hudson, 2010.
              </p>
            </div>

            <div className="lg:order-2 order-1">
              <CoverStage
                src="/images/creative-work/blow-3.jpg"
                width={896}
                height={1273}
                alt="Isabella Blow — book by Martina Rink, Thames & Hudson"
                priority
              />
            </div>
          </div>

          {/* Spreads */}
          <div className="mt-16 md:mt-20">
            <SectionLabel>Inside the book</SectionLabel>
            <div className="grid md:grid-cols-2 gap-4">
              <Spread src="/images/creative-work/blow-1.png" width={1280} height={947} alt="Isabella Blow — interior pages" />
              <Spread src="/images/creative-work/blow-2.png" width={1280} height={751} alt="Isabella Blow — interior pages" />
            </div>
          </div>

          {/* Gallery */}
          <div className="mt-16 md:mt-20">
            <SectionLabel>At the launch · Photo credit Dafydd Jones</SectionLabel>
            <EditorialGallery
              images={[
                { src: "/images/creative-work/blow-13.jpg", width: 640, height: 426, alt: "Isabella Blow launch" },
                { src: "/images/creative-work/blow-4.jpg",  width: 640, height: 426, alt: "Isabella Blow launch" },
                { src: "/images/creative-work/blow-6.jpg",  width: 426, height: 640, alt: "Isabella Blow launch" },
                { src: "/images/creative-work/blow-5.jpg",  width: 640, height: 426, alt: "Isabella Blow launch" },
                { src: "/images/creative-work/blow-7.jpg",  width: 426, height: 640, alt: "Isabella Blow launch" },
                { src: "/images/creative-work/blow-9.jpg",  width: 640, height: 426, alt: "Isabella Blow launch" },
                { src: "/images/creative-work/blow-10.jpg", width: 640, height: 426, alt: "Isabella Blow launch" },
                { src: "/images/creative-work/blow-14.jpg", width: 640, height: 426, alt: "Isabella Blow launch" },
                { src: "/images/creative-work/blow-16.jpg", width: 426, height: 640, alt: "Isabella Blow launch" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          03 — FASHION GERMANY
      ══════════════════════════════════════════════════════ */}
      <BookBand
        id="fashion-germany"
        title="Fashion Germany"
        year="2014"
        publisher="Prestel · Random House"
      />

      <section className="bg-cream py-16 md:py-20 lg:py-24">
        <div className="container-content max-w-7xl">

          {/* Intro — cover left, text right */}
          <div className="grid lg:grid-cols-[0.4fr_0.6fr] gap-10 lg:gap-16 items-start">

            <CoverStage
              src="/images/creative-work/fashion-1.png"
              width={1064}
              height={960}
              alt="Fashion Germany — book by Martina Rink"
              priority
            />

            <div className="flex flex-col justify-center lg:py-8">
              <blockquote
                className="font-[family-name:var(--font-display)] italic text-ink
                           leading-[1.3] mb-4"
                style={{ fontSize: "clamp(1.15rem,2vw,1.625rem)" }}
              >
                &ldquo;The book&rsquo;s encyclopedic entries are illustrated
                with numerous beautiful colour images — followers of
                contemporary fashion will enjoy this title.&rdquo;
              </blockquote>
              <p className="text-[12px] uppercase tracking-[0.18em] text-ink-quiet mb-8 font-[family-name:var(--font-body)]">
                New York Journal of Books, 2014
              </p>
              <p className="text-[17px] leading-[1.8] text-ink-soft max-w-[580px] font-[family-name:var(--font-body)]">
                An encyclopedic portrait of German fashion — the photographers,
                designers, editors, models, and stylists who built an industry
                the world watches without always naming. Short interviews,
                essays, and hundreds of images collected into a single definitive
                volume.
              </p>
              <p className="mt-5 text-[17px] leading-[1.8] text-ink-soft max-w-[580px] font-[family-name:var(--font-body)]">
                Published 2014.
              </p>
            </div>
          </div>

          {/* Spreads */}
          <div className="mt-16 md:mt-20">
            <SectionLabel>Inside the book</SectionLabel>
            <div className="grid md:grid-cols-2 gap-4">
              <Spread src="/images/creative-work/fashion-2.png" width={1280} height={747}  alt="Fashion Germany — interior spread" />
              <Spread src="/images/creative-work/fashion-3.png" width={1836} height={1226} alt="Fashion Germany — interior spread" />
            </div>
          </div>

          {/* Gallery */}
          <div className="mt-16 md:mt-20">
            <SectionLabel>From the book</SectionLabel>
            <EditorialGallery
              images={[
                { src: "/images/creative-work/fashion-5.jpg",  width: 700, height: 467,  alt: "Fashion Germany" },
                { src: "/images/creative-work/fashion-4.jpg",  width: 768, height: 1087, alt: "Fashion Germany" },
                { src: "/images/creative-work/fashion-7.jpg",  width: 633, height: 481,  alt: "Fashion Germany" },
                { src: "/images/creative-work/fashion-8.jpg",  width: 640, height: 427,  alt: "Fashion Germany" },
                { src: "/images/creative-work/fashion-9.jpg",  width: 541, height: 481,  alt: "Fashion Germany" },
                { src: "/images/creative-work/fashion-11.jpg", width: 441, height: 480,  alt: "Fashion Germany" },
                { src: "/images/creative-work/fashion-12.jpg", width: 640, height: 461,  alt: "Fashion Germany" },
                { src: "/images/creative-work/fashion-13.jpg", width: 640, height: 465,  alt: "Fashion Germany" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          OWN THE WORK — AMAZON PURCHASE SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="bg-ink py-24 lg:py-32">
        <div className="container-content">

          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16 lg:mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-10 bg-pink/50" aria-hidden />
              <p className="text-[10px] uppercase tracking-[0.34em] text-cream/50 font-[family-name:var(--font-body)]">
                Available in print
              </p>
              <span className="h-px w-10 bg-pink/50" aria-hidden />
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-[42px] md:text-[56px] leading-[1.0] tracking-[-0.015em] text-cream">
              Own the work.
            </h2>
            <p className="mt-6 text-[16px] leading-[1.8] text-cream/55 font-[family-name:var(--font-body)] max-w-lg mx-auto">
              Three books written across two decades. Each one a document of
              a world that was worth paying close attention to.
            </p>
          </div>

          {/* Book cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">

            {/* ── People of Deutschland ── */}
            <article className="group flex flex-col bg-cream/[0.04] border border-cream/10 hover:border-pink/40 transition-all duration-300">

              {/* Cover */}
              <div className="relative bg-[#1a1610] flex items-center justify-center px-10 pt-12 pb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                <Image
                  src="/images/books/people-of-deutschland-cover.png"
                  alt="People of Deutschland — book cover by Martina Rink"
                  width={400}
                  height={560}
                  className="relative z-10 w-full max-w-[200px] mx-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:scale-[1.03] transition-transform duration-500 object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-8 lg:p-10">
                <p className="text-[9px] uppercase tracking-[0.3em] text-pink/70 font-[family-name:var(--font-body)] mb-3">
                  Prestel · Random House · 2023
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-[22px] leading-snug text-cream mb-4">
                  People of Deutschland
                </h3>
                <p className="text-[14px] leading-[1.75] text-cream/50 font-[family-name:var(--font-body)] flex-1">
                  A portrait of contemporary Germany told through thirty-five women
                  of influence. Spiegel bestseller. Photography, culture, and a
                  country seen from the inside.
                </p>
                <a
                  href="https://www.amazon.de/exec/obidos/ASIN/3959103980/edel_fb_edenbooks-21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-3 bg-plum hover:bg-plum-deep text-cream text-[11px] uppercase tracking-[0.22em] font-[family-name:var(--font-body)] py-4 px-6 rounded-[1px] transition-colors duration-200"
                >
                  <AmazonIcon />
                  Order on Amazon
                </a>
              </div>
            </article>

            {/* ── Isabella Blow ── */}
            <article className="group flex flex-col bg-cream/[0.04] border border-cream/10 hover:border-pink/40 transition-all duration-300">

              <div className="relative bg-[#1a1610] flex items-center justify-center px-10 pt-12 pb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                <Image
                  src="/images/books/isabella-blow-cover.png"
                  alt="Isabella Blow — A Life in Fashion, book cover by Martina Rink"
                  width={400}
                  height={560}
                  className="relative z-10 w-full max-w-[200px] mx-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:scale-[1.03] transition-transform duration-500 object-contain"
                />
              </div>

              <div className="flex flex-col flex-1 p-8 lg:p-10">
                <p className="text-[9px] uppercase tracking-[0.3em] text-pink/70 font-[family-name:var(--font-body)] mb-3">
                  Thames &amp; Hudson · 2010
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-[22px] leading-snug text-cream mb-4">
                  Isabella Blow —<br />A Life in Fashion
                </h3>
                <p className="text-[14px] leading-[1.75] text-cream/50 font-[family-name:var(--font-body)] flex-1">
                  The definitive visual biography of fashion&rsquo;s most singular
                  patron. Intimate, meticulous, and unlike anything published on
                  the subject before or since.
                </p>
                <a
                  href="https://www.amazon.de/Isabella-Blow-Martina-Rink/dp/0500515352/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-3 bg-plum hover:bg-plum-deep text-cream text-[11px] uppercase tracking-[0.22em] font-[family-name:var(--font-body)] py-4 px-6 rounded-[1px] transition-colors duration-200"
                >
                  <AmazonIcon />
                  Order on Amazon
                </a>
              </div>
            </article>

            {/* ── Fashion Germany ── */}
            <article className="group flex flex-col bg-cream/[0.04] border border-cream/10 hover:border-pink/40 transition-all duration-300">

              <div className="relative bg-[#1a1610] flex items-center justify-center px-10 pt-12 pb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                <Image
                  src="/images/books/fashion-germany-cover.png"
                  alt="Fashion Germany — book cover by Martina Rink"
                  width={400}
                  height={560}
                  className="relative z-10 w-full max-w-[200px] mx-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:scale-[1.03] transition-transform duration-500 object-contain"
                />
              </div>

              <div className="flex flex-col flex-1 p-8 lg:p-10">
                <p className="text-[9px] uppercase tracking-[0.3em] text-pink/70 font-[family-name:var(--font-body)] mb-3">
                  Prestel · Random House · 2014
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-[22px] leading-snug text-cream mb-4">
                  Fashion Germany
                </h3>
                <p className="text-[14px] leading-[1.75] text-cream/50 font-[family-name:var(--font-body)] flex-1">
                  An inside document of the German fashion industry — the
                  creative directors, photographers, stylists, and editors
                  who built it from the ground up.
                </p>
                <a
                  href="https://www.amazon.de/Fashion-Germany-Kreative-Stories-Trends/dp/3791348884/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center justify-center gap-3 bg-plum hover:bg-plum-deep text-cream text-[11px] uppercase tracking-[0.22em] font-[family-name:var(--font-body)] py-4 px-6 rounded-[1px] transition-colors duration-200"
                >
                  <AmazonIcon />
                  Order on Amazon
                </a>
              </div>
            </article>

          </div>

          {/* Footnote */}
          <p className="mt-12 text-center text-[11px] tracking-[0.12em] text-cream/25 font-[family-name:var(--font-body)]">
            Links open Amazon.de
          </p>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CLOSING CTA
      ══════════════════════════════════════════════════════ */}
      <section className="bg-aubergine py-24 lg:py-32">
        <div className="container-content max-w-2xl mx-auto text-center">
          <ScriptAccent className="block text-[2.75rem] text-pink/80 mb-8 leading-tight">
            the work continues.
          </ScriptAccent>
          <p className="text-[17px] leading-[1.8] text-cream/65 font-[family-name:var(--font-body)] mb-12">
            Three published books. Two decades of editorial work. The thread
            running through all of it — the same one running through the private
            work now — is a fascination with what women do when they stop
            performing and start choosing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PlumButton href="/writing">Read the writing</PlumButton>
            <GhostButton href="/work-with-me" className="border-cream/30 text-cream hover:bg-cream/10">
              Work with me
            </GhostButton>
          </div>
        </div>
      </section>
    </>
  );
}
