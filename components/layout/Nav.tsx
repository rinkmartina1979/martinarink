"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PlumButton } from "@/components/brand/PlumButton";
import { MobileMenu } from "./MobileMenu";
import { NavDropdown } from "./NavDropdown";
import { cn } from "@/lib/utils";

// Order: About → Work With Me (dropdown) → Press → Writing
const NAV_LINKS_LEFT  = [{ label: "About", href: "/about" }];
const NAV_LINKS_RIGHT = [
  { label: "Press",   href: "/press" },
  { label: "Writing", href: "/writing" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cream/90 backdrop-blur-md border-b border-sand/40"
          : "bg-transparent",
      )}
    >
      <div className="container-content flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-[20px] tracking-[0.06em] text-ink"
          aria-label="Martina Rink home"
        >
          MARTINA RINK<span className="text-pink">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS_LEFT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] uppercase tracking-[0.12em] font-medium text-ink hover:text-pink transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <NavDropdown />
          {NAV_LINKS_RIGHT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] uppercase tracking-[0.12em] font-medium text-ink hover:text-pink transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <PlumButton href="/assessment" className="!px-6 !py-3 !text-[11px] !tracking-[0.18em]">
            Begin the Assessment
          </PlumButton>
        </nav>

        {/* Mobile */}
        <MobileMenu links={[...NAV_LINKS_LEFT, ...NAV_LINKS_RIGHT]} />
      </div>
    </header>
  );
}
