"use client";

/**
 * /admin/contract?secret=ADMIN_SECRET&email=...&firstName=...&programme=...
 *
 * Martina's internal tool to send a coaching contract to a client.
 * Protected by ?secret= query param checked against ADMIN_SECRET env var.
 * Only Martina ever visits this page — accessed from a bookmarked URL.
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const PROGRAMME_DEFAULTS: Record<string, { label: string; fee: string }> = {
  "sober-muse": { label: "The Sober Muse Method", fee: "€5,000" },
  empowerment: { label: "Female Empowerment & Leadership", fee: "€7,500" },
  consultation: { label: "Private Consultation", fee: "€450" },
};

const SERVICE_TEMPLATES: Record<string, string> = {
  "sober-muse":
    "90-day private coaching programme — The Sober Muse Method. Includes weekly 60-minute sessions via Zoom, asynchronous support between sessions, and direct access to Martina throughout. Focused on the specific work agreed in our private consultation.",
  empowerment:
    "Bespoke Female Empowerment & Leadership coaching programme over 3–12 months. Includes bi-weekly 60-minute sessions via Zoom, written reflection work between sessions, and sustained direct support throughout. Scope and duration as agreed in our private consultation.",
  consultation:
    "Single private consultation — 45 minutes via Zoom. A focused, confidential conversation on the specific questions and direction agreed between us. Fee credited in full to the programme investment upon enrolment.",
};

const FormSchema = z.object({
  adminSecret: z.string().min(1, "Secret required"),
  email: z.string().email("Valid email required"),
  firstName: z.string().min(1, "First name required"),
  programme: z.enum(["sober-muse", "empowerment", "consultation"]),
  serviceDescription: z.string().min(10, "Describe the service in detail"),
  fee: z.string().min(1, "Fee required"),
  deliveryMethod: z.enum(["Online", "In-person", "Telephone"]),
  location: z.string().optional(),
  contractDate: z.string().min(1, "Date required"),
});

type FormData = z.infer<typeof FormSchema>;

function todayFormatted(): string {
  return new Date().toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function todayInputValue(): string {
  return new Date().toISOString().split("T")[0];
}

export default function AdminContractPage() {
  const [searchSecret, setSearchSecret] = useState("");
  const [prefillEmail, setPrefillEmail] = useState("");
  const [prefillFirstName, setPrefillFirstName] = useState("");
  const [prefillProgramme, setPrefillProgramme] = useState<"sober-muse" | "empowerment" | "consultation">("empowerment");
  const [authorised, setAuthorised] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sentUrl, setSentUrl] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Read URL params client-side
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const secret = params.get("secret") ?? "";
    const email = params.get("email") ?? "";
    const firstName = params.get("firstName") ?? "";
    const prog = params.get("programme") as "sober-muse" | "empowerment" | "consultation" | null;

    setSearchSecret(secret);
    setPrefillEmail(email);
    setPrefillFirstName(firstName);
    if (prog && ["sober-muse", "empowerment", "consultation"].includes(prog)) {
      setPrefillProgramme(prog);
    }

    // Quick client-side check: if no secret in URL at all, show nothing
    setAuthorised(secret.length > 0);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      programme: "empowerment",
      serviceDescription: SERVICE_TEMPLATES["empowerment"],
      deliveryMethod: "Online",
      contractDate: todayFormatted(),
    },
  });

  // When prefill values are ready, set them into the form
  useEffect(() => {
    if (prefillEmail) setValue("email", prefillEmail);
    if (prefillFirstName) setValue("firstName", prefillFirstName);
    if (prefillProgramme) {
      setValue("programme", prefillProgramme);
      setValue("fee", PROGRAMME_DEFAULTS[prefillProgramme]?.fee ?? "");
      setValue("serviceDescription", SERVICE_TEMPLATES[prefillProgramme] ?? "");
    }
    if (searchSecret) setValue("adminSecret", searchSecret);
    setValue("contractDate", todayFormatted());
  }, [prefillEmail, prefillFirstName, prefillProgramme, searchSecret, setValue]);

  const programme = watch("programme");
  const deliveryMethod = watch("deliveryMethod");

  // Auto-fill fee + service description template when programme changes
  useEffect(() => {
    if (programme) {
      setValue("fee", PROGRAMME_DEFAULTS[programme]?.fee ?? "");
      // Only overwrite description when it's currently a known template
      // (i.e. Martina hasn't started writing her own copy)
      const currentDesc = (document.querySelector<HTMLTextAreaElement>('[name="serviceDescription"]'))?.value ?? "";
      const isStillTemplate = Object.values(SERVICE_TEMPLATES).some(
        (t) => t === currentDesc,
      );
      if (!currentDesc || isStillTemplate) {
        setValue("serviceDescription", SERVICE_TEMPLATES[programme] ?? "");
      }
    }
  }, [programme, setValue]);

  const onSubmit = async (data: FormData) => {
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contract/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setSentUrl(json.contractUrl ?? "");
      setStatus("sent");
    } catch {
      setErrorMsg("Network error — check your connection.");
      setStatus("error");
    }
  };

  if (authorised === null) return null; // hydrating

  if (!authorised) {
    return (
      <div className="min-h-screen bg-[#1a1020] flex items-center justify-center px-6">
        <p className="text-cream/40 text-[13px] font-[family-name:var(--font-body)] tracking-widest uppercase">
          Not found
        </p>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="min-h-screen bg-[#1a1020] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="h-px w-16 mx-auto mb-10 bg-gradient-to-r from-transparent via-pink to-transparent" />
          <div className="w-12 h-12 rounded-full border border-pink/40 flex items-center justify-center mx-auto mb-8">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 10.5l4.5 4.5 7.5-9" stroke="#F942AA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-display)] italic text-[32px] text-cream mb-4 leading-tight">
            Contract sent.
          </h1>
          <p className="text-[15px] text-cream/60 font-[family-name:var(--font-body)] leading-relaxed mb-6">
            The invite email has been sent. The client has 7 days to sign.
          </p>
          {sentUrl && (
            <div className="bg-[#2a1f38] p-4 text-left mb-8">
              <p className="text-[10px] uppercase tracking-widest text-cream/30 mb-2 font-[family-name:var(--font-body)]">
                Contract link (for your records)
              </p>
              <p className="text-[12px] text-cream/60 font-[family-name:var(--font-body)] break-all leading-relaxed">
                {sentUrl}
              </p>
            </div>
          )}
          <button
            onClick={() => {
              setStatus("idle");
              setSentUrl("");
            }}
            className="text-[11px] uppercase tracking-[0.2em] text-cream/40 hover:text-cream/70 transition-colors font-[family-name:var(--font-body)] cursor-pointer"
          >
            Send another contract
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full bg-[#2a1f38] border border-cream/10 text-cream placeholder-cream/30 px-4 py-3 text-[15px] font-[family-name:var(--font-body)] focus:outline-none focus:border-pink/40 transition-colors";
  const labelClass =
    "block text-[10px] uppercase tracking-[0.22em] text-cream/40 font-[family-name:var(--font-body)] mb-2";
  const errorClass = "mt-1 text-[12px] text-pink/80 font-[family-name:var(--font-body)]";

  return (
    <div className="min-h-screen bg-[#1a1020] py-16 px-6">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="h-px w-16 mb-8 bg-gradient-to-r from-transparent via-pink to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.28em] text-cream/30 font-[family-name:var(--font-body)] mb-3">
            Admin — Contract
          </p>
          <h1 className="font-[family-name:var(--font-display)] italic text-[32px] text-cream leading-tight">
            Send coaching contract.
          </h1>
          <p className="mt-3 text-[14px] text-cream/50 font-[family-name:var(--font-body)] leading-relaxed">
            Fill in the details below. The client receives a signed link by email.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">

          {/* Hidden secret field */}
          <input type="hidden" {...register("adminSecret")} />

          {/* Client email */}
          <div>
            <label className={labelClass}>Client email</label>
            <input type="email" placeholder="client@email.com" className={inputClass} {...register("email")} />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* First name */}
          <div>
            <label className={labelClass}>Client first name</label>
            <input type="text" placeholder="Sarah" className={inputClass} {...register("firstName")} />
            {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
          </div>

          {/* Programme */}
          <div>
            <label className={labelClass}>Programme</label>
            <div className="space-y-2">
              {(["sober-muse", "empowerment", "consultation"] as const).map((p) => (
                <label key={p} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    value={p}
                    {...register("programme")}
                    className="accent-pink cursor-pointer"
                  />
                  <span className="text-[14px] text-cream/70 group-hover:text-cream/90 transition-colors font-[family-name:var(--font-body)]">
                    {PROGRAMME_DEFAULTS[p].label}
                  </span>
                </label>
              ))}
            </div>
            {errors.programme && <p className={errorClass}>{errors.programme.message}</p>}
          </div>

          {/* Service description */}
          <div>
            <label className={labelClass}>Service description</label>
            <textarea
              rows={4}
              placeholder="90-day intensive coaching programme focused on [specific goals agreed in consultation]. Includes weekly 60-minute sessions via Zoom, written reflections, and direct messaging access throughout."
              className={`${inputClass} resize-y`}
              {...register("serviceDescription")}
            />
            {errors.serviceDescription && <p className={errorClass}>{errors.serviceDescription.message}</p>}
          </div>

          {/* Fee */}
          <div>
            <label className={labelClass}>Investment (fee)</label>
            <input
              type="text"
              placeholder="€5,000"
              className={inputClass}
              {...register("fee")}
            />
            {errors.fee && <p className={errorClass}>{errors.fee.message}</p>}
          </div>

          {/* Delivery method */}
          <div>
            <label className={labelClass}>Delivery format</label>
            <div className="space-y-2">
              {(["Online", "In-person", "Telephone"] as const).map((m) => (
                <label key={m} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    value={m}
                    {...register("deliveryMethod")}
                    className="accent-pink cursor-pointer"
                  />
                  <span className="text-[14px] text-cream/70 group-hover:text-cream/90 transition-colors font-[family-name:var(--font-body)]">
                    {m}
                  </span>
                </label>
              ))}
            </div>
            {errors.deliveryMethod && <p className={errorClass}>{errors.deliveryMethod.message}</p>}
          </div>

          {/* Location — shown only for in-person */}
          {deliveryMethod === "In-person" && (
            <div>
              <label className={labelClass}>Location / address</label>
              <input
                type="text"
                placeholder="Steinkreuzstr. 26b, 76228 Karlsruhe"
                className={inputClass}
                {...register("location")}
              />
            </div>
          )}

          {/* Contract date */}
          <div>
            <label className={labelClass}>Contract date (Karlsruhe, …)</label>
            <input
              type="text"
              placeholder={todayFormatted()}
              className={inputClass}
              {...register("contractDate")}
            />
            {errors.contractDate && <p className={errorClass}>{errors.contractDate.message}</p>}
          </div>

          {/* Error message */}
          {status === "error" && (
            <div className="bg-pink/10 border border-pink/20 px-4 py-3">
              <p className="text-[14px] text-pink/90 font-[family-name:var(--font-body)]">{errorMsg}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-plum hover:bg-plum-deep text-cream text-[12px] uppercase tracking-[0.22em] py-4 transition-colors disabled:opacity-50 font-[family-name:var(--font-body)] cursor-pointer"
          >
            {status === "sending" ? "Sending…" : "Send contract to client"}
          </button>

        </form>
      </div>
    </div>
  );
}
