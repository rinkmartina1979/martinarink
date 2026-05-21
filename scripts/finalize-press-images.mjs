/**
 * Finalize press images:
 * 1. Copy 16 curated normalized images → clean semantic names in public/images/press/
 * 2. Delete 6 fake "Forbidden" files
 * 3. Write pressImages.json manifest
 *
 * Run: node scripts/finalize-press-images.mjs
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRESS_DIR = path.join(__dirname, "..", "public", "images", "press");
const NORM_DIR  = path.join(PRESS_DIR, "_normalized");
const LIB_DIR   = path.join(__dirname, "..", "lib");

/* ── Section mapping from DOM inspection of martinarink.de/press ─── */

// PEOPLE OF DEUTSCHLAND — top 6 by file size (135→113 KB, all 957×538)
const POD_PICKS = [
  { norm: "71100e-a911b36e823e4db69940d13c0fca6d00-mv2-b2e4a696.jpg", clean: "pod-press-01.jpg", origW: 957, origH: 538, sizeKB: 135 },
  { norm: "71100e-ed55938d03174b4bb2ac0cd45f48ab0a-mv2-70976003.jpg", clean: "pod-press-02.jpg", origW: 957, origH: 538, sizeKB: 132 },
  { norm: "71100e-c3c595de8e0d4281bfa19bd6694bc407-mv2-4be9b28a.jpg", clean: "pod-press-03.jpg", origW: 957, origH: 538, sizeKB: 127 },
  { norm: "71100e-1b5bd5f868eb4351b76fb1a9021e9e0a-mv2-051ce4fd.jpg", clean: "pod-press-04.jpg", origW: 957, origH: 538, sizeKB: 115 },
  { norm: "71100e-2d1de8dfffeb4202a5fad03061a79204-mv2-edafe8bf.jpg", clean: "pod-press-05.jpg", origW: 957, origH: 538, sizeKB: 113 },
  { norm: "71100e-305c14d7fa6c48ef8a5a411026fd28b7-mv2-fad0537c.jpg", clean: "pod-press-06.jpg", origW: 957, origH: 538, sizeKB: 113 },
];

// ISABELLA BLOW — 5 best (feature PNG + 4 portrait covers)
const BLOW_PICKS = [
  { norm: "71100e-c89bee0785b045d7afd9bad5608b946f-mv2-2179198c.jpg", clean: "blow-press-feature.jpg", origW: 853, origH: 539, sizeKB: 443 },
  { norm: "71100e-c0ccd545dde24172bca23ed6b385d6e4-mv2-336ceb3b.jpg", clean: "blow-press-01.jpg", origW: 419, origH: 539, sizeKB: 87 },
  { norm: "71100e-e342c7f6cbbc475f9ed1da3948f9c716-mv2-3d6cab8b.jpg", clean: "blow-press-02.jpg", origW: 413, origH: 539, sizeKB: 77 },
  { norm: "71100e-f423fce09b2a47f3af2a7a3bb3f1e766-mv2-f2114dc0.jpg", clean: "blow-press-03.jpg", origW: 384, origH: 540, sizeKB: 67 },
  { norm: "71100e-5b6f8d2797c0424ebf6d83d2e6155f88-mv2-87d10cf8.jpg", clean: "blow-press-04.jpg", origW: 391, origH: 540, sizeKB: 67 },
];

// FASHION GERMANY — 1 medium feature + 4 small covers (thumbnail-only)
const FASHION_PICKS = [
  { norm: "71100e-690a2130c791439ea0b444c4b13fe1a7-mv2-20a84831.jpg", clean: "fashion-press-feature.jpg", origW: 455, origH: 366, sizeKB: 288 },
  { norm: "71100e-d273e9b43e1e42648ccb940207e4f976-mv2-aa2bf204.jpg", clean: "fashion-cover-01.jpg", origW: 274, origH: 366, sizeKB: 27 },
  { norm: "71100e-5bf2ec7fef3a4d449a9ff6072c0c130c-mv2-f737c53d.jpg", clean: "fashion-cover-02.jpg", origW: 259, origH: 365, sizeKB: 30 },
  { norm: "71100e-22b68e652ca543ee8e3902b7c5619fd0-mv2-4152156b.jpg", clean: "fashion-cover-03.jpg", origW: 259, origH: 365, sizeKB: 26 },
  { norm: "71100e-c4981776ad1e4123bfb01feac6a79201-mv2-1791932a.jpg", clean: "fashion-cover-04.jpg", origW: 258, origH: 365, sizeKB: 27 },
];

