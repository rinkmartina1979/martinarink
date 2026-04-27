/**
 * Points of Departure — Seven Questions
 *
 * Each option carries archetype scores (reckoning / threshold / return)
 * and optional secondary signals (serviceIntent, readiness, privacy).
 *
 * The email gate fires after question 3.
 */

import type { AssessmentQuestion } from "./types";

export const QUESTIONS: AssessmentQuestion[] = [
  {
    id: "q1_arrival",
    order: 1,
    question: "What brought you here today?",
    subtext: "There is no wrong answer. This is the beginning of an honest look.",
    options: [
      {
        id: "q1_a",
        label: "I'm not entirely sure. Something felt necessary.",
        scores: { reckoning: 3, threshold: 1, return: 0 },
      },
      {
        id: "q1_b",
        label: "I've been circling this for a while. I want to finally name it.",
        scores: { reckoning: 1, threshold: 3, return: 1 },
      },
      {
        id: "q1_c",
        label: "I've done work before. I'm ready for the next layer.",
        scores: { reckoning: 0, threshold: 1, return: 3 },
      },
      {
        id: "q1_d",
        label: "Someone I trust mentioned this. I'm curious, cautiously.",
        scores: { reckoning: 2, threshold: 1, return: 0 },
      },
    ],
  },
  {
    id: "q2_awareness",
    order: 2,
    question: "How long have you known something needed to change?",
    options: [
      {
        id: "q2_a",
        label: "It arrived recently. I'm still adjusting to the realisation.",
        scores: { reckoning: 3, threshold: 1, return: 0 },
      },
      {
        id: "q2_b",
        label: "Months. It's been building quietly.",
        scores: { reckoning: 1, threshold: 3, return: 1 },
      },
      {
        id: "q2_c",
        label: "Years. I've known for a long time.",
        scores: { reckoning: 0, threshold: 2, return: 3 },
      },
      {
        id: "q2_d",
        label: "It comes and goes. It's not linear for me.",
        scores: { reckoning: 2, threshold: 2, return: 1 },
      },
    ],
  },
  {
    id: "q3_privacy",
    order: 3,
    question: "Who in your life knows about this?",
    subtext:
      "This question shapes the kind of support that will serve you.",
    gateAfter: true,
    options: [
      {
        id: "q3_a",
        label: "No one. This is entirely private.",
        scores: { reckoning: 3, threshold: 1, return: 0, privacy: "high" },
      },
      {
        id: "q3_b",
        label: "One person — someone I trust completely.",
        scores: { reckoning: 2, threshold: 2, return: 0, privacy: "high" },
      },
      {
        id: "q3_c",
        label: "A small circle knows something is shifting.",
        scores: { reckoning: 0, threshold: 3, return: 1, privacy: "standard" },
      },
      {
        id: "q3_d",
        label: "It's relatively open. I don't feel I need to hide it.",
        scores: { reckoning: 0, threshold: 2, return: 2, privacy: "standard" },
      },
    ],
  },
  {
    id: "q4_stakes",
    order: 4,
    question:
      "When you imagine six months from now, having changed nothing — what do you feel?",
    options: [
      {
        id: "q4_a",
        label:
          "A low dread. Not panic — a quiet understanding of what stays the same.",
        scores: { reckoning: 3, threshold: 1, return: 0 },
      },
      {
        id: "q4_b",
        label: "A clear sense of loss for something I haven't had yet.",
        scores: { reckoning: 0, threshold: 3, return: 1 },
      },
      {
        id: "q4_c",
        label:
          "Frustration. I've been here before. I refuse to be here again.",
        scores: { reckoning: 0, threshold: 1, return: 3 },
      },
      {
        id: "q4_d",
        label: "Grief. For time already spent this way.",
        scores: { reckoning: 1, threshold: 2, return: 2 },
      },
    ],
  },
  {
    id: "q5_resistance",
    order: 5,
    question: "What has held you back before?",
    options: [
      {
        id: "q5_a",
        label: "Not being ready to look at it directly.",
        scores: { reckoning: 3, threshold: 1, return: 0 },
      },
      {
        id: "q5_b",
        label: "Fear of what changes if I change.",
        scores: { reckoning: 1, threshold: 3, return: 0 },
      },
      {
        id: "q5_c",
        label: "The wrong support — or no real support at all.",
        scores: { reckoning: 0, threshold: 2, return: 2 },
      },
      {
        id: "q5_d",
        label: "Nothing significant. This is the first time I'm facing it.",
        scores: { reckoning: 2, threshold: 1, return: 0 },
      },
    ],
  },
  {
    id: "q6_landscape",
    order: 6,
    question:
      "Which of these comes closest to describing your current landscape?",
    subtext:
      "Be honest with yourself here. Both are held without judgment.",
    options: [
      {
        id: "q6_a",
        label:
          "Alcohol has become something I rely on more than I'd like. That's what I want to address.",
        scores: {
          reckoning: 2,
          threshold: 1,
          return: 0,
          serviceIntent: "sober-muse",
        },
      },
      {
        id: "q6_b",
        label:
          "I've made changes before, but the pattern finds its way back. I need real structure.",
        scores: {
          reckoning: 0,
          threshold: 2,
          return: 2,
          serviceIntent: "sober-muse",
        },
      },
      {
        id: "q6_c",
        label:
          "That's not the central issue. It's more about how I lead, live, and take up space.",
        scores: {
          reckoning: 1,
          threshold: 2,
          return: 2,
          serviceIntent: "empowerment",
        },
      },
      {
        id: "q6_d",
        label:
          "Both, honestly. The drinking and the woman I've become around it.",
        scores: {
          reckoning: 1,
          threshold: 2,
          return: 1,
          serviceIntent: "both",
        },
      },
    ],
  },
  {
    id: "q7_need",
    order: 7,
    question: "What do you need most right now?",
    options: [
      {
        id: "q7_a",
        label: "To be seen accurately, without judgment.",
        scores: {
          reckoning: 3,
          threshold: 0,
          return: 0,
          readiness: "low",
        },
      },
      {
        id: "q7_b",
        label: "To understand what's possible and what working together looks like.",
        scores: {
          reckoning: 0,
          threshold: 3,
          return: 0,
          readiness: "medium",
        },
      },
      {
        id: "q7_c",
        label:
          "To begin. A clear structure and someone who knows exactly what they're doing.",
        scores: {
          reckoning: 0,
          threshold: 1,
          return: 3,
          readiness: "high",
        },
      },
      {
        id: "q7_d",
        label: "To feel less alone in this.",
        scores: {
          reckoning: 2,
          threshold: 1,
          return: 0,
          readiness: "low",
        },
      },
    ],
  },
];
