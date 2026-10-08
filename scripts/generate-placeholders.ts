/**
 * Draws placeholder before/after pairs into public/images/before-after/.
 * They are illustrations marked "DEMO" — replace them with real photos using the same
 * file names (or upload real pairs in /admin → Галерея) and the site picks them up as is.
 *
 * Usage: npm run images:placeholders            (skips files that already exist)
 *        npm run images:placeholders -- --force (overwrites everything)
 */
import {existsSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const W = 1200;
const H = 900;
const outDir = path.join(process.cwd(), 'public/images/before-after');
const force = process.argv.includes('--force');

type Kind = 'sofa2' | 'sofa3' | 'chair' | 'armchair' | 'armchair-ottoman' | 'mattress' | 'corner' | 'bed';

const items: {file: string; kind: Kind; color: string; wall: string}[] = [
  {file: '01-kangassohva', kind: 'sofa3', color: '#8fa3b8', wall: '#e9e4dc'},
  {file: '02-ruokapoydan-tuoli', kind: 'chair', color: '#cdb892', wall: '#e4e7ea'},
  {file: '03-boucle-sohva', kind: 'sofa2', color: '#ebe3d2', wall: '#d9dde0'},
  {file: '04-korvanojatuoli', kind: 'armchair', color: '#6f917d', wall: '#ece7df'},
  {file: '05-patja', kind: 'mattress', color: '#f2efe9', wall: '#dfe3e8'},
  {file: '06-vaalea-kangassohva', kind: 'sofa3', color: '#efe9dd', wall: '#d5dadf'},
  {file: '07-nojatuoli-ja-rahi', kind: 'armchair-ottoman', color: '#b98d6a', wall: '#e8e6e1'},
  {file: '08-kulmasohva', kind: 'corner', color: '#7f8a99', wall: '#ebe6de'},
  {file: '09-nahkasohva', kind: 'sofa2', color: '#74452e', wall: '#e2e2de'},
  {file: '10-parisanky', kind: 'bed', color: '#e3e8ee', wall: '#e6e1d8'}
];

function mix(hex: string, other: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [a, b] = [p(hex), p(other)];
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

// small deterministic PRNG so placeholders are stable between runs
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rect = (x: number, y: number, w: number, h: number, r: number, fill: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;

/** Upholstered parts (stains are clipped to these) and hard parts (legs, frames) per furniture type. */
function furniture(kind: Kind, c: string): {soft: string[]; hard: string[]} {
  const dark = mix(c, '#000000', 0.16);
  const light = mix(c, '#ffffff', 0.14);
  const wood = '#5b4636';
  const sofa = (x: number, w: number, cushions: number) => {
    const soft = [
      rect(x + 40, 330, w - 80, 250, 56, dark),
      rect(x, 410, 130, 260, 48, c),
      rect(x + w - 130, 410, 130, 260, 48, c),
      rect(x + 110, 600, w - 220, 80, 20, dark)
    ];
    const cw = (w - 240) / cushions;
    for (let i = 0; i < cushions; i++) {
      soft.push(rect(x + 120 + i * cw + 5, 380, cw - 10, 150, 34, c));
      soft.push(rect(x + 120 + i * cw + 3, 510, cw - 6, 110, 30, light));
    }
    const hard = [rect(x + 60, 680, 26, 56, 6, wood), rect(x + w - 86, 680, 26, 56, 6, wood)];
    return {soft, hard};
  };
  switch (kind) {
    case 'sofa3':
      return sofa(150, 900, 3);
    case 'sofa2':
      return sofa(230, 740, 2);
    case 'corner': {
      const base = sofa(110, 820, 3);
      base.soft.push(
        `<path d="M700 520 H1010 a40 40 0 0 1 40 40 V740 a40 40 0 0 1 -40 40 H740 a40 40 0 0 1 -40 -40 Z" fill="${light}"/>`,
        rect(690, 700, 370, 80, 30, dark)
      );
      base.hard.push(rect(1000, 780, 26, 40, 6, wood), rect(730, 780, 26, 40, 6, wood));
      return base;
    }
    case 'armchair':
    case 'armchair-ottoman': {
      const x = kind === 'armchair' ? 380 : 220;
      const soft = [
        `<path d="M${x + 60} 250 h320 a50 50 0 0 1 50 50 v330 h-420 v-330 a50 50 0 0 1 50 -50 z" fill="${dark}"/>`,
        rect(x, 400, 110, 270, 46, c),
        rect(x + 330, 400, 110, 270, 46, c),
        rect(x + 100, 330, 240, 200, 36, c),
        rect(x + 96, 520, 248, 110, 30, light),
        rect(x + 90, 610, 260, 66, 18, dark)
      ];
      const hard = [rect(x + 50, 676, 24, 64, 6, wood), rect(x + 366, 676, 24, 64, 6, wood)];
      if (kind === 'armchair-ottoman') {
        soft.push(rect(740, 560, 260, 130, 40, c), rect(748, 548, 244, 60, 28, light));
        hard.push(rect(770, 690, 22, 50, 6, wood), rect(948, 690, 22, 50, 6, wood));
      }
      return {soft, hard};
    }
    case 'chair':
      return {
        soft: [rect(440, 250, 320, 250, 40, c), rect(420, 520, 360, 80, 30, light)],
        hard: [
          rect(450, 590, 26, 180, 6, wood),
          rect(724, 590, 26, 180, 6, wood),
          rect(455, 480, 22, 60, 4, wood),
          rect(723, 480, 22, 60, 4, wood)
        ]
      };
    case 'mattress':
      return {
        soft: [
          `<path d="M210 470 L900 400 a40 40 0 0 1 36 12 L1050 520 a30 30 0 0 1 -18 48 L330 650 a40 40 0 0 1 -36 -14 L196 520 a30 30 0 0 1 14 -50 z" fill="${light}"/>`,
          `<path d="M300 640 L1040 560 V640 a30 30 0 0 1 -26 30 L330 740 a36 36 0 0 1 -32 -12 z" fill="${dark}"/>`,
          `<path d="M196 520 L300 640 V728 L190 600 z" fill="${mix(c, '#000000', 0.24)}"/>`
        ],
        hard: []
      };
    case 'bed':
      return {
        soft: [
          rect(200, 250, 800, 260, 30, mix(c, '#000000', 0.22)),
          rect(170, 470, 860, 170, 36, light),
          rect(230, 410, 320, 110, 40, '#ffffff'),
          rect(650, 410, 320, 110, 40, '#ffffff'),
          rect(170, 600, 860, 90, 24, dark)
        ],
        hard: [rect(200, 690, 30, 50, 6, wood), rect(970, 690, 30, 50, 6, wood)]
      };
  }
}

function scene(item: (typeof items)[number], state: 'before' | 'after', seed: number) {
  const dirty = state === 'before';
  // "before": the fabric is greyer and browner, with blotches clipped to the upholstery
  const color = dirty ? mix(mix(item.color, '#6b5a45', 0.34), '#3a3a3a', 0.12) : item.color;
  const {soft, hard} = furniture(item.kind, color);
  const rand = rng(seed);
  const stains = Array.from({length: 9}, () => {
    const cx = 220 + rand() * 760;
    const cy = 360 + rand() * 300;
    const rx = 30 + rand() * 70;
    const ry = 18 + rand() * 40;
    const tone = rand() > 0.5 ? '#4a3524' : '#3d3d3d';
    return `<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="${tone}" opacity="${(0.22 + rand() * 0.26).toFixed(2)}" transform="rotate(${(rand() * 60 - 30).toFixed(0)} ${cx.toFixed(0)} ${cy.toFixed(0)})"/>`;
  }).join('');
  const sparkles = [
    [300, 300, 20],
    [860, 270, 26],
    [960, 420, 16]
  ]
    .map(
      ([x, y, s]) =>
        `<path d="M${x} ${y - s} L${x + s * 0.24} ${y - s * 0.24} L${x + s} ${y} L${x + s * 0.24} ${y + s * 0.24} L${x} ${y + s} L${x - s * 0.24} ${y + s * 0.24} L${x - s} ${y} L${x - s * 0.24} ${y - s * 0.24} Z" fill="#ffffff" opacity="0.9"/>`
    )
    .join('');
  const wall = dirty ? mix(item.wall, '#8a8478', 0.18) : item.wall;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${mix(wall, '#ffffff', 0.25)}"/>
        <stop offset="1" stop-color="${wall}"/>
      </linearGradient>
      <filter id="blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
      <filter id="shadow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
      <clipPath id="soft">${soft.join('').replace(/ fill="[^"]*"/g, '')}</clipPath>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#wall)"/>
    <rect y="700" width="${W}" height="200" fill="${mix(wall, '#7b6a58', dirty ? 0.5 : 0.38)}"/>
    <rect y="696" width="${W}" height="8" fill="${mix(wall, '#000000', 0.12)}"/>
    <ellipse cx="600" cy="752" rx="460" ry="26" fill="#000000" opacity="0.28" filter="url(#shadow)"/>
    ${hard.join('')}
    ${soft.join('')}
    ${dirty ? `<g clip-path="url(#soft)" filter="url(#blur)">${stains}</g>` : sparkles}
    <text x="${W - 36}" y="${H - 32}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="6" fill="#000000" opacity="0.28">DEMO</text>
  </svg>`;
}

async function main() {
  await mkdir(outDir, {recursive: true});
  let written = 0;
  for (const [index, item] of items.entries()) {
    for (const state of ['before', 'after'] as const) {
      const file = path.join(outDir, `${item.file}-${state}.jpg`);
      if (existsSync(file) && !force) continue;
      await sharp(Buffer.from(scene(item, state, index * 97 + 13)))
        .jpeg({quality: 82, mozjpeg: true})
        .toFile(file);
      written++;
    }
  }
  console.log(`${written} placeholder images written to public/images/before-after/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
