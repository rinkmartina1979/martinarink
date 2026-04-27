import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2026-02-01'

// Guard: only create a real client when projectId is available.
// During build without env vars the client is a no-op placeholder.
export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      stega: {
        studioUrl: '/admin',
      },
    })
  : createClient({
      projectId: 'placeholder',
      dataset,
      apiVersion,
      useCdn: false,
    })
