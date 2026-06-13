/**
 * Testimonials — single source of truth for all client reviews.
 *
 * Every quote on the site should originate here, so names, roles, NDA status,
 * and photos are edited once and never drift between pages. The homepage tries
 * Sanity first (`getFeaturedTestimonials`) and falls back to HOMEPAGE_FALLBACK.
 *
 * RULES:
 *  - `nda: true` clients render role-only ("Founder · London") — never named.
 *  - Never add a review without the client's verified words. No fabrication,
 *    no de-anonymising without written permission.
 */

export interface Review {
  id: string;
  /** Real first name, or role-stand-in when nda. */
  name: string;
  role: string | null;
  quote: string;
  nda: boolean;
  photoPath?: string;
  programme?: "sober-muse" | "empowerment" | "consultation";
  /** Show in the homepage three-up proof row. */
  featuredHome?: boolean;
}

export const REVIEWS: Review[] = [
  {
    id: "anja",
    name: "Anja",
    role: "Founder & Digital Business Consultant",
    quote:
      "The session with Martina was a thoroughly enriching experience — inspiring, motivating, and above all extremely effective. She has a wonderful way of helping you arrive at important realisations about yourself in a remarkably short time.",
    nda: false,
    photoPath: "/images/portraits/anja-testimonial.avif",
    programme: "empowerment",
    featuredHome: true,
  },
  {
    id: "lu",
    name: "Lu",
    role: "Patent Attorney",
    quote:
      "Martina is warm, constructive and very professional — with great expertise in guiding people to find their way. I recommend her without hesitation to anyone serious about personal development.",
    nda: false,
    photoPath: "/images/portraits/portrait-lu.avif",
    programme: "empowerment",
    featuredHome: true,
  },
  {
    id: "harita",
    name: "Harita",
    role: "Manager · Automotive industry",
    quote:
      "Her energy is truly special. The topics we discuss resonate so deeply with my own thoughts — as if taken directly from my own mind. She speaks from experience and conveys profound depth.",
    nda: false,
    photoPath: "/images/portraits/portrait-harita.avif",
    programme: "empowerment",
    featuredHome: true,
  },
  {
    // Sober Muse client — NDA is intentional (sobriety + privacy). Do not name.
    id: "sober-clarity",
    name: "Founder",
    role: "Founder · London",
    quote:
      "I came in thinking I had a drinking problem. I left understanding I had a clarity problem — and the drinking had been the solution I'd found for it. Martina saw that distinction before I did.",
    nda: true,
    programme: "sober-muse",
  },
  {
    // Sober Muse client — NDA is intentional. Do not name.
    id: "sober-capacity",
    name: "Founder",
    role: "Founder · London",
    quote:
      "The work was not a rebuild. It was the return of a capacity I had quietly stopped believing in.",
    nda: true,
    programme: "sober-muse",
  },
  {
    // Used on /about — Anja's empowerment-specific reflection.
    id: "anja-about",
    name: "Anja",
    role: "Founder & Digital Business Consultant",
    quote:
      "Martina doesn't coach you toward an answer. She asks the question you didn't know you were avoiding — and then she waits. That quality of attention is genuinely rare.",
    nda: false,
    photoPath: "/images/portraits/anja-testimonial.avif",
    programme: "empowerment",
  },
];

/** Homepage three-up proof row (named clients with portraits). */
export const HOMEPAGE_FALLBACK: Review[] = REVIEWS.filter((r) => r.featuredHome);

export function getReview(id: string): Review {
  const review = REVIEWS.find((r) => r.id === id);
  if (!review) throw new Error(`Unknown testimonial id: ${id}`);
  return review;
}

/*
 * PENDING — real clients, portraits ready, awaiting verified quote text from
 * Martina. Do NOT invent words; add full entries here once confirmed:
 *   • Armina · Patent Engineer  → /images/portraits/armina-patent-engineer.avif
 *   • Rebecca                   → /images/portraits/portrait-rebecca.avif
 */
