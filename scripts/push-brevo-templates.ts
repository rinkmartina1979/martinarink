/**
 * push-brevo-templates.ts — push all 28 Vogue templates to Brevo.
 *
 * Usage:
 *   npx tsx scripts/push-brevo-templates.ts --dry-run   # write HTML previews, no API calls
 *   npx tsx scripts/push-brevo-templates.ts             # update all 28 templates in Brevo
 *   npx tsx scripts/push-brevo-templates.ts --only 14,18  # update specific template ids
 *
 * Reads BREVO_API_KEY from .env.local. Template updates are free on every
 * Brevo plan — the monthly send limit only applies to actual sends.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { BREVO_TEMPLATES } from "../lib/brevo-templates";

const ROOT = resolve(__dirname, "..");

/* ─── minimal .env.local parser (no dotenv dependency) ─────────── */
function loadEnvLocal(): Record<string, string> {
  const out: Record<string, string> = {};
  const raw = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const onlyArg = args.find((a) => a.startsWith("--only"));
const ONLY: number[] | null = onlyArg
  ? (onlyArg.includes("=") ? onlyArg.split("=")[1] : args[args.indexOf(onlyArg) + 1])
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n))
  : null;

const templates = ONLY
  ? BREVO_TEMPLATES.filter((t) => ONLY.includes(t.id))
  : BREVO_TEMPLATES;

async function main() {
  console.log(`\nBrevo template push — ${templates.length} template(s)${DRY_RUN ? " [DRY RUN]" : ""}\n`);

  if (DRY_RUN) {
    const previewDir = resolve(ROOT, "scripts", "brevo-preview");
    mkdirSync(previewDir, { recursive: true });
    for (const t of templates) {
      const file = resolve(previewDir, `${String(t.id).padStart(2, "0")}-${t.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.html`);
      writeFileSync(file, t.html, "utf8");
      console.log(`  ✓ #${t.id}  "${t.subject}"  →  ${file.replace(ROOT + "\\", "")}`);
    }
    console.log(`\nOpen the files in scripts/brevo-preview/ in a browser to inspect.\n`);
    return;
  }

  const env = loadEnvLocal();
  const apiKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("BREVO_API_KEY not found in .env.local or environment.");
    process.exit(1);
  }

  let ok = 0;
  let failed = 0;

  for (const t of templates) {
    try {
      const res = await fetch(`https://api.brevo.com/v3/smtp/templates/${t.id}`, {
        method: "PUT",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          subject: t.subject,
          htmlContent: t.html,
          isActive: true,
        }),
      });

      if (res.status === 204 || res.ok) {
        console.log(`  ✓ #${t.id}  ${t.name}`);
        ok++;
      } else {
        const body = await res.text();
        console.error(`  ✗ #${t.id}  ${t.name} — HTTP ${res.status}: ${body}`);
        failed++;
      }
    } catch (err) {
      console.error(`  ✗ #${t.id}  ${t.name} — ${err instanceof Error ? err.message : err}`);
      failed++;
    }
    // gentle pacing — Brevo rate limit is generous but no reason to burst
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\nDone. ${ok} updated, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

main();
