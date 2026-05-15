import Link from "next/link";
import { cn } from "@/lib/utils";

interface PlumButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-[1px] " +
  "bg-plum text-cream uppercase tracking-[0.2em] font-medium text-[0.75rem] " +
  "px-8 py-4 md:px-12 md:py-[18px] min-h-[44px] min-w-[44px] " +
  "transition-all duration-300 ease-out hover:bg-plum-deep hover:tracking-[0.25em] " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

export function PlumButton({
  children,
  href,
  onClick,
  className,
  type = "button",
  disabled,
}: PlumButtonProps) {
  if (href) {
    return (
      <Link href={href} className={cn(baseClasses, className)}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, className)}
    >
      {children}
    </button>
  );
}
