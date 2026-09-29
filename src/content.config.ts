import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categoryIds } from './data/categories';

const localized = z.object({ zh: z.string(), en: z.string() });
const localizedList = z.object({ zh: z.array(z.string()), en: z.array(z.string()) });

const products = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/products' }),
  schema: z.object({
    model: z.string(),
    category: z.enum(categoryIds),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    name: localized,
    summary: localized,
    features: localizedList,
    applications: localizedList,
    specs: z.array(z.object({ label: localized, value: z.union([z.string(), localized]) })),
    tags: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    datasheet: z.string().optional(),
    body: z.object({ zh: z.string().optional(), en: z.string().optional() }).default({}),
  }),
});

export const collections = { products };
