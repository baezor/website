import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Social card dimensions (recommended for Open Graph)
const WIDTH = 1200;
const HEIGHT = 630;

// Colors matching the site's theme
const BACKGROUND_COLOR = '#faf9f5'; // Light theme background
const TEXT_COLOR = '#141413'; // Dark text

// Create SVG with site branding
const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&amp;display=swap');
    </style>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="${BACKGROUND_COLOR}"/>

  <!-- Subtle pattern/texture -->
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${TEXT_COLOR}" stroke-width="0.5" opacity="0.05"/>
  </pattern>
  <rect width="100%" height="100%" fill="url(#grid)"/>

  <!-- Accent line at top -->
  <rect x="0" y="0" width="${WIDTH}" height="8" fill="#C9A227"/>

  <!-- Main title -->
  <text x="600" y="260"
        font-family="Poppins, sans-serif"
        font-size="80"
        font-weight="700"
        fill="${TEXT_COLOR}"
        text-anchor="middle"
        letter-spacing="-2">
    Angel Baez
  </text>

  <!-- Subtitle -->
  <text x="600" y="340"
        font-family="Poppins, sans-serif"
        font-size="36"
        font-weight="600"
        fill="${TEXT_COLOR}"
        text-anchor="middle"
        opacity="0.7">
    Full Stack Developer
  </text>

  <!-- Decorative elements -->
  <line x1="400" y1="390" x2="800" y2="390" stroke="#C9A227" stroke-width="2"/>

  <!-- Website URL -->
  <text x="600" y="450"
        font-family="Poppins, sans-serif"
        font-size="24"
        font-weight="600"
        fill="${TEXT_COLOR}"
        text-anchor="middle"
        opacity="0.5">
    angel-baez.com
  </text>
</svg>
`;

async function generateSocialCard() {
  const outputPath = join(__dirname, '..', 'src', 'assets', 'social-card.png');

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  console.log(`Social card generated: ${outputPath}`);
}

generateSocialCard().catch(console.error);
