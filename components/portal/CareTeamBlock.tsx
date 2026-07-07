import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { CareTeamMember } from "@/sanity/lib/membersQueries";

interface CareTeamBlockProps {
  members: CareTeamMember[];
}

export function CareTeamBlock({ members }: CareTeamBlockProps) {
  if (!members.length) return null;

  return (
    <section>
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-2">
        Your care team
      </p>
      <p className="font-[family-name:var(--font-display)] text-[24px] md:text-[28px] text-ink leading-snug mb-8">
        The two women behind your programme.
      </p>

      <div className="divide-y divide-sand/40 border-t border-b border-sand/40">
        {members.map((member) => (
          <div
            key={member._id}
            className="py-8 md:py-10 flex flex-col sm:flex-row gap-6 sm:gap-8"
          >
            {member.photo?.asset ? (
              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 relative overflow-hidden rounded-full border border-sand/50">
                <Image
                  src={urlFor(member.photo).width(192).height(192).url()}
                  alt={member.photo.alt ?? member.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div
                className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-bone border border-sand/50 flex items-center justify-center"
                aria-hidden
              >
                <span className="font-[family-name:var(--font-display)] text-[28px] text-plum">
                  {member.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-[22px] md:text-[24px] text-ink leading-snug">
                {member.name}
              </p>
              <p className="mt-1 text-[12px] uppercase tracking-[0.16em] text-plum">
                {member.role}
              </p>
              <p className="mt-4 text-[15px] leading-[1.8] text-ink-soft max-w-xl">
                {member.bio}
              </p>
              {member.availability && (
                <p className="mt-4 text-[12px] uppercase tracking-[0.1em] text-ink-quiet">
                  {member.availability}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
