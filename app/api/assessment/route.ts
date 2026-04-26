import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { subscribeToKit, getArchetypeTag, type Archetype } from "@/lib/kit";

function verifyTallySignature(payload: string, signature: string): boolean {
  const secret = process.env.TALLY_SIGNING_SECRET;
  if (!secret) return false;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("base64");
  return hmac === signature;
}

interface TallyField {
  key: string;
  label?: string;
  value: string | number | string[] | null;
}

function flattenFields(fields: TallyField[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const field of fields) {
    if (field.value === null) continue;
    out[field.key] = Array.isArray(field.value)
      ? field.value.join(",")
      : String(field.value);
  }
  return out;
}

function determineArchetype(fields: Record<string, string>): Archetype {
  const gap = parseInt(fields["gap_size"] ?? "3", 10);
  const readiness = (fields["readiness"] ?? "considering").toLowerCase();
  if (readiness === "ready" || readiness === "ready_to_begin") return "return";
  if (gap >= 4) return "threshold";
  return "reckoning";
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("tally-signature") ?? "";

  if (process.env.TALLY_SIGNING_SECRET && !verifyTallySignature(payload, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let data;
  try {
    data = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const fields = flattenFields(data?.data?.fields ?? []);
  const email = fields["email"];
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const archetype = determineArchetype(fields);
  const archetypeTag = getArchetypeTag(archetype);

  const formId = process.env.KIT_FORM_ID_ASSESSMENT;
  if (formId) {
    await subscribeToKit({
      email,
      firstName: fields["first_name"],
      formId,
      tags: archetypeTag ? [archetypeTag] : [],
      fields: { archetype, source: "assessment" },
    });
  }

  return NextResponse.json({ received: true, archetype });
}
