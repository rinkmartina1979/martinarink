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
