/**
 * Press Image Audit Script
 * Generates contact-sheet.jpg + press-image-audit.json
 * Run: node scripts/audit-press-images.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRESS_DIR  = path.join(__dirname, '..', 'public', 'images', 'press');
const AUDIT_DIR  = path.join(PRESS_DIR, '_audit');
const JSON_OUT   = path.join(AUDIT_DIR, 'press-image-audit.json');
const SHEET_OUT  = path.join(AUDIT_DIR, 'contact-sheet.jpg');

const THUMB_W    = 280;
const THUMB_H    = 210;
const COLS       = 5;
const PAD        = 8;
const LABEL_H    = 28;
const BG_COLOR   = { r: 240, g: 235, b: 228, alpha: 1 }; // warm cream
const LABEL_BG   = { r: 30, g: 27, b: 23, alpha: 1 };    // ink

/* ── helpers ─────────────────────────────────────────────── */
function fmtBytes(b) {
  if (b < 1024)       return `${b} B`;
  if (b < 1024*1024)  return `${(b/1024).toFixed(1)} KB`;
  return `${(b/(1024*1024)).toFixed(2)} MB`;
}

function orientation(w, h) {
  if (w > h * 1.2)  return 'landscape';
  if (h > w * 1.2)  return 'portrait';
  return 'square';
}

function guessCategory(filename, w, h, sizeBytes) {
  const f = filename.toLowerCase();
  // Named files give clear signals
  if (f.includes('blow-greek'))       return 'press-clipping';
  if (f.includes('blow-events'))      return 'media-collage';
  if (f.includes('blow-interview'))   return 'press-clipping';
  if (f.includes('pod-press'))        return 'media-collage';
  if (f.includes('pod-perspective'))  return 'press-clipping';
  if (f.includes('fashion-germany-press')) return 'press-clipping';

  // Wix files — classify by dimensions + size
  const orient = orientation(w, h);
  const ratio  = w / h;

  // Very small — likely low-quality or social icon
  if (w < 300 && h < 300) return 'logo-social';

  // Tall portrait under 300px wide — likely magazine/book cover scan
  if (orient === 'portrait' && w < 320) return 'magazine-cover';

  // Portrait 380–450w × ~540h — book/magazine covers
  if (orient === 'portrait' && w >= 350 && w <= 460 && h >= 480) return 'magazine-cover';

  // Wide landscape 957×538 (exactly the Wix 16:9 thumbnail size) — press clippings/article screenshots
  if (w === 957 && h === 538) return 'press-clipping';
  if (w >= 800 && orient === 'landscape' && ratio > 1.5) return 'press-clipping';

  // Square-ish png — likely collage or screenshot
  if (orient === 'square') return 'media-collage';

  return 'press-clipping';
}

function proposedFilename(index, filename, category, w, h) {
  const ext  = path.extname(filename).toLowerCase().replace('.jpeg', '.jpg');
  const idx  = String(index + 1).padStart(2, '0');
  const o    = orientation(w, h);

  const prefixes = {
    'press-clipping':    'press-clip',
    'magazine-cover':    'mag-cover',
    'media-collage':     'collage',
    'book-cover':        'book-cover',
    'publication-spread':'spread',
    'event-photo':       'event',
    'portrait':          'portrait',
    'logo-social':       'SKIP',
    'duplicate':         'SKIP',
    'low-quality':       'SKIP',
  };
  const prefix = prefixes[category] ?? 'misc';
  if (prefix === 'SKIP') return `[skip]`;

  // keep named files as-is
  if (!filename.startsWith('71100e')) return filename;

  return `${prefix}-${idx}-${o}${ext}`;
}