const ALL_PICKS = [...POD_PICKS, ...BLOW_PICKS, ...FASHION_PICKS];

// 6 fake files to delete (9-byte "Forbidden" text, not images)
const FAKES = [
  "blow-events-collage.jpg",
  "blow-greek-press.jpg",
  "blow-interview.jpg",
  "fashion-germany-press.jpg",
  "pod-perspective-daily.jpg",
  "pod-press-collage.jpg",
];

async function main() {
  console.log("── Finalize Press Images ──────────────────────\n");

  // 1. Copy curated normalized images with clean names
  console.log("Copying 16 curated images with clean names...");
  for (const pick of ALL_PICKS) {
    const src  = path.join(NORM_DIR, pick.norm);
    const dest = path.join(PRESS_DIR, pick.clean);

    if (!fs.existsSync(src)) {
      console.error(`  ✗ NOT FOUND: ${pick.norm}`);
      continue;
    }

    // Get actual dimensions of normalized file
    const meta = await sharp(dest.endsWith(".skip") ? src : src).metadata();

    fs.copyFileSync(src, dest);
    console.log(`  ✓ ${pick.clean}  (${meta.width}×${meta.height})`);

    // Update dimensions to actual normalized values
    pick.normW = meta.width;
    pick.normH = meta.height;
  }

  // 2. Delete fake files
  console.log("\nDeleting 6 fake 'Forbidden' files...");
  for (const fake of FAKES) {
    const p = path.join(PRESS_DIR, fake);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`  ✗ Deleted: ${fake}`);
    } else {
      console.log(`  - Already gone: ${fake}`);
    }
  }

  // 3. Write manifest
  const manifest = {
    generated: new Date().toISOString(),
    totalSelected: ALL_PICKS.length,
    sections: {
      peopleOfDeutschland: POD_PICKS.map(p => ({
        src: `/images/press/${p.clean}`,
        width: p.normW ?? p.origW,
        height: p.normH ?? p.origH,
        alt: `People of Deutschland — press coverage, Martina Rink`,
        objectFit: "object-contain",
      })),
      isabellaBlow: BLOW_PICKS.map((p, i) => ({
        src: `/images/press/${p.clean}`,
        width: p.normW ?? p.origW,
        height: p.normH ?? p.origH,
        alt: i === 0
          ? "Isabella Blow — featured press spread, Martina Rink"
          : `Isabella Blow — press coverage ${i}, Martina Rink`,
        objectFit: "object-contain",
        featured: i === 0,
      })),
      fashionGermany: FASHION_PICKS.map((p, i) => ({
        src: `/images/press/${p.clean}`,
        width: p.normW ?? p.origW,
        height: p.normH ?? p.origH,
        alt: i === 0
          ? "Fashion Germany — featured press clipping, Martina Rink"
          : `Fashion Germany — magazine cover ${i}, Martina Rink`,
        objectFit: "object-contain",
        featured: i === 0,
        thumbnailOnly: i > 0,
        maxRenderWidth: i > 0 ? 130 : undefined,
      })),
    },
  };

  const manifestPath = path.join(PRESS_DIR, "_audit", "press-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✓ Manifest → ${manifestPath}`);

  // 4. Summary
  console.log(`\n── Summary ───────────────────────────────────`);
  console.log(`Selected images    : ${ALL_PICKS.length}`);
  console.log(`  POD clippings    : ${POD_PICKS.length}`);
  console.log(`  Blow images      : ${BLOW_PICKS.length}`);
  console.log(`  Fashion images   : ${FASHION_PICKS.length}`);
  console.log(`Fake files deleted : ${FAKES.length}`);
  console.log(`\nClean filenames now in public/images/press/:`);
  ALL_PICKS.forEach(p => console.log(`  ${p.clean}`));
}

main().catch(err => { console.error(err); process.exit(1); });
