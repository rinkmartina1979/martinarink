import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeNewsletter } from "@/lib/brevo";

const NewsletterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  consent: z.boolean().optional(),
  // Where the signup came from — "newsletter-form" (default), "popup",
  // "footer", "blog-post", etc. Surfaces in Brevo as the SOURCE attribute.
  source: z.string().max(40).optional(),
});

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = NewsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await subscribeNewsletter({
    email: parsed.data.email,
    firstName: parsed.data.firstName,
    source: parsed.data.source,
  });

  if (!result.success) {
    // Don't expose internal errors to the client
    console.error("[Newsletter] Subscribe failed:", result.error);
    return NextResponse.json(
      { error: "Could not subscribe at this time. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
