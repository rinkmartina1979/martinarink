import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditingClient } from "@/components/sanity/VisualEditingClient";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { playfair, dmSans, dancingScript } from "@/lib/fonts";
import { buildMetadata, personSchema, organizationSchema } from "@/lib/metadata";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { NewsletterPopup } from "@/components/brand/NewsletterPopup";
import "./globals.css";

// Root layout metadata — LIVE. noIndex: false (default). Page-level overrides this.
export const metadata: Metadata = buildMetadata();

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${dancingScript.variable} antialiased`}
    >
      <body className="bg-cream text-ink min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-plum focus:text-cream focus:rounded-[1px] focus:text-[13px] focus:uppercase focus:tracking-[0.18em]"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <Nav />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        {/* Editorial newsletter popup — self-suppresses on /assessment, /apply,
            /book, /thank-you, /admin, and stays away for 30 days after dismissal. */}
        {!isDraftMode && <NewsletterPopup />}
        {/* Click-to-edit overlay — only loads when previewing inside Sanity Studio */}
        {isDraftMode && <VisualEditingClient />}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
