import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { AudioPlayer } from "@/components/brand/AudioPlayer";
import {
  getAudioDrop,
  getAudioDropsForClient,
} from "@/sanity/lib/membersQueries";

export const metadata = buildMetadata({ noIndex: true });

interface AudioDropPageProps {
  params: Promise<{ token: string; dropId: string }>;
}

interface VerifyResponse {
  valid: boolean;
  reason?: string;
  clientId?: string;
  firstName?: string;
  programme?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ExpiredPage() {
  return (
    <section className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="font-[family-name:var(--font-script)] text-[32px] text-pink leading-none mb-6">
          Unavailable.
        </p>
        <p className="text-[18px] leading-[1.75] text-ink-soft">
          This link has expired or is no longer active. If you believe this is an
          error, please{" "}
          <Link
            href="/contact"
            className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
          >
            get in touch
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function AccessDeniedPage({ token }: { token: string }) {
  return (
    <section className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="text-[18px] leading-[1.75] text-ink-soft mb-6">
          This recording is not available on your programme.
        </p>
        <Link
          href={`/members/${token}`}
          className="text-[14px] text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
        >
          ← Back to your library
        </Link>
      </div>
    </section>
  );
}

export default async function AudioDropPage({ params }: AudioDropPageProps) {
  const { token, dropId } = await params;

  // Verify token
  let verify: VerifyResponse;
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/members/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });
    verify = await res.json();
  } catch {
    return <ExpiredPage />;
  }

  if (!verify.valid || !verify.clientId || !verify.programme) {
    return <ExpiredPage />;
  }

  const { clientId, programme } = verify;

  // Fetch the drop and the client's allowed drops in parallel
  const [drop, clientDrops] = await Promise.all([
    getAudioDrop(dropId),
    getAudioDropsForClient(clientId, programme),
  ]);

  if (!drop || !drop.audioUrl) {
    return <AccessDeniedPage token={token} />;
  }

  // Verify access — the drop must appear in this client's allowed list
  const allowed = (clientDrops ?? []).some((d) => d.slug === dropId);
  if (!allowed) {
    return <AccessDeniedPage token={token} />;
  }

  return (
    <div className="bg-cream min-h-screen">
      <article className="pt-28 md:pt-36 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Eyebrow */}
          <Eyebrow className="mb-6">Private recording</Eyebrow>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-display)] text-[40px] md:text-[52px] leading-tight text-ink mb-3">
            {drop.title}
          </h1>

          {/* Release date */}
          <p className="text-[14px] text-ink-quiet mb-10">
            {formatDate(drop.releasedAt)}
          </p>

          {/* Player */}
          <AudioPlayer
            src={drop.audioUrl}
            title={drop.title}
            duration={drop.durationSeconds ?? 0}
            transcript={drop.transcript ?? undefined}
          />

          {/* Description */}
          {drop.description && (
            <div className="mt-10 border-t border-sand/30 pt-8">
              <p className="text-[17px] leading-[1.75] text-ink-soft">
                {drop.description}
              </p>
            </div>
          )}

          {/* Back link */}
          <div className="mt-14 pt-8 border-t border-sand/30">
            <Link
              href={`/members/${token}`}
              className="text-[14px] text-ink-quiet hover:text-plum transition-colors"
            >
              ← Back to your library
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
