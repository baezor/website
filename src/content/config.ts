import { defineCollection, z } from 'astro:content';

// FAQ item schema for structured data
const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    metaDescription: z.string().max(160).optional(),
    keywords: z.array(z.string()).optional(),
    contentType: z.enum(['technical-tutorial', 'algorithm', 'personal-essay', 'project-showcase']).optional(),
    lang: z.enum(['en', 'es']).default('en'),
    // FAQ section for AEO optimization
    faqs: z.array(faqItemSchema).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};