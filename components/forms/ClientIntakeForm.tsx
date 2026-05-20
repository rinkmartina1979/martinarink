"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

// ── Schema ────────────────────────────────────────────────────

const IntakeSchema = z.object({
  firstName:             z.string().min(1, "Required"),
  lastName:              z.string().min(1, "Required"),
  dateOfBirth:           z.string().min(1, "Required"),
  address:               z.string().min(1, "Required"),
  city:                  z.string().min(1, "Required"),
  postcode:              z.string().min(1, "Required"),
  phone:                 z.string().min(1, "Required"),
  email:                 z.string().email("Please enter a valid email"),
  occupation:            z.string().min(1, "Required"),
  employer:              z.string().optional(),
  emergencyContactName:  z.string().min(1, "Required"),
  emergencyContactPhone: z.string().min(1, "Required"),
  maritalStatus:         z.string().min(1, "Please select"),
  preferredPronouns:     z.string().optional(),
  referralSource:        z.string().optional(),
  emailOptIn:            z.boolean().optional(),
  programme:             z.enum(["sober-muse", "empowerment", "consultation"]),

  conditions:              z.array(z.string()).optional(),
  medications:             z.boolean(),
  medicationsDetail:       z.string().optional(),
  recentTherapy:           z.boolean(),
  recentTherapyDetail:     z.string().optional(),
  sleepIssues:             z.boolean(),
  sleepIssuesDetail:       z.string().optional(),
  addictions:              z.boolean(),
  addictionsDetail:        z.string().optional(),
  currentTherapist:        z.boolean(),
  currentTherapistDetail:  z.string().optional(),
  physicalHealth:          z.string().min(1, "Please select"),

  whyNow:           z.string().min(20, "Please share a little more."),
  whatIsWorking:    z.string().min(10, "Please share a little more."),
  whatCouldBeBetter: z.string().min(10, "Please share a little more."),
  expectations:     z.string().min(10, "Please share a little more."),
  focusFirst:       z.string().min(10, "Please share a little more."),
  strengths:        z.string().min(10, "Please share a little more."),
  areasForGrowth:   z.string().min(10, "Please share a little more."),
  withoutLimits:    z.string().min(10, "Please share a little more."),

  timeKeeping:     z.string().min(1, "Please select"),
  exerciseRegular: z.boolean(),
  exerciseDetail:  z.string().optional(),
  hobbies:         z.boolean(),
  hobbiesDetail:   z.string().optional(),
  funActivities:   z.string().optional(),

  personalGoals:     z.string().min(10, "Please share a little more."),
  professionalGoals: z.string().min(10, "Please share a little more."),
  desiredChanges:    z.string().min(10, "Please share a little more."),
  obstacles:         z.string().min(10, "Please share a little more."),
  successDefinition: z.string().min(10, "Please share a little more."),

  investmentReadiness: z.string().min(1, "Please select"),
  consent: z.literal(true),
});

type IntakeFormValues = z.infer<typeof IntakeSchema>;

// ── Primitives ────────────────────────────────────────────────

const inputBase =
  "w-full px-4 py-3 bg-cream border text-ink placeholder-ink-quiet/40 text-[15px] " +
  "leading-[1.7] focus:outline-none rounded-[1px] transition-colors duration-200";
const inputNormal = "border-sand focus:border-aubergine";
const inputError  = "border-pink";

