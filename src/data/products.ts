import { getCollection, type CollectionEntry } from 'astro:content';
import { categoryIds, getCategory, type CategoryId } from './categories';
import { localePath, type Lang } from '../i18n';

export type Product = CollectionEntry<'products'>;

export const getProducts = async (): Promise<Product[]> =>
  (await getCollection('products')).sort(
    (a, b) =>
      categoryIds.indexOf(a.data.category) - categoryIds.indexOf(b.data.category) ||
      a.data.order - b.data.order ||
      a.data.model.localeCompare(b.data.model),
  );

export const productsIn = (all: Product[], category: CategoryId) =>
  all.filter((p) => p.data.category === category);

export const productUrl = (lang: Lang, p: Product) =>
  localePath(lang, `/products/${p.data.category}/${p.id}/`);

export const productImage = (p: Product) =>
  p.data.images[0] ?? getCategory(p.data.category).placeholder;
