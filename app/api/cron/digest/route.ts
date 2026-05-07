/**
 * GET /api/cron/digest
 *
 * Bi-weekly email digest — called by Vercel Cron.
 * Vercel automatically sets Authorization: Bearer <CRON_SECRET> on cron calls.
 *
 * Logic:
 *   1. Fetch posts published in the last 14 days
 *   2. If none: log 'skipped' to Sanity, return 200
 *   3. Build HTML email (max 3 posts)
 *   4. Create + send Brevo campaign
 *   5. Log result to Sanity emailDigestLog
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, type PostListItem } from '@/sanity/lib/queries'
import { client as sanityClient } from '@/sanity/lib/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BREVO_API_BASE = 'https://api.brevo.com/v3'
const MAX_POSTS_IN_DIGEST = 3
const DIGEST_WINDOW_DAYS = 14

async function logToSanity(data: {
  sentAt: string
  postIds: string[]
  brevoEmailId: string
  status: 'sent' | 'skipped' | 'failed'
  errorMessage?: string
}): Promise<void> {
  try {
    await sanityClient.create({
      _type: 'emailDigestLog',
      sentAt: data.sentAt,
      postIds: data.postIds,
      recipientCount: 0, // Brevo does not return this immediately on campaign create
      brevoEmailId: data.brevoEmailId,
      status: data.status,
      ...(data.errorMessage ? { errorMessage: data.errorMessage } : {}),
    })
  } catch (err) {
    console.error('[digest cron] Sanity log failed:', err)
  }
}

function buildDigestHtml(posts: PostListItem[], siteUrl: string): string {
  const month = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' })

  const postRows = posts
    .slice(0, MAX_POSTS_IN_DIGEST)
    .map(
      (post) => `
      <tr>
        <td style="padding:32px 0;border-bottom:1px solid #C8B8A2;">
          <p style="margin:0 0 8px;font-size:19px;font-weight:normal;font-family:Georgia,serif;color:#1E1B17;">
            <a href="${siteUrl}/writing/${post.slug}" style="color:#5C2D8E;text-decoration:none;">
              ${post.title}
            </a>
          </p>
          ${
            post.excerpt
              ? `<p style="margin:8px 0 16px;font-size:15px;line-height:1.7;color:#4A3728;font-family:Georgia,serif;">
                  ${post.excerpt}
                </p>`
              : ''
          }
          <a
            href="${siteUrl}/writing/${post.slug}"
            style="font-size:13px;color:#5C2D8E;text-decoration:none;letter-spacing:0.06em;font-family:Georgia,serif;"
          >
            Read &rarr;
          </a>
        </td>
      </tr>`,
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>From the writing room — ${month}</title>
</head>
<body style="margin:0;padding:0;background:#F7F3EE;">
  <div style="max-width:600px;margin:0 auto;background:#F7F3EE;padding:48px 40px;font-family:Georgia,serif;color:#1E1B17;">

    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.12em;color:#8A7F72;text-transform:uppercase;font-family:Georgia,serif;">
      From the writing room
    </p>
    <h1 style="margin:0 0 40px;font-size:26px;font-weight:normal;color:#1E1B17;">
      ${month}
    </h1>

    <hr style="border:none;border-top:1px solid #C8B8A2;margin-bottom:0;" />

    <table style="width:100%;border-collapse:collapse;">
      ${postRows}
    </table>

    <div style="margin-top:48px;padding-top:32px;border-top:1px solid #C8B8A2;">
      <p style="font-size:13px;color:#8A7F72;line-height:1.6;margin:0 0 8px;">
        You're receiving this because you subscribed at martinarink.com.
      </p>
      <p style="font-size:13px;color:#8A7F72;line-height:1.6;margin:0;">
        <a href="{{unsubscribe}}" style="color:#8A7F72;">Unsubscribe</a>
        &nbsp;·&nbsp;
        <a href="${siteUrl}" style="color:#8A7F72;">martinarink.com</a>
      </p>
    </div>

  </div>
</body>
</html>
  `.trim()
}

export async function GET(req: NextRequest) {
  // Verify Vercel Cron secret
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }
  }

  const brevoKey = process.env.BREVO_API_KEY
  if (!brevoKey) {
    return NextResponse.json(
      { error: 'BREVO_API_KEY not configured' },
      { status: 503 },
    )
  }

  const listIdRaw = process.env.BREVO_LIST_ID_NEWSLETTER
  if (!listIdRaw) {
    return NextResponse.json(
      { error: 'BREVO_LIST_ID_NEWSLETTER not configured' },
      { status: 503 },
    )
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://martinarink.com')

  const sentAt = new Date().toISOString()

  // Fetch all posts and filter to those published in last 14 days
  const allPosts = await getAllPosts()
  const cutoff = new Date(Date.now() - DIGEST_WINDOW_DAYS * 24 * 60 * 60 * 1000)
  const recentPosts = (allPosts ?? []).filter(
    (p) => p.publishedAt && new Date(p.publishedAt) >= cutoff,
  )

  if (recentPosts.length === 0) {
    await logToSanity({
      sentAt,
      postIds: [],
      brevoEmailId: '',
      status: 'skipped',
    })
    return NextResponse.json({ ok: true, skipped: true, reason: 'No posts in last 14 days' })
  }

  const postsForDigest = recentPosts.slice(0, MAX_POSTS_IN_DIGEST)
  const postIds = postsForDigest.map((p) => p.slug).filter(Boolean)
  const htmlContent = buildDigestHtml(postsForDigest, siteUrl)

  // Build subject — add month label on first of the month
  const now = new Date()
  const isFirstOfMonth = now.getDate() === 1
  const monthLabel = now.toLocaleString('en-GB', { month: 'long' })
  const subject = isFirstOfMonth
    ? `From the writing room — ${monthLabel}`
    : 'From the writing room'

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'hello@martinarink.com'

  let campaignId = ''
  try {
    const createRes = await fetch(`${BREVO_API_BASE}/emailCampaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoKey,
      },
      body: JSON.stringify({
        name: `Digest — ${sentAt}`,
        subject,
        sender: { name: 'Martina Rink', email: fromEmail },
        recipients: { listIds: [parseInt(listIdRaw, 10)] },
        htmlContent,
        scheduledAt: 'now',
      }),
    })

    if (!createRes.ok) {
      const errText = await createRes.text()
      console.error('[digest cron] Brevo campaign error:', createRes.status, errText)
      await logToSanity({
        sentAt,
        postIds,
        brevoEmailId: '',
        status: 'failed',
        errorMessage: `HTTP ${createRes.status}: ${errText}`,
      })
      return NextResponse.json(
        { error: 'Brevo campaign creation failed', detail: errText },
        { status: 502 },
      )
    }

    const campaignData = (await createRes.json()) as { id?: number }
    campaignId = String(campaignData.id ?? '')
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[digest cron] Brevo network error:', err)
    await logToSanity({ sentAt, postIds, brevoEmailId: '', status: 'failed', errorMessage: message })
    return NextResponse.json({ error: 'Brevo request failed', detail: message }, { status: 502 })
  }

  await logToSanity({ sentAt, postIds, brevoEmailId: campaignId, status: 'sent' })

  return NextResponse.json({
    ok: true,
    postsCount: postsForDigest.length,
    campaignId,
  })
}
