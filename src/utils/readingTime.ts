/**
 * Calculate estimated reading time for a blog post
 * @param content - The markdown content of the blog post
 * @param wordsPerMinute - Average reading speed (default: 200 WPM)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  // Remove markdown syntax for more accurate word count
  const cleanContent = content
    // Remove frontmatter (only the first occurrence)
    .replace(/^---[\s\S]*?---/, '')
    // Remove fenced code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove indented code blocks (4+ spaces or tab at line start)
    .replace(/^(?:    |\t).+$/gm, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Convert links to text (handle simple nested brackets by removing link part)
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // Remove markdown formatting characters
    .replace(/[#*_~]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Count words
  const words = cleanContent.split(/\s+/).filter(word => word.length > 0).length;

  // Calculate reading time (minimum 1 minute)
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  return minutes;
}
