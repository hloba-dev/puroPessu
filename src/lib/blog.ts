import 'server-only';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {cache} from 'react';
import type {Locale} from '@/i18n/routing';
import {articles, findArticleBySlug, type ArticleCategory, type ArticleEntry} from '@/content/articles';

/** Blog articles are MDX files in content/{locale}/{id}.mdx; slugs and dates live in src/content/articles.ts. */

export interface ArticleMeta {
  id: string;
  slug: string;
  category: ArticleCategory;
  published: string;
  updated?: string;
  title: string;
  description: string;
  excerpt: string;
  readingMinutes: number;
}

export interface TocItem {
  id: string;
  text: string;
}

/** Same function for the table of contents and the rendered <h2 id>: unicode letters kept (ä, ö, кириллица). */
export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function parseFrontmatter(source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  const data: Record<string, string> = {};
  if (!match) return {data, body: source};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const raw = line.slice(separator + 1).trim();
    try {
      data[key] = raw.startsWith('"') ? (JSON.parse(raw) as string) : raw.replace(/^'|'$/g, '');
    } catch {
      data[key] = raw.replace(/^"|"$/g, '');
    }
  }
  return {data, body: source.slice(match[0].length)};
}

const readArticle = cache(async (locale: Locale, id: string) => {
  const file = path.join(process.cwd(), 'content', locale, `${id}.mdx`);
  const {data, body} = parseFrontmatter(await readFile(file, 'utf8'));
  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const toc: TocItem[] = [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const text = m[1].replace(/[*_`]/g, '').trim();
    return {id: headingId(text), text};
  });
  return {data, body, toc, readingMinutes: Math.max(1, Math.round(words / 200))};
});

async function toMeta(entry: ArticleEntry, locale: Locale): Promise<ArticleMeta> {
  const {data, readingMinutes} = await readArticle(locale, entry.id);
  return {
    id: entry.id,
    slug: entry.slugs[locale],
    category: entry.category,
    published: entry.published,
    updated: entry.updated,
    title: data.title ?? entry.id,
    description: data.description ?? '',
    excerpt: data.excerpt ?? data.description ?? '',
    readingMinutes
  };
}

/** All articles of a locale, newest first. */
export const listArticles = cache(async (locale: Locale): Promise<ArticleMeta[]> => {
  const metas = await Promise.all(articles.map((entry) => toMeta(entry, locale)));
  return metas.sort((a, b) => b.published.localeCompare(a.published));
});

export async function getArticle(locale: Locale, slug: string) {
  const entry = findArticleBySlug(locale, slug);
  if (!entry) return null;
  const [meta, source] = await Promise.all([toMeta(entry, locale), readArticle(locale, entry.id)]);
  return {entry, meta, body: source.body, toc: source.toc};
}
