import { createClient } from 'next-sanity'

// Strip any invisible/invalid characters — copy-paste from browser dashboards
// can include zero-width spaces, trailing newlines, etc.
const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const projectId = rawProjectId.replace(/[^a-z0-9-]/g, '').trim()
export const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production').trim()
export const apiVersion = '2026-02-01'

// Guard: only create a real client when projectId is available and valid.
// During build without env vars the client is a no-op placeholder.
const VALID_PROJECT_ID = /^[a-z0-9][a-z0-9-]*$/.test(projectId)

export const client = VALID_PROJECT_ID
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
