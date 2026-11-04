import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
 const publicBuild = process.env.LUMEN_BUILD_MODE === 'public'
 if (publicBuild && !site) throw new Error('A public site URL is required for robots.txt')
 // Crawling must remain allowed so crawlers can see the SSR noindex header.
 const sitemap = publicBuild ? `Sitemap: ${new URL('/sitemap.xml', site).href}\n` : ''
 return new Response(`User-agent: *\nAllow: /\n${sitemap}`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
