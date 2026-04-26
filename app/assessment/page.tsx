import { Eyebrow } from "@/components/brand/Eyebrow";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "The Private Assessment",
  description:
    "Seven questions. About four minutes. At the end, a letter — written specifically for where you are. Not a quiz. A beginning.",
  path: "/assessment",
});

const TALLY_FORM_ID = process.env.NEXT_PUBLIC_TALLY_FORM_ID || "";

export default function AssessmentPage() {
  return (
    <>
      <section className="bg-ink pt-32 md:pt-40 pb-16">
        <div className="container-content max-w-2xl mx-auto text-center">
          <Eyebrow className="justify-center">
            <span className="text-pink-soft">A private assessment</span>
          </Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[60px] leading-[1.05] text-cream">
            Where are you,{" "}
            <ScriptAccent className="text-[1.1em]">really?</ScriptAccent>
          </h1>
          <p className="mt-8 text-[17px] leading-[1.75] text-cream/85">
            Seven questions. About four minutes. At the end, a letter — written
            specifically for where you are.
          </p>
          <p className="mt-4 text-[15px] text-cream/70">
            Not a quiz. Not a quadrant. A beginning.
          </p>
        </div>
      </section>

      <section className="bg-cream py-12 md:py-20">
        <div className="container-content max-w-3xl mx-auto">
          <p className="text-[15px] text-ink-quiet text-center mb-10">
            Your answers are private. Unsubscribing is one click, always.
          </p>

          {TALLY_FORM_ID ? (
            <div className="bg-bone p-2">
              <iframe
                src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1`}
                title="The Private Assessment"
                width="100%"
                height="700"
                className="border-0 block w-full"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="bg-bone p-12 text-center">
              <p className="text-[14px] uppercase tracking-[0.18em] text-ink-quiet">
                Assessment placeholder — connect Tally form ID via{" "}
                <code>NEXT_PUBLIC_TALLY_FORM_ID</code> to activate
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
