import { createImageUrlBuilder } from '@sanity/image-url'
import { projectId, dataset } from './client'

const builder = createImageUrlBuilder({ projectId, dataset })

// Accepts the raw coverImage object from GROQ queries
// { asset: { _ref: string }; alt?: string }
export function urlForImage(
  source: { asset: { _ref: string } } | null | undefined,
): string | null {
  if (!source?.asset?._ref) return null
  try {
    return builder.image(source).auto('format').fit('max').url()
  } catch {
    return null
  }
}
