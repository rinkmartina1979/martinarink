import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[16px] leading-[1.75] text-ink-soft mb-4 last:mb-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-[family-name:var(--font-display)] text-[24px] text-ink mt-10 mb-3 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-[family-name:var(--font-display)] text-[20px] text-ink mt-8 mb-2 first:mt-0">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-pink pl-6 italic text-[17px] leading-[1.75] text-ink-soft my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="space-y-2 pl-5 list-disc text-[16px] leading-[1.75] text-ink-soft mb-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="space-y-2 pl-5 list-decimal text-[16px] leading-[1.75] text-ink-soft mb-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
};

interface PortableTextBodyProps {
  value: unknown[];
  className?: string;
}

export function PortableTextBody({ value, className }: PortableTextBodyProps) {
  return (
    <div className={className}>
      <PortableText value={value as Parameters<typeof PortableText>[0]["value"]} components={components} />
    </div>
  );
}
