import { Eyebrow } from "@/components/brand/Eyebrow";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Press, speaking, and partnership enquiries for Martina Rink. Client intake begins with the assessment or a private consultation.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="bg-cream pt-32 md:pt-40 pb-24 min-h-screen">
      <div className="container-content max-w-2xl">
        <Eyebrow withLine>Contact</Eyebrow>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[48px] leading-tight text-ink">
          For press, speaking, and partnerships.
        </h1>
        <p className="mt-8 text-[17px] leading-[1.75] text-ink-soft">
          If you&rsquo;d like to work with me privately, the conversation
          begins somewhere else — with the assessment, or a consultation
          request.
        </p>
        <div className="mt-6 space-y-3">
          <Link
            href="/assessment"
            className="block text-[17px] text-wine font-[family-name:var(--font-display)] italic underline decoration-pink underline-offset-4"
          >
            → Take the assessment
          </Link>
          <Link
            href="/book"
            className="block text-[17px] text-wine font-[family-name:var(--font-display)] italic underline decoration-pink underline-offset-4"
          >
            → Request a private consultation
          </Link>
        </div>

        <div className="mt-16 pt-12 border-t border-sand/50">
          <p className="text-[17px] leading-[1.75] text-ink-soft">
            For press, speaking enquiries, or partnership conversations, write
            to me at:
          </p>
          <a
            href="mailto:contact@martinarink.com"
            className="mt-4 block font-[family-name:var(--font-display)] italic text-[24px] text-wine underline decoration-pink decoration-1 underline-offset-[6px]"
          >
            contact@martinarink.com
          </a>
          <p className="mt-8 text-[15px] leading-[1.75] text-ink-soft">
            Martina Rink — UG (haftungsbeschränkt)
            <br />
            Steinkreuzstr. 26b, 76228 Karlsruhe, Germany
          </p>
          <p className="mt-8 text-[14px] uppercase tracking-[0.18em] text-ink-quiet">
            Ibiza · Berlin · Munich
          </p>
        </div>
      </div>
    </section>
  );
}
