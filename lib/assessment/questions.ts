/**
 * Points of Departure — Ten Questions
 *
 * Questions 1–3 (isIntro: true) are "Before we begin" warm-up screens.
 * Questions 4–10 are the scored assessment.
 *
 * Each option carries one archetypeKey (A / B / C / D).
 * A → The Emotionally Exhausted Self
 * B → The Self-Doubting Achiever
 * C → The Self-Abandoning People Pleaser
 * D → The Emerging Empowered Woman
 *
 * The email gate fires after question at index 5 (main Q3).
 */

import type { AssessmentQuestion } from "./types";

export const QUESTIONS: AssessmentQuestion[] = [
  // ─── BEFORE WE BEGIN (isIntro: true) ───────────────────────────

  {
    id: "pre_1_interest",
    order: 1,
    isIntro: true,
    question: "What made you interested in this assessment today?",
    options: [
      {
        id: "pre1_a",
        label: "I am feeling emotionally stuck and overwhelmed",
        scores: { archetypeKey: "A" },
      },
      {
        id: "pre1_b",
        label: "I want to reconnect with my confidence and sense of self",
        scores: { archetypeKey: "B" },
      },
      {
        id: "pre1_c",
        label: "I am going through a significant life change",
        scores: { archetypeKey: "C" },
      },
      {
        id: "pre1_d",
        label: "I am ready for deeper self-awareness and personal growth",
        scores: { archetypeKey: "D" },
      },
    ],
  },

  {
    id: "pre_2_season",
    order: 2,
    isIntro: true,
    question: "How would you describe your current life season?",
    options: [
      {
        id: "pre2_a",
        label: "Healing — I am recovering from something difficult",
        scores: { archetypeKey: "A" },
      },
      {
        id: "pre2_b",
        label: "Transitioning — things are shifting but the path is not yet clear",
        scores: { archetypeKey: "B" },
      },
      {
        id: "pre2_c",
        label: "Growing, but struggling — I can see where I want to be, and I am not there yet",
        scores: { archetypeKey: "C" },
      },
      {
        id: "pre2_d",
        label: "Expanding — I am ready to step into more",
        scores: { archetypeKey: "D" },
      },
    ],
  },

  {
    id: "pre_3_seeking",
    order: 3,
    isIntro: true,
    question: "What are you currently seeking most for yourself?",
    options: [
      {
        id: "pre3_a",
        label: "Emotional support and a safe space to process",
        scores: { archetypeKey: "A" },
      },
      {
        id: "pre3_b",
        label: "Confidence and a stronger sense of who I am",
        scores: { archetypeKey: "B" },
      },
      {
        id: "pre3_c",
        label: "Clarity about what I want and why I keep holding back",
        scores: { archetypeKey: "C" },
      },
      {
        id: "pre3_d",
        label: "Alignment between who I am and how I live",
        scores: { archetypeKey: "D" },
      },
    ],
  },

  // ─── SCORED ASSESSMENT (main questions) ────────────────────────

  {
    id: "q1_overwhelm",
    order: 4,
    question: "When life becomes emotionally overwhelming, you usually…",
    options: [
      {
        id: "q1_a",
        label: "Withdraw and isolate — you need to be alone to manage it",
        scores: { archetypeKey: "A" },
      },
      {
        id: "q1_b",
        label: "Push through and ignore your emotions — you will deal with it later",
        scores: { archetypeKey: "B" },
      },
      {
        id: "q1_c",
        label: "Reach out for reassurance and seek validation from others",
        scores: { archetypeKey: "C" },
      },
      {
        id: "q1_d",
        label: "Sit with it consciously and process what you are feeling",
        scores: { archetypeKey: "D" },
      },
    ],
  },

  {
    id: "q2_relationships",
    order: 5,
    question: "In your relationships and work, you often…",
    options: [
      {
        id: "q2_a",
        label: "Struggle to express your needs or ask for what you deserve",
        scores: { archetypeKey: "A" },
      },
      {
        id: "q2_b",
        label: "Fear disappointing others, even at your own expense",
        scores: { archetypeKey: "B" },
      },
      {
        id: "q2_c",
        label: "Feel responsible for how others feel around you",
        scores: { archetypeKey: "C" },
      },
      {
        id: "q2_d",
        label: "Maintain clear boundaries and communicate honestly",
        scores: { archetypeKey: "D" },
      },
    ],
  },

  {
    id: "q3_connection",
    order: 6,
    gateAfter: true,
    question: "How connected do you feel to yourself right now?",
    subtext: "Your result is written for where you actually are — not where you think you should be.",
    options: [
      {
        id: "q3_a",
        label: "Completely disconnected — I have lost touch with who I am",
        scores: { archetypeKey: "A" },
      },
      {
        id: "q3_b",
        label: "I know myself, but I rarely live as the truest version of myself",
        scores: { archetypeKey: "B" },
      },
      {
        id: "q3_c",
        label: "I am still figuring out who I am outside of my roles and relationships",
        scores: { archetypeKey: "C" },
      },
      {
        id: "q3_d",
        label: "Deeply connected — I know what I value and I live by it",
        scores: { archetypeKey: "D" },
      },
    ],
  },

  {
    id: "q4_blocks",
    order: 7,
    question: "What stops you most from going after what you truly want?",
    options: [
      {
        id: "q4_a",
        label: "Fear of failure and not being good enough",
        scores: { archetypeKey: "A" },
      },
      {
        id: "q4_b",
        label: "Self-doubt — a quiet voice that questions everything",
        scores: { archetypeKey: "B" },
      },
      {
        id: "q4_c",
        label: "Fear of judgment or not being accepted as you truly are",
        scores: { archetypeKey: "C" },
      },
      {
        id: "q4_d",
        label: "Very little — you take imperfect action and trust yourself",
        scores: { archetypeKey: "D" },
      },
    ],
  },

  {
    id: "q5_inner_voice",
    order: 8,
    question: "When you observe your inner dialogue, it mostly…",
    options: [
      {
        id: "q5_a",
        label: "Tears you down — you are extremely hard on yourself",
        scores: { archetypeKey: "A" },
      },
      {
        id: "q5_b",
        label: "Questions whether you are enough — smart, successful, or worthy enough",
        scores: { archetypeKey: "B" },
      },
      {
        id: "q5_c",
        label: "Depends on what others think of you to feel okay about yourself",
        scores: { archetypeKey: "C" },
      },
      {
        id: "q5_d",
        label: "Speaks with compassion — you encourage yourself as you would a close friend",
        scores: { archetypeKey: "D" },
      },
    ],
  },

  {
    id: "q6_highest_self",
    order: 9,
    question: "When you imagine your highest self, what feels hardest?",
    options: [
      {
        id: "q6_a",
        label: "Believing you truly deserve that version of your life",
        scores: { archetypeKey: "A" },
      },
      {
        id: "q6_b",
        label: "Letting go of the patterns and beliefs that keep you small",
        scores: { archetypeKey: "B" },
      },
      {
        id: "q6_c",
        label: "Being fully seen and known without losing love or belonging",
        scores: { archetypeKey: "C" },
      },
      {
        id: "q6_d",
        label: "Consistently embodying it — becoming her, not just knowing her",
        scores: { archetypeKey: "D" },
      },
    ],
  },

  {
    id: "q7_desire",
    order: 10,
    question: "What do you desire most right now?",
    options: [
      {
        id: "q7_a",
        label: "Deep inner peace and lasting emotional freedom",
        scores: { archetypeKey: "A" },
      },
      {
        id: "q7_b",
        label: "Unshakeable confidence and a real sense of self-worth",
        scores: { archetypeKey: "B" },
      },
      {
        id: "q7_c",
        label: "Clarity about my purpose and freedom from what others think",
        scores: { archetypeKey: "C" },
      },
      {
        id: "q7_d",
        label: "Expansion — stepping into leadership, visibility, and my full potential",
        scores: { archetypeKey: "D" },
      },
    ],
  },
];

/** The three "Before We Begin" questions shown before the scored assessment */
export const INTRO_QUESTIONS = QUESTIONS.filter((q) => q.isIntro);

/** The seven scored questions */
export const MAIN_QUESTIONS = QUESTIONS.filter((q) => !q.isIntro);
