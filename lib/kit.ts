/**
 * Kit (formerly ConvertKit) v4 API client
 * Used for newsletter subscription and assessment archetype tagging.
 */

const KIT_API_BASE = "https://api.kit.com/v4";

interface SubscribeOptions {
  email: string;
  firstName?: string;
  formId: string;
  tags?: string[];
  fields?: Record<string, string>;
}

export async function subscribeToKit({
  email,
  firstName,
  formId,
  tags = [],
  fields = {},
}: SubscribeOptions): Promise<{ success: boolean; error?: string; subscriberId?: number }> {
  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) {
    return { success: false, error: "KIT_API_KEY not configured" };
  }

  try {
    const res = await fetch(`${KIT_API_BASE}/forms/${formId}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Kit-Api-Key": apiKey,
      },
      body: JSON.stringify({
        email_address: email,
        first_name: firstName,
        fields,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[Kit] Subscribe failed:", error);
      return { success: false, error };
    }

    const data = await res.json();
    const subscriberId = data.subscriber?.id;

    // Apply tags if any
    if (subscriberId && tags.length > 0) {
      await Promise.all(
        tags.map((tagId) =>
          fetch(`${KIT_API_BASE}/subscribers/${subscriberId}/tags`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Kit-Api-Key": apiKey,
            },
            body: JSON.stringify({ tag_id: parseInt(tagId, 10) }),
          }).catch((e) => console.error("[Kit] Tag failed:", e))
        )
      );
    }

    return { success: true, subscriberId };
  } catch (err) {
    console.error("[Kit] Network error:", err);
    return { success: false, error: "Network error" };
  }
}

export type Archetype = "reckoning" | "threshold" | "return";

export function getArchetypeTag(archetype: Archetype): string {
  const map: Record<Archetype, string> = {
    reckoning: process.env.KIT_TAG_ARCHETYPE_RECKONING ?? "",
    threshold: process.env.KIT_TAG_ARCHETYPE_THRESHOLD ?? "",
    return: process.env.KIT_TAG_ARCHETYPE_RETURN ?? "",
  };
  return map[archetype];
}
