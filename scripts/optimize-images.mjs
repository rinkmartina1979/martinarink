/**
 * optimize-images.mjs — one-off source-weight reducer for referenced above-fold images.
 *
 * SAFE BY DESIGN:
 *  - Only processes the explicit ALLOWLIST below (referenced in components).
 *  - Backs up every original to /_originals (gitignored) before touching it.
 *  - Keeps the same filename + extension → no component `src` changes.
 *  - Caps longest edge at 2000px; only writes if the result is smaller.
 *
 * Run: node scripts/optimize-images.mjs
 * Restore an original: copy it back from /_originals/<same path>.
 */
import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const BACKUP = path.join(ROOT, "_originals");
const MAX_EDGE = 2000;
const MIN_BYTES = 400 * 1024; // skip anything already under 400 KB

const ALLOWLIST = [
  "images/portraits/martina-women-empowerment-coach.jpg", // homepage hero (LCP)
  "images/portraits/martina-portrait-pink-blouse.jpg",    // /about opening (LCP)
  "images/portraits/martina-before-practice.jpg",         // /about split
  "images/portraits/martina-portrait-studio.jpg",         // /work-with-me hero + JSON-LD
  "images/portraits/martina-bw-studio.jpg",               // /sober-muse hero
  "images/portraits/martina-ibiza-sunset.jpg",            // /empowerment hero
  "images/portraits/martina-night-sky.jpg",               // /empowerment strip
  "images/portraits/martina-event-plum.png",              // /sober-muse investment
  "images/portraits/martina-library-pink.jpg",            // homepage about section
  "images/portraits/martina-garden-pink.jpg",             // newsletter strip
  "images/portraits/Martina-rink-press-photoshoot.jpeg",  // /press + /newsletter
  "images/portraits/martina-rink-showcasing-isabelle-blow-book.jpeg",
  "images/portraits/martina-rink-givinng-press-interview.jpeg",
  "images/portraits/martina-rink-being-ready-for-press-shot.jpeg",
  "images/books/people-of-deutschland-cover.png",
  "images/books/isabella-blow-cover.png",
  "images/books/fashion-germany-cover.png",
];

let savedTotal = 0;

for (const rel of ALLOWLIST) {
  const abs = path.join(PUBLIC, rel);
  let stat;
  try {
    stat = await fs.stat(abs);
  } catch {
    console.log("skip (missing):", rel);
    continue;
  }
  if (stat.size < MIN_BYTES) {
    console.log("skip (already small):", rel, `${(stat.size / 1024) | 0}KB`);
    continue;
  }

  // 1. Back up the original (idempotent — never overwrite an existing backup)
  const backupPath = path.join(BACKUP, rel);
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  try {
    await fs.access(backupPath);
  } catch {
    await fs.copyFile(abs, backupPath);
  }

  // 2. Re-encode from the backup (guarantees we never compound-compress)
  const ext = path.extname(rel).toLowerCase();
  let pipeline = sharp(backupPath, { failOn: "none" })
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true });

  const buf =
    ext === ".png"
      ? await pipeline.png({ compressionLevel: 9, effort: 10, quality: 82 }).toBuffer()
      : await pipeline.jpeg({ quality: 72, mozjpeg: true }).toBuffer();

  if (buf.length < stat.size) {
    await fs.writeFile(abs, buf);
    savedTotal += stat.size - buf.length;
    console.log(
      "optimised:",
      rel,
      `${(stat.size / 1024) | 0}KB -> ${(buf.length / 1024) | 0}KB`,
    );
  } else {
    console.log("kept (no gain):", rel);
  }
}

console.log(`\nTotal saved: ${(savedTotal / 1024 / 1024).toFixed(2)} MB`);
