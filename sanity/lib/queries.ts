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

const RELATED_POSTS_QUERY = `
  *[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...$limit] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage { asset, alt }
  }
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

export async function getRelatedPosts(
  slug: string,
  limit = 2,
): Promise<PostListItem[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<PostListItem[]>(RELATED_POSTS_QUERY, {
      slug,
      limit,
    })
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

/* ─── Assessment Page (singleton) ─────────────────────────── */
export interface SanityAssessmentPage {
  headline: string | null
  subheadline: string | null
  introCopy: string[] | null
  emailGateHeadline: string | null
  emailGateCopy: string | null
  consentText: string | null
  privacyNote: string | null
  seoTitle: string | null
  seoDescription: string | null
}

const ASSESSMENT_PAGE_QUERY = `
  *[_type == "assessmentPage"][0] {
    headline,
    subheadline,
    introCopy,
    emailGateHeadline,
    emailGateCopy,
    consentText,
    privacyNote,
    seoTitle,
    seoDescription
  }
`

export async function getAssessmentPage(): Promise<SanityAssessmentPage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityAssessmentPage | null>(ASSESSMENT_PAGE_QUERY)
  } catch {
    return null
  }
}

/* ─── Page Singletons ──────────────────────────────────────── */
export interface SanitySeoMeta {
  seoTitle?: string | null
  seoDescription?: string | null
  noindex?: boolean | null
}

export interface SanityHomePage {
  heroHeadline: string | null
  heroSubheadline: string | null
  heroCta: { label: string; url: string } | null
  heroSecondaryLabel: string | null
  heroSecondaryUrl: string | null
  authorityItems: string[] | null
  aboutTeaser: string | null
  assessmentCtaHeadline: string | null
  assessmentCtaCopy: string | null
  assessmentCtaLabel: string | null
  newsletterCtaHeadline: string | null
  newsletterCtaCopy: string | null
  seo: SanitySeoMeta | null
}

export interface SanityAboutPage {
  heroHeadline: string | null
  heroCopy: string | null
  storyOrigin: string | null
  storyIsabellaBlowEra: string | null
  storyBooks: string | null
  storySobriety: string | null
  storyWhy: string | null
  ctaLabel: string | null
  ctaUrl: string | null
  seo: SanitySeoMeta | null
}

export interface SanityProgrammePage {
  heroHeadline: string | null
  heroTagline: string | null
  heroCopy: string | null
  forWhomCopy: string | null
  whatThisIsNotCopy: string | null
  methodCopy: string | null
  privacyCopy: string | null
  investmentText: string | null
  ctaLabel: string | null
  ctaUrl: string | null
  seo: SanitySeoMeta | null
}

export interface SanityWorkWithMePage {
  heroHeadline: string | null
  heroCopy: string | null
  ctaLabel: string | null
  ctaUrl: string | null
  seo: SanitySeoMeta | null
}

export interface SanityNewsletterPage {
  headline: string | null
  subheadline: string | null
  bodyCopy: string | null
  trustNote: string | null
  seo: SanitySeoMeta | null
}

export interface SanityPressPage {
  bioCopy: string | null
  pressKitUrl: string | null
  ctaLabel: string | null
  ctaUrl: string | null
  seo: SanitySeoMeta | null
}

export interface SanityContactPage {
  headline: string | null
  subheadline: string | null
  pressInquiryCopy: string | null
  privateInquiryCopy: string | null
  speakingInquiryCopy: string | null
  seo: SanitySeoMeta | null
}

export interface SanityPublication {
  _id: string
  title: string
  subtitle: string | null
  publisher: string | null
  year: number | null
  description: string | null
  isBestseller: boolean
  order: number
  coverImage: { asset: { _ref: string }; alt?: string } | null
}

export interface SanityPressItem {
  _id: string
  publication: string
  headline: string | null
  type: string | null
  featured: boolean
  order: number
  url: string | null
  logo: { asset: { _ref: string }; alt?: string } | null
}

export interface SanityPartnerLogo {
  _id: string
  name: string
  order: number
  url: string | null
  logo: { asset: { _ref: string }; alt?: string } | null
}

export interface SanityLegalPage {
  title: string
  body: unknown[] | null
  updatedAt: string | null
  seo: SanitySeoMeta | null
}

const SEO_FIELDS = `seo { seoTitle, seoDescription, noindex }`

export async function getHomePage(): Promise<SanityHomePage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityHomePage | null>(`
      *[_type == "homePage"][0] {
        heroHeadline, heroSubheadline,
        heroCta, heroSecondaryLabel, heroSecondaryUrl,
        authorityItems, aboutTeaser,
        assessmentCtaHeadline, assessmentCtaCopy, assessmentCtaLabel,
        newsletterCtaHeadline, newsletterCtaCopy,
        ${SEO_FIELDS}
      }
    `)
  } catch { return null }
}

export async function getAboutPage(): Promise<SanityAboutPage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityAboutPage | null>(`
      *[_type == "aboutPage"][0] {
        heroHeadline, heroCopy,
        storyOrigin, storyIsabellaBlowEra, storyBooks, storySobriety, storyWhy,
        ctaLabel, ctaUrl,
        ${SEO_FIELDS}
      }
    `)
  } catch { return null }
}

export async function getSoberMusePage(): Promise<SanityProgrammePage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityProgrammePage | null>(`
      *[_type == "soberMusePage"][0] {
        heroHeadline, heroTagline, heroCopy,
        forWhomCopy, whatThisIsNotCopy, methodCopy, privacyCopy,
        investmentText, ctaLabel, ctaUrl,
        ${SEO_FIELDS}
      }
    `)
  } catch { return null }
}

export async function getEmpowermentPage(): Promise<SanityProgrammePage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityProgrammePage | null>(`
      *[_type == "empowermentPage"][0] {
        heroHeadline, heroTagline, heroCopy,
        forWhomCopy, whatThisIsNotCopy, methodCopy, privacyCopy,
        investmentText, ctaLabel, ctaUrl,
        ${SEO_FIELDS}
      }
    `)
  } catch { return null }
}

export async function getWorkWithMePage(): Promise<SanityWorkWithMePage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityWorkWithMePage | null>(`
      *[_type == "workWithMePage"][0] {
        heroHeadline, heroCopy, ctaLabel, ctaUrl,
        ${SEO_FIELDS}
      }
    `)
  } catch { return null }
}

export async function getNewsletterPage(): Promise<SanityNewsletterPage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityNewsletterPage | null>(`
      *[_type == "newsletterPage"][0] {
        headline, subheadline, bodyCopy, trustNote,
        ${SEO_FIELDS}
      }
    `)
  } catch { return null }
}

export async function getPressPage(): Promise<SanityPressPage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityPressPage | null>(`
      *[_type == "pressPage"][0] {
        bioCopy, pressKitUrl, ctaLabel, ctaUrl,
        ${SEO_FIELDS}
      }
    `)
  } catch { return null }
}

export async function getContactPage(): Promise<SanityContactPage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityContactPage | null>(`
      *[_type == "contactPage"][0] {
        headline, subheadline,
        pressInquiryCopy, privateInquiryCopy, speakingInquiryCopy,
        ${SEO_FIELDS}
      }
    `)
  } catch { return null }
}

export async function getPublications(): Promise<SanityPublication[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityPublication[]>(`
      *[_type == "publication"] | order(order asc) {
        _id, title, subtitle, publisher, year, description, isBestseller, order,
        coverImage { asset, alt }
      }
    `)
  } catch { return null }
}

export async function getPressItems(featuredOnly = false): Promise<SanityPressItem[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    const filter = featuredOnly
      ? `*[_type == "pressItem" && featured == true]`
      : `*[_type == "pressItem"]`
    return await client.fetch<SanityPressItem[]>(`
      ${filter} | order(order asc) {
        _id, publication, headline, type, featured, order, url,
        logo { asset, alt }
      }
    `)
  } catch { return null }
}

export async function getPartnerLogos(): Promise<SanityPartnerLogo[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityPartnerLogo[]>(`
      *[_type == "partnerLogo"] | order(order asc) {
        _id, name, order, url,
        logo { asset, alt }
      }
    `)
  } catch { return null }
}

/* ─── Creative Work Page (singleton) ──────────────────────── */
export interface SanityImageWithAlt {
  asset: { _ref: string }
  alt: string
  caption?: string | null
}

export interface SanityCreativeWorkSection {
  heading: string | null
  body: string | null
  imageGallery: SanityImageWithAlt[] | null
  quote?: string | null
  quoteSource?: string | null
  photoCredit: string | null
}

export interface SanityCreativeWorkPage {
  eyebrow: string | null
  heroHeadline: string | null
  heroSubheadline: string | null
  introCopy: string | null
  peopleOfDeutschland: SanityCreativeWorkSection | null
  isabellaBlow: (SanityCreativeWorkSection & { quote: string | null; quoteSource: string | null }) | null
  fashionGermany: (SanityCreativeWorkSection & { quote: string | null; quoteSource: string | null }) | null
  closingSection: {
    heading: string | null
    body: string | null
    primaryCtaLabel: string | null
    primaryCtaUrl: string | null
    secondaryCtaLabel: string | null
    secondaryCtaUrl: string | null
  } | null
  seo: SanitySeoMeta | null
}

export async function getCreativeWorkPage(): Promise<SanityCreativeWorkPage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityCreativeWorkPage | null>(`
      *[_type == "creativeWorkPage"][0] {
        eyebrow, heroHeadline, heroSubheadline, introCopy,
        peopleOfDeutschland {
          heading, body,
          imageGallery[] { asset, alt, caption },
          photoCredit
        },
        isabellaBlow {
          heading, body,
          imageGallery[] { asset, alt, caption },
          quote, quoteSource, photoCredit
        },
        fashionGermany {
          heading, body,
          imageGallery[] { asset, alt, caption },
          quote, quoteSource, photoCredit
        },
        closingSection {
          heading, body,
          primaryCtaLabel, primaryCtaUrl,
          secondaryCtaLabel, secondaryCtaUrl
        },
        ${SEO_FIELDS}
      }
    `)
  } catch { return null }
}

export async function getLegalPage(slug: string): Promise<SanityLegalPage | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<SanityLegalPage | null>(`
      *[_type == "legalPage" && slug.current == $slug][0] {
        title, body, updatedAt,
        ${SEO_FIELDS}
      }
    `, { slug })
  } catch { return null }
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
