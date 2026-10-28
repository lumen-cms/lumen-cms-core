const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const getSecureHeader = require('./nextjs_csp_generator')
module.exports = ({
  contentSecurityPolicy = {},
  ignoreCsp,
  transpilePackages = ['lumen-cms-core']
}) => {
  /**
   * @type {import('next').NextConfig}
   */
  const config = {
    reactStrictMode: true,
    transpilePackages,
    async headers() {
      return [
        {
          // Apply these headers to all routes in your application.
          source: '/:path*',
          headers: getSecureHeader({ ignoreCsp, contentSecurityPolicy })
        }
      ]
    },
    images: {
      formats: ['image/avif', 'image/webp'],
      // Preserve the quality used by ToolbarLogo with Next.js 16's allowlist.
      qualities: [75, 95],
      // path: 'https://img-12.lumen.media/_next/image/',
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'a.storyblok.com'
        },
        {
          protocol: 'https',
          hostname: 'img2.storyblok.com'
        },
        {
          protocol: 'https',
          hostname: 'cdn.shopify.com'
        },
        {
          protocol: 'https',
          hostname: 'cdn.jsdelivr.net'
        },
        {
          protocol: 'https',
          hostname: '**.public.blob.vercel-storage.com'
        }
      ],
      deviceSizes: [360, 640, 768, 1024, 1280, 1536],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
    },
    webpack: (config, { isServer }) => {
      // Fast Refresh adds import.meta to CommonJS MUI/icon modules and Babel
      // helpers. Let Webpack parse both syntaxes while keeping their exports.
      config.module.rules.push({
        test: /[/\\](?:@babel[/\\]runtime[/\\]helpers|@mui|mdi-material-ui)[/\\].*\.js$/,
        type: 'javascript/auto'
      })

      if (!isServer) {
        config.resolve.fallback.fs = false
      }

      config.resolve.plugins.push(
        new TsconfigPathsPlugin({ baseUrl: process.cwd() })
      )
      if (!isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser'
      }
      return config
    },
    async rewrites() {
      return {
        beforeFiles: [{ source: '/sitemap.xml', destination: '/api/sitemap' }]
      }
    }
  }

  return config
}
