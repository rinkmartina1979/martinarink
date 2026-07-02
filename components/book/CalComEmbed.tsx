"use client";

/**
 * CalComEmbed — inline Cal.com booking iframe.
 *
 * Cal.com is the single booking source across the site (replaces Calendly,
 * 2026 migration). Unlike the old Calendly free-tier workaround, booking
 * confirmation here is NOT read from postMessage — it is written server-side
 * by the signed Cal.com webhook (/api/webhooks/calcom), which is available on
 * Cal.com's free plan. The iframe is presentation only.
 *
 * `url` — full Cal.com booking link, e.g. https://cal.com/martinarink/30min
 */

interface CalComEmbedProps {
  url: string;
}

export function CalComEmbed({ url }: CalComEmbedProps) {
  const embedUrl = new URL(url);
  embedUrl.searchParams.set("embed", "true");
  embedUrl.searchParams.set("theme", "light");
  embedUrl.searchParams.set("layout", "month_view");

  return (
    <iframe
      src={embedUrl.toString()}
      title="Book a private session with Martina Rink"
      width="100%"
      style={{ minHeight: "700px", border: "none", display: "block" }}
      loading="lazy"
    />
  );
}
