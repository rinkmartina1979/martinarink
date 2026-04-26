"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Eyebrow } from "@/components/brand/Eyebrow";

export default function BookPage() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "martinarink" });
      const brandVars = {
        "cal-brand": "#6B2737",
        "cal-brand-emphasis": "#521E2B",
        "cal-text-emphasis": "#1E1B17",
        "cal-text": "#4A3728",
        "cal-border": "#C8B8A2",
        "cal-text-subtle": "#8A7F72",
        "cal-bg": "#F7F3EE",
        "cal-bg-subtle": "#EDE8E0",
        "cal-bg-emphasis": "#1E1B17",
      };
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: { light: brandVars, dark: brandVars },
        hideEventTypeDetails: false,
      });
    })();
  }, []);

  const calLink =
    process.env.NEXT_PUBLIC_CAL_LINK || "martinarink/private-consultation";

  return (
    <>
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

      <section className="bg-cream pb-24">
        <div className="container-content max-w-3xl mx-auto">
          <div className="bg-bone p-2">
            <Cal
              namespace="martinarink"
              calLink={calLink}
              style={{ width: "100%", height: "100%", minHeight: "650px" }}
              config={{ layout: "month_view" }}
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
