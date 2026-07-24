import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    author: z.string().optional(),
    draft: z.boolean().default(false),
    published: z.boolean().default(true),
    featured: z.boolean().default(false),
    toc: z.boolean().default(true),
    comment: z.boolean().default(true),
    language: z.enum(['zh-CN', 'en-US']).default('zh-CN'),
  }),
});

const plog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/plog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().default(''),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    album: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().default('i-carbon:camera'),
      accent: z.string().default('#5b8def'),
    }),
    location: z.string().default(''),
    camera: z.string().default(''),
    tags: z.array(z.string()).default([]),
    image: image().optional(),
    imageAlt: z.string().optional(),
    photos: z.array(z.object({
      file: z.string(),
      title: z.string().optional(),
      caption: z.string().optional(),
      description: z.string().optional(),
      signature: z.string().optional(),
      alt: z.string().optional(),
      date: z.coerce.date().optional(),
      location: z.string().optional(),
      camera: z.string().optional(),
      tags: z.array(z.string()).optional(),
      accent: z.string().optional(),
      featured: z.boolean().optional(),
      downloadName: z.string().optional(),
    })).default([]),
    gradient: z.string().default('linear-gradient(135deg, #5b8def 0%, #7c3aed 52%, #f97316 100%)'),
    accent: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    published: z.boolean().default(true),
    language: z.enum(['zh-CN', 'en-US']).default('zh-CN'),
  }),
});

export const collections = { blog, plog };
