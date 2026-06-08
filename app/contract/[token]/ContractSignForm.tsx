"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const SignSchema = z.object({
  signedName: z.string().min(2, "Please enter your full name to sign"),
  consentAnnexes: z.literal(true, {
    error: "You must confirm receipt of all annexes to proceed",
  }),
  consentGeneral: z.literal(true, {
    error: "You must agree to the terms of this contract to proceed",
  }),
});

type SignFormData = z.infer<typeof SignSchema>;

interface Props {
  contractId: string;
  sig: string;
  firstName: string;
}

export function ContractSignForm({ contractId, sig, firstName }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "signing" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignFormData>({
    resolver: zodResolver(SignSchema),
    defaultValues: {
      consentAnnexes: undefined,
      consentGeneral: undefined,
    },
  });

  const signedName = watch("signedName");

  const onSubmit = async (data: SignFormData) => {
    setStatus("signing");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contract/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, sig, signedName: data.signedName }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      router.push("/contract/signed");
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-white border border-sand text-ink placeholder-ink-quiet/50 px-4 py-3 text-[16px] font-[family-name:var(--font-body)] focus:outline-none focus:border-plum/40 transition-colors";
  const errorClass = "mt-1.5 text-[12px] text-red-600 font-[family-name:var(--font-body)]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>

      {/* Signature input */}
      <div className="bg-bone p-6 mb-8 border-l-4 border-plum/30">
        <label className="block text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-3 font-[family-name:var(--font-body)]">
          Your signature — type your full name
        </label>
        <input
          type="text"
          placeholder={`${firstName} [surname]`}
          autoComplete="name"
          className={inputClass}
          {...register("signedName")}
        />
        {errors.signedName && <p className={errorClass}>{errors.signedName.message}</p>}

        {/* Live signature preview */}
        {signedName && signedName.length >= 2 && (
          <div className="mt-4 pt-4 border-t border-sand">
            <p className="text-[10px] uppercase tracking-widest text-ink-quiet/60 mb-1 font-[family-name:var(--font-body)]">Preview</p>
            <p className="font-[family-name:var(--font-display)] italic text-[26px] text-ink">
              {signedName}
            </p>
          </div>
        )}
      </div>

      {/* Consent checkboxes */}
      <div className="space-y-4 mb-8">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 accent-plum cursor-pointer flex-shrink-0"
            {...register("consentAnnexes")}
          />
          <span className="font-[family-name:var(--font-body)] text-[14px] text-ink-soft leading-[1.65] group-hover:text-ink transition-colors">
            I confirm that I have received and read the annexes to this contract: the Questionnaire, the{" "}
            <a href="/legal/terms" target="_blank" className="text-plum underline decoration-plum/30">General Terms and Conditions</a>,
            the{" "}
            <a href="/legal/cancellation" target="_blank" className="text-plum underline decoration-plum/30">Cancellation Policy</a>,
            and the{" "}
            <a href="/legal/privacy" target="_blank" className="text-plum underline decoration-plum/30">Privacy Policy</a>.
          </span>
        </label>
        {errors.consentAnnexes && <p className={errorClass}>{errors.consentAnnexes.message}</p>}

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 accent-plum cursor-pointer flex-shrink-0"
            {...register("consentGeneral")}
          />
          <span className="font-[family-name:var(--font-body)] text-[14px] text-ink-soft leading-[1.65] group-hover:text-ink transition-colors">
            I agree to the terms set out in this coaching contract and confirm that the information above is correct.
          </span>
        </label>
        {errors.consentGeneral && <p className={errorClass}>{errors.consentGeneral.message}</p>}
      </div>

      {/* Error */}
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 mb-6">
          <p className="text-[14px] text-red-700 font-[family-name:var(--font-body)]">{errorMsg}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "signing"}
        className="w-full bg-plum hover:bg-plum-deep text-cream text-[12px] uppercase tracking-[0.22em] py-5 transition-colors disabled:opacity-50 font-[family-name:var(--font-body)] cursor-pointer"
      >
        {status === "signing" ? "Confirming…" : "I agree and sign this contract"}
      </button>

      <p className="mt-4 text-[12px] text-ink-quiet font-[family-name:var(--font-body)] leading-relaxed text-center">
        By clicking above, you are signing this contract digitally. A signed copy will be sent to your email address immediately.
      </p>

    </form>
  );
}
