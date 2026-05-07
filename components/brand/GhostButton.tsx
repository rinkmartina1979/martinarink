import Link from "next/link";
import { cn } from "@/lib/utils";

interface GhostButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "dark" | "light";
}

export function GhostButton({
  children,
  href,
  onClick,
  className,
  variant = "dark",
}: GhostButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-[1px] " +
    "uppercase tracking-[0.18em] font-medium text-[0.75rem] " +
    "px-7 py-4 md:px-9 md:py-4 min-h-[44px] min-w-[44px] " +
    "border transition-all duration-300 ease-out";

  const variantClasses =
    variant === "dark"
      ? "border-ink text-ink hover:bg-ink hover:text-cream"
      : "border-cream text-cream hover:bg-cream hover:text-ink";

  if (href) {
    return (
      <Link href={href} className={cn(base, variantClasses, className)}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cn(base, variantClasses, className)}>
      {children}
    </button>
  );
}
