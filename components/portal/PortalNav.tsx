"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * The private portal's own fixed header — replaces the marketing nav on
 * /members routes (hidden there in components/layout/Nav.tsx). Same height as
 * the marketing header (72/80px) so existing page top-padding still clears it.
 *
 * Entitlement-aware: areas the client cannot yet reach render muted, not linked.
 * Quiet-luxury 2026: cream surface, single sand hairline, uppercase tracked
 * labels, plum active state, horizontal scroll on mobile (no visible scrollbar).
 */

type Gate = "none" | "portal" | "programme";

const ITEMS: Array<{ label: string; suffix: string; gate: Gate }> = [
  { label: "Overview", suffix: "", gate: "none" },
  { label: "Foundation", suffix: "/workbook", gate: "portal" },
  { label: "Journal", suffix: "/journal", gate: "portal" },
  { label: "Billing", suffix: "/billing", gate: "none" },
  { label: "Schedule", suffix: "/schedule", gate: "portal" },
  { label: "Resources", suffix: "/resources", gate: "programme" },
  { label: "Learn", suffix: "/learn", gate: "portal" },
];

export interface PortalNavProps {
  token: string;
  portalAccess: boolean;
  programmeAccess: boolean;
}

export function PortalNav({ token, portalAccess, programmeAccess }: PortalNavProps) {
  const pathname = usePathname();
  const base = `/members/${token}`;

  function isEntitled(gate: Gate): boolean {
    if (gate === "none") return true;
    if (gate === "portal") return portalAccess;
    return programmeAccess;
  }

  function isActive(href: string): boolean {
    if (href === base) return pathname === base;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-sand/60">
      <div className="container-content flex items-center gap-6 h-[72px] md:h-[80px]">
        {/* Wordmark → overview */}
        <Link
          href={base}
          className="flex-shrink-0 font-[family-name:var(--font-display)] text-[18px] md:text-[22px] tracking-[0.16em] text-ink hover:text-plum transition-colors duration-200"
          aria-label="Portal home"
        >
          MARTINA RINK<span className="text-pink">.</span>
        </Link>

        {/* Nav */}
        <nav aria-label="Portal" className="flex-1 min-w-0">
          <ul className="flex items-center justify-end gap-x-5 md:gap-x-6 overflow-x-auto whitespace-nowrap no-scrollbar">
            {ITEMS.map((item) => {
              const href = `${base}${item.suffix}`;
              const entitled = isEntitled(item.gate);
              const active = entitled && isActive(href);

              if (!entitled) {
                return (
                  <li key={item.label}>
                    <span
                      aria-disabled="true"
                      title="Available once your programme begins"
                      className="text-[11px] uppercase tracking-[0.18em] text-ink-quiet/40 cursor-default select-none"
                    >
                      {item.label}
                    </span>
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-[11px] uppercase tracking-[0.18em] transition-colors duration-200",
                      active ? "text-plum" : "text-ink-quiet hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
