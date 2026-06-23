import Link from "next/link";
import type { MemberAudioDrop, ProgrammeResource } from "@/sanity/lib/membersQueries";

// ── Inline SVG icons ─────────────────────────────────────────

function AudioIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="flex-shrink-0">
      <path d="M11 3.5a4.5 4.5 0 010 9M8 2v12M5 4.5a4.5 4.5 0 000 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="flex-shrink-0">
      <path d="M4 2h5.5L12 4.5V14H4V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M9 2v3h3M6 7h4M6 9.5h4M6 12h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="flex-shrink-0">
      <path d="M6.5 9.5a3.5 3.5 0 004.95 0l1.5-1.5a3.5 3.5 0 00-4.95-4.95L7 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M9.5 6.5a3.5 3.5 0 00-4.95 0L3 8a3.5 3.5 0 004.95 4.95L9 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function WorkbookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="flex-shrink-0">
      <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M6 5h4M6 7.5h4M6 10h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M3 4h1M3 8h1M3 12h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="flex-shrink-0">
      <rect x="1.5" y="3.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M10.5 6l4-2v8l-4-2V6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────

type CombinedResource =
  | { kind: "audio"; id: string; title: string; description: string | null; date: string; slug: string; duration: number | null }
  | { kind: "document" | "workbook" | "link" | "video"; id: string; title: string; description: string | null; date: string; href: string };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDuration(seconds: number | null): string | null {
  if (!seconds) return null;
  return `${Math.ceil(seconds / 60)} min`;
}

const TYPE_LABELS: Record<string, string> = {
  audio: "Recording",
  document: "Document",
  workbook: "Workbook",
  link: "Reading",
  video: "Video",
};

function TypeIcon({ kind }: { kind: string }) {
  if (kind === "audio") return <AudioIcon />;
  if (kind === "document") return <DocumentIcon />;
  if (kind === "workbook") return <WorkbookIcon />;
  if (kind === "video") return <VideoIcon />;
  return <LinkIcon />;
}

// ── Props ─────────────────────────────────────────────────────

interface ResourceListProps {
  audioDrops: MemberAudioDrop[] | null;
  programmeResources: ProgrammeResource[] | null;
  token: string;
}

export function ResourceList({ audioDrops, programmeResources, token }: ResourceListProps) {
  const combined: CombinedResource[] = [
    ...(audioDrops ?? []).map((d) => ({
      kind: "audio" as const,
      id: d._id,
      title: d.title,
      description: d.description,
      date: d.releasedAt,
      slug: d.slug,
      duration: d.durationSeconds,
    })),
    ...(programmeResources ?? []).map((r) => ({
      kind: r.type,
      id: r._id,
      title: r.title,
      description: r.description,
      date: r.publishedAt,
      href: r.assetUrl ?? r.externalUrl ?? "#",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!combined.length) {
    return (
      <p className="text-[15px] text-ink-quiet leading-[1.75] py-8 border-t border-sand/20">
        Martina will add resources here as your programme develops.
      </p>
    );
  }

  return (
    <div className="space-y-px">
      {combined.map((item) => {
        const isAudio = item.kind === "audio";
        const href = isAudio
          ? `/members/${token}/audio/${(item as { slug: string }).slug}`
          : (item as { href: string }).href;
        const isExternal = !isAudio && (item as { href: string }).href !== "#" && !(item as { href: string }).href.startsWith("/");

        return (
          <Link
            key={item.id}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="flex items-start gap-4 px-5 py-4 bg-bone border border-sand/20 hover:border-ink-soft/30 hover:bg-cream transition-colors duration-150 group"
          >
            <span className="mt-0.5 text-ink-quiet group-hover:text-ink transition-colors">
              <TypeIcon kind={item.kind} />
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] uppercase tracking-[0.16em] text-ink-quiet">
                  {TYPE_LABELS[item.kind] ?? item.kind}
                </span>
                {isAudio && (item as { duration: number | null }).duration && (
                  <>
                    <span className="text-ink-quiet/40 text-[10px]">·</span>
                    <span className="text-[10px] text-ink-quiet">
                      {formatDuration((item as { duration: number | null }).duration)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[15px] text-ink leading-snug group-hover:text-plum transition-colors">
                {item.title}
              </p>
              {item.description && (
                <p className="mt-1 text-[13px] text-ink-quiet leading-[1.6] line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            <span className="flex-shrink-0 text-[11px] text-ink-quiet/60 mt-1 hidden sm:block">
              {formatDate(item.date)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
