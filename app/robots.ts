import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/login', '/auth', '/update-password'],
        },
        sitemap: 'https://www.alrund.space/sitemap.xml',
    };
}
