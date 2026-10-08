import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  // `NEXT_OUTPUT=standalone` is set by the Dockerfile; Vercel uses the default output.
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
  poweredByHeader: false,
  // blog articles are read from disk when pages are (re)generated: ship them with the server bundle
  outputFileTracingIncludes: {
    '/**': ['./content/**/*.mdx', './public/brand/logo-512.png'],
    '/admin/**': ['./assets/fonts/*.ttf']
  },
  experimental: {
    globalNotFound: true,
    // Tailwind output is small: inlining it removes the render-blocking stylesheet requests
    inlineCss: true
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: supabaseHost
      ? [{protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**'}]
      : []
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {key: 'X-Content-Type-Options', value: 'nosniff'},
          {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
          {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
          {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'}
        ]
      },
      {
        source: '/admin/:path*',
        headers: [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}]
      }
    ];
  }
};

export default withNextIntl(nextConfig);
