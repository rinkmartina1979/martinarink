"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MobileMenuProps {
  links: { label: string; href: string }[];
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
      >
        <span className="block h-px w-6 bg-ink" />
        <span className="block h-px w-6 bg-ink" />
        <span className="block h-px w-6 bg-ink" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-ink flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="container-content flex items-center justify-between h-[72px] shrink-0">
              <span className="font-[family-name:var(--font-display)] text-[20px] tracking-[0.06em] text-cream">
                MARTINA RINK<span className="text-pink">.</span>
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="text-cream text-2xl w-10 h-10 flex items-center justify-center"
              >
                ×
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
                    className="bg-cream/5 border border-sand/20 p-4 text-center"
                  >
                    <span className="block font-[family-name:var(--font-display)] italic text-[24px] text-pink-soft">
                      I.
                    </span>
                    <span className="block text-[13px] text-cream mt-2 leading-tight">
                      The Sober Muse Method
                    </span>
                    <span className="block text-[11px] text-cream/50 mt-1">
                      from €5,000
                    </span>
                  </Link>
                  <Link
                    href="/empowerment"
                    onClick={close}
                    className="bg-cream/5 border border-sand/20 p-4 text-center"
                  >
                    <span className="block font-[family-name:var(--font-display)] italic text-[24px] text-pink-soft">
                      II.
                    </span>
                    <span className="block text-[13px] text-cream mt-2 leading-tight">
                      Female Empowerment &amp; Leadership
                    </span>
                    <span className="block text-[11px] text-cream/50 mt-1">
                      from €7,500
                    </span>
                  </Link>
                </div>
              </div>

              {/* Primary CTA */}
              <Link
                href="/assessment"
                onClick={close}
                className="mt-4 inline-flex items-center justify-center bg-wine text-cream uppercase tracking-[0.18em] text-[11px] font-medium px-10 py-4 rounded-[1px] w-full max-w-xs text-center"
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
