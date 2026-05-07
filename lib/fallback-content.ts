/**
 * Fallback content used when Sanity is empty or env vars are missing.
 *
 * Brand voice: First-person observational. Max 3 sentences per paragraph.
 * No banned words. No exclamation marks. Names anonymised, NDA-safe.
 *
 * Types here mirror the public-facing fields of `MemberCaseStudy`,
 * `MemberAudioDrop`, and `MemberMilestone` from `sanity/lib/membersQueries.ts`.
 */

import type {
  MemberCaseStudy,
  MemberAudioDrop,
  MemberMilestone,
} from "@/sanity/lib/membersQueries";

/* ─── Portable Text helpers ──────────────────────────────────── */

interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks?: string[];
}

interface PortableTextBlock {
  _type: "block";
  _key: string;
  style: "normal";
  children: PortableTextSpan[];
  markDefs?: unknown[];
}

function block(key: string, text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}s`, text }],
  };
}

/* ─── Case studies ───────────────────────────────────────────── */

export const FALLBACK_CASE_STUDIES: MemberCaseStudy[] = [
  {
    _id: "fallback-case-adriana",
    slug: "adriana",
    pseudonym: "Adriana",
    industry: "Founder, fashion house — Barcelona",
    programme: "sober-muse",
    problemSnapshot:
      "Forty-one. The work was beautiful. The wine was constant. She knew she was not the woman she meant to be by seven in the evening, and she did not know how to begin the sentence that would change it.",
    workNarrative: [
      block(
        "a1",
        "She came to me in the second autumn of a quiet question. Her label was on its third capsule. The press was generous, the team was loyal, and her glass was rarely empty after five.",
      ),
      block(
        "a2",
        "We did not begin with the drinking. We began with what she was being asked to perform — at fittings, at dinners, at the end of a long Tuesday — and what it cost her to stay charming through it. The drinking, when we returned to it, was almost incidental.",
      ),
      block(
        "a3",
        "Ninety days is not a long time. It is, in my experience, long enough to find the woman who lives behind the role. She was already there. She had been waiting.",
      ),
      block(
        "a4",
        "What I noticed in her, and what I told her, was a kind of sober precision she had been calling shyness. It was not shyness. It was taste, asking to be listened to.",
      ),
    ],
    outcomeMarker:
      "She ran her spring show without a glass in her hand and described it, afterwards, as the first one she remembered.",
    permissionGrantedAt: "2025-11-01T00:00:00Z",
    visibleOnSite: true,
    order: 1,
  },
  {
    _id: "fallback-case-helena",
    slug: "helena",
    pseudonym: "Helena",
    industry: "Senior partner, international law firm — Frankfurt",
    programme: "empowerment",
    problemSnapshot:
      "Fifty-two. Made partner at thirty-six. The kind of woman who is described, in profiles, as formidable. She had built a life she could no longer feel inside.",
    workNarrative: [
      block(
        "h1",
        "She arrived in March, by referral, with a clear and specific request. She wanted to be told the truth about what she was doing. She had stopped trusting the people closest to her to do it.",
      ),
      block(
        "h2",
        "We worked through her calendar first. Not as a productivity exercise — as an inventory of where her attention had been spent and what it had been spent on. The pattern that surfaced was not what she expected.",
      ),
      block(
        "h3",
        "She had been mistaking exhaustion for seniority and silence for composure. Once we named that, the second half of the work became possible. She made a series of decisions over the following months that were, by her own account, overdue by a decade.",
      ),
      block(
        "h4",
        "Her practice did not shrink. Her week did. The two are not the same thing, and she had been treating them as if they were.",
      ),
    ],
    outcomeMarker:
      "She redrew her role at the firm and took the first uninterrupted month off in seventeen years.",
    permissionGrantedAt: "2025-11-01T00:00:00Z",
    visibleOnSite: true,
    order: 2,
  },
  {
    _id: "fallback-case-margaux",
    slug: "margaux",
    pseudonym: "Margaux",
    industry: "C-suite, international media group — London",
    programme: "empowerment",
    problemSnapshot:
      "Thirty-eight. Promoted twice in three years into a role she had asked for and could not, in private, admit she wanted. The competence was real. The fit was not.",
    workNarrative: [
      block(
        "m1",
        "Margaux came in October on the suggestion of a former client. Her brief, in the first session, was crisp. She wanted help thinking, in private, about something she had not allowed herself to think about in public.",
      ),
      block(
        "m2",
        "The shape of the work was patient. We met fortnightly for eight months. Between sessions she wrote, often at length, and I read carefully and asked one or two questions in return.",
      ),
      block(
        "m3",
        "What we were doing, though neither of us would have said so at the start, was helping her notice the difference between ambition that belonged to her and ambition that had been handed to her. The distinction was not theoretical. It changed where she chose to spend the next decade.",
      ),
      block(
        "m4",
        "She left the role she had been promoted into. She did not leave the industry. She is, by every measure she now cares about, more senior than she was.",
      ),
    ],
    outcomeMarker:
      "She negotiated a structurally different mandate and is now, by her own definition, in the right room.",
    permissionGrantedAt: "2025-11-01T00:00:00Z",
    visibleOnSite: true,
    order: 3,
  },
];

/* ─── Audio drops (members portal demo) ──────────────────────── */

export const FALLBACK_AUDIO_DROPS: MemberAudioDrop[] = [
  {
    _id: "fallback-drop-the-quiet-room",
    title: "The quiet room",
    slug: "the-quiet-room",
    description:
      "On the difference between being alone and being unobserved, and why the second is the harder thing to find.",
    audioUrl: "/audio/the-quiet-room.mp3",
    durationSeconds: 624,
    coverImage: null,
    releasedAt: "2025-12-01T08:00:00Z",
  },
  {
    _id: "fallback-drop-after-the-yes",
    title: "After the yes",
    slug: "after-the-yes",
    description:
      "What to listen for in the first ten minutes of a meeting you did not, in your bones, want to take.",
    audioUrl: "/audio/after-the-yes.mp3",
    durationSeconds: 538,
    coverImage: null,
    releasedAt: "2026-01-15T08:00:00Z",
  },
];

/* ─── Milestones (members portal demo) ───────────────────────── */

export const FALLBACK_MILESTONES: MemberMilestone[] = [
  {
    _id: "fallback-milestone-1",
    title: "First sober dinner with the board",
    achievedAt: "2025-11-12T20:00:00Z",
    note: "She described the evening as quieter and longer, and said she remembered the conversations.",
  },
  {
    _id: "fallback-milestone-2",
    title: "Declined the speaking slot she had been dreading",
    achievedAt: "2026-01-08T10:00:00Z",
    note: "A small thing in the world, and a precise thing for her. We marked it.",
  },
  {
    _id: "fallback-milestone-3",
    title: "Renegotiated the scope of the new role",
    achievedAt: "2026-02-22T09:00:00Z",
    note: null,
  },
];
