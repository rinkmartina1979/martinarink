import Link from "next/link";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { PlumButton } from "@/components/brand/PlumButton";
import { GhostButton } from "@/components/brand/GhostButton";

export default function NotFound() {
  return (
    <section className="bg-cream min-h-screen flex items-center pt-24 pb-24">
      <div className="container-content max-w-2xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
          404
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[48px] md:text-[64px] leading-tight text-ink">
          This page does not exist.
        </h1>
        <ScriptAccent className="block mt-4 text-[42px] text-pink">
          but you do.
        </ScriptAccent>
        <p className="mt-10 text-[17px] leading-[1.75] text-ink-soft max-w-md mx-auto">
          Perhaps you were looking for the assessment, or for the work itself.
          Either way — you have arrived somewhere.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <PlumButton href="/assessment">Begin the assessment</PlumButton>
          <GhostButton href="/">Return home</GhostButton>
        </div>
        <div className="mt-16 pt-8 border-t border-sand/40">
          <Link
            href="/writing"
            className="text-[14px] text-ink-quiet hover:text-ink transition-colors underline underline-offset-4"
          >
            Or read the writing →
          </Link>
        </div>
      </div>
    </section>
  );
}
