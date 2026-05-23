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
  exhausted: {
    archetype: "exhausted",
    name: "The Emotionally Exhausted Self",
    tagline: "You have been carrying more than you were meant to carry alone.",
    opening:
      "There is a particular kind of tired that has nothing to do with sleep. It is the tiredness of holding yourself together through things that were never yours to manage alone. That is where you are.",
    bodyParagraphs: [
      "What I notice in women who arrive here from this place: they are often the most perceptive, the most attuned to others — and the least attended to themselves. You have learned to read the room so precisely that you forgot to read yourself.",
      "The emotional weight you carry is real. Not a character flaw. Not a weakness. Evidence of how hard you have been working to hold a life together without the right support.",
      "What you need right now is not a programme. It is a quieter entry point — letters, writing, a space to be witnessed without immediately having to decide anything. That is what my private correspondence is for.",
    ],
    closing:
      "When the time comes to do something more — and it will — you will know. I am here for that moment too.",
    ctaLabel: "Receive the private letters",
    ctaHref: "/newsletter",
    secondaryCta: {
      label: "Read the writing first",
      href: "/writing",
    },
  },

  doubting: {
    archetype: "doubting",
    name: "The Self-Doubting Achiever",
    tagline: "You have built something real. And yet the voice that questions it has never gone quiet.",
    opening:
      "You are capable — more capable than you let yourself believe on most days. The doubt you carry is not about ability. It has never been about ability. It is about whether you are allowed to trust what you know.",
    bodyParagraphs: [
      "From the outside, your life looks like evidence of success. And it is. But there is a gap — between what you have built and how you feel inside it — that you have been trying to close alone.",
      "Self-doubt at this level is not fixed by more achievement. More credentials. More proof. It is a pattern that lives underneath your accomplishments, unmoved by them.",
      "I work with women exactly here. Not to fix what is broken — because nothing is broken — but to close the distance between who you are and who you experience yourself as.",
    ],
    closing:
      "A private consultation is where this usually begins. An hour for me to see you clearly, and for you to understand what working together would actually look like.",
    ctaLabel: "Begin with a private consultation",
    ctaHref: "/book",
    secondaryCta: {
      label: "Learn about the work",
      href: "/work-with-me",
    },
  },

  pleasing: {
    archetype: "pleasing",
    name: "The Self-Abandoning People Pleaser",
    tagline: "You have spent a long time making yourself smaller so others could feel comfortable.",
    opening:
      "You know what you want. You have known for a while. What stops you is not confusion — it is the weight of other people's needs, other people's comfort, the fear of what is lost when you finally choose yourself.",
    bodyParagraphs: [
      "Self-abandonment is quiet. It does not look like crisis from the outside. It looks like kindness, like flexibility, like someone who has it together. But you feel the cost of it.",
      "The work here is not about becoming someone who stops caring for others. It is about reclaiming the part of you that existed before you learned that your worth depended on being needed.",
      "Women in this place often find that a private consultation is the clearest next step — a space where nothing is required of you except honesty. Where someone else holds the container for once.",
    ],
    closing:
      "I would like to speak with you. Not to tell you what to do, but to reflect back what I see — which is often quite different from what you believe about yourself.",
    ctaLabel: "Begin with a private consultation",
    ctaHref: "/book",
    secondaryCta: {
      label: "Explore the work",
      href: "/work-with-me",
    },
  },

  empowered: {
    archetype: "empowered",
    name: "The Emerging Empowered Woman",
    tagline: "You know who you are. Now the question is how fully you let yourself live it.",
    opening:
      "You are not someone who needs convincing. You have already done the interior work to arrive at clarity about what you value and how you want to show up. What remains is embodiment — consistently living from that place.",
    bodyParagraphs: [
      "The gap between knowing and being is one of the most underestimated challenges of real personal development. You are not lacking insight. You are ready for the structure and support that make change irreversible.",
      "Women at this stage often find that the biggest shifts happen not in understanding, but in the accountability — someone who holds the bar at the level you have set for yourself, week after week.",
      "The next step for you is direct. An application — to see whether we are the right fit, and whether the timing is right to begin.",
    ],
    closing:
      "I hold limited space. If you are ready, I would like to hear from you.",
    ctaLabel: "Apply for the programme",
    ctaHref: "/apply/empowerment",
    secondaryCta: {
      label: "Read the programme page",
      href: "/empowerment",
    },
  },
};
