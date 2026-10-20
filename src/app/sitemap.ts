import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://joashattend.co.ke';
  const routes = ['', '/demo', '/legal/privacy-policy', '/legal/terms', '/legal/cookie-policy', '/auth/signin', '/auth/signup'];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/demo' ? 0.9 : 0.5,
  }));
}
