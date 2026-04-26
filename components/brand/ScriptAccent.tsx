import { cn } from "@/lib/utils";

interface ScriptAccentProps {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "div";
}

/**
 * Buffalo / Dancing Script accent — for "and yet.", "welcome home, love",
 * Martina signature moments. Pink #F942AA. Max 5 instances per page.
 */
export function ScriptAccent({
  children,
  className,
  as: Tag = "span",
}: ScriptAccentProps) {
  return (
    <Tag
      className={cn(
        "font-[family-name:var(--font-script)] text-pink not-italic",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
