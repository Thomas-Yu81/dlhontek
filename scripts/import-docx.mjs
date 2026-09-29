#!/usr/bin/env node
// 将 Word（.docx）产品资料转换为产品 YAML + 图片。
// 用法: npm run import:docx -- <docx 文件或目录> --category <分类ID> [--lang zh|en]
//   分类ID: water-quality | valves | flow | pressure-level
// 已存在的 YAML 只更新 body.<lang> 与 images，不会覆盖手工填写的其他字段。
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import mammoth from 'mammoth';

const CATEGORIES = ['water-quality', 'valves', 'flow', 'pressure-level'];
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CONTENT = path.join(ROOT, 'src/content/products');
const IMAGES = path.join(ROOT, 'public/images/products');

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args.splice(i, 2)[1] : def;
};
const category = opt('category');
const lang = opt('lang', 'zh');
const input = args[0];
if (!input || !CATEGORIES.includes(category) || !['zh', 'en'].includes(lang)) {
  console.error('Usage: npm run import:docx -- <file.docx|dir> --category <' + CATEGORIES.join('|') + '> [--lang zh|en]');
  process.exit(1);
}

const q = (s) => JSON.stringify(s);
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/\.docx$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `product-${Date.now()}`;

const files = (await stat(input)).isDirectory()
  ? (await readdir(input)).filter((f) => f.toLowerCase().endsWith('.docx') && !f.startsWith('~$')).map((f) => path.join(input, f))
  : [input];

for (const file of files) {
  const base = path.basename(file, '.docx');
  const modelMatch = base.match(/[A-Za-z]{1,6}[-_]?[A-Za-z0-9-]+/);
  const model = modelMatch ? modelMatch[0].toUpperCase() : base;
  const slug = slugify(modelMatch ? modelMatch[0] : base);
  const imgDir = path.join(IMAGES, slug);
  await mkdir(imgDir, { recursive: true });

  const images = [];
  const { value: html, messages } = await mammoth.convertToHtml(
    { path: file },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        const ext = (image.contentType.split('/')[1] || 'png').replace('jpeg', 'jpg').replace('x-emf', 'emf');
        const name = `${images.length + 1}.${ext}`;
        await writeFile(path.join(imgDir, name), await image.readAsBuffer());
        const src = `/images/products/${slug}/${name}`;
        images.push(src);
        return { src };
      }),
    },
  );
  const { value: text } = await mammoth.extractRawText({ path: file });
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const title = lines[0] ?? base;
  const summary = lines.slice(1).find((l) => l.length > 15) ?? title;
  const body = html.replace(/<p>\s*<\/p>/g, '');

  const yamlPath = path.join(CONTENT, `${slug}.yaml`);
  if (existsSync(yamlPath)) {
    let y = await readFile(yamlPath, 'utf8');
    y = y.replace(/^images:.*(\n\s+-.*)*$/m, `images: [${images.map(q).join(', ')}]`);
    y = y.replace(/^body:[\s\S]*$/m, '').trimEnd();
    y += `\nbody:\n  ${lang}: ${q(body)}\n`;
    await writeFile(yamlPath, y);
    console.log(`updated  ${path.relative(ROOT, yamlPath)} (${images.length} images)`);
  } else {
    const both = (v) => `\n  zh: ${q(v)}\n  en: ${q(v)}`;
    const y = [
      `model: ${q(model)}`,
      `category: ${category}`,
      'featured: false',
      'order: 100',
      `name:${both(title)}`,
      `summary:${both(summary)}`,
      'features:\n  zh: []\n  en: []',
      'applications:\n  zh: []\n  en: []',
      'specs: []',
      'tags: []',
      `images: [${images.map(q).join(', ')}]`,
      `body:\n  ${lang}: ${q(body)}`,
    ].join('\n');
    await writeFile(yamlPath, y + '\n');
    console.log(`created  ${path.relative(ROOT, yamlPath)} (${images.length} images) — 请补充英文名称、参数表与特点`);
  }
  for (const m of messages.filter((m) => m.type === 'warning')) console.warn(`  ! ${m.message}`);
}
