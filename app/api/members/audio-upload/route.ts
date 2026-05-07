/**
 * POST /api/members/audio-upload
 *
 * Uploads an audio file to Vercel Blob for use in audioDrop documents.
 * After upload, paste the returned URL into the audioDrop.audioUrl field in Sanity Studio.
 *
 * Upgrade path: replace put() with a Hello Audio API call when Hello Audio is
 * activated. The audioUrl stored in Sanity stays the same shape — just swap the
 * source. No client-side changes required.
 *
 * Form data: { file: File, adminSecret: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const adminSecret = process.env.MEMBERS_ADMIN_SECRET
  if (!adminSecret) {
    return NextResponse.json(
      { error: 'MEMBERS_ADMIN_SECRET not configured' },
      { status: 503 },
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const submittedSecret = formData.get('adminSecret')
  if (submittedSecret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 })
  }

  if (!file.type.startsWith('audio/')) {
    return NextResponse.json(
      { error: `Invalid file type: ${file.type}. Must be an audio file.` },
      { status: 400 },
    )
  }

  // Sanitise filename — strip path traversal characters
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const blobPath = `members/audio/${Date.now()}-${safeName}`

  try {
    const blob = await put(blobPath, file, {
      access: 'public',
      contentType: file.type,
    })

    return NextResponse.json({
      url: blob.url,
      size: file.size,
    })
  } catch (err) {
    console.error('[audio-upload] Vercel Blob error:', err)
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
