import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToKit } from "@/lib/kit";

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

  const formId = process.env.KIT_FORM_ID_NEWSLETTER;
  if (!formId) {
    return NextResponse.json(
      { error: "Newsletter not configured" },
      { status: 503 }
    );
  }

  const result = await subscribeToKit({
    email: parsed.data.email,
    firstName: parsed.data.firstName,
    formId,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
