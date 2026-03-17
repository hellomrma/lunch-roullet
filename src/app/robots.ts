import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pangyo-pick.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      // AI 크롤러 명시적 허용 (GEO)
      { userAgent: 'GPTBot',        allow: '/' },
      { userAgent: 'ChatGPT-User',  allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot',     allow: '/' },
      { userAgent: 'anthropic-ai',  allow: '/' },
      { userAgent: 'Googlebot',     allow: '/' },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
