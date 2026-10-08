/**
 * Generates favicon / app icons / default Open Graph image from the logo.
 * Usage: npm run icons   (re-run after replacing public/brand/logo.*)
 */
import {existsSync} from 'node:fs';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const brandDir = path.join(root, 'public/brand');
const appDir = path.join(root, 'src/app');
const BG = '#020204';

const source = ['logo.svg', 'logo.png', 'logo.webp'].map((f) => path.join(brandDir, f)).find(existsSync);
if (!source) {
  console.error('Logo not found: put logo.svg / logo.png / logo.webp into public/brand/');
  process.exit(1);
}

/** ICO container with PNG-compressed entries (supported by every current browser). */
function buildIco(images: {size: number; data: Buffer}[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({size, data}) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

async function main() {
  const logo = await sharp(source, {density: 300}).trim().png().toBuffer();
  const square = (size: number) =>
    sharp(logo).resize(size, size, {fit: 'contain', background: {r: 0, g: 0, b: 0, alpha: 0}});

  // UI logo sizes used by <Image> in the header/footer and by JSON-LD
  await square(96).png({compressionLevel: 9}).toFile(path.join(brandDir, 'logo-96.png'));
  await square(512).png({compressionLevel: 9}).toFile(path.join(brandDir, 'logo-512.png'));

  await square(512).png({compressionLevel: 9}).toFile(path.join(appDir, 'icon.png'));

  // Apple touch icons must be opaque
  const applePad = 14;
  await sharp({create: {width: 180, height: 180, channels: 4, background: BG}})
    .composite([{input: await square(180 - applePad * 2).png().toBuffer(), left: applePad, top: applePad}])
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));

  const ico = buildIco(
    await Promise.all([16, 32, 48].map(async (size) => ({size, data: await square(size).png().toBuffer()})))
  );
  await writeFile(path.join(appDir, 'favicon.ico'), ico);

  // Default Open Graph image: dark background + logo + slogan
  const W = 1200;
  const H = 630;
  const backdrop = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${BG}"/>
          <stop offset="0.62" stop-color="#03101c"/>
          <stop offset="1" stop-color="#063a52"/>
        </linearGradient>
        <radialGradient id="r" cx="0.5" cy="1.15" r="0.75">
          <stop offset="0" stop-color="#3ec8e4" stop-opacity="0.55"/>
          <stop offset="1" stop-color="#3ec8e4" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
      <rect width="${W}" height="${H}" fill="url(#r)"/>
      <text x="470" y="285" font-family="Poppins, Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="900" font-size="78" fill="#ffffff">SOHVAN PESU</text>
      <text x="470" y="372" font-family="Poppins, Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="900" font-size="78" fill="#ffffff">KOTONASI</text>
      <text x="472" y="436" font-family="Poppins, Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="500" font-size="30" fill="#9ad9ec">Paikan päällä · joka päivä 6–21 · puropesu.fi</text>
    </svg>`
  );
  await sharp(backdrop)
    .composite([{input: await square(340).png().toBuffer(), left: 80, top: 145}])
    .png({compressionLevel: 9})
    // a plain static file: it is referenced explicitly from page metadata and JSON-LD
    .toFile(path.join(root, 'public/og-default.png'));

  console.log('Icons generated from', path.relative(root, source!));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
