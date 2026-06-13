"use client";

/**
 * StickyMobileCTA — persistent thumb-zone conversion bar (mobile only).
 *
 * 2026 high-ticket funnel pattern: once the hero CTAs scroll out of view on a
 * phone, the visitor loses the only path to act without scrolling back or
 * opening the menu. This bar reappears in the thumb zone after the fold.
 *
 * Behaviour:
 *  - md:hidden — at >=768px the fixed desktop nav already shows a persistent
 *    "Begin the Assessment" button, so the bar would be redundant.
 *  - Appears only after the user scrolls past ~60% of the first viewport
 *    (i.e. past the hero), so it never competes with the hero's own CTAs.
 *  - Suppressed on funnel-terminal / utility routes where a second CTA is noise.
 *  - z-40: below the nav (z-50) and the full-screen mobile menu (z-100), so an
 *    open menu cleanly covers it.
 *  - env(safe-area-inset-bottom): clears the iOS home indicator.
 *  - Hidden state is non-interactive (translate-y-full, pointer-events-none,
 *    tabIndex -1, aria-hidden) so it never traps keyboard focus off-screen.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Routes where a standing assessment CTA is redundant or intrusive. */
const SUPPRESS_PREFIXES = [
  "/assessment",
  "/apply",
  "/book",
  "/thank-you",
  "/intake",
  "/admin",
  "/studio",
];

export function StickyMobileCTA() {
  const pathname = usePathname();
  const suppressed = SUPPRESS_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (suppressed) {
      setVisible(false);
      return;
    }
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.6);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [suppressed, pathname]);

  if (suppressed) return null;

  return (
    <div
      aria-hidden={!visible}
      className={[
        "md:hidden fixed inset-x-0 bottom-0 z-40",
        "transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "translate-y-full pointer-events-none",
      ].join(" ")}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="bg-aubergine/95 backdrop-blur-sm border-t border-pink/30 px-4 py-3">
        <Link
          href="/assessment"
          tabIndex={visible ? 0 : -1}
          className="flex h-12 w-full items-center justify-center rounded-[1px]
                     bg-plum text-cream uppercase tracking-[0.18em] text-[11px] font-semibold
                     transition-colors duration-200 hover:bg-plum-deep
                     focus-visible:outline focus-visible:outline-2
                     focus-visible:outline-offset-2 focus-visible:outline-cream"
        >
          Begin the private assessment&nbsp;<span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
