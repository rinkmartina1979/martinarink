import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full text-center">
        {/* Script accent */}
        <p className="font-[family-name:var(--font-script)] text-[38px] md:text-[48px] text-ink leading-none mb-8">
          Somewhere else.
        </p>

        {/* Headline */}
        <h1 className="font-[family-name:var(--font-display)] text-[44px] md:text-[56px] leading-[1.1] text-ink mb-8">
          The page you were looking for isn&rsquo;t here.
        </h1>

        {/* Body */}
        <p className="text-[18px] leading-[1.75] text-ink-soft mb-14">
          It may have moved, or the link may have changed. The work is still here
          — it just lives somewhere else.
        </p>

        {/* Navigation grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Link
            href="/assessment"
            className="bg-bone border border-sand/50 px-6 py-5 text-[14px] text-plum hover:text-plum-deep hover:border-sand/80 transition-colors leading-snug"
          >
            The assessment
          </Link>
          <Link
            href="/writing"
            className="bg-bone border border-sand/50 px-6 py-5 text-[14px] text-plum hover:text-plum-deep hover:border-sand/80 transition-colors leading-snug"
          >
            The writing
          </Link>
          <Link
            href="/work-with-me"
            className="bg-bone border border-sand/50 px-6 py-5 text-[14px] text-plum hover:text-plum-deep hover:border-sand/80 transition-colors leading-snug"
          >
            Work with me
          </Link>
        </div>

        {/* Home link */}
        <p className="text-[14px] text-ink-quiet">
          Or start at the beginning —{" "}
          <Link
            href="/"
            className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
          >
            home
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
