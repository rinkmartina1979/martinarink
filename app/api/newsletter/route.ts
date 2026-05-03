import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeNewsletter } from "@/lib/brevo";

const NewsletterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  consent: z.boolean().optional(),
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
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
