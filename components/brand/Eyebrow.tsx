import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  withLine?: boolean;
  /** Use "light" on dark backgrounds (plum, ink) */
  variant?: "default" | "light";
}

export function Eyebrow({ children, className, withLine = false, variant = "default" }: EyebrowProps) {
  const textColor = variant === "light" ? "text-cream/60" : "text-ink-quiet";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {withLine && <span className="block h-px w-12 bg-pink" aria-hidden />}
      <span className={cn("text-[0.6875rem] uppercase tracking-[0.22em] font-medium", textColor)}>
        {children}
      </span>
    </div>
  );
}
