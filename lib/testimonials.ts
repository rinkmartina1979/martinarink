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
  /** Show in the homepage four-up proof grid. */
  featuredHome?: boolean;
}

export const REVIEWS: Review[] = [
  {
    id: "harita",
    name: "Harita",
    role: "Manager · Automotive industry",
    quote:
      "I've had a few conversations with Martina, and her energy is truly special. The topics we discuss resonate so deeply with my own thoughts — as if taken directly from my own mind. She speaks from experience and conveys profound depth. Every interaction is deeply inspiring.",
    nda: false,
    photoPath: "/images/portraits/portrait-harita.avif",
    programme: "empowerment",
    featuredHome: true,
  },
  {
    id: "lu",
    name: "Lu",
    role: "Patent Attorney",
    quote:
      "Martina has so many wonderful attributes that it is very difficult to describe the full impact in a few sentences. She is warm, supportive, constructive and very professional — with great expertise to guide people in finding their way. Highly recommended for anyone seeking serious personal development.",
    nda: false,
    photoPath: "/images/portraits/portrait-lu.avif",
    programme: "empowerment",
    featuredHome: true,
  },
  {
    id: "anja",
    name: "Anja",
    role: "Founder & Digital Business Consultant",
    quote:
      "The session with Martina was a thoroughly enriching experience. It was inspiring, motivating, and above all extremely effective. She has a wonderful way of helping you arrive at important realisations about yourself — in a remarkably short time.",
    nda: false,
    photoPath: "/images/portraits/anja-testimonial.avif",
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
    // Empowerment client — use on /empowerment page.
    id: "armina",
    name: "Armina",
    role: "Patent Engineer",
    quote:
      "My experience with Martina as a life coach was life-changing. From the very first consultation, I felt understood and supported. She helped me gain clarity about my life path and clearly define my goals. Martina's dedication is noticeable in every coaching session — she supports me in discovering my own inner strength and developing my full potential. Her voice is calming and encouraging, and every conversation offers a safe space for growth. I wholeheartedly recommend Martina to anyone seeking an empathetic and committed coach.",
    nda: false,
    photoPath: "/images/portraits/portrait-armina.avif",
    programme: "empowerment",
  },
  {
    id: "rebecca",
    name: "Rebecca",
    role: "Travel Agent & Entrepreneur",
    quote:
      "A dear friend introduced me to Martina's Dry January Challenge. What began as an experiment quickly became one of the most significant months of my life. With Martina's support I not only completed the challenge but gained a much deeper understanding of my relationship with myself. Challenge accomplished.",
    nda: false,
    photoPath: "/images/portraits/portrait-rebecca.avif",
    programme: "sober-muse",
    featuredHome: true,
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

/** Homepage four-up proof grid (named clients with portraits). */
export const HOMEPAGE_FALLBACK: Review[] = REVIEWS.filter((r) => r.featuredHome);

export function getReview(id: string): Review {
  const review = REVIEWS.find((r) => r.id === id);
  if (!review) throw new Error(`Unknown testimonial id: ${id}`);
  return review;
}

/*
 * PENDING — portrait ready, awaiting verified quote text from Martina:
 *   • Armina · Patent Engineer  → /images/portraits/armina-patent-engineer.avif
 */
