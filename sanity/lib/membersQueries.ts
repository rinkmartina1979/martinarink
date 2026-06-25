/**
 * Sanity query helpers for the members area.
 *
 * Security invariant: privateNotes and email are NEVER returned by any query here.
 * All queries are scoped to the minimum fields needed to render the client portal.
 */

import { client } from './client'

const IS_SANITY_CONFIGURED = !!(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'placeholder'
)

/* ─── Types ─────────────────────────────────────────────────── */

export interface MemberClientProfile {
  _id: string
  firstName: string
  archetype: string | null
  programme: string | null
  programmeVariant: string | null
  status: string
  enrolledAt: string
  expectedCompletionAt: string | null
  revokedAt: string | null
  tokenVersion: number | null
  portalStage: string | null
  nextStepTitle: string | null
  nextStepDescription: string | null
  nextStepCtaLabel: string | null
  nextStepHref: string | null
  nextStepDueAt: string | null
  // Billing & entitlement fields — written only by webhooks or Martina in Studio
  stripeCustomerId: string | null
  depositPaidAt: string | null
  manualDepositPaidAt: string | null
  finalFeeDueAt: string | null
  finalFeePaidAt: string | null
  manualFinalFeePaidAt: string | null
  programmeActiveAt: string | null
  programmeCompletedAt: string | null
  accessSuspendedAt: string | null
  adminAccessOverride: boolean | null
}

export interface MemberAudioDrop {
  _id: string
  title: string
  slug: string
  description: string | null
  audioUrl: string | null
  durationSeconds: number | null
  coverImage: { asset: { _ref: string }; alt?: string } | null
  releasedAt: string
}

export interface MemberAudioDropFull extends MemberAudioDrop {
  transcript: string | null
}

export interface MemberMilestone {
  _id: string
  title: string
  achievedAt: string
  note: string | null
}

export interface MemberCaseStudy {
  _id: string
  slug: string
  pseudonym: string
  industry: string
  programme: string
  problemSnapshot: string | null
  workNarrative: unknown[] | null
  outcomeMarker: string | null
  permissionGrantedAt: string
  visibleOnSite: boolean
  order: number
}

/* ─── Queries ───────────────────────────────────────────────── */

export async function getClientByToken(
  clientId: string,
): Promise<MemberClientProfile | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<MemberClientProfile | null>(
      `
      *[_type == "clientProfile" && clientId == $clientId][0] {
        _id,
        firstName,
        archetype,
        programme,
        programmeVariant,
        status,
        enrolledAt,
        expectedCompletionAt,
        revokedAt,
        tokenVersion,
        portalStage,
        nextStepTitle,
        nextStepDescription,
        nextStepCtaLabel,
        nextStepHref,
        nextStepDueAt,
        stripeCustomerId,
        depositPaidAt,
        manualDepositPaidAt,
        finalFeeDueAt,
        finalFeePaidAt,
        manualFinalFeePaidAt,
        programmeActiveAt,
        programmeCompletedAt,
        accessSuspendedAt,
        adminAccessOverride
      }
      `,
      { clientId },
    )
  } catch {
    return null
  }
}

export async function getAudioDropsForClient(
  clientId: string,
  programme: string,
): Promise<MemberAudioDrop[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    // Fetch the Sanity _id for this client so we can check reference arrays
    const profileRef = await client.fetch<{ _id: string } | null>(
      `*[_type == "clientProfile" && clientId == $clientId][0] { _id }`,
      { clientId },
    )
    if (!profileRef) return null

    return await client.fetch<MemberAudioDrop[]>(
      `
      *[
        _type == "audioDrop" &&
        releasedAt <= now() &&
        (
          count(visibleTo) == 0 ||
          $profileId in visibleTo[]._ref
        ) &&
        (programme == $programme || programme == "both")
      ] | order(releasedAt desc) [0...20] {
        _id,
        title,
        "slug": slug.current,
        description,
        audioUrl,
        durationSeconds,
        coverImage { asset, alt },
        releasedAt
      }
      `,
      { profileId: profileRef._id, programme },
    )
  } catch {
    return null
  }
}

export async function getAudioDrop(slug: string): Promise<MemberAudioDropFull | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<MemberAudioDropFull | null>(
      `
      *[_type == "audioDrop" && slug.current == $slug][0] {
        _id,
        title,
        "slug": slug.current,
        description,
        audioUrl,
        durationSeconds,
        coverImage { asset, alt },
        releasedAt,
        transcript
      }
      `,
      { slug },
    )
  } catch {
    return null
  }
}