/* ── main ────────────────────────────────────────────────── */
async function main() {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });

  const files = fs.readdirSync(PRESS_DIR)
    .filter(f => !f.startsWith('_') && /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
    .sort();

  console.log(`Found ${files.length} images. Processing...`);

  const records = [];

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const fullPath = path.join(PRESS_DIR, filename);
    const stat     = fs.statSync(fullPath);

    let meta;
    try {
      meta = await sharp(fullPath).metadata();
    } catch (e) {
      console.warn(`  ⚠ Cannot read: ${filename} — ${e.message}`);
      records.push({
        index: i + 1,
        filename,
        width: 0, height: 0,
        fileSizeBytes: stat.size,
        fileSizeHuman: fmtBytes(stat.size),
        orientation: 'unknown',
        format: 'unknown',
        category: 'low-quality',
        recommendedSection: 'do-not-use',
        objectFit: 'object-contain',
        proposedFilename: '[skip]',
        altText: '',
        notes: `Cannot read: ${e.message}`,
      });
      continue;
    }

    const w    = meta.width  ?? 0;
    const h    = meta.height ?? 0;
    const cat  = guessCategory(filename, w, h, stat.size);
    const o    = orientation(w, h);
    const proposed = proposedFilename(i, filename, cat, w, h);

    // Determine recommended section
    let section = 'featured-media';
    const f = filename.toLowerCase();
    if (cat === 'logo-social')          section = 'do-not-use';
    else if (stat.size < 15000)         section = 'do-not-use';   // tiny file
    else if (f.includes('blow'))        section = 'isabella-blow';
    else if (f.includes('pod') || f.includes('perspective')) section = 'people-of-deutschland';
    else if (f.includes('fashion'))     section = 'fashion-germany';
    else if (cat === 'magazine-cover')  section = 'people-of-deutschland'; // will re-classify after visual review
    else if (cat === 'press-clipping' && w === 957) {
      // large group — split by thirds for POD (most 957s are POD based on page order)
      section = 'people-of-deutschland';
    }

    const objectFit = (cat === 'press-clipping' || cat === 'magazine-cover' || cat === 'publication-spread' || cat === 'book-cover')
      ? 'object-contain'
      : 'object-cover';

    // Draft alt text
    let altText = '';
    if (f.includes('pod'))          altText = 'People of Deutschland — press coverage, Martina Rink';
    else if (f.includes('blow'))    altText = 'Isabella Blow — press coverage, Martina Rink';
    else if (f.includes('fashion')) altText = 'Fashion Germany — press coverage, Martina Rink';
    else if (cat === 'magazine-cover') altText = 'Magazine cover featuring Martina Rink publication';
    else altText = `Press coverage — Martina Rink, ${cat.replace(/-/g,' ')}`;

    // Quality flags
    const notes = [];
    if (w < 400 && h < 400)      notes.push('low-res');
    if (stat.size < 30000)       notes.push('very small file');
    if (w === 957 && h === 538)  notes.push('standard Wix thumbnail');
    if (cat === 'logo-social')   notes.push('social icon — skip');

    records.push({
      index:           i + 1,
      filename,
      width:           w,
      height:          h,
      fileSizeBytes:   stat.size,
      fileSizeHuman:   fmtBytes(stat.size),
      orientation:     o,
      format:          meta.format ?? 'unknown',
      category:        cat,
      recommendedSection: section,
      objectFit,
      proposedFilename: proposed,
      altText,
      notes:           notes.join('; ') || 'ok',
    });

    process.stdout.write(`  [${String(i+1).padStart(2)}/${files.length}] ${filename} — ${w}×${h} ${fmtBytes(stat.size)} ${cat}\n`);
  }

  /* ── Write JSON ─────────────────────────────────────── */
  fs.writeFileSync(JSON_OUT, JSON.stringify(records, null, 2));
  console.log(`\n✓ JSON written → ${JSON_OUT}`);

  /* ── Summary ────────────────────────────────────────── */
  const byCategory = {};
  const bySection  = {};
  for (const r of records) {
    byCategory[r.category]          = (byCategory[r.category] ?? 0) + 1;
    bySection[r.recommendedSection] = (bySection[r.recommendedSection] ?? 0) + 1;
  }

  console.log('\n── Category breakdown ──');
  for (const [k, v] of Object.entries(byCategory).sort((a,b) => b[1]-a[1]))
    console.log(`  ${k.padEnd(22)} ${v}`);

  console.log('\n── Section breakdown ──');
  for (const [k, v] of Object.entries(bySection).sort((a,b) => b[1]-a[1]))
    console.log(`  ${k.padEnd(28)} ${v}`);

  /* ── Generate contact sheet ─────────────────────────── */
  const usable = records.filter(r => r.width > 0);
  const ROWS   = Math.ceil(usable.length / COLS);
  const SW     = COLS * (THUMB_W + PAD) + PAD;
  const SH     = ROWS * (THUMB_H + LABEL_H + PAD) + PAD + 60; // 60px header

  console.log(`\nGenerating contact sheet ${SW}×${SH}px (${COLS} cols × ${ROWS} rows)...`);

  // Create base canvas
  const canvas = sharp({
    create: { width: SW, height: SH, channels: 4, background: BG_COLOR }
  });

  // Composite each thumbnail
  const composites = [];

  // Header text via SVG
  const headerSvg = `<svg width="${SW}" height="60" xmlns="http://www.w3.org/2000/svg">
    <rect width="${SW}" height="60" fill="#1E1B17"/>
    <text x="20" y="38" font-family="sans-serif" font-size="22" font-weight="bold" fill="#F8F4F1">
      Press Image Audit — martinarink.com/press — ${usable.length} images
    </text>
  </svg>`;
  composites.push({ input: Buffer.from(headerSvg), top: 0, left: 0 });

  for (let i = 0; i < usable.length; i++) {
    const rec  = usable[i];
    const col  = i % COLS;
    const row  = Math.floor(i / COLS);
    const x    = PAD + col * (THUMB_W + PAD);
    const y    = 60 + PAD + row * (THUMB_H + LABEL_H + PAD);

    // Thumbnail
    try {
      const thumb = await sharp(path.join(PRESS_DIR, rec.filename))
        .resize(THUMB_W, THUMB_H, { fit: 'inside', background: { r: 237, g: 232, b: 224, alpha: 1 } })
        .flatten({ background: { r: 237, g: 232, b: 224 } })
        .jpeg({ quality: 82 })
        .toBuffer();

      // White background for thumb cell
      const cell = await sharp({
        create: { width: THUMB_W, height: THUMB_H, channels: 3, background: { r: 237, g: 232, b: 224 } }
      })
        .composite([{ input: thumb, gravity: 'center' }])
        .jpeg({ quality: 80 })
        .toBuffer();

      composites.push({ input: cell, top: y, left: x });
    } catch (e) {
      // skip broken thumbnail
    }

    // Label
    const short  = rec.filename.length > 22 ? rec.filename.slice(0, 10) + '…' + rec.filename.slice(-8) : rec.filename;
    const catAbbr = rec.category.replace('press-clipping','clip').replace('magazine-cover','mag').replace('media-collage','collage').replace('logo-social','SKIP').replace('low-quality','SKIP');
    const labelSvg = `<svg width="${THUMB_W}" height="${LABEL_H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${THUMB_W}" height="${LABEL_H}" fill="#1E1B17"/>
      <text x="6" y="12" font-family="monospace" font-size="9" fill="#F8F4F1">[${rec.index}] ${short}</text>
      <text x="6" y="23" font-family="monospace" font-size="9" fill="#F942AA">${catAbbr} · ${rec.width}×${rec.height} · ${rec.fileSizeHuman}</text>
    </svg>`;
    composites.push({ input: Buffer.from(labelSvg), top: y + THUMB_H, left: x });
  }

  await sharp({ create: { width: SW, height: SH, channels: 4, background: BG_COLOR } })
    .composite(composites)
    .jpeg({ quality: 88 })
    .toFile(SHEET_OUT);

  console.log(`✓ Contact sheet → ${SHEET_OUT}`);
  console.log('\nDone. Review _audit/contact-sheet.jpg before proceeding with design.\n');
}

main().catch(err => { console.error(err); process.exit(1); });
