/**
 * Sanity write client — used ONLY in server-side API routes.
 * Never import this in components or pages (it carries a write token).
 *
 * Env var required: SANITY_API_WRITE_TOKEN
 * Get it from: Sanity project → API → Tokens → Add API token (Editor role)
 */

import { createClient, type SanityClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from './client'

const VALID_PROJECT_ID = /^[a-z0-9][a-z0-9-]*$/.test(projectId)
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN

export const writeClient: SanityClient | null =
  VALID_PROJECT_ID && WRITE_TOKEN
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token: WRITE_TOKEN,
      })
    : null

/** Type guard — use before any mutation */
export function hasWriteClient(c: typeof writeClient): c is SanityClient {
  return c !== null
}
