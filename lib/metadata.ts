import type { Metadata } from "next";
import { SITE } from "./utils";

// PREVIEW MODE — blocks all crawlers site-wide. Flip false for launch.
// Single source of truth — affects EVERY page's robots metadata.
const PREVIEW_MODE = false;

interface BuildMetadataOpts {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: BuildMetadataOpts = {}): Metadata {
  const fullTitle = title
    ? `${title} — ${SITE.name}`
    : `${SITE.name} — Private Mentoring for High-Achieving Women`;
  const desc = description ?? SITE.description;
  const url = `${SITE.url}${path}`;
  const ogImage = image ?? `${SITE.url}/opengraph-image`;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.png",
      apple: "/apple-touch-icon.png",
    },
    robots: (PREVIEW_MODE || noIndex)
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Martina Rink",
    jobTitle: "Private Mentor · Author · Sober Conscious Coach",
    url: SITE.url,
    sameAs: [
      SITE.social.linkedin,
      SITE.social.instagram,
    ],
    worksFor: {
      "@type": "Organization",
      name: "The Sober Muse Method",
    },
    knowsAbout: [
      "Conscious leadership",
      "Female empowerment",
      "Sobriety coaching",
      "Executive mentoring",
    ],
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Martina Rink",
    url: SITE.url,
    image: `${SITE.url}/images/portraits/martina-portrait-studio.jpg`,
    description:
      "Private mentorship for accomplished women. Sober Muse Method and Female Empowerment & Leadership.",
    founder: { "@type": "Person", name: "Martina Rink" },
    areaServed: "Worldwide",
    priceRange: "€€€€",
  };
}

export function aboutPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Martina Rink",
    jobTitle: "Author · Private Mentor · Sober Conscious Coach",
    url: `${SITE.url}/about`,
    image: `${SITE.url}/images/portraits/martina-portrait-studio.jpg`,
    description:
      "Spiegel Bestseller author, former personal assistant to Isabella Blow, co-creator of People of Deutschland, and private mentor to senior women.",
    sameAs: [
      SITE.social.linkedin,
      SITE.social.instagram,
      "https://www.spiegel.de/",
    ],
    knowsAbout: [
      "Conscious leadership",
      "Female empowerment",
      "Sobriety mentoring",
      "Executive mentoring",
      "Identity and second-chapter careers",
    ],
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  priceFrom: number;
  priceCurrency?: string;
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: `${SITE.url}${opts.path}`,
    provider: {
      "@type": "Person",
      name: "Martina Rink",
      url: SITE.url,
    },
    areaServed: "Worldwide",
    serviceType: "Private mentoring",
    offers: {
      "@type": "Offer",
      url: `${SITE.url}${opts.path}`,
      priceCurrency: opts.priceCurrency ?? "EUR",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: opts.priceFrom,
        priceCurrency: opts.priceCurrency ?? "EUR",
        minPrice: opts.priceFrom,
      },
      availability: "https://schema.org/LimitedAvailability",
      ...(opts.duration ? { eligibleDuration: opts.duration } : {}),
    },
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
