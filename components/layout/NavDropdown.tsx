"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef } from "react";

export function NavDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleClose = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
    >
      {/* Trigger */}
      <button
        type="button"
        className="flex items-center gap-1.5 text-[13px] uppercase tracking-[0.12em] font-medium text-ink hover:text-pink transition-colors duration-200"
        aria-expanded={open}
        aria-haspopup="true"
      >
        Work With Me
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[540px] bg-cream border border-sand/60 shadow-sm"
            role="menu"
          >
            <div className="grid grid-cols-2 divide-x divide-sand/60">
              {/* Panel I — Sober Muse */}
              <Link
                href="/sober-muse"
                onClick={() => setOpen(false)}
                className="p-8 group hover:bg-bone transition-colors duration-200"
                role="menuitem"
              >
                <span className="block font-[family-name:var(--font-display)] italic text-[36px] leading-none text-pink-soft">
                  I.
                </span>
                <span className="mt-4 block font-[family-name:var(--font-display)] text-[18px] text-ink leading-tight">
                  The Sober Muse Method
                </span>
                <span className="mt-2 block text-[12px] text-ink-quiet tracking-wide">
                  90 days · private · from €5,000
                </span>
                <span className="mt-5 block text-[12px] text-wine group-hover:text-pink transition-colors">
                  Explore →
                </span>
              </Link>

              {/* Panel II — Empowerment */}
              <Link
                href="/empowerment"
                onClick={() => setOpen(false)}
                className="p-8 group hover:bg-bone transition-colors duration-200"
                role="menuitem"
              >
                <span className="block font-[family-name:var(--font-display)] italic text-[36px] leading-none text-pink-soft">
                  II.
                </span>
                <span className="mt-4 block font-[family-name:var(--font-display)] text-[18px] text-ink leading-tight">
                  Female Empowerment &amp; Leadership
                </span>
                <span className="mt-2 block text-[12px] text-ink-quiet tracking-wide">
                  6–12 months · private · from €7,500
                </span>
                <span className="mt-5 block text-[12px] text-wine group-hover:text-pink transition-colors">
                  Explore →
                </span>
              </Link>
            </div>

            {/* Bottom strip */}
            <div className="border-t border-sand/60 px-8 py-4 flex items-center justify-between">
              <span className="text-[11px] text-ink-quiet">
                Not sure which applies to you?
              </span>
              <Link
                href="/assessment"
                onClick={() => setOpen(false)}
                className="text-[11px] uppercase tracking-[0.14em] text-wine hover:text-pink transition-colors"
              >
                Begin the assessment →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
