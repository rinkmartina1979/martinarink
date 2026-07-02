/**
 * scripts/check-env.ts
 *
 * Compares required environment variable NAMES (never values) against
 * .env.local, and separately reports which of those are set in Vercel
 * Production via `vercel env ls` (also names only).
 *
 * This exists because a local secret change is not real until it is
 * mirrored in Vercel AND the project is redeployed — that mismatch caused
 * a real incident (2026-07-02: MEMBERS_TOKEN_SECRET rotated locally but
 * not in Vercel, so every emailed portal link failed signature verification).
 *
 * Usage: npx tsx scripts/check-env.ts
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

// Vars the app cannot run correctly without, grouped by what breaks if missing.
const REQUIRED: Record<string, string[]> = {
  'Sanity (all reads/writes)': [
    'SANITY_API_PROJECT_ID',
    'SANITY_API_DATASET',
    'SANITY_API_WRITE_TOKEN',
  ],
  // sanity/lib/client.ts (the client-safe reader used by verifyPortalAccess and
  // every membersQueries call) reads ONLY these NEXT_PUBLIC_ vars — it does not
  // fall back to SANITY_API_PROJECT_ID. If these are blank, portal pages silently
  // 404/expire even though the write-side vars above are fine. Caught 2026-07-02.
  'Sanity (client-safe reader)': ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET'],
  'Members portal auth': ['MEMBERS_TOKEN_SECRET', 'MEMBERS_ADMIN_SECRET'],
  'Email (Resend transactional)': ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'RESEND_NOTIFY_EMAIL'],
  'Email (Brevo drip)': ['BREVO_API_KEY', 'BREVO_LIST_ID_NEWSLETTER', 'BREVO_LIST_ID_ASSESSMENT'],
  'Funnel secrets': ['ASSESSMENT_RESULT_SECRET', 'ACCEPT_SECRET', 'CONTRACT_SECRET'],
  'Stripe (payments)': ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
  'Cal.com (booking)': ['CALCOM_WEBHOOK_SECRET', 'NEXT_PUBLIC_CALCOM_URL'],
  Site: ['NEXT_PUBLIC_SITE_URL'],
}

function loadLocalEnvNames(): Map<string, boolean> {
  const envPath = resolve(process.cwd(), '.env.local')
  const set = new Map<string, boolean>() // name -> hasNonEmptyValue
  if (!existsSync(envPath)) return set
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (!m) continue
    const value = m[2].replace(/^["']|["']$/g, '')
    set.set(m[1], value.length > 0)
  }
  return set
}

function loadVercelProdNames(): Set<string> | null {
  try {
    const out = execSync('vercel env ls production', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] })
    const names = new Set<string>()
    for (const line of out.split('\n')) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s/)
      if (m) names.add(m[1])
    }
    return names
  } catch {
    return null // vercel CLI not authed/linked — degrade gracefully
  }
}

function main() {
  const local = loadLocalEnvNames()
  const vercelProd = loadVercelProdNames()

  console.log('\nEnv check — names only, no values ever printed.\n')

  let anyMissing = false

  for (const [group, keys] of Object.entries(REQUIRED)) {
    console.log(`${group}`)
    for (const key of keys) {
      const inLocal = local.has(key)
      const localNonEmpty = local.get(key) === true
      const localMark = !inLocal ? '✗ missing' : localNonEmpty ? '✓' : '✗ empty'

      let vercelMark = '? unknown (vercel CLI not authed)'
      if (vercelProd) vercelMark = vercelProd.has(key) ? '✓' : '✗ missing'

      const bad = localMark.startsWith('✗') || vercelMark.startsWith('✗')
      if (bad) anyMissing = true

      console.log(`  ${bad ? '⚠' : ' '} ${key.padEnd(32)} local: ${localMark.padEnd(12)} vercel prod: ${vercelMark}`)
    }
    console.log('')
  }

  if (anyMissing) {
    console.log('One or more required keys are missing or empty. See above.')
    console.log('Reminder: a local value is not real in production until it is also set in')
    console.log('Vercel AND the project has been redeployed after the change.\n')
    process.exit(1)
  } else {
    console.log('All required keys present locally and in Vercel Production.\n')
  }
}

main()