export async function getMilestonesForClient(
  clientId: string,
): Promise<MemberMilestone[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    const profileRef = await client.fetch<{ _id: string } | null>(
      `*[_type == "clientProfile" && clientId == $clientId][0] { _id }`,
      { clientId },
    )
    if (!profileRef) return null

    return await client.fetch<MemberMilestone[]>(
      `
      *[
        _type == "clientMilestone" &&
        client._ref == $profileId &&
        private == false
      ] | order(achievedAt desc) {
        _id,
        title,
        achievedAt,
        note
      }
      `,
      { profileId: profileRef._id },
    )
  } catch {
    return null
  }
}

/* ─── Journal ───────────────────────────────────────────────── */

export interface JournalEntryContent {
  feeling?: string
  sleepQuality?: string
  gratefulFor?: string
  todayGreatIf?: string
  goalsToday?: string
  highlights?: string
  difficultSituations?: string
  goodForMyself?: string
  didConsume?: boolean
  consumeWhat?: string
  consumeHowMuch?: string
  trigger?: string
  noticedChanges?: string
  tomorrowAffirmations?: string
  goalsTomorrow?: string
}

export interface JournalMonthProgress {
  mornings: number
  evenings: number
}

/**
 * Fetch one client's journal entry for a date + type (for editor prefill).
 * Always scoped by clientId — never returns another client's entry.
 */
export async function getJournalEntry(
  clientId: string,
  date: string,
  type: 'morning' | 'evening',
): Promise<{ visibility: string; content: JournalEntryContent } | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<{ visibility: string; content: JournalEntryContent } | null>(
      `
      *[
        _type == "journalEntry" &&
        clientId == $clientId &&
        entryDate == $date &&
        entryType == $type
      ][0] { visibility, content }
      `,
      { clientId, date, type },
    )
  } catch {
    return null
  }
}

export interface MonthlyReviewContent {
  accomplished?: string
  whatWorked?: string
  improveNext?: string
  towardGoals?: string
  celebrate?: string
}

/** Fetch a client's monthly review for prefill. Scoped by clientId. */
export async function getMonthlyReview(
  clientId: string,
  monthIndex: number,
): Promise<{ visibility: string; content: MonthlyReviewContent } | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<{ visibility: string; content: MonthlyReviewContent } | null>(
      `
      *[
        _type == "monthlyReview" &&
        clientId == $clientId &&
        monthIndex == $monthIndex
      ][0] {
        visibility,
        "content": { accomplished, whatWorked, improveNext, towardGoals, celebrate }
      }
      `,
      { clientId, monthIndex },
    )
  } catch {
    return null
  }
}

/** Count of morning/evening entries for a client (portal progress card). */
export async function getJournalMonthProgress(
  clientId: string,
): Promise<JournalMonthProgress> {
  if (!IS_SANITY_CONFIGURED) return { mornings: 0, evenings: 0 }
  try {
    const res = await client.fetch<JournalMonthProgress>(
      `{
        "mornings": count(*[_type == "journalEntry" && clientId == $clientId && entryType == "morning"]),
        "evenings": count(*[_type == "journalEntry" && clientId == $clientId && entryType == "evening"])
      }`,
      { clientId },
    )
    return res ?? { mornings: 0, evenings: 0 }
  } catch {
    return { mornings: 0, evenings: 0 }
  }
}

/* ─── Foundation Workbook ───────────────────────────────────── */

export interface WorkbookSectionContent {
  becoming?: string
  visionDescription?: string
  whyChange?: string
  goalWhat?: string
  goalWhy?: string
  goalWho?: string
  goalWhen?: string
  goalWhere?: string
  fearList?: string
  prosChange?: string
  consChange?: string
  voidToFill?: string
  letterPast?: string
  letterFuture?: string
  letterFamily?: string
  contractText?: string
  contractLocation?: string
  contractSignature?: string
  affirmations?: string
  dailyMindset?: string
  newLifeMeaning?: string
  freeJournaling?: string
  notes?: string
}

export interface WorkbookSectionRecord {
  visibility: string
  content: WorkbookSectionContent
  signedAt: string | null
}

/**
 * Fetch one client's workbook section for editor prefill. Scoped by clientId —
 * never returns another client's section.
 */
export async function getWorkbookSection(
  clientId: string,
  sectionKey: string,
): Promise<WorkbookSectionRecord | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<WorkbookSectionRecord | null>(
      `
      *[
        _type == "workbookSection" &&
        clientId == $clientId &&
        sectionKey == $sectionKey
      ][0] { visibility, content, signedAt }
      `,
      { clientId, sectionKey },
    )
  } catch {
    return null
  }
}

/**
 * Section keys this client has started (a doc exists). Length = progress count;
 * the array drives completion ticks on the workbook hub.
 */
