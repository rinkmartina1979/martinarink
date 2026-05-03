import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display text-display-md text-ink mt-12 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display text-display-sm text-ink mt-8 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-body text-ink-soft leading-[1.7] mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l border-pink/40 pl-6 italic text-ink-soft my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 text-ink-soft space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 text-ink-soft space-y-2">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-wine underline underline-offset-2 hover:text-wine-deep"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-medium text-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export function PortableTextBody({ value }: { value: unknown[] }) {
  return (
    <div className="max-w-prose">
      {/* @ts-expect-error PortableText accepts unknown[] at runtime */}
      <PortableText value={value} components={components} />
    </div>
  );
}
