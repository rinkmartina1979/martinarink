import { buildMetadata } from "@/lib/metadata";
import { Eyebrow } from "@/components/brand/Eyebrow";
import { PortalRecoveryForm } from "@/components/portal/PortalRecoveryForm";

export const metadata = buildMetadata({ noIndex: true });

export default function PortalAccessPage() {
  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-28 md:pt-36 pb-12 px-6 border-b border-sand/30">
        <div className="max-w-xl mx-auto">
          <Eyebrow className="mb-5">Private portal</Eyebrow>
          <h1 className="font-[family-name:var(--font-display)] text-[40px] md:text-[52px] text-ink leading-[1.05]">
            Access your private portal.
          </h1>
          <p className="mt-6 text-[16px] leading-[1.75] text-ink-soft font-[family-name:var(--font-body)]">
            Enter the email connected to your programme and we&rsquo;ll send a fresh private link.
            Your previous link stops working once a new one is issued.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-xl mx-auto">
          <PortalRecoveryForm />
          <p className="mt-8 text-[13px] leading-[1.65] text-ink-quiet font-[family-name:var(--font-body)]">
            Your link is private to you. Please don&rsquo;t share it. If you need anything else,
            you can reach Martina at{" "}
            <a
              href="mailto:contact@martinarink.com"
              className="text-plum underline underline-offset-4 hover:text-plum-deep transition-colors"
            >
              contact@martinarink.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
