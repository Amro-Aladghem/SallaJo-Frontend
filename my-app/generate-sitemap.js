import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';

const SITE_URL = process.env.SITE_URL || 'https://sallahjo.taskalyze.com';
const API_BASE = 'https://sallahapi.taskalyze.com/api/v1';

const staticRoutes = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/support', changefreq: 'monthly', priority: 0.6 },
];

async function fetchStoreSlugs() {
  try {
    const res = await fetch(`${API_BASE}/stores/active`);
    if (res.ok) {
      const slugs = await res.json();
      console.log(`Fetched ${slugs.length} store slugs from API`);
      return Array.isArray(slugs) ? slugs : [];
    }
  } catch {}
  return [];
}

async function buildSitemap() {
  const stream = new SitemapStream({ hostname: SITE_URL });

  for (const route of staticRoutes) {
    stream.write(route);
  }

  const storeSlugs = await fetchStoreSlugs();

  for (const slug of storeSlugs) {
    stream.write({ url: `/store/${slug}`, changefreq: 'daily', priority: 0.9 });
    stream.write({ url: `/store/${slug}/offers`, changefreq: 'daily', priority: 0.7 });
    stream.write({ url: `/store/${slug}/discounts`, changefreq: 'daily', priority: 0.7 });
    stream.write({ url: `/store/${slug}/info`, changefreq: 'weekly', priority: 0.5 });
  }

  stream.end();

  const xml = await streamToPromise(stream);

  const outDir = resolve('dist');
  const publicDir = resolve('public');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

  writeFileSync(resolve(outDir, 'sitemap.xml'), xml);
  writeFileSync(resolve(publicDir, 'sitemap.xml'), xml);

  console.log(`✓ sitemap.xml generated — ${staticRoutes.length} static + ${storeSlugs.length} store(s) = ${staticRoutes.length + storeSlugs.length * 4} URLs`);
}

buildSitemap().catch((err) => {
  console.error('✗ sitemap generation failed:', err);
  process.exit(1);
});
