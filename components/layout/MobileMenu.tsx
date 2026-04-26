"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface MobileMenuProps {
  links: { label: string; href: string }[];
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

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
            className="fixed inset-0 z-[100] bg-ink flex flex-col"
          >
            <div className="container-content flex items-center justify-between h-[72px]">
              <span className="font-[family-name:var(--font-display)] text-[20px] tracking-[0.06em] text-cream">
                MARTINA RINK<span className="text-pink">.</span>
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-cream text-2xl"
              >
                ×
              </button>
            </div>

            <nav className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-[family-name:var(--font-display)] text-[40px] text-cream hover:text-pink transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/work-with-me"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex items-center justify-center bg-cream text-ink uppercase tracking-[0.18em] text-[12px] font-medium px-10 py-4 rounded-[1px]"
              >
                Apply
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
