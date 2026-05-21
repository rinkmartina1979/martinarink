import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const root = process.cwd();
const inputDir = path.join(root, "public/images/press");
const auditDir = path.join(inputDir, "_audit");
const normalizedDir = path.join(inputDir, "_normalized");

fs.mkdirSync(auditDir, { recursive: true });
fs.mkdirSync(normalizedDir, { recursive: true });

const allowed = /\.(jpg|jpeg|png|webp|avif|gif)$/i;

const files = fs
  .readdirSync(inputDir)
  .filter((file) => !file.startsWith("_"))
  .filter((file) => {
    const full = path.join(inputDir, file);
    return fs.statSync(full).isFile();
  });

const results = [];

function hashFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha1").update(buffer).digest("hex");
}

for (const file of files) {
  const fullPath = path.join(inputDir, file);
  const stat = fs.statSync(fullPath);
  const ext = path.extname(file).toLowerCase();
  const hash = hashFile(fullPath);

  const item = {
    file,
    ext,
    sizeKB: Math.round(stat.size / 1024),
    sizeMB: Number((stat.size / 1024 / 1024).toFixed(2)),
    hash,
    readable: false,
    format: null,
    width: null,
    height: null,
    orientation: null,
    aspect: null,
    warning: [],
    normalizedFile: null,
  };

  if (!allowed.test(file)) {
    item.warning.push("unsupported-or-missing-extension");
  }

  if (stat.size > 20 * 1024 * 1024) {
    item.warning.push("over-20mb-chatgpt-limit");
  }

  try {
    const image = sharp(fullPath, { failOn: "none" });
    const meta = await image.metadata();

    item.readable = true;
    item.format = meta.format;
    item.width = meta.width;
    item.height = meta.height;

    item.orientation =
      meta.width > meta.height
        ? "landscape"
        : meta.width < meta.height
          ? "portrait"
          : "square";

    item.aspect = Number((meta.width / meta.height).toFixed(2));

    if (meta.width < 500 || meta.height < 500) {
      item.warning.push("low-resolution");
    }

    const baseName = path
      .basename(file, ext || undefined)
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    const normalizedFile = `${baseName || "press-image"}-${hash.slice(0, 8)}.jpg`;
    const outputPath = path.join(normalizedDir, normalizedFile);

    await sharp(fullPath, { failOn: "none" })
      .rotate()
      .resize({
        width: 2200,
        height: 2200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 88,
        progressive: true,
        mozjpeg: true,
      })
      .toFile(outputPath);

    item.normalizedFile = `_normalized/${normalizedFile}`;
  } catch (error) {
    item.readable = false;
    item.warning.push(`unreadable: ${error.message}`);
  }

  results.push(item);
}

fs.writeFileSync(
  path.join(auditDir, "press-image-audit.json"),
  JSON.stringify(results, null, 2)
);

const thumbW = 240;
const thumbH = 170;
const labelH = 84;
const gap = 24;
const cols = 4;
const rows = Math.ceil(results.length / cols);
const sheetW = cols * thumbW + (cols + 1) * gap;
const sheetH = rows * (thumbH + labelH) + (rows + 1) * gap;

const composites = [];

for (let i = 0; i < results.length; i++) {
  const item = results[i];
  const row = Math.floor(i / cols);
  const col = i % cols;
  const left = gap + col * (thumbW + gap);
  const top = gap + row * (thumbH + labelH + gap);

  let imageBuffer;

  if (item.readable) {
    imageBuffer = await sharp(path.join(inputDir, item.file), { failOn: "none" })
      .rotate()
      .resize(thumbW, thumbH, {
        fit: "contain",
        background: "#F8F4F1",
      })
      .jpeg({ quality: 85 })
      .toBuffer();
  } else {
    imageBuffer = await sharp({
      create: { width: thumbW, height: thumbH, channels: 3, background: { r: 35, g: 23, b: 39 } }
    })
      .composite([{
        input: Buffer.from(
          `<svg width="${thumbW}" height="${thumbH}" xmlns="http://www.w3.org/2000/svg">
            <text x="20" y="85" font-size="16" font-family="Arial" fill="#F942AA">UNREADABLE</text>
            <text x="20" y="110" font-size="11" font-family="Arial" fill="#F8F4F1">${item.file.slice(0,28)}</text>
          </svg>`
        ),
        top: 0, left: 0
      }])
      .jpeg({ quality: 85 })
      .toBuffer();
  }

  const shortName =
    item.file.length > 32 ? item.file.slice(0, 29) + "..." : item.file;

  const warnText = item.warning.join(", ").slice(0, 58);
  const warnColor = item.warning.length ? "#B00020" : "#4a9a4a";

  const labelSvg = `<svg width="${thumbW}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#F8F4F1"/>
    <text x="4" y="16" font-size="11" font-family="monospace" fill="#1E1B17">${i + 1}. ${shortName}</text>
    <text x="4" y="34" font-size="10" font-family="monospace" fill="#636260">${item.width || "-"}×${item.height || "-"} · ${item.format || "?"} · ${item.sizeKB}KB</text>
    <text x="4" y="52" font-size="10" font-family="monospace" fill="${warnColor}">${warnText || "ok"}</text>
    <text x="4" y="70" font-size="9" font-family="monospace" fill="#9A7F72">${item.orientation || ""} ${item.aspect ? "· " + item.aspect : ""}</text>
  </svg>`;

  composites.push({ input: imageBuffer, left, top });
  composites.push({ input: Buffer.from(labelSvg), left, top: top + thumbH });
}

await sharp({
  create: { width: sheetW, height: sheetH, channels: 3, background: { r: 237, g: 232, b: 224 } },
})
  .composite(composites)
  .jpeg({ quality: 90 })
  .toFile(path.join(auditDir, "contact-sheet.jpg"));

// ── Summary ─────────────────────────────────────────────────
const readable    = results.filter((i) => i.readable);
const unreadable  = results.filter((i) => !i.readable);
const over20mb    = results.filter((i) => i.sizeMB > 20);
const lowRes      = results.filter((i) => i.warning.includes("low-resolution"));
const unsupported = results.filter((i) => i.warning.includes("unsupported-or-missing-extension"));

console.log(`\n── Press Image Audit ───────────────────────────`);
console.log(`Total files       : ${results.length}`);
console.log(`Readable          : ${readable.length}`);
console.log(`Unreadable        : ${unreadable.length}`);
console.log(`Over 20MB         : ${over20mb.length}`);
console.log(`Low resolution    : ${lowRes.length}`);
console.log(`Unsupported ext   : ${unsupported.length}`);
console.log(`\nUnreadable files:`);
unreadable.forEach(i => console.log(`  ✗ ${i.file}  [${i.sizeKB}KB]  ${i.warning.join("; ")}`));
console.log(`\nLow-res files (under 500px on shortest side):`);
lowRes.forEach(i => console.log(`  ⚠ ${i.file}  ${i.width}×${i.height}`));
console.log(`\nOutputs:`);
console.log(`  contact-sheet   → public/images/press/_audit/contact-sheet.jpg`);
console.log(`  audit JSON      → public/images/press/_audit/press-image-audit.json`);
console.log(`  normalized JPGs → public/images/press/_normalized/  (${readable.length} files)`);
