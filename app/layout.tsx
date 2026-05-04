import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditingClient } from "@/components/sanity/VisualEditingClient";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { playfair, dmSans, dancingScript } from "@/lib/fonts";
import { buildMetadata, personSchema } from "@/lib/metadata";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Click-to-edit overlay — only loads when previewing inside Sanity Studio */}
        {isDraftMode && <VisualEditingClient />}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
