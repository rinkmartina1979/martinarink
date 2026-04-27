/**
 * Points of Departure — Hardcoded Archetype Result Copy
 *
 * Used as fallback when Sanity is unavailable.
 * Sanity-editable versions live in the assessmentResult schema.
 *
 * Voice: first-person, observational, precise, warm, unhurried.
 * No banned words. No exclamation marks.
 */

import type { ArchetypeResult } from "./types";

export const ARCHETYPE_RESULTS: Record<string, ArchetypeResult> = {
  reckoning: {
    archetype: "reckoning",
    name: "The Quiet Reckoning",
    tagline: "You are at the very beginning of something true.",
    opening:
      "Something shifted before you had the words for it. That is what brought you here — not certainty, but the quiet insistence of a feeling you can no longer ignore.",
    bodyParagraphs: [
      "You are not yet ready to leap. That is not a flaw. It is the accurate reading of where you are. There is intelligence in your hesitation — not cowardice. The women who do this work most deeply are often the ones who came quietly.",
      "What I've noticed, over many years of this work: the women who call themselves \"not ready\" are frequently the ones who have already begun. The looking is the beginning. And you are already looking.",
      "What you need right now is not a programme. It is a witness. Someone who can hold what you're seeing without asking you to resolve it before you've understood it. That is what the private letters are for.",
    ],
    closing:
      "When you are ready for a conversation — and you will know when you are — I am here.",
    ctaLabel: "Receive the private letters",
    ctaHref: "/newsletter",
    secondaryCta: {
      label: "Read the writing first",
      href: "/writing",
    },
  },

  threshold: {
    archetype: "threshold",
    name: "The Threshold",
    tagline: "You can see the other side. You haven't crossed yet.",
    opening:
      "You have been standing at this edge long enough to know exactly what it costs to stay. You've named it. You've sat with it. And still, here you are — which means the fear is real, and so is the readiness.",
    bodyParagraphs: [
      "The threshold is a specific kind of liminal space. You're not uncertain about what needs to change. You're uncertain about what changes when you change. That's a different question — and it deserves a different kind of support.",
      "I work with women at exactly this point. Not to push them across, but to make the crossing feel less like a loss. Because the fear underneath isn't of the work — it's of becoming someone your current life wasn't built for.",
      "You are ready to understand what's possible. The programme gives you that — a structure, a companion, and a clear pathway from where you are to where you already know you want to be.",
    ],
    closing:
      "I'd like to tell you more about what we'd do together. Come read about the programme.",
    ctaLabel: "Read about the programme",
    ctaHref: "/sober-muse",
    secondaryCta: {
      label: "Or request a private consultation first",
      href: "/book",
    },
  },

  return: {
    archetype: "return",
    name: "The Return",
    tagline: "You've been here before. This time, you mean it.",
    opening:
      "You are not new to this. You have circled back — maybe more than once — and what has changed is not the situation, but you. The quality of your wanting is different now. More precise. Less apologetic.",
    bodyParagraphs: [
      "The women who are The Return are, in my experience, the most ready — and also the most likely to underestimate themselves. Because they've tried before and not arrived where they intended, they carry a private doubt. Let me name it plainly: that doubt is not evidence of failure. It is evidence of how seriously you take this.",
      "You don't need more information. You don't need more time to consider. What you need is the right structure, with someone who knows what they're doing and will not let you disappear into the work.",
      "The next step is a conversation. A private consultation — €450, credited to the programme if you proceed. In that hour, I will tell you exactly what I see, and we will decide together whether this is the right fit.",
    ],
    closing:
      "You've waited long enough. Begin the application, or request a consultation.",
    ctaLabel: "Begin the application",
    ctaHref: "/apply/sober-muse",
    secondaryCta: {
      label: "Request a private consultation first",
      href: "/book",
    },
  },
};
