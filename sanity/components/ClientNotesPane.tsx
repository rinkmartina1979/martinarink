/**
 * sanity/components/ClientNotesPane.tsx
 *
 * Renders as the "Notes" tab on every clientProfile document in Studio.
 * Martina sees — and adds — notes without leaving the client she has open.
 *
 * Architecture:
 *  - useClient() gives the Studio's own authenticated Sanity client (read + write).
 *    No separate write token needed here.
 *  - client.listen() keeps the list live across tabs.
 *  - Quick-create dialog for short notes (no page navigation required).
 *  - Edit icon navigates to the full clientNote document for longer edits.
 *  - Pin toggle is a one-click in-list action.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useClient } from 'sanity'
import { useRouter } from 'sanity/router'
import {
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Label,
  Select,
  Spinner,
  Stack,
  Text,
} from '@sanity/ui'
import { AddIcon, EditIcon, PinIcon } from '@sanity/icons'

// ── types ─────────────────────────────────────────────────────────────────────

interface ClientNote {
  _id: string
  note: string
  category: string
  pinned: boolean
  createdAt: string
}

interface ViewDocumentProps {
  _id?: string
  clientId?: string
  firstName?: string
  lastName?: string
}

export interface ClientNotesPaneProps {
  document: {
    displayed: ViewDocumentProps
  }
}

// ── constants ─────────────────────────────────────────────────────────────────

const CATEGORY_TONE: Record<
  string,
  'positive' | 'caution' | 'critical' | 'default'
> = {
  general: 'default',
  session: 'positive',
  wellbeing: 'caution',
  billing: 'critical',
  admin: 'default',
}

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'session', label: 'Session' },
  { value: 'wellbeing', label: 'Wellbeing' },
  { value: 'billing', label: 'Billing' },
  { value: 'admin', label: 'Admin' },
]

const NOTES_QUERY = `
  *[_type == "clientNote" && clientId == $clientId]
  | order(pinned desc, createdAt desc) {
    _id, note, category, pinned, createdAt
  }
`

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ── component ─────────────────────────────────────────────────────────────────

export function ClientNotesPane({
  document: { displayed },
}: ClientNotesPaneProps) {
  const client = useClient({ apiVersion: '2026-01-01' })
  const router = useRouter()

  const clientId = displayed?.clientId ?? null
  const clientRef = displayed?._id ?? null

  // ── note list state ─────────────────────────────────────────────
  const [notes, setNotes] = useState<ClientNote[]>([])
  const [loading, setLoading] = useState(true)

  // ── dialog state ────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draftText, setDraftText] = useState('')
  const [draftCategory, setDraftCategory] = useState('general')
  const [draftPinned, setDraftPinned] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ── fetch ───────────────────────────────────────────────────────
  const fetchNotes = useCallback(() => {
    if (!clientId) {
      setLoading(false)
      return Promise.resolve()
    }
    return client
      .fetch<ClientNote[]>(NOTES_QUERY, { clientId })
      .then((rows) => {
        setNotes(rows)
        setLoading(false)
      })
      .catch((err) => {
        console.error('[ClientNotesPane] fetch error:', err)
        setLoading(false)
      })
  }, [client, clientId])

  // initial fetch + live subscription
  useEffect(() => {
    setLoading(true)
    fetchNotes()
    if (!clientId) return
    const sub = client
      .listen(`*[_type == "clientNote" && clientId == $clientId]`, { clientId })
      .subscribe(() => fetchNotes())
    return () => sub.unsubscribe()
  }, [clientId, client, fetchNotes])

  // focus textarea when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [dialogOpen])

  // ── actions ─────────────────────────────────────────────────────
  const openDialog = () => {
    setDraftText('')
    setDraftCategory('general')
    setDraftPinned(false)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!clientRef || !clientId || !draftText.trim() || saving) return
    setSaving(true)
    try {
      await client.create({
        _type: 'clientNote',
        client: { _type: 'reference', _ref: clientRef },
        clientId,
        note: draftText.trim(),
        category: draftCategory,
        pinned: draftPinned,
        createdAt: new Date().toISOString(),
      })
      setDialogOpen(false)
      fetchNotes()
    } catch (err) {
      console.error('[ClientNotesPane] create error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePin = async (note: ClientNote) => {
    try {
      await client.patch(note._id).set({ pinned: !note.pinned }).commit()
      // optimistic update
      setNotes((prev) =>
        prev
          .map((n) => (n._id === note._id ? { ...n, pinned: !n.pinned } : n))
          .sort((a, b) => {
            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          }),
      )
    } catch (err) {
      console.error('[ClientNotesPane] pin toggle error:', err)
      fetchNotes()
    }
  }

  const handleEdit = (note: ClientNote) => {
    router.navigateIntent('edit', { id: note._id, type: 'clientNote' })
  }

  // ── guard ────────────────────────────────────────────────────────
  if (!clientId) {
    return (
      <Box padding={4}>
        <Text muted size={1}>
          Set a Client ID on this profile before adding notes.
        </Text>
      </Box>
    )
  }

  // ── render ───────────────────────────────────────────────────────
  return (
    <>
      {/* Quick-create dialog */}
      {dialogOpen && (
        <Dialog
          header="New note"
          id="create-client-note"
          onClose={() => setDialogOpen(false)}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              {/* Note textarea — native element for reliable autofocus */}
              <textarea
                ref={textareaRef}
                placeholder="Write a note…"
                rows={5}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSave()
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontFamily: 'inherit',
                  fontSize: 14,
                  lineHeight: 1.6,
                  border: '1px solid var(--card-border-color, #ccc)',
                  borderRadius: 3,
                  background: 'var(--card-bg-color, #fff)',
                  color: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />

              {/* Category row */}
              <Flex gap={3} align="center">
                <Label size={1} style={{ minWidth: 72, flexShrink: 0 }}>
                  Category
                </Label>
                <Select
                  value={draftCategory}
                  onChange={(e) =>
                    setDraftCategory((e.target as HTMLSelectElement).value)
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Flex>

              {/* Pinned row */}
              <Flex gap={3} align="center">
                <Label size={1} style={{ minWidth: 72, flexShrink: 0 }}>
                  Pinned
                </Label>
                <input
                  type="checkbox"
                  checked={draftPinned}
                  onChange={(e) => setDraftPinned(e.target.checked)}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
              </Flex>

              {/* Actions */}
              <Flex justify="flex-end" gap={2}>
                <Button
                  text="Cancel"
                  mode="ghost"
                  tone="default"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                />
                <Button
                  text={saving ? 'Saving…' : 'Save note'}
                  tone="primary"
                  disabled={saving || !draftText.trim()}
                  onClick={handleSave}
                />
              </Flex>

              <Text size={0} muted style={{ textAlign: 'right' }}>
                ⌘ + Enter to save
              </Text>
            </Stack>
          </Box>
        </Dialog>
      )}

      {/* Main pane */}
      <Box padding={4}>
        {/* Header row */}
        <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <Text size={1} muted>
            {loading
              ? ''
              : `${notes.length} note${notes.length !== 1 ? 's' : ''}`}
          </Text>
          <Button
            text="New note"
            icon={AddIcon}
            tone="primary"
            mode="ghost"
            onClick={openDialog}
          />
        </Flex>

        {/* Loading */}
        {loading && (
          <Flex justify="center" style={{ padding: 40 }}>
            <Spinner />
          </Flex>
        )}

        {/* Empty state */}
        {!loading && notes.length === 0 && (
          <Card padding={4} tone="transparent" border radius={2}>
            <Text size={1} muted>
              No notes yet. Add the first note for this client.
            </Text>
          </Card>
        )}

        {/* Notes list */}
        {!loading && notes.length > 0 && (
          <Stack space={3}>
            {notes.map((note) => (
              <Card
                key={note._id}
                padding={3}
                border
                radius={2}
                tone={note.pinned ? 'caution' : 'default'}
              >
                {/* Card header */}
                <Flex
                  justify="space-between"
                  align="flex-start"
                  style={{ marginBottom: 10, gap: 8 }}
                >
                  {/* Left: badges */}
                  <Flex style={{ gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Badge
                      tone={CATEGORY_TONE[note.category] ?? 'default'}
                      size={1}
                      mode="outline"
                    >
                      {note.category}
                    </Badge>
                    {note.pinned && (
                      <Badge tone="caution" size={1}>
                        pinned
                      </Badge>
                    )}
                  </Flex>

                  {/* Right: date + actions */}
                  <Flex style={{ gap: 4, alignItems: 'center', flexShrink: 0 }}>
                    <Text size={0} muted>
                      {fmtDate(note.createdAt)}
                    </Text>
                    <Button
                      icon={PinIcon}
                      mode="ghost"
                      tone={note.pinned ? 'caution' : 'default'}
                      padding={2}
                      title={note.pinned ? 'Unpin' : 'Pin to top'}
                      onClick={() => handleTogglePin(note)}
                    />
                    <Button
                      icon={EditIcon}
                      mode="ghost"
                      padding={2}
                      title="Open full note"
                      onClick={() => handleEdit(note)}
                    />
                  </Flex>
                </Flex>

                {/* Note body */}
                <Text size={1} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
                  {note.note || (
                    <em style={{ opacity: 0.45 }}>Empty note — click edit to fill in.</em>
                  )}
                </Text>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </>
  )
}