function FieldLabel({ children, required = true }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[10px] tracking-[0.26em] uppercase text-ink-quiet mb-2 font-[family-name:var(--font-body)]">
      {children}
      {required && <span className="text-pink ml-1">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" aria-live="polite" className="mt-1.5 text-[12px] text-pink tracking-[0.04em]">
      {message}
    </p>
  );
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 pt-2">
      <div className="flex items-center gap-4 mb-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-aubergine flex items-center justify-center
                         font-[family-name:var(--font-body)] text-[10px] tracking-[0.12em] text-cream/70">
          {number}
        </span>
        <span className="h-px flex-1 bg-pink/30" aria-hidden />
      </div>
      <h2 className="font-[family-name:var(--font-display)] italic text-[28px] md:text-[34px]
                     leading-tight tracking-[-0.01em] text-ink">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[14px] leading-[1.7] text-ink-quiet font-[family-name:var(--font-body)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function YesNoConditional({
  label,
  boolField,
  detailField,
  detailPlaceholder,
  register,
  watch,
  errors,
}: {
  label: string;
  boolField: keyof IntakeFormValues;
  detailField: keyof IntakeFormValues;
  detailPlaceholder?: string;
  register: ReturnType<typeof useForm<IntakeFormValues>>["register"];
  watch: ReturnType<typeof useForm<IntakeFormValues>>["watch"];
  errors: ReturnType<typeof useForm<IntakeFormValues>>["formState"]["errors"];
}) {
  const value = watch(boolField);
  return (
    <div className="space-y-3">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex gap-6">
        {(["true", "false"] as const).map((v) => (
          <label key={v} className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="radio"
              value={v}
              {...register(boolField, {
                setValueAs: (v) => v === "true",
              })}
              className="w-4 h-4 accent-aubergine"
            />
            <span className="text-[13px] text-ink font-[family-name:var(--font-body)]">
              {v === "true" ? "Yes" : "No"}
            </span>
          </label>
        ))}
      </div>
      {value === true && (
        <textarea
          rows={2}
          placeholder={detailPlaceholder ?? "Please describe…"}
          {...register(detailField)}
          className={cn(inputBase, inputNormal, "resize-none")}
        />
      )}
      <FieldError message={errors[boolField]?.message as string} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

export function ClientIntakeForm({ programme }: { programme?: "sober-muse" | "empowerment" | "consultation" }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IntakeFormValues>({
    resolver: zodResolver(IntakeSchema),
    defaultValues: {
      programme:       programme ?? "sober-muse",
      medications:     false,
      recentTherapy:   false,
      sleepIssues:     false,
      addictions:      false,
      currentTherapist: false,
      exerciseRegular: false,
      hobbies:         false,
      emailOptIn:      false,
      conditions:      [],
    },
  });

  const onSubmit = async (data: IntakeFormValues) => {
    setServerError("");
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Something went wrong. Please try again.");
      }
      router.push("/thank-you/application");
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const CONDITIONS = [
    "ADD / ADHD", "Alcohol use", "Anxiety", "Depression",
    "Eating disorder", "Emotional abuse (past or present)",
    "Physical abuse (past or present)", "Sexual abuse (past or present)",
    "Suicidal thoughts", "Substance use",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-20">

      {/* ── 1. PERSONAL INFORMATION ───────────────────────── */}
      <fieldset className="space-y-6">
        <SectionHeader
          number="01"
          title="Personal information."
          subtitle="All information is held in strict confidence and used only for the purpose of this private work."
        />

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <FieldLabel>First name</FieldLabel>
            <input type="text" autoComplete="given-name"
              className={cn(inputBase, errors.firstName ? inputError : inputNormal)}
              {...register("firstName")} />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div>
            <FieldLabel>Last name</FieldLabel>
            <input type="text" autoComplete="family-name"
              className={cn(inputBase, errors.lastName ? inputError : inputNormal)}
              {...register("lastName")} />
            <FieldError message={errors.lastName?.message} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <FieldLabel>Date of birth</FieldLabel>
            <input type="date"
              className={cn(inputBase, errors.dateOfBirth ? inputError : inputNormal)}
              {...register("dateOfBirth")} />
            <FieldError message={errors.dateOfBirth?.message} />
          </div>
          <div>
            <FieldLabel>Preferred pronouns</FieldLabel>
            <input type="text" placeholder="e.g. she / her"
              className={cn(inputBase, inputNormal)}
              {...register("preferredPronouns")} />
          </div>
        </div>

        <div>
          <FieldLabel>Address</FieldLabel>
          <input type="text" autoComplete="street-address"
            className={cn(inputBase, errors.address ? inputError : inputNormal)}
            {...register("address")} />
          <FieldError message={errors.address?.message} />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <FieldLabel>City</FieldLabel>
            <input type="text" autoComplete="address-level2"
              className={cn(inputBase, errors.city ? inputError : inputNormal)}
              {...register("city")} />
            <FieldError message={errors.city?.message} />
          </div>
          <div>
            <FieldLabel>Postcode / ZIP</FieldLabel>
            <input type="text" autoComplete="postal-code"
              className={cn(inputBase, errors.postcode ? inputError : inputNormal)}
              {...register("postcode")} />
            <FieldError message={errors.postcode?.message} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <FieldLabel>Phone</FieldLabel>
            <input type="tel" autoComplete="tel"
              className={cn(inputBase, errors.phone ? inputError : inputNormal)}
              {...register("phone")} />
            <FieldError message={errors.phone?.message} />
          </div>
          <div>
            <FieldLabel>Email address</FieldLabel>
            <input type="email" autoComplete="email"
              className={cn(inputBase, errors.email ? inputError : inputNormal)}
              {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <FieldLabel>Occupation</FieldLabel>
            <input type="text"
              className={cn(inputBase, errors.occupation ? inputError : inputNormal)}
              {...register("occupation")} />
            <FieldError message={errors.occupation?.message} />
          </div>
          <div>
            <FieldLabel required={false}>Employer / Company</FieldLabel>
            <input type="text"
              className={cn(inputBase, inputNormal)}
              {...register("employer")} />
          </div>
        </div>

        <div>
          <FieldLabel>Marital status</FieldLabel>
          <select className={cn(inputBase, errors.maritalStatus ? inputError : inputNormal)}
            {...register("maritalStatus")}>
            <option value="">Select…</option>
            {["Single", "Married", "Partnered", "Widowed", "Divorced", "Polyamorous", "Prefer not to say"].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <FieldError message={errors.maritalStatus?.message} />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <FieldLabel>Emergency contact name</FieldLabel>
            <input type="text"
              className={cn(inputBase, errors.emergencyContactName ? inputError : inputNormal)}
              {...register("emergencyContactName")} />
            <FieldError message={errors.emergencyContactName?.message} />
          </div>
          <div>
            <FieldLabel>Emergency contact phone</FieldLabel>
            <input type="tel"
              className={cn(inputBase, errors.emergencyContactPhone ? inputError : inputNormal)}
              {...register("emergencyContactPhone")} />
            <FieldError message={errors.emergencyContactPhone?.message} />
          </div>
        </div>

        <div>
          <FieldLabel required={false}>How did you hear about Martina?</FieldLabel>
          <input type="text" placeholder="Instagram, a friend, press, Miss Germany, other…"
            className={cn(inputBase, inputNormal)}
            {...register("referralSource")} />
        </div>

        <div>
          <FieldLabel>Programme you are applying for</FieldLabel>
          <select className={cn(inputBase, errors.programme ? inputError : inputNormal)}
            {...register("programme")}>
            <option value="sober-muse">The Sober Muse Method — 90 days, from €5,000</option>
            <option value="empowerment">Female Empowerment & Leadership — 3–12 months, from €7,500</option>
            <option value="consultation">Private Consultation — €450</option>
          </select>
          <FieldError message={errors.programme?.message} />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 w-4 h-4 accent-aubergine flex-shrink-0"
            {...register("emailOptIn")} />
          <span className="text-[13px] leading-[1.65] text-ink-soft font-[family-name:var(--font-body)]">
            I would like to receive occasional letters and notes from Martina by email.
          </span>
        </label>
      </fieldset>

      {/* ── 2. HEALTH & WELLBEING ─────────────────────────── */}
      <fieldset className="space-y-8">
        <SectionHeader
          number="02"
          title="Health & wellbeing."
          subtitle="This section is confidential. It helps Martina understand you fully before your first conversation."
        />

        <div>
          <FieldLabel required={false}>Please indicate any of the following that are relevant to you</FieldLabel>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {CONDITIONS.map((condition) => (
              <label key={condition} className="flex items-center gap-3 cursor-pointer group">
                <Controller
                  name="conditions"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      value={condition}
                      checked={field.value?.includes(condition) ?? false}
                      onChange={(e) => {
                        const current = field.value ?? [];
                        field.onChange(
                          e.target.checked
                            ? [...current, condition]
                            : current.filter((c) => c !== condition)
                        );
                      }}
                      className="w-4 h-4 flex-shrink-0 accent-aubergine"
                    />
                  )}
                />
                <span className="text-[14px] text-ink-soft group-hover:text-ink transition-colors
                                 font-[family-name:var(--font-body)]">
                  {condition}
                </span>
              </label>
            ))}
          </div>
        </div>

        <YesNoConditional
          label="Are you currently taking any medications?"
          boolField="medications"
          detailField="medicationsDetail"
          detailPlaceholder="Please name them and describe the dosage if comfortable doing so."
          register={register}
          watch={watch}
          errors={errors}
        />

        <YesNoConditional
          label="Have you received any therapeutic or professional support in the past 30 days?"
          boolField="recentTherapy"
          detailField="recentTherapyDetail"
          detailPlaceholder="Please describe the type of support and how recently."
          register={register}
          watch={watch}
          errors={errors}
        />

        <YesNoConditional
          label="Do you currently have difficulties sleeping?"
          boolField="sleepIssues"
          detailField="sleepIssuesDetail"
          detailPlaceholder="How long has this been the case? How does it affect your day?"
          register={register}
          watch={watch}
          errors={errors}
        />

        <YesNoConditional
          label="Are you navigating any dependencies or addictive patterns?"
          boolField="addictions"
          detailField="addictionsDetail"
          detailPlaceholder="Please describe as honestly as you can — this is a safe space."
          register={register}
          watch={watch}
          errors={errors}
        />

        <YesNoConditional
          label="Are you currently working with a therapist or psychiatrist?"
          boolField="currentTherapist"
          detailField="currentTherapistDetail"
          detailPlaceholder="Type and frequency — e.g. weekly psychotherapy, monthly psychiatry."
          register={register}
          watch={watch}
          errors={errors}
        />

        <div>
          <FieldLabel>How would you rate your overall physical health?</FieldLabel>
          <div className="flex flex-wrap gap-4 mt-1">
            {["Excellent", "Good", "Fair", "Poor"].map((opt) => (
              <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" value={opt}
                  {...register("physicalHealth")}
                  className="w-4 h-4 accent-aubergine" />
                <span className="text-[13px] text-ink font-[family-name:var(--font-body)]">{opt}</span>
              </label>
            ))}
          </div>
          <FieldError message={errors.physicalHealth?.message} />
        </div>
      </fieldset>

      {/* ── 3. YOUR INNER LIFE ────────────────────────────── */}
      <fieldset className="space-y-8">
        <SectionHeader
          number="03"
          title="Your inner life."
          subtitle="There are no right answers here. Martina reads every word herself."
        />

        {[
          { field: "whyNow" as const,          label: "What has brought you to this conversation?",
            placeholder: "Be as honest as you can. This is private and will be read only by Martina." },
          { field: "whatIsWorking" as const,    label: "What part of your life is working well right now?",
            placeholder: "Even if it feels small." },
          { field: "whatCouldBeBetter" as const, label: "What part of your life could be working better?",
            placeholder: "Where do you feel the gap most clearly?" },
          { field: "expectations" as const,     label: "What do you expect — or hope — from this private work?",
            placeholder: "Not in outcomes necessarily. What would feel like something shifting?" },
          { field: "focusFirst" as const,       label: "If we were to begin somewhere, where would you want to begin?",
            placeholder: "There is no wrong answer." },
          { field: "strengths" as const,        label: "What do you consider your strengths?",
            placeholder: "The things you know, quietly, that you do well." },
          { field: "areasForGrowth" as const,   label: "Where do you most want to grow?",
            placeholder: "The honest version — not the LinkedIn version." },
          { field: "withoutLimits" as const,    label: "If nothing could hold you back — what would you do?",
            placeholder: "No filters. This is just between us." },
        ].map(({ field, label, placeholder }) => (
          <div key={field}>
            <FieldLabel>{label}</FieldLabel>
            <textarea rows={4} placeholder={placeholder}
              className={cn(inputBase, errors[field] ? inputError : inputNormal, "resize-y")}
              {...register(field)} />
            <FieldError message={errors[field]?.message} />
          </div>
        ))}
      </fieldset>

      {/* ── 4. HABITS & LIFESTYLE ─────────────────────────── */}
      <fieldset className="space-y-8">
        <SectionHeader
          number="04"
          title="Habits & lifestyle."
          subtitle="Small details that help Martina understand the texture of your daily life."
        />

        <div>
          <FieldLabel>Are you usually…</FieldLabel>
          <div className="flex flex-wrap gap-6 mt-1">
            {["Early", "On time", "Running late"].map((opt) => (
              <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" value={opt}
                  {...register("timeKeeping")}
                  className="w-4 h-4 accent-aubergine" />
                <span className="text-[13px] text-ink font-[family-name:var(--font-body)]">{opt}</span>
              </label>
            ))}
          </div>
          <FieldError message={errors.timeKeeping?.message} />
        </div>

        <YesNoConditional
          label="Do you exercise regularly?"
          boolField="exerciseRegular"
          detailField="exerciseDetail"
          detailPlaceholder="What do you do, and how often?"
          register={register}
          watch={watch}
          errors={errors}
        />

        <YesNoConditional
          label="Do you have hobbies or creative interests?"
          boolField="hobbies"
          detailField="hobbiesDetail"
          detailPlaceholder="What are they, and how often do you return to them?"
          register={register}
          watch={watch}
          errors={errors}
        />

        <div>
          <FieldLabel required={false}>What do you do for pleasure — the small things?</FieldLabel>
          <input type="text" placeholder="Walking, reading, cooking, cinema…"
            className={cn(inputBase, inputNormal)}
            {...register("funActivities")} />
        </div>
      </fieldset>

      {/* ── 5. GOALS ──────────────────────────────────────── */}
      <fieldset className="space-y-8">
        <SectionHeader
          number="05"
          title="Goals & direction."
          subtitle="Where you want to go — and what stands between you and it."
        />

        {[
          { field: "personalGoals" as const,     label: "What are your personal goals?",
            placeholder: "Not the ambitious list. The ones that matter to you privately." },
          { field: "professionalGoals" as const,  label: "What are your professional goals?",
            placeholder: "The next chapter — what does it look like from the inside?" },
          { field: "desiredChanges" as const,     label: "What changes do you most want to make in your life right now?",
            placeholder: "If you could change one thing this year — what would it be?" },
          { field: "obstacles" as const,          label: "What keeps getting in the way?",
            placeholder: "The patterns you can name. The ones you can't quite yet." },
          { field: "successDefinition" as const,  label: "How do you define success — for yourself, not anyone else?",
            placeholder: "This question often takes a moment." },
        ].map(({ field, label, placeholder }) => (
          <div key={field}>
            <FieldLabel>{label}</FieldLabel>
            <textarea rows={3} placeholder={placeholder}
              className={cn(inputBase, errors[field] ? inputError : inputNormal, "resize-y")}
              {...register(field)} />
            <FieldError message={errors[field]?.message} />
          </div>
        ))}
      </fieldset>

      {/* ── 6. INVESTMENT ─────────────────────────────────── */}
      <fieldset className="space-y-6">
        <SectionHeader
          number="06"
          title="Investment readiness."
          subtitle="An honest question — because fit matters more than urgency."
        />
        <div>
          <FieldLabel>Where are you with the investment?</FieldLabel>
          <select
            className={cn(inputBase, errors.investmentReadiness ? inputError : inputNormal)}
            {...register("investmentReadiness")}
          >
            <option value="">Select…</option>
            <option value="Yes — ready to invest in the next 60 days">
              Yes — I am ready to invest in the next 60 days
            </option>
            <option value="Yes — with a payment plan">
              Yes — with a payment plan
            </option>
            <option value="Exploring — want to understand the process first">
              I am exploring — I want to understand the process first
            </option>
            <option value="Not at this time">
              Not at this time
            </option>
          </select>
          <FieldError message={errors.investmentReadiness?.message} />
        </div>
      </fieldset>

      {/* ── CONSENT & SUBMIT ──────────────────────────────── */}
      <div className="pt-2 space-y-6 border-t border-sand/60">
        <p className="text-[13px] leading-[1.75] text-ink-quiet font-[family-name:var(--font-body)]">
          All information you share in this form is held in strict confidence by Martina Rink.
          It is used solely to prepare for your private work together and will not be shared with any
          third party. Your data is stored securely and you may request its deletion at any time.
        </p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 accent-aubergine flex-shrink-0"
            {...register("consent")}
          />
          <span className="text-[13px] leading-[1.7] text-ink-soft font-[family-name:var(--font-body)]">
            I have read the privacy note above and consent to Martina Rink holding this information
            for the purpose of our private work together.
            <span className="text-pink ml-1">*</span>
          </span>
        </label>
        <FieldError message={errors.consent?.message} />

        {serverError && (
          <p role="alert" aria-live="polite" className="text-[14px] text-pink">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center bg-aubergine text-cream uppercase
                     tracking-[0.22em] text-[11px] font-medium px-14 py-[15px] rounded-[1px]
                     hover:bg-aubergine-deep transition-colors duration-300
                     disabled:opacity-60 disabled:cursor-not-allowed
                     font-[family-name:var(--font-body)]"
        >
          {isSubmitting ? "Sending…" : "Submit intake form"}
        </button>
      </div>

    </form>
  );
}
