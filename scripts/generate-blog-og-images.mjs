import sharp from 'sharp';
import { readdir, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BLOG_DIR = join(__dirname, '..', 'src', 'content', 'blog');
const OUTPUT_DIR = join(__dirname, '..', 'src', 'assets', 'og');

const WIDTH = 1200;
const HEIGHT = 630;

// Colors matching brutalist theme
const BG = '#0a0a0a';
const TEXT = '#e8e6e3';
const ACCENT = '#ff3b30';
const DIM = '#5a5850';
const BORDER = '#2a2a28';

/**
 * Simple hash function to generate deterministic values from a string.
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded pseudo-random number generator.
 */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/**
 * Generate abstract grid pattern SVG elements.
 * Creates a unique pattern seeded from the post title.
 */
function generateGridPattern(title) {
  const seed = hashString(title);
  const rand = seededRandom(seed);

  const cols = 24;
  const rows = 12;
  const cellW = WIDTH / cols;
  const cellH = HEIGHT / rows;
  let elements = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const val = rand();

      // Only fill ~30% of cells for a sparse, deliberate look
      if (val > 0.7) {
        const x = col * cellW;
        const y = row * cellH;

        // Determine cell style
        const styleVal = rand();
        let fill, opacity;

        if (styleVal < 0.15) {
          // Accent red cells (rare, high impact)
          fill = ACCENT;
          opacity = 0.3 + rand() * 0.5;
        } else if (styleVal < 0.4) {
          // Lighter cells
          fill = TEXT;
          opacity = 0.03 + rand() * 0.06;
        } else {
          // Border-color cells (subtle structure)
          fill = TEXT;
          opacity = 0.01 + rand() * 0.04;
        }

        elements += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${fill}" opacity="${opacity}"/>`;
      }
    }
  }

  // Add a few horizontal accent lines for structure
  const lineCount = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < lineCount; i++) {
    const y = Math.floor(rand() * rows) * cellH;
    const x1 = Math.floor(rand() * 8) * cellW;
    const x2 = x1 + (4 + Math.floor(rand() * 12)) * cellW;
    const opacity = 0.1 + rand() * 0.25;
    elements += `<line x1="${x1}" y1="${y}" x2="${Math.min(x2, WIDTH)}" y2="${y}" stroke="${ACCENT}" stroke-width="1" opacity="${opacity}"/>`;
  }

  return elements;
}

/**
 * Wrap text to fit within maxWidth (approximate character count).
 * Returns array of lines.
 */
function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) lines.push(current.trim());

  return lines.slice(0, 3); // Max 3 lines
}

/**
 * Escape XML special characters.
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate OG image SVG for a blog post.
 */
function generateSvg(title, category, date) {
  const gridPattern = generateGridPattern(title);
  const titleUpper = title.toUpperCase();
  const titleLines = wrapText(titleUpper, 28);
  const fontSize = titleLines.length > 2 ? 52 : titleLines.length > 1 ? 58 : 68;
  const lineHeight = fontSize * 1.15;
  const titleStartY = 240 + ((3 - titleLines.length) * lineHeight * 0.3);

  const titleElements = titleLines.map((line, i) =>
    `<text x="80" y="${titleStartY + i * lineHeight}"
           font-family="Arial Black, Impact, sans-serif"
           font-size="${fontSize}"
           font-weight="900"
           fill="${TEXT}"
           letter-spacing="1">
      ${escapeXml(line)}
    </text>`
  ).join('\n');

  const categoryUpper = category ? category.toUpperCase() : '';

  return `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="100%" height="100%" fill="${BG}"/>

  <!-- Generative grid pattern -->
  ${gridPattern}

  <!-- Top accent bar -->
  <rect x="0" y="0" width="${WIDTH}" height="3" fill="${ACCENT}"/>

  <!-- Category label -->
  ${categoryUpper ? `
  <text x="80" y="${titleStartY - lineHeight * 0.8}"
        font-family="Courier New, monospace"
        font-size="14"
        font-weight="700"
        fill="${ACCENT}"
        letter-spacing="3">
    ${escapeXml(categoryUpper)}
  </text>` : ''}

  <!-- Title -->
  ${titleElements}

  <!-- Bottom section -->
  <line x1="80" y1="520" x2="400" y2="520" stroke="${BORDER}" stroke-width="1"/>

  <!-- Date -->
  <text x="80" y="555"
        font-family="Courier New, monospace"
        font-size="13"
        fill="${DIM}"
        letter-spacing="2">
    ${date || ''}
  </text>

  <!-- Site URL -->
  <text x="80" y="580"
        font-family="Courier New, monospace"
        font-size="13"
        fill="${DIM}"
        letter-spacing="2">
    ANGEL-BAEZ.COM
  </text>

  <!-- Bottom accent bar -->
  <rect x="0" y="${HEIGHT - 3}" width="${WIDTH}" height="3" fill="${ACCENT}"/>
</svg>`;
}

/**
 * Parse frontmatter from a markdown file.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    fm[key] = value;
  }

  return fm;
}

/**
 * Parse categories from frontmatter (handles YAML arrays).
 */
function parseCategories(content) {
  const match = content.match(/categories:\s*\n((?:\s+-\s+.*\n?)*)/);
  if (match) {
    return match[1]
      .split('\n')
      .map(l => l.replace(/^\s+-\s+/, '').replace(/["']/g, '').trim())
      .filter(Boolean);
  }

  // Inline array format
  const inlineMatch = content.match(/categories:\s*\[(.*?)\]/);
  if (inlineMatch) {
    return inlineMatch[1].split(',').map(c => c.replace(/["'\s]/g, '').trim()).filter(Boolean);
  }

  return [];
}

/**
 * Main: generate OG images for all blog posts.
 */
async function main() {
  // Parse CLI args
  const args = process.argv.slice(2);
  const forceAll = args.includes('--force');
  const specificSlug = args.find(a => !a.startsWith('--'));

  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  // Read all blog posts
  const files = (await readdir(BLOG_DIR)).filter(f => f.endsWith('.md'));
  let generated = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = file.replace('.md', '');

    // Filter by specific slug if provided
    if (specificSlug && slug !== specificSlug) continue;

    const outputPath = join(OUTPUT_DIR, `${slug}.png`);

    // Skip if image already exists (unless --force)
    if (!forceAll && existsSync(outputPath)) {
      skipped++;
      continue;
    }

    const content = await readFile(join(BLOG_DIR, file), 'utf-8');
    const fm = parseFrontmatter(content);
    const categories = parseCategories(content);
    const category = categories[0] || '';

    // Format date as YYYY.MM.DD
    let dateStr = '';
    if (fm.pubDate) {
      try {
        const d = new Date(fm.pubDate);
        dateStr = d.toISOString().slice(0, 10).replace(/-/g, '.');
      } catch { }
    }

    const title = fm.title || slug.replace(/-/g, ' ');
    const svg = generateSvg(title, category, dateStr);

    await sharp(Buffer.from(svg))
      .png({ quality: 90 })
      .toFile(outputPath);

    generated++;
    console.log(`  ✓ ${slug}.png`);
  }

  console.log(`\nDone: ${generated} generated, ${skipped} skipped (already exist)`);
  if (skipped > 0) {
    console.log('  Use --force to regenerate all images');
  }
}

main().catch(console.error);
