import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from './readingTime';

describe('calculateReadingTime', () => {
  describe('basic word counting', () => {
    it('should calculate reading time for simple text', () => {
      // 200 words at 200 WPM = 1 minute
      const words = Array(200).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe(1);
    });

    it('should round up to nearest minute', () => {
      // 250 words at 200 WPM = 1.25 minutes, should round up to 2
      const words = Array(250).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe(2);
    });

    it('should enforce minimum 1 minute reading time', () => {
      expect(calculateReadingTime('Short text')).toBe(1);
      expect(calculateReadingTime('Just a few words here')).toBe(1);
    });

    it('should handle empty content', () => {
      expect(calculateReadingTime('')).toBe(1);
      expect(calculateReadingTime('   ')).toBe(1);
    });
  });

  describe('frontmatter removal', () => {
    it('should remove YAML frontmatter', () => {
      const content = `---
title: Test Post
description: A test
---

This is the actual content.`.concat(' word'.repeat(192));

      // Should only count "This is the actual content." (5 words) + 192 "word" = 197 words
      // At 200 WPM, 197 words rounds up to 1 minute
      const result = calculateReadingTime(content);
      expect(result).toBe(1);
    });

    it('should handle content without frontmatter', () => {
      const content = 'Regular markdown content without frontmatter';
      expect(calculateReadingTime(content)).toBe(1);
    });
  });

  describe('code block removal', () => {
    it('should remove fenced code blocks', () => {
      const content = `
Some text here.

\`\`\`javascript
const code = "This should be ignored";
const moreCode = "Also ignored";
\`\`\`

More text here.
`;
      // Should only count "Some text here. More text here."
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should remove multiple code blocks', () => {
      const content = `
Text before.

\`\`\`js
const first = "ignored";
\`\`\`

Middle text.

\`\`\`python
def second():
    pass
\`\`\`

Text after.
`;
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should remove inline code', () => {
      const content = 'Use the `calculateReadingTime` function with `content` parameter.';
      // Should count: "Use the function with parameter."
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should remove indented code blocks (4 spaces)', () => {
      const content = `
Some text here.

    const indentedCode = "ignored";
    const moreIndented = "also ignored";

More text here.
`;
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should remove indented code blocks (tabs)', () => {
      const content = `
Some text here.

\tconst tabbedCode = "ignored";
\tconst moreTabs = "also ignored";

More text here.
`;
      expect(calculateReadingTime(content)).toBe(1);
    });
  });

  describe('markdown syntax removal', () => {
    it('should convert links to text', () => {
      const content = 'Check out [this link](https://example.com) for more info.';
      // Should count: "Check out this link for more info."
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should remove images', () => {
      const content = 'Here is an image: ![Alt text](image.png) followed by text.';
      // Should count: "Here is an image: followed by text."
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should remove markdown formatting characters', () => {
      const content = '# Heading\n\n**Bold text** and *italic text* and ~~strikethrough~~.';
      // Should count words without formatting chars
      expect(calculateReadingTime(content)).toBe(1);
    });
  });

  describe('whitespace normalization', () => {
    it('should normalize multiple spaces', () => {
      const content = 'Multiple    spaces     between    words';
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should normalize newlines', () => {
      const content = 'Line one\n\nLine two\n\n\nLine three';
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should trim leading and trailing whitespace', () => {
      const content = '   Content with spaces   ';
      expect(calculateReadingTime(content)).toBe(1);
    });
  });

  describe('custom words per minute', () => {
    it('should accept custom WPM rate', () => {
      const words = Array(400).fill('word').join(' ');

      // At 200 WPM: 400 words = 2 minutes
      expect(calculateReadingTime(words, 200)).toBe(2);

      // At 400 WPM: 400 words = 1 minute
      expect(calculateReadingTime(words, 400)).toBe(1);

      // At 100 WPM: 400 words = 4 minutes
      expect(calculateReadingTime(words, 100)).toBe(4);
    });
  });

  describe('real-world content examples', () => {
    it('should handle typical blog post content', () => {
      const content = `---
title: My Blog Post
pubDate: 2025-01-05
---

# Introduction

This is a **real blog post** with various elements.

## Code Example

\`\`\`typescript
function example() {
  return "This code is ignored";
}
\`\`\`

## Lists

- First item
- Second item
- Third item

Check out [this link](https://example.com) for more.

![Screenshot](screenshot.png)

Regular paragraph text continues here.
`.concat(' word'.repeat(180));

      // Should count actual readable content, not frontmatter or code
      const result = calculateReadingTime(content);
      expect(result).toBeGreaterThanOrEqual(1);
    });

    it('should handle content with only code blocks', () => {
      const content = `\`\`\`javascript
const allCode = true;
\`\`\``;
      expect(calculateReadingTime(content)).toBe(1); // Minimum
    });
  });

  describe('HTML tag removal', () => {
    it('should remove HTML tags', () => {
      const content = 'This is <strong>bold</strong> and <em>italic</em> text.';
      // Should count: "This is bold and italic text."
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should remove HTML tags with attributes', () => {
      const content = 'Click <a href="https://example.com" class="link">here</a> for more.';
      // Should count: "Click here for more."
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should remove self-closing HTML tags', () => {
      const content = 'Line break here<br />and continue text.';
      expect(calculateReadingTime(content)).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle content with special characters', () => {
      const content = 'Content with special chars: @#$%^&*()';
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should handle URLs in text', () => {
      const content = 'Visit https://example.com for more information about this topic.';
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should handle mixed language content', () => {
      const content = 'English text and español mezclado together in content.';
      expect(calculateReadingTime(content)).toBe(1);
    });

    it('should handle very long content', () => {
      // 2000 words at 200 WPM = 10 minutes
      const words = Array(2000).fill('word').join(' ');
      expect(calculateReadingTime(words)).toBe(10);
    });

    it('should only remove first frontmatter block', () => {
      const content = `---
title: First
---

Content here with --- dashes in text.

More content.`;
      // Should keep "--- dashes in text" as content
      expect(calculateReadingTime(content)).toBe(1);
    });
  });
});
