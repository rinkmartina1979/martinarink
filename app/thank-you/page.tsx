import Link from "next/link";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Thank you",
  noIndex: true,
});

export default function ThankYouPage() {
  return (
    <section className="bg-cream pt-32 md:pt-40 pb-24 min-h-screen flex items-center">
      <div className="container-content max-w-2xl mx-auto text-center">
        <Eyebrow className="justify-center">A beginning</Eyebrow>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-[44px] md:text-[60px] leading-tight text-ink">
          Your letter is on its way.
        </h1>
        <ScriptAccent className="block mt-6 text-[40px] text-pink">
          a beginning.
        </ScriptAccent>
        <p className="mt-10 text-[17px] leading-[1.75] text-ink-soft">
          Check your inbox — the letter will arrive within a few minutes. If
          you don&rsquo;t see it, check your spam folder.
        </p>
        <Link
          href="/writing"
          className="mt-12 inline-block text-[14px] text-wine underline decoration-pink underline-offset-4"
        >
          Return to the journal →
        </Link>
      </div>
    </section>
  );
}
