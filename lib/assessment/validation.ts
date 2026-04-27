/**
 * Points of Departure — Zod Validation Schemas
 */

import { z } from "zod";
import { QUESTIONS } from "./questions";

const QUESTION_IDS = QUESTIONS.map((q) => q.id);

export const answerMapSchema = z
  .record(z.string(), z.number().int().min(0).max(3))
  .refine(
    (answers) => {
      // All 7 questions must be answered
      return QUESTION_IDS.every((id) => answers[id] !== undefined);
    },
    { message: "All questions must be answered before submitting." }
  );

export const assessmentSubmissionSchema = z.object({
  answers: answerMapSchema,
  email: z.string().email("Please enter a valid email address."),
  firstName: z.string().max(80).optional(),
});

export type ValidatedSubmission = z.infer<typeof assessmentSubmissionSchema>;
