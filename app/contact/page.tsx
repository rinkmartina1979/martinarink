import type { Metadata } from "next";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { buildMetadata } from "@/lib/metadata";
import Link from "next/link";
import { getContactPage } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactPage();
  if (data?.seo?.seoTitle) {
    return buildMetadata({
      title: data.seo.seoTitle,
      description: data.seo.seoDescription ?? undefined,
      path: "/contact",
    });
  }
  return buildMetadata({
    title: "Contact",
    description:
      "Press, speaking, and partnership enquiries for Martina Rink. Client intake begins with the assessment or a private consultation.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const data = await getContactPage();

  const headline = data?.headline ?? "For press, speaking, and partnerships.";
  const subheadline =
    data?.subheadline ??
    "If you’d like to work with me privately, the conversation begins somewhere else — with the assessment, or a consultation request.";
  const pressInquiryCopy =
    data?.pressInquiryCopy ??
    "For press, speaking enquiries, or partnership conversations, write to me at:";

  return (
    <section className="bg-cream pt-32 md:pt-40 pb-24 min-h-screen">
      <div className="container-content max-w-2xl">
        <Eyebrow withLine>Contact</Eyebrow>
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[48px] leading-tight text-ink">
          {headline}
        </h1>
        <p className="mt-8 text-[17px] leading-[1.75] text-ink-soft">
          {subheadline}
        </p>
        <div className="mt-6 space-y-3">
          <Link
            href="/assessment"
            className="block text-[17px] text-plum font-[family-name:var(--font-display)] italic underline decoration-pink underline-offset-4"
          >
            → Take the assessment
          </Link>
          <Link
            href="/book"
            className="block text-[17px] text-plum font-[family-name:var(--font-display)] italic underline decoration-pink underline-offset-4"
          >
            → Request a private consultation
          </Link>
        </div>

        <div className="mt-16 pt-12 border-t border-sand/50">
          <p className="text-[17px] leading-[1.75] text-ink-soft">
            {pressInquiryCopy}
          </p>
          <a
            href="mailto:contact@martinarink.com"
            className="mt-4 block font-[family-name:var(--font-display)] italic text-[24px] text-plum underline decoration-pink decoration-1 underline-offset-[6px]"
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
