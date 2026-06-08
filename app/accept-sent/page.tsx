import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { InlineContractForm } from "@/components/contract/InlineContractForm";

export const metadata: Metadata = buildMetadata({
  title: "Application accepted",
  noIndex: true,
});

// ── Checkmark icon ─────────────────────────────────────────────────────────
function Check({ colour = "#F942AA" }: { colour?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="flex-shrink-0 mt-0.5"
    >
      <path
        d="M2.5 7.5l3 3 6-6"
        stroke={colour}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Automated confirmation row ─────────────────────────────────────────────
function DoneRow({
  label,
  sub,
  dim,
}: {
  label: string;
  sub?: string;
  dim?: boolean;
}) {
  return (
    <li className="flex gap-3 items-start">
      <Check colour={dim ? "#8A7F72" : "#F942AA"} />
      <div>
        <p
          className={`font-[family-name:var(--font-body)] text-[14px] ${
            dim ? "text-cream/45" : "text-cream/80"
          }`}
        >
          {label}
        </p>
        {sub && (
          <p className="font-[family-name:var(--font-body)] text-[11px] text-cream/30 mt-0.5">
            {sub}
          </p>
        )}
      </div>
    </li>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default async function AcceptSentPage({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string;
    email?: string;
    programme?: string;
    admin_token?: string;
    contract_sent?: string;
  }>;
}) {
  const params          = await searchParams;
  const name            = params.name            ?? "the applicant";
  const email           = params.email           ?? "";
  const programme       = params.programme       ?? "";
  const adminToken      = params.admin_token     ?? "";
  const contractAutoSent = params.contract_sent  === "1";
  const hasToken        = adminToken.length > 0;

  // ── PATH A: Contract fired automatically ────────────────────────────────
  if (contractAutoSent) {
    return (
      <section className="min-h-screen bg-aubergine px-6 py-16">
        <div className="max-w-md mx-auto">

          {/* Pink hairline */}
          <div
            aria-hidden
            className="h-px w-16 mb-12"
            style={{ background: "linear-gradient(to right, transparent, #F942AA, transparent)" }}
          />

          {/* Headline */}
          <div className="mb-10">
            <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.28em] text-cream/30 mb-4">
              One click — three things
            </p>
            <h1 className="font-[family-name:var(--font-display)] italic text-[32px] md:text-[40px] leading-[1.1] text-cream">
              {name} is on her way.
            </h1>
            <p className="mt-4 text-[15px] leading-[1.8] text-cream/55 font-[family-name:var(--font-body)]">
              Everything that needed to happen has happened.
              <br />
              Without another step from you.
            </p>
          </div>

          {/* Three confirmed automations */}
          <div className="border-t border-cream/10 pt-8 mb-8">
            <ul className="space-y-5">
              <DoneRow
                label="Acceptance email sent"
                sub={`Booking link delivered to ${email || "her inbox"}`}
              />
              <DoneRow
                label="Coaching contract sent"
                sub="Signed link emailed — valid for 7 days"
              />
              <DoneRow
                label="Intake form queued"
                sub="Fires automatically when she signs the contract"
                dim
              />
            </ul>
          </div>

          {/* What happens next — fully passive for Martina */}
          <div className="bg-cream/[0.04] border border-cream/[0.08] px-5 py-5 mb-10">
            <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-cream/25 mb-4">
              The rest is automatic
            </p>
            <ol className="space-y-3">
              {[
                ["She signs the contract", "Intake form arrives in her inbox — no action from you"],
                ["She submits intake",     "You receive her responses directly"],
                ["Programme begins",       "You have everything you need"],
              ].map(([step, note], i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-[family-name:var(--font-body)] text-[10px] text-cream/25 mt-0.5 flex-shrink-0 w-4 text-right">
                    {String(i + 1)}
                  </span>
                  <div>
                    <p className="text-[13px] text-cream/65 font-[family-name:var(--font-body)]">
                      {step}
                    </p>
                    <p className="text-[11px] text-cream/30 font-[family-name:var(--font-body)]">
                      {note}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Escape hatch — collapsed by default */}
          {hasToken && email && programme && (
            <details className="group border-t border-cream/10 pt-8">
              <summary className="list-none cursor-pointer text-[11px] uppercase tracking-[0.2em] text-cream/30 hover:text-cream/50 transition-colors font-[family-name:var(--font-body)] flex items-center gap-2">
                <span>Resend with custom description</span>
                <span
                  aria-hidden
                  className="inline-block transition-transform group-open:rotate-180"
                >
                  ↓
                </span>
              </summary>
              <div className="mt-6">
                <p className="text-[13px] text-cream/40 font-[family-name:var(--font-body)] leading-relaxed mb-5">
                  The contract that just sent used the programme template. If you need to
                  personalise the service description — or the client&rsquo;s fee differs —
                  send a second version below. Only the latest signed contract counts.
                </p>
                <InlineContractForm
                  adminToken={adminToken}
                  email={email}
                  firstName={name}
                  programme={programme}
                />
              </div>
            </details>
          )}

          <div className="mt-12 pt-6 border-t border-cream/10 text-center">
            <p className="font-[family-name:var(--font-display)] italic text-[18px] text-cream/50">
              Martina
            </p>
          </div>

        </div>
      </section>
    );
  }

  // ── PATH B: Contract not yet sent (CONTRACT_SECRET missing or blob failed) ──
  // Shows the inline form as "Step 2" — same experience as before, degraded gracefully.
  return (
    <section className="min-h-screen bg-aubergine px-6 py-16">
      <div className="max-w-md mx-auto">

        {/* Pink hairline */}
        <div
          aria-hidden
          className="h-px w-16 mx-auto mb-10"
          style={{ background: "linear-gradient(to right, transparent, #F942AA, transparent)" }}
        />

        {/* Step 1 done */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border border-pink/40 flex items-center justify-center mx-auto mb-8">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path
                d="M4 10.5l4.5 4.5 7.5-9"
                stroke="#F942AA"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="font-[family-name:var(--font-body)] text-[11px] uppercase tracking-[0.26em] text-cream/40 mb-4">
            Step 1 of 2 — done
          </p>

          <h1 className="font-[family-name:var(--font-display)] italic text-[32px] md:text-[40px] leading-[1.1] text-cream mb-6">
            {name} has her booking link.
          </h1>

          <p className="text-[15px] leading-[1.75] text-cream/60 font-[family-name:var(--font-body)] mb-2">
            The acceptance email — with{" "}
            <span className="text-cream/80">/book?token=approved</span> — has been sent to{" "}
            {email ? <span className="text-cream/80">{email}</span> : "her inbox"}.
          </p>

          <p className="text-[12px] leading-[1.7] text-cream/35 font-[family-name:var(--font-body)] mt-4">
            Brevo: <span className="text-cream/55">accepted</span>
          </p>
        </div>

        {/* Automated chain overview */}
        <div className="mt-10 pt-8 border-t border-cream/10">
          <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.22em] text-cream/25 mb-5 text-center">
            After you send the contract
          </p>
          <ol className="space-y-3">
            {[
              ["She books the consultation", "via the booking link above"],
              ["Send the contract below",    "pre-filled — takes 30 seconds"],
              ["She signs digitally",        "intake form fires automatically"],
              ["You receive her intake",     "she&rsquo;s ready to begin"],
            ].map(([step, sub], i) => (
              <li key={i} className="flex gap-4">
                <span className="font-[family-name:var(--font-body)] text-[11px] text-pink/50 mt-0.5 flex-shrink-0 w-5 text-center">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p
                    className="text-[13px] text-cream/70 font-[family-name:var(--font-body)]"
                    dangerouslySetInnerHTML={{ __html: step }}
                  />
                  <p
                    className="text-[11px] text-cream/35 font-[family-name:var(--font-body)]"
                    dangerouslySetInnerHTML={{ __html: sub }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Step 2: Send contract */}
        {hasToken && email && programme ? (
          <InlineContractForm
            adminToken={adminToken}
            email={email}
            firstName={name}
            programme={programme}
          />
        ) : (
          <div className="mt-10 pt-8 border-t border-cream/10 text-center">
            <p className="font-[family-name:var(--font-body)] text-[11px] uppercase tracking-[0.2em] text-cream/30 mb-3">
              Step 2 — send the contract
            </p>
            <p className="text-[13px] text-cream/50 font-[family-name:var(--font-body)] leading-relaxed mb-4">
              Use your bookmarked admin link to send the coaching contract.
            </p>
            <a
              href={`/admin/contract${
                email || programme
                  ? `?${new URLSearchParams({
                      ...(email && { email }),
                      ...(name !== "the applicant" && { firstName: name }),
                      ...(programme && { programme }),
                    }).toString()}`
                  : ""
              }`}
              className="inline-block text-[11px] uppercase tracking-[0.2em] text-pink/70 hover:text-pink transition-colors font-[family-name:var(--font-body)]"
            >
              Open contract form &rarr;
            </a>
            <p className="mt-2 text-[11px] text-cream/25 font-[family-name:var(--font-body)]">
              Add <span className="text-cream/40">?secret=…</span> from your bookmarked URL.
            </p>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-cream/10 text-center">
          <p className="font-[family-name:var(--font-display)] italic text-[20px] text-cream/60">
            Martina
          </p>
        </div>

      </div>
    </section>
  );
}
