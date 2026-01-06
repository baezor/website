/**
 * Calculate estimated reading time for a blog post
 * @param content - The markdown content of the blog post
 * @param wordsPerMinute - Average reading speed (default: 200 WPM)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  // Remove markdown syntax for more accurate word count
  const cleanContent = content
    .replace(/^---[\s\S]*?---/m, '') // Remove frontmatter
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to text
    .replace(/[#*_~]/g, '') // Remove markdown formatting
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Count words
  const words = cleanContent.split(/\s+/).filter(word => word.length > 0).length;

  // Calculate reading time (minimum 1 minute)
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  return minutes;
}
