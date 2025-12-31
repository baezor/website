import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../_posts');
const DEST_DIR = path.join(__dirname, '../src/content/blog');

// Known typos to fix
const TYPO_FIXES = {
  'midn': 'mind',
};

/**
 * Fix typos in text
 */
function fixTypos(text) {
  let fixed = text;
  for (const [wrong, right] of Object.entries(TYPO_FIXES)) {
    fixed = fixed.replace(new RegExp(`\\b${wrong}\\b`, 'g'), right);
  }
  return fixed;
}

/**
 * Parse Jekyll frontmatter from content
 */
function parseJekyllFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error('Invalid frontmatter format');
  }

  const frontmatterText = match[1];
  const markdownContent = match[2];

  const frontmatter = {};
  const lines = frontmatterText.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();
    frontmatter[key] = value;
  }

  return { frontmatter, content: markdownContent };
}

/**
 * Convert Jekyll date format to ISO 8601 UTC
 * Example: "2024-07-01 00:00:00 -0500" -> "2024-07-01T05:00:00.000Z"
 */
function convertDateToISO(jekyllDate) {
  // Parse: "YYYY-MM-DD HH:MM:SS ±HHMM"
  const dateRegex = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})\s+([+-])(\d{2})(\d{2})$/;
  const match = jekyllDate.match(dateRegex);

  if (!match) {
    throw new Error(`Invalid date format: ${jekyllDate}`);
  }

  const [, year, month, day, hours, minutes, seconds, tzSign, tzHours, tzMinutes] = match;

  // Create date in the original timezone
  const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);

  // Adjust for timezone offset to get UTC
  const offsetMinutes = parseInt(tzHours) * 60 + parseInt(tzMinutes);
  const offsetMs = offsetMinutes * 60 * 1000;

  if (tzSign === '-') {
    // Negative offset means behind UTC, so add to get UTC
    date.setTime(date.getTime() + offsetMs);
  } else {
    // Positive offset means ahead of UTC, so subtract to get UTC
    date.setTime(date.getTime() - offsetMs);
  }

  return date.toISOString();
}

/**
 * Parse space-separated categories into array
 */
function parseCategories(categoriesString) {
  if (!categoriesString) return [];
  return categoriesString.split(/\s+/).filter(c => c.length > 0);
}

/**
 * Extract slug from Jekyll filename
 * Example: "2024-07-01-all-my-links.md" -> "all-my-links"
 */
function extractSlugFromFilename(filename) {
  // Remove .md extension
  const withoutExt = filename.replace(/\.md$/, '');
  // Remove YYYY-MM-DD- prefix
  return withoutExt.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/**
 * Generate Astro frontmatter
 */
function generateAstroFrontmatter(jekyllData) {
  const { title, description, date, categories } = jekyllData;

  const astroFrontmatter = {
    title: title.replace(/^["']|["']$/g, ''), // Remove quotes if present
    description: fixTypos(description.replace(/^["']|["']$/g, '')),
    pubDate: convertDateToISO(date),
  };

  if (categories && categories.length > 0) {
    astroFrontmatter.categories = categories;
  }

  return astroFrontmatter;
}

/**
 * Convert frontmatter object to YAML string
 */
function frontmatterToYAML(frontmatter) {
  let yaml = '---\n';

  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      yaml += `${key}:\n`;
      for (const item of value) {
        yaml += `  - ${item}\n`;
      }
    } else if (key === 'pubDate') {
      // Don't quote date values - Astro needs to parse them
      yaml += `${key}: ${value}\n`;
    } else {
      // Quote string values for safety
      yaml += `${key}: "${value}"\n`;
    }
  }

  yaml += '---\n';
  return yaml;
}

/**
 * Migrate a single post
 */
function migratePost(sourceFile) {
  const filename = path.basename(sourceFile);
  const slug = extractSlugFromFilename(filename);
  const destFile = path.join(DEST_DIR, `${slug}.md`);

  console.log(`\nMigrating: ${filename} -> ${slug}.md`);

  // Check if destination already exists
  if (fs.existsSync(destFile)) {
    console.warn(`  ⚠️  Warning: ${slug}.md already exists, skipping`);
    return { success: false, reason: 'exists' };
  }

  // Read source file
  const content = fs.readFileSync(sourceFile, 'utf-8');

  try {
    // Parse Jekyll frontmatter
    const { frontmatter, content: markdownContent } = parseJekyllFrontmatter(content);

    // Validate required fields
    if (!frontmatter.title || !frontmatter.date || !frontmatter.description) {
      throw new Error('Missing required fields (title, date, or description)');
    }

    // Parse categories
    const categories = parseCategories(frontmatter.categories);

    // Generate Astro frontmatter
    const astroFrontmatter = generateAstroFrontmatter({
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      categories,
    });

    // Create new content
    const newContent = frontmatterToYAML(astroFrontmatter) + markdownContent;

    // Write to destination
    fs.writeFileSync(destFile, newContent, 'utf-8');

    console.log(`  ✓ Successfully migrated`);
    console.log(`    Title: ${astroFrontmatter.title}`);
    console.log(`    Date: ${astroFrontmatter.pubDate}`);
    if (categories.length > 0) {
      console.log(`    Categories: ${categories.join(', ')}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return { success: false, reason: error.message };
  }
}

/**
 * Main migration function
 */
function main() {
  console.log('='.repeat(60));
  console.log('Jekyll to Astro Blog Migration Script');
  console.log('='.repeat(60));

  // Check if source directory exists
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`\n✗ Error: Source directory not found: ${POSTS_DIR}`);
    process.exit(1);
  }

  // Check if destination directory exists
  if (!fs.existsSync(DEST_DIR)) {
    console.error(`\n✗ Error: Destination directory not found: ${DEST_DIR}`);
    process.exit(1);
  }

  // Get all markdown files
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('\n✗ No markdown files found in _posts directory');
    process.exit(1);
  }

  console.log(`\nFound ${files.length} posts to migrate\n`);

  // Migrate each post
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
  };

  for (const file of files) {
    const sourceFile = path.join(POSTS_DIR, file);
    const result = migratePost(sourceFile);

    if (result.success) {
      results.success++;
    } else if (result.reason === 'exists') {
      results.skipped++;
    } else {
      results.failed++;
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('Migration Summary');
  console.log('='.repeat(60));
  console.log(`✓ Successfully migrated: ${results.success}`);
  if (results.skipped > 0) {
    console.log(`⚠ Skipped (already exists): ${results.skipped}`);
  }
  if (results.failed > 0) {
    console.log(`✗ Failed: ${results.failed}`);
  }
  console.log('='.repeat(60));

  if (results.failed > 0) {
    console.log('\n⚠️  Some posts failed to migrate. Please review the errors above.');
    process.exit(1);
  }

  console.log('\n✓ Migration completed successfully!');
  console.log('\nNext steps:');
  console.log('  1. Run: npm run build');
  console.log('  2. Run: npm run dev (and check /blog/)');
  console.log('  3. Run: npm run test:visual');
}

// Run migration
main();
