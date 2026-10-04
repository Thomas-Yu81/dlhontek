import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categoryIds } from './data/categories';

const localized = z.object({ zh: z.string(), en: z.string() });
const strings = z.array(z.string()).nullish().transform((v) => v ?? []);
const localizedList = z.object({ zh: strings, en: strings });

const products = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/products' }),
  schema: z.object({
    model: z.string(),
    category: z.enum(categoryIds),
    featured: z.boolean().nullish().transform((v) => v ?? false),
    order: z.number().nullish().transform((v) => v ?? 100),
    name: localized,
    summary: localized,
    features: localizedList,
    applications: localizedList,
    specs: z
      .array(z.object({ label: localized, value: z.union([z.string(), localized]) }))
      .nullish()
      .transform((v) => v ?? []),
    tags: strings,
    images: strings,
    datasheet: z.string().nullish(),
    body: z
      .object({ zh: z.string().nullish(), en: z.string().nullish() })
      .nullish()
      .transform((v) => v ?? {}),
  }),
});

export const collections = { products };
