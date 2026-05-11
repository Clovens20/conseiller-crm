import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login/', '/auth/'],
    },
    sitemap: 'https://planifier.konektegroup.com/sitemap.xml',
  }
}
