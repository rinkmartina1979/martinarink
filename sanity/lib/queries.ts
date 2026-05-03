import { client } from './client'

const IS_SANITY_CONFIGURED = !!(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'placeholder'
)

/* ─── Types ────────────────────────────────────────────────── */
export interface PostListItem {
  _id: string
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string | null
  coverImage: { asset: { _ref: string }; alt?: string } | null
}

export interface PostFull extends PostListItem {
  body: unknown[] | null
  seoTitle: string | null
  seoDescription: string | null
}

export interface Testimonial {
  _id: string
  name: string
  role: string | null
  quote: string
  programme: string | null
  featured: boolean
  nda: boolean
  order: number
  portrait: { asset: { _ref: string }; alt?: string } | null
}

/* ─── GROQ queries ─────────────────────────────────────────── */
const POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage { asset, alt }
  }
`

const POST_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage { asset, alt },
    body,
    seoTitle,
    seoDescription
  }
`

const POST_SLUGS_QUERY = `
  *[_type == "post"] { "slug": slug.current }
`

const FEATURED_TESTIMONIALS_QUERY = `
  *[_type == "testimonial" && featured == true] | order(order asc) {
    _id,
    name,
    role,
    quote,
    programme,
    featured,
    nda,
    order,
    portrait { asset, alt }
  }
`

/* ─── Fetch helpers ────────────────────────────────────────── */
export async function getAllPosts(): Promise<PostListItem[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<PostListItem[]>(POSTS_QUERY)
  } catch {
    return null
  }
}

export async function getAllPostSlugs(): Promise<string[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    const results = await client.fetch<{ slug: string }[]>(POST_SLUGS_QUERY)
    return results.map((r) => r.slug).filter(Boolean)
  } catch {
    return null
  }
}

export async function getPost(slug: string): Promise<PostFull | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<PostFull>(POST_QUERY, { slug })
  } catch {
    return null
  }
}

export async function getFeaturedTestimonials(): Promise<Testimonial[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<Testimonial[]>(FEATURED_TESTIMONIALS_QUERY)
  } catch {
    return null
  }
}

/* ─── Page-data stubs ──────────────────────────────────────────
 * These query functions return null until the corresponding singleton
 * documents are created in Sanity Studio. Pages render hardcoded
 * fallback content when the result is null, so the site is always
 * complete. Once content is added in /admin, replace the body of
 * each function with a real `client.fetch(...)` call.
 * ────────────────────────────────────────────────────────────── */

export interface SeoBlock {
  seoTitle: string | null
  seoDescription: string | null
}

export interface HomePage {
  seo: SeoBlock
  heroEyebrow?: string | null
  heroHeadline?: string | null
  heroSubcopy?: string | null
  heroSubheadline?: string | null
  heroCta?: { label?: string; url?: string } | null
  heroSecondaryLabel?: string | null
  heroSecondaryUrl?: string | null
  assessmentCtaHeadline?: string | null
  assessmentCtaCopy?: string | null
  assessmentCtaLabel?: string | null
  aboutTeaser?: string | null
}

export interface AboutPage {
  seo: SeoBlock
  heroHeadline?: string | null
  heroCopy: string
  storyIsabellaBlowEra: string
  storyBooks: string
  storyOrigin: string
  storySobriety: string
  storyWhy: string
  ctaLabel?: string | null
  ctaUrl?: string | null
}

export interface SoberMusePage {
  seo: SeoBlock
  heroHeadline?: string | null
  heroCopy?: string | null
  whatThisIsNotCopy: string
  forWhomCopy: string
  methodCopy: string
  privacyCopy: string
  ctaLabel?: string | null
  ctaUrl?: string | null
  investmentText?: string | null
}

export interface EmpowermentPage extends SoberMusePage {}

export interface WorkWithMePage {
  seo: SeoBlock
  introCopy?: string | null
  heroHeadline?: string | null
  heroCopy?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
}

export interface LegalPage {
  seo: SeoBlock
  updatedAt: string | null
  body: unknown[] | null
}

export interface PartnerLogo {
  _id: string
  name: string
  url: string | null
}

export async function getHomePage(): Promise<HomePage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<HomePage>(
      `*[_type == "homePage"][0]{ seo{seoTitle, seoDescription}, heroEyebrow, heroHeadline, heroSubcopy }`
    )
  } catch {
    return null
  }
}

export async function getAboutPage(): Promise<AboutPage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<AboutPage>(
      `*[_type == "aboutPage"][0]{ seo{seoTitle, seoDescription}, heroCopy, storyIsabellaBlowEra, storyBooks, storyOrigin, storySobriety, storyWhy }`
    )
  } catch {
    return null
  }
}

export async function getSoberMusePage(): Promise<SoberMusePage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SoberMusePage>(
      `*[_type == "soberMusePage"][0]{ seo{seoTitle, seoDescription}, whatThisIsNotCopy, forWhomCopy, methodCopy, privacyCopy }`
    )
  } catch {
    return null
  }
}

export async function getEmpowermentPage(): Promise<EmpowermentPage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<EmpowermentPage>(
      `*[_type == "empowermentPage"][0]{ seo{seoTitle, seoDescription}, whatThisIsNotCopy, forWhomCopy, methodCopy, privacyCopy }`
    )
  } catch {
    return null
  }
}

export async function getWorkWithMePage(): Promise<WorkWithMePage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<WorkWithMePage>(
      `*[_type == "workWithMePage"][0]{ seo{seoTitle, seoDescription}, introCopy }`
    )
  } catch {
    return null
  }
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<LegalPage>(
      `*[_type == "legalPage" && slug.current == $slug][0]{ seo{seoTitle, seoDescription}, "updatedAt": _updatedAt, body }`,
      { slug }
    )
  } catch {
    return null
  }
}

export async function getPartnerLogos(): Promise<PartnerLogo[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<PartnerLogo[]>(
      `*[_type == "partnerLogo"] | order(order asc) { _id, name, url }`
    )
  } catch {
    return null
  }
}

/* ─── Assessment Result ────────────────────────────────────── */
export interface SanityAssessmentResult {
  archetype: string
  name: string
  tagline: string
  opening: string
  bodyParagraphs: string[]
  closing: string
}

const ASSESSMENT_RESULT_QUERY = `
  *[_type == "assessmentResult" && archetype == $archetype][0] {
    archetype,
    name,
    tagline,
    opening,
    bodyParagraphs,
    closing
  }
`

export async function getAssessmentResult(
  archetype: string
): Promise<SanityAssessmentResult | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityAssessmentResult | null>(
      ASSESSMENT_RESULT_QUERY,
      { archetype }
    )
  } catch {
    return null
  }
}
