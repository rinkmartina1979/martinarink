import Link from "next/link";
import type { MemberAudioDrop } from "@/sanity/lib/membersQueries";

/**
 * Quiet shelf of the client's recordings/resources. Calm empty state.
 */
export function ResourceShelf({
  drops,
  token,
}: {
  drops: MemberAudioDrop[] | null;
  token: string;
}) {
  const items = (drops ?? []).slice(0, 4);

  return (
    <div className="bg-bone border border-sand/40 p-6 rounded-[1px]">
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-4">Your resources</p>

      {items.length === 0 ? (
        <p className="text-[14px] leading-[1.7] text-ink-soft font-[family-name:var(--font-body)]">
          Recordings and resources Martina prepares for you will appear here.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((drop) => (
            <li key={drop._id}>
              <Link
                href={`/members/${token}/audio/${drop.slug}`}
                className="group flex items-baseline justify-between gap-4"
              >
                <span className="text-[15px] text-ink group-hover:text-plum transition-colors">
                  {drop.title}
                </span>
                <span className="flex-shrink-0 text-[12px] text-ink-quiet">Listen →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 border-t border-sand/30 pt-4">
        {drops && drops.length >= 4 && (
          <Link
            href={`/members/${token}/resources`}
            className="text-[13px] text-plum hover:text-plum-deep transition-colors"
          >
            All resources →
          </Link>
        )}
        <Link
          href={`/members/${token}/learn`}
          className="text-[13px] text-ink-quiet hover:text-ink transition-colors"
        >
          Facts about Alcohol & Women →
        </Link>
      </div>
    </div>
  );
}
