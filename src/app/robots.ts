import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://joashattend.co.ke';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/member', '/api'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
