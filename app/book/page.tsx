import { Eyebrow } from "@/components/brand/Eyebrow";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Book a Consultation",
  noIndex: true,
});

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/martinarink/let-s-make-a-change";

export default function BookPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-cream pt-32 md:pt-40 pb-12">
        <div className="container-content max-w-2xl mx-auto text-center">
          <Eyebrow className="justify-center" withLine>
            A private conversation
          </Eyebrow>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-[40px] md:text-[52px] leading-tight text-ink">
            A forty-five minute conversation, before anything else.
          </h1>
          <p className="mt-8 text-[17px] leading-[1.75] text-ink-soft">
            This is not a sales call, and it is not complimentary coaching.
            It&rsquo;s a genuine conversation — about where you are, what
            you&rsquo;re considering, and whether working together is right for
            both of us. I hold four of these a week.
          </p>
          <p className="mt-6 text-[15px] text-ink-quiet">
            €450, applied to the programme if you proceed.
          </p>
        </div>
      </section>

      {/* ── CALENDLY EMBED ───────────────────────────────────── */}
      <section className="bg-cream pb-24">
        <div className="container-content max-w-3xl mx-auto">
          <div className="bg-bone p-2">
            <iframe
              src={`${CALENDLY_URL}?hide_event_type_details=0&hide_gdpr_banner=1&primary_color=6B2737&text_color=1E1B17&background_color=F7F3EE`}
              title="Book a private consultation with Martina Rink"
              width="100%"
              style={{ minHeight: "700px", border: "none", display: "block" }}
              loading="lazy"
              allow="payment"
            />
          </div>
          <p className="mt-8 text-center text-[14px] text-ink-quiet leading-relaxed">
            If, after our conversation, the timing doesn&rsquo;t feel right —
            I&rsquo;ll say so, warmly. The fit matters as much to me as it does
            to you.
          </p>
        </div>
      </section>
    </>
  );
}
