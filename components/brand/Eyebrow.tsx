import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  withLine?: boolean;
}

export function Eyebrow({ children, className, withLine = false }: EyebrowProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {withLine && <span className="block h-px w-12 bg-pink" aria-hidden />}
      <span className="text-[0.6875rem] uppercase tracking-[0.22em] font-medium text-ink-quiet">
        {children}
      </span>
    </div>
  );
}