export async function getWorkbookProgress(
  clientId: string,
): Promise<{ startedKeys: string[] }> {
  if (!IS_SANITY_CONFIGURED) return { startedKeys: [] }
  try {
    const keys = await client.fetch<string[]>(
      `*[_type == "workbookSection" && clientId == $clientId].sectionKey`,
      { clientId },
    )
    return { startedKeys: keys ?? [] }
  } catch {
    return { startedKeys: [] }
  }
}

/**
 * Sections a client has chosen to share (shared / needs-support) — for Martina.
 * Private sections are never returned. Scoped by clientId.
 */
export async function getSharedWorkbookForClient(
  clientId: string,
): Promise<(WorkbookSectionRecord & { sectionKey: string })[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<(WorkbookSectionRecord & { sectionKey: string })[]>(
      `
      *[
        _type == "workbookSection" &&
        clientId == $clientId &&
        visibility != "private"
      ] | order(sectionKey asc) { sectionKey, visibility, content, signedAt }
      `,
      { clientId },
    )
  } catch {
    return null
  }
}

/* ─── P2: Care Team + Programme + Resources ─────────────────── */

export interface CareTeamMember {
  _id: string
  name: string
  role: string
  bio: string
  photo: { asset: { _ref: string }; alt?: string } | null
  availability: string | null
  sortOrder: number
}

export interface ProgrammeDefinition {
  _id: string
  name: string
  programmeId: string
  tagline: string | null
  durationDisplay: string | null
  includedItems: string[] | null
}

export interface ProgrammeResource {
  _id: string
  title: string
  description: string | null
  type: 'document' | 'workbook' | 'link' | 'video'
  assetUrl: string | null
  externalUrl: string | null
  programme: string
  publishedAt: string
}

export async function getCareTeamForProgramme(
  programme: string,
): Promise<CareTeamMember[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<CareTeamMember[]>(
      `
      *[
        _type == "careTeamMember" &&
        (programme == $programme || programme == "both")
      ] | order(sortOrder asc) {
        _id,
        name,
        role,
        bio,
        photo { asset, alt },
        availability,
        sortOrder
      }
      `,
      { programme },
    )
  } catch {
    return null
  }
}

export async function getProgrammeDefinition(
  programmeId: string,
): Promise<ProgrammeDefinition | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<ProgrammeDefinition | null>(
      `
      *[_type == "programme" && programmeId == $programmeId][0] {
        _id,
        name,
        programmeId,
        tagline,
        durationDisplay,
        includedItems
      }
      `,
      { programmeId },
    )
  } catch {
    return null
  }
}

export async function getProgrammeResources(
  programme: string,
  portalStage: string,
  clientSanityId: string,
): Promise<ProgrammeResource[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<ProgrammeResource[]>(
      `
      *[
        _type == "programmeResource" &&
        publishedAt <= now() &&
        (programme == $programme || programme == "both") &&
        (count(gatedByStage) == 0 || $portalStage in gatedByStage) &&
        (count(visibleTo) == 0 || $clientSanityId in visibleTo[]._ref)
      ] | order(publishedAt desc) {
        _id,
        title,
        description,
        type,
        "assetUrl": asset.asset->url,
        externalUrl,
        programme,
        publishedAt
      }
      `,
      { programme, portalStage, clientSanityId },
    )
  } catch {
    return null
  }
}

/* ─── W3: Clinical Education (Learn) ────────────────────────── */

export interface LearnArticle {
  _id: string
  title: string
  titleDe: string | null
  slug: string
  category: string
  bodyEn: string
  bodyDe: string | null
  attribution: string | null
  programme: string
  sortOrder: number
}

/**
 * Fetch learn articles visible to a client's programme.
 * programme = "sober-muse" | "empowerment"
 * Returns articles where programme matches or programme == "both".
 */
export async function getLearnArticles(
  programme: string,
): Promise<LearnArticle[]> {
  if (!IS_SANITY_CONFIGURED) return []
  try {
    return await client.fetch<LearnArticle[]>(
      `
      *[
        _type == "learnArticle" &&
        (programme == $programme || programme == "both")
      ] | order(sortOrder asc) {
        _id,
        title,
        titleDe,
        "slug": slug.current,
        category,
        bodyEn,
        bodyDe,
        attribution,
        programme,
        sortOrder
      }
      `,
      { programme },
    )
  } catch {
    return []
  }
}

export async function getVisibleCaseStudies(): Promise<MemberCaseStudy[] | null> {
  if (!IS_SANITY_CONFIGURED) return null
  try {
    return await client.fetch<MemberCaseStudy[]>(
      `
      *[_type == "caseStudy" && visibleOnSite == true] | order(order asc) {
        _id,
        "slug": slug.current,
        pseudonym,
        industry,
        programme,
        problemSnapshot,
        workNarrative,
        outcomeMarker,
        permissionGrantedAt,
        visibleOnSite,
        order
      }
      `,
    )
  } catch {
    return null
  }
}
