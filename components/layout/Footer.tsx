import Link from "next/link";
import { ScriptAccent } from "@/components/brand/ScriptAccent";
import { SITE } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="container-content py-20 md:py-24">
        <div className="grid md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand column */}
          <div>
            <p className="font-[family-name:var(--font-display)] text-[20px] tracking-[0.04em]">
              MARTINA RINK<span className="text-pink">.</span>
            </p>
            <p className="mt-3 text-[13px] text-cream/70 leading-relaxed">
              Private mentoring for the woman who has built the life and is,
              quietly, ready for the next chapter of it.
            </p>
          </div>

          {/* The Work */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cream/50 mb-5">
              The work
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/sober-muse"
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                >
                  Sober Muse
                </Link>
              </li>
              <li>
                <Link
                  href="/empowerment"
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                >
                  Female Empowerment
                </Link>
              </li>
              <li>
                <Link
                  href="/assessment"
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                >
                  Assessment
                </Link>
              </li>
              <li>
                <Link
                  href="/work-with-me"
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                >
                  Apply
                </Link>
              </li>
            </ul>
          </div>

          {/* Writing */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cream/50 mb-5">
              Writing
            </p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/writing"
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                >
                  Journal
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                >
                  Letters
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="/press#speaking"
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                >
                  Speaking
                </Link>
              </li>
            </ul>
          </div>

          {/* Find me */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cream/50 mb-5">
              Find me
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={SITE.social.instagram}
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={SITE.social.linkedin}
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={SITE.social.facebook}
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={SITE.social.xing}
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xing
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-[14px] text-cream/85 hover:text-pink transition-colors"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-sand/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-[12px] text-cream/50">
            © 2026 Martina Rink &middot; Ibiza · Berlin · Munich
          </div>
          <div className="flex flex-wrap gap-6 text-[12px] uppercase tracking-[0.15em]">
            <Link href="/legal/privacy" className="text-cream/50 hover:text-cream">
              Privacy
            </Link>
            <Link href="/legal/imprint" className="text-cream/50 hover:text-cream">
              Imprint
            </Link>
            <Link href="/legal/terms" className="text-cream/50 hover:text-cream">
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <ScriptAccent className="text-[28px] text-pink/70">
            Martina
          </ScriptAccent>
        </div>
      </div>
    </footer>
  );
}
