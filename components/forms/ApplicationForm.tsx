"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ── Shared schema ─────────────────────────────────────────────

const baseSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name."),
  email: z.string().email("Please enter a valid email address."),
  q1: z.string().min(20, "Please tell us a little more — at least a sentence."),
  q2: z.string().min(20, "Please tell us a little more — at least a sentence."),
  q3: z.string().min(1, "Please make a selection."),
  q4: z.string().min(10, "Please share a little more."),
  // Budget readiness — qualifies fit before the call. Honest filter, not gatekeeping.
  q5: z.string().min(1, "Please make a selection."),
  consent: z.literal(true, {
    error: "Please confirm you have read the privacy note.",
  }),
});

type BaseFormValues = z.infer<typeof baseSchema>;

interface FormField {
  id: keyof BaseFormValues;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "checkbox";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

// ── Shared form shell ─────────────────────────────────────────

function ApplicationFormShell({
  fields,
  submitLabel = "Submit application",
  programme,
}: {
  fields: FormField[];
  submitLabel?: string;
  programme: "sober-muse" | "empowerment";
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BaseFormValues>({
    resolver: zodResolver(baseSchema),
  });

  const onSubmit = async (data: BaseFormValues) => {
    setServerError("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, programme }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Something went wrong. Please try again.");
      }
      // Redirect to the dedicated application thank-you page —
      // gives applicants weight-appropriate acknowledgement, sets 48hr
      // expectation, and bridges the silent wait with reading material.
      router.push("/thank-you/application");
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {fields.map((field) => (
        <div key={field.id}>
          <label
            htmlFor={`field-${field.id}`}
            className="block text-[12px] tracking-[0.18em] uppercase text-ink-quiet mb-2"
          >
            {field.label}
            {field.required !== false && (
              <span className="text-plum ml-1">*</span>
            )}
          </label>

          {field.type === "textarea" && (
            <textarea
              id={`field-${field.id}`}
              rows={5}
              placeholder={field.placeholder}
              className={[
                "w-full px-4 py-3 bg-cream border text-ink placeholder-ink-quiet/50 text-[15px] leading-[1.7] focus:outline-none rounded-[1px] transition-colors resize-y",
                errors[field.id]
                  ? "border-plum"
                  : "border-sand focus:border-ink-soft",
              ].join(" ")}
              {...register(field.id)}
            />
          )}

          {field.type === "text" && (
            <input
              id={`field-${field.id}`}
              type="text"
              placeholder={field.placeholder}
              className={[
                "w-full px-4 py-3 bg-cream border text-ink placeholder-ink-quiet/50 text-[15px] focus:outline-none rounded-[1px] transition-colors",
                errors[field.id]
                  ? "border-plum"
                  : "border-sand focus:border-ink-soft",
              ].join(" ")}
              {...register(field.id)}
            />
          )}

          {field.type === "email" && (
            <input
              id={`field-${field.id}`}
              type="email"
              autoComplete="email"
              placeholder={field.placeholder}
              className={[
                "w-full px-4 py-3 bg-cream border text-ink placeholder-ink-quiet/50 text-[15px] focus:outline-none rounded-[1px] transition-colors",
                errors[field.id]
                  ? "border-plum"
                  : "border-sand focus:border-ink-soft",
              ].join(" ")}
              {...register(field.id)}
            />
          )}

          {field.type === "select" && field.options && (
            <select
              id={`field-${field.id}`}
              className={[
                "w-full px-4 py-3 bg-cream border text-ink text-[15px] focus:outline-none rounded-[1px] transition-colors",
                errors[field.id]
                  ? "border-plum"
                  : "border-sand focus:border-ink-soft",
              ].join(" ")}
              {...register(field.id)}
            >
              <option value="">Select one…</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {field.type === "checkbox" && (
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id={`field-${field.id}`}
                type="checkbox"
                className="mt-1 w-4 h-4 accent-plum"
                {...register(field.id)}
              />
              <span className="text-[13px] leading-[1.6] text-ink-soft">
                I have read the privacy note above and consent to Martina Rink
                storing my application for the purpose of this process.
              </span>
            </label>
          )}

          {errors[field.id] && (
            <p
              role="alert"
              aria-live="polite"
              className="mt-2 text-[13px] text-plum"
            >
              {errors[field.id]?.message as string}
            </p>
          )}
        </div>
      ))}

      {serverError && (
        <p role="alert" aria-live="polite" className="text-[14px] text-plum">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center bg-plum text-cream uppercase tracking-[0.18em] text-[12px] font-medium px-12 py-4 rounded-[1px] hover:bg-plum-deep transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

// ── Sober Muse specific fields ────────────────────────────────

const SOBER_MUSE_FIELDS: FormField[] = [
  { id: "firstName", label: "First name", type: "text", placeholder: "Your first name" },
  { id: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
  {
    id: "q1",
    label: "What brought you to this programme?",
    type: "textarea",
    placeholder:
      "Tell me what's been happening — as honestly as you can. There is no wrong answer.",
  },
  {
    id: "q2",
    label: "What have you tried before, and what happened?",
    type: "textarea",
    placeholder:
      "I'm not looking for a clean record. I want to understand what you've already been through.",
  },
  {
    id: "q3",
    label: "Where are you right now with alcohol?",
    type: "select",
    options: [
      "I'm drinking more than I want to and I want to stop",
      "I've reduced but keep going back to it",
      "I've stopped but I need support to stay stopped",
      "It's complicated — I'd rather explain in our conversation",
    ],
  },
  {
    id: "q4",
    label: "What does the next chapter of your life look like — if this works?",
    type: "textarea",
    placeholder:
      "Not in outcomes or metrics. What does it feel like to be her?",
  },
  {
    id: "q5",
    label: "Investment readiness",
    type: "select",
    options: [
      "Yes — I'm ready to invest €5,000–€7,500 in the next 60 days",
      "Yes, with a payment plan",
      "Not at this time — I'd like to begin with the newsletter",
    ],
  },
  {
    id: "consent",
    label: "",
    type: "checkbox",
  },
];

// ── Empowerment specific fields ───────────────────────────────

const EMPOWERMENT_FIELDS: FormField[] = [
  { id: "firstName", label: "First name", type: "text", placeholder: "Your first name" },
  { id: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
  {
    id: "q1",
    label: "What is the gap you are trying to close?",
    type: "textarea",
    placeholder:
      "Between where you are and where you want to be — in your leadership, your life, or both.",
  },
  {
    id: "q2",
    label: "What have you already tried — and where did it fall short?",
    type: "textarea",
    placeholder:
      "Coaching, therapy, courses, corporate development. What did and didn't work, and why.",
  },
  {
    id: "q3",
    label: "What is your current role or context?",
    type: "select",
    options: [
      "Senior executive / C-suite",
      "Business owner / founder",
      "Partner or director level",
      "In transition between roles",
      "Other — I'll explain",
    ],
  },
  {
    id: "q4",
    label: "What does success look like for you — 12 months from now?",
    type: "textarea",
    placeholder: "Not the LinkedIn version. The honest version.",
  },
  {
    id: "q5",
    label: "Investment readiness",
    type: "select",
    options: [
      "Yes — I'm ready to invest €7,500–€15,000 in the next 60 days",
      "Yes, with a payment plan",
      "Not at this time — I'd like to begin with the newsletter",
    ],
  },
  {
    id: "consent",
    label: "",
    type: "checkbox",
  },
];

// ── Named exports ─────────────────────────────────────────────

export function SoberMuseApplicationForm() {
  return (
    <ApplicationFormShell
      fields={SOBER_MUSE_FIELDS}
      submitLabel="Submit application"
      programme="sober-muse"
    />
  );
}

export function EmpowermentApplicationForm() {
  return (
    <ApplicationFormShell
      fields={EMPOWERMENT_FIELDS}
      submitLabel="Submit application"
      programme="empowerment"
    />
  );
}
