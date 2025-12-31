import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    categories: z.array(z.string()).optional(),
    metaDescription: z.string().max(160).optional(),
    keywords: z.array(z.string()).optional(),
    contentType: z.enum(['technical-tutorial', 'algorithm', 'personal-essay', 'project-showcase']).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};