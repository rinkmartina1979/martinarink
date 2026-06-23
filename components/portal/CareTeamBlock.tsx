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
      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-quiet mb-6">
        Your care team
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {members.map((member) => (
          <div
            key={member._id}
            className="bg-bone border border-sand/30 p-6 flex gap-5 items-start"
          >
            {member.photo?.asset ? (
              <div className="flex-shrink-0 w-14 h-14 relative overflow-hidden rounded-full">
                <Image
                  src={urlFor(member.photo).width(112).height(112).url()}
                  alt={member.photo.alt ?? member.name}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div
                className="flex-shrink-0 w-14 h-14 rounded-full bg-sand/40 flex items-center justify-center"
                aria-hidden
              >
                <span className="font-[family-name:var(--font-display)] text-[20px] text-ink-quiet">
                  {member.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink-quiet mb-1">
                {member.role}
              </p>
              <p className="font-[family-name:var(--font-display)] text-[18px] text-ink leading-snug mb-2">
                {member.name}
              </p>
              <p className="text-[14px] leading-[1.7] text-ink-soft">
                {member.bio}
              </p>
              {member.availability && (
                <p className="mt-3 text-[12px] text-ink-quiet tracking-[0.04em]">
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
