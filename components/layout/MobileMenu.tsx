"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MobileMenuProps {
  links: { label: string; href: string }[];
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef  = useRef<HTMLButtonElement>(null);
  const closeRef    = useRef<HTMLButtonElement>(null);
  const menuRef     = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    // Return focus to the hamburger that opened the menu
    setTimeout(() => triggerRef.current?.focus(), 50);
  };

  // Focus trap + initial focus
  useEffect(() => {
    if (!open) return;
    // Move initial focus to close button
    setTimeout(() => closeRef.current?.focus(), 310); // after entrance animation

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const menu = menuRef.current;
      if (!menu) return;
      const focusable = Array.from(
        menu.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null); // only visible elements
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { last.focus(); e.preventDefault(); }
      } else {
        if (document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="md:hidden flex flex-col items-center justify-center gap-[5px] p-2 -mr-2 min-h-[44px] min-w-[44px]"
      >
        <span className="block h-px w-6 bg-ink" />
        <span className="block h-px w-6 bg-ink" />
        <span className="block h-px w-6 bg-ink" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-aubergine flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="container-content flex items-center justify-between h-[88px] shrink-0">
              <span className="font-[family-name:var(--font-display)] text-[20px] tracking-[0.06em] text-cream">
                MARTINA RINK<span className="text-pink">.</span>
              </span>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="text-cream text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center hover:text-pink transition-colors"
              >
                <span aria-hidden>×</span>
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-12">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="font-[family-name:var(--font-display)] text-[38px] text-cream hover:text-pink transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Work With Me — expanded in mobile */}
              <div className="w-full border-t border-sand/20 pt-6 mt-2">
                <p className="text-[10px] uppercase tracking-[0.22em] text-cream/50 text-center mb-5">
                  Work With Me
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/sober-muse"
                    onClick={close}
                    className="bg-cream/10 border border-cream/20 p-4 text-center hover:bg-cream/15 transition-colors"
                  >
                    <span className="block font-[family-name:var(--font-display)] italic text-[24px] text-pink-soft">
                      I.
                    </span>
                    <span className="block text-[13px] text-cream mt-2 leading-tight">
                      The Sober Muse Method
                    </span>
                    <span className="block text-[11px] text-cream/50 mt-1">
                      Private · By application
                    </span>
                  </Link>
                  <Link
                    href="/empowerment"
                    onClick={close}
                    className="bg-cream/10 border border-cream/20 p-4 text-center hover:bg-cream/15 transition-colors"
                  >
                    <span className="block font-[family-name:var(--font-display)] italic text-[24px] text-pink-soft">
                      II.
                    </span>
                    <span className="block text-[13px] text-cream mt-2 leading-tight">
                      Female Empowerment &amp; Leadership
                    </span>
                    <span className="block text-[11px] text-cream/50 mt-1">
                      Private · By application
                    </span>
                  </Link>
                </div>
              </div>

              {/* Primary CTA */}
              <Link
                href="/assessment"
                onClick={close}
                className="mt-4 inline-flex items-center justify-center bg-plum text-cream uppercase tracking-[0.18em] text-[11px] font-medium px-10 py-4 rounded-[1px] w-full max-w-xs text-center"
              >
                Begin the Assessment
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
