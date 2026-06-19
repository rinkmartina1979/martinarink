"use client";

/**
 * EditorialTestimonials — full 2026 Vogue editorial layout.
 *
 * All reviews are shown. Layout adapts by type:
 *   Named reviews  → hero · pair · centered pull-quote · editorial single
 *   NDA reviews    → violet-soft panel, no portraits, large italic
 *   Marquee strip  → ink background, scrolling anonymous quotes
 */

import Image from "next/image";

interface TestimonialItem {
  key: string;
  name: string;
  role: string | null;
  quote: string;
  nda: boolean;
  photoPath?: string;
}

interface Props {
  testimonials: TestimonialItem[];
}

const MARQUEE_QUOTES = [
  "I came in thinking I had a drinking problem. I left understanding I had a clarity problem.",
  "The work was not a rebuild. It was the return of a capacity I had quietly stopped believing in.",
  "She asked the question I didn't know I was avoiding — and then she waited.",
  "Something about her quality of attention made it impossible to stay vague with myself.",
  "In a remarkably short time, she helped me arrive at realisations I'd been circling for years.",
];

// ─── Shared primitives ────────────────────────────────────────────────────────

function QuoteMark({ size = "lg" }: { size?: "lg" | "md" | "sm" }) {
  const px = size === "lg" ? "clamp(80px,12vw,160px)" : size === "md" ? "clamp(60px,8vw,100px)" : "clamp(44px,5vw,72px)";
  return (
    <span
      aria-hidden
      className="block font-[family-name:var(--font-display)] italic text-pink/30 leading-none select-none"
      style={{ fontSize: px }}
    >
      &ldquo;
    </span>
  );
}

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[9px] uppercase tracking-[0.28em] font-[family-name:var(--font-body)] ${className}`}>
      {children}
    </p>
  );
}

function Nameplate({ item, align = "left" }: { item: TestimonialItem; align?: "left" | "center" }) {
  const display = item.nda ? item.role : item.name;
  const sub = item.nda ? null : item.role;
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {display && (
        <p className="text-[10px] uppercase tracking-[0.22em] text-ink font-medium">{display}</p>
      )}
      {sub && (
        <p className="text-[9px] uppercase tracking-[0.16em] text-ink-quiet mt-0.5">{sub}</p>
      )}
      {item.nda && (
        <p className="text-[9px] uppercase tracking-[0.16em] text-ink-quiet/55 mt-0.5">Identity withheld · NDA</p>
      )}
    </div>
  );
}

function SmallPortrait({ item }: { item: TestimonialItem }) {
  if (!item.photoPath || item.nda) return null;
  return (
    <div className="relative w-[48px] h-[64px] flex-shrink-0 overflow-hidden">
      <Image
        src={item.photoPath}
        alt={item.name}
        fill
        sizes="48px"
        className="object-cover object-top grayscale"
      />
    </div>
  );
}

// ─── Layout blocks ────────────────────────────────────────────────────────────

/**
 * HERO — full-width 2-col. Giant italic quote left, tall B&W portrait right.
 * Used for the first named review (strongest / longest narrative).
 */
function HeroReview({ item }: { item: TestimonialItem }) {
  return (
    <div className="container-content pb-16 md:pb-24">
      <div className="grid md:grid-cols-[1fr_300px] xl:grid-cols-[1fr_380px] gap-10 xl:gap-20 items-start">
        <figure>
          <QuoteMark size="lg" />
          <blockquote
            className="font-[family-name:var(--font-display)] italic text-ink leading-[1.28] -mt-4"
            style={{ fontSize: "clamp(22px,3vw,38px)" }}
          >
            {item.quote}
          </blockquote>
          <div className="mt-10 pt-6 border-t border-pink/25">
            <Nameplate item={item} />
          </div>
        </figure>

        {item.photoPath && !item.nda && (
          <div className="relative w-full aspect-[3/4] overflow-hidden hidden md:block">
            <Image
              src={item.photoPath}
              alt={item.name}
              fill
              sizes="(max-width: 1280px) 300px, 380px"
              className="object-cover object-top grayscale hover:grayscale-0 transition-[filter] duration-700"
              priority={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * PAIR — 2-col, each with small portrait, medium-size italic quote.
 * Used for the 2nd and 3rd named reviews.
 */
function PairedReviews({ items }: { items: [TestimonialItem, TestimonialItem] }) {
  return (
    <div className="container-content pb-16 md:pb-24">
      <div className="grid md:grid-cols-2 gap-x-12 xl:gap-x-20 gap-y-14">
        {items.map((item) => (
          <article key={item.key}>
            <Eyebrow className="text-pink/55 mb-6">Client review</Eyebrow>
            <blockquote
              className="font-[family-name:var(--font-display)] italic text-ink leading-[1.55]"
              style={{ fontSize: "clamp(17px,1.8vw,22px)" }}
            >
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <div className="mt-7 pt-5 border-t border-sand/50 flex items-center gap-4">
              <SmallPortrait item={item} />
              <Nameplate item={item} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/**
 * CENTERED — full-width, centred on page. No portrait column.
 * Used for a shorter, punchier named quote — gives the eye a rest.
 */
function CenteredPullQuote({ item }: { item: TestimonialItem }) {
  return (
    <div className="container-content pb-20 md:pb-28">
      <div className="max-w-2xl mx-auto text-center">
        <QuoteMark size="md" />
        <blockquote
          className="font-[family-name:var(--font-display)] italic text-ink leading-[1.42] -mt-3"
          style={{ fontSize: "clamp(20px,2.4vw,30px)" }}
        >
          {item.quote}
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-4">
          <SmallPortrait item={item} />
          <Nameplate item={item} align="center" />
        </div>
      </div>
    </div>
  );
}

/**
 * EDITORIAL SINGLE — 2-col with portrait on right, slightly smaller text.
 * Used for Armina and any overflow named reviews.
 */
function EditorialSingle({ item }: { item: TestimonialItem }) {
  return (
    <div className="container-content pb-16 md:pb-24">
      <div className="grid md:grid-cols-[1fr_260px] xl:grid-cols-[1fr_320px] gap-10 xl:gap-16 items-start">
        <figure>
          <Eyebrow className="text-pink/55 mb-6">Client review</Eyebrow>
          <blockquote
            className="font-[family-name:var(--font-display)] italic text-ink leading-[1.62]"
            style={{ fontSize: "clamp(16px,1.6vw,20px)" }}
          >
            &ldquo;{item.quote}&rdquo;
          </blockquote>
          <div className="mt-7 pt-5 border-t border-sand/50">
            <Nameplate item={item} />
          </div>
        </figure>

        {item.photoPath && !item.nda && (
          <div className="relative w-full aspect-[3/4] overflow-hidden hidden md:block">
            <Image
              src={item.photoPath}
              alt={item.name}
              fill
              sizes="(max-width: 1280px) 260px, 320px"
              className="object-cover object-top grayscale hover:grayscale-0 transition-[filter] duration-700"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * NDA BLOCK — violet-soft wash, no portraits, larger italic text.
 * Signals a different register: anonymous voices, protected identity.
 */
function NdaBlock({ items }: { items: TestimonialItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="bg-violet-soft border-y border-violet-mid/50">
      <div className="container-content py-20 md:py-28">
        <Eyebrow className="text-ink-quiet/60 mb-14">
          Private voices · identity withheld by request
        </Eyebrow>
        <div className={`grid gap-x-16 xl:gap-x-24 gap-y-16 ${items.length >= 2 ? "md:grid-cols-2" : "max-w-2xl"}`}>
          {items.map((item, i) => (
            <article key={item.key}>
              <QuoteMark size="sm" />
              <blockquote
                className="font-[family-name:var(--font-display)] italic text-ink leading-[1.4] -mt-2"
                style={{ fontSize: i === 0 ? "clamp(20px,2.2vw,28px)" : "clamp(18px,2vw,24px)" }}
              >
                {item.quote}
              </blockquote>
              <p className="mt-6 pt-4 border-t border-pink/20 text-[9px] uppercase tracking-[0.22em] text-ink-quiet/70">
                {item.role} · NDA
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * MARQUEE — ink strip, scrolling NDA quotes, pauses on hover.
 */
function Marquee() {
  const doubled = [...MARQUEE_QUOTES, ...MARQUEE_QUOTES];
  return (
    <div className="bg-ink overflow-hidden py-7 border-t border-white/5" aria-hidden="true">
      <div
        className="flex will-change-transform"
        style={{ animation: "editorial-ticker 60s linear infinite" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")
        }
      >
        {doubled.map((q, i) => (
          <span key={i} className="flex items-center flex-shrink-0">
            <span className="font-[family-name:var(--font-display)] italic text-cream/50 text-[13px] leading-snug px-10 whitespace-nowrap">
              &ldquo;{q}&rdquo;
            </span>
            <span className="text-pink/35 text-[7px] flex-shrink-0">◆</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes editorial-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function EditorialTestimonials({ testimonials }: Props) {
  const named = testimonials.filter((t) => !t.nda);
  const anonymous = testimonials.filter((t) => t.nda);

  const hero = named[0];
  const pair = named.slice(1, 3) as [TestimonialItem, TestimonialItem] | [];
  const centered = named[3] ?? null;
  const extras = named.slice(4); // Armina and beyond

  return (
    <section className="bg-cream border-t border-sand/30">
      {/* ── Eyebrow ── */}
      <div className="container-content pt-20 md:pt-28 pb-16 md:pb-20">
        <p className="text-[10px] uppercase tracking-[0.28em] text-ink-quiet font-[family-name:var(--font-body)]">
          Women who have done this work
        </p>
      </div>

      {/* ── 1. Hero ── */}
      {hero && <HeroReview item={hero} />}

      {/* ── Divider ── */}
      <div className="container-content">
        <div className="border-t border-sand/40 mb-16 md:mb-24" />
      </div>

      {/* ── 2. Pair ── */}
      {pair.length === 2 && <PairedReviews items={pair as [TestimonialItem, TestimonialItem]} />}

      {/* ── 3. Centered pull-quote ── */}
      {centered && <CenteredPullQuote item={centered} />}

      {/* ── 4. Editorial singles (Armina etc.) ── */}
      {extras.length > 0 && (
        <>
          <div className="container-content">
            <div className="border-t border-sand/40 mb-16 md:mb-24" />
          </div>
          {extras.map((item) => (
            <EditorialSingle key={item.key} item={item} />
          ))}
        </>
      )}

      {/* ── 5. NDA block ── */}
      <NdaBlock items={anonymous} />

      {/* ── 6. Marquee ── */}
      <Marquee />
    </section>
  );
}
