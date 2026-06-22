/**
 * Server-side portal access check, shared by member pages.
 *
 * Verifies the HMAC member token and loads the client profile. Returns null
 * for invalid tokens, missing clients, or completed (archived) programmes —
 * the caller decides how to render those.
 */

import { verifyMemberToken } from "@/lib/members/token";
import {
  getClientByToken,
  type MemberClientProfile,
} from "@/sanity/lib/membersQueries";

export interface PortalAccess {
  clientId: string;
  profile: MemberClientProfile;
}

export async function verifyPortalAccess(
  token: string,
): Promise<PortalAccess | null> {
  const payload = verifyMemberToken(token);
  if (!payload) return null;

  const profile = await getClientByToken(payload.clientId);
  if (!profile) return null;
  if (profile.status === "completed") return null;

  return { clientId: payload.clientId, profile };
}
