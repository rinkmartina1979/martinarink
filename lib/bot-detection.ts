/**
 * Shared bot-detection heuristics for public form endpoints
 * (newsletter signup, programme applications).
 */

// Known spam / disposable / bot-network domains (update as new attacks emerge)
export const BLOCKED_DOMAINS = new Set([
  // Seen in the list-bombing attack (June 2026)
  "chameleongroup.co",
  "a7.ru",
  "a7goldinvest.ru",
  "a7gi.ru",
  // Common disposable mail providers
  "mailnull.com", "spamgourmet.com", "guerrillamail.com", "guerrillamail.net",
  "guerrillamail.org", "guerrillamail.biz", "guerrillamail.de", "guerrillamail.info",
  "trashmail.com", "trashmail.net", "trashmail.at", "trashmail.io",
  "yopmail.com", "yopmail.fr", "cool.fr.nf", "jetable.fr.nf",
  "nospam.ze.tc", "nomail.xl.cx", "mega.zik.dj", "speed.1s.fr",
  "courriel.fr.nf", "moncourrier.fr.nf", "monemail.fr.nf",
  "mailinator.com", "mailinator.net", "suremail.info",
  "spamfree24.org", "spamfree24.de", "spamfree24.eu", "spamfree24.info",
  "spamfree24.net", "spamfree24.com",
  "dispostable.com", "mailnesia.com",
  "spam4.me", "sharklasers.com", "guerillmail.info",
  "grr.la", "guerillamail.com", "spam.la",
  "throwam.com", "throwam.net", "throwem.com",
  "temp-mail.org", "tempmail.com", "fakemail.net",
  "10minutemail.com", "10minutemail.net", "10minutemail.org",
  "20minutemail.com", "throwaway.email",
  "vtext.com",     // SMS-to-email gateway, not a real inbox
  "google.com",    // Google's own domain is never a real user inbox
]);

// Detect random-string names: mixed-case runs, no real word shape
// Real names: "Sarah", "Anne-Marie", "Björn", "McDonald" — at most 2 uppercase mid-word
// Bot names: "MoVzeAHYIObPRIoMwtqqMrSj" — many uppercase scattered through a long string
export function isBotName(name: string): boolean {
  if (!name || name.length <= 2) return false;
  if (name.length > 30) return true; // no real first name is 30+ chars
  const innerUpper = (name.slice(1).match(/[A-Z]/g) ?? []).length;
  if (innerUpper > 2 && name.length > 12) return true;
  return false;
}

/**
 * Detect gibberish free-text answers — random character strings with no
 * real word shape (e.g. "ACGcDCpbCEXCGhFgiQMPeqc"). Real sentences have
 * spaces and a normal vowel ratio; bot-fuzzed answers typically don't.
 */
export function isGibberishText(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.length < 12) return false;
  // Real answers — even short ones — contain at least one space between words.
  if (!/\s/.test(trimmed)) {
    const vowels = (trimmed.match(/[aeiouAEIOU]/g) ?? []).length;
    const vowelRatio = vowels / trimmed.length;
    const innerUpper = (trimmed.slice(1).match(/[A-Z]/g) ?? []).length;
    // Low vowel ratio + scattered capitals + no spaces = random string, not a word/sentence.
    if (vowelRatio < 0.25 && innerUpper >= 2) return true;
  }
  return false;
}

/** Simple in-process IP rate limiter. Resets on cold start — intentional. */
const ipRateMaps = new Map<string, Map<string, { count: number; windowStart: number }>>();

export function isRateLimited(
  bucket: string,
  ip: string,
  limit: number,
  windowMs: number,
): boolean {
  if (!ipRateMaps.has(bucket)) ipRateMaps.set(bucket, new Map());
  const map = ipRateMaps.get(bucket)!;
  const now = Date.now();
  const record = map.get(ip);
  if (!record || now - record.windowStart > windowMs) {
    map.set(ip, { count: 1, windowStart: now });
    return false;
  }
  record.count += 1;
  return record.count > limit;
}

/**
 * Detect a near-duplicate submission of the same idempotency key within a
 * short window (e.g. a double-click or a network-retry re-POST). Returns
 * true and does NOT record the key if it's a repeat within the window —
 * callers should skip side effects (emails, notifications) but can still
 * respond normally. A genuinely new submission (or the same key again after
 * the window elapses) returns false and records the key.
 */
const dedupMaps = new Map<string, Map<string, number>>();

export function isDuplicateSubmission(
  bucket: string,
  key: string,
  windowMs: number,
): boolean {
  if (!dedupMaps.has(bucket)) dedupMaps.set(bucket, new Map());
  const map = dedupMaps.get(bucket)!;
  const now = Date.now();
  const lastSeen = map.get(key);
  if (lastSeen && now - lastSeen < windowMs) {
    return true;
  }
  map.set(key, now);
  return false;
}

export function getClientIp(req: { headers: { get(name: string): string | null } }): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
