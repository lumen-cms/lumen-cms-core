/** A last-resort destination name for image-only links without CMS text. */
export function accessibleLinkName(href: string) {
 try {
  const url = new URL(href, 'https://local.invalid')
  const services: Record<string, string> = { 'apps.apple.com': 'App Store', 'play.google.com': 'Google Play', 'twitter.com': 'Twitter', 'x.com': 'X', 'www.facebook.com': 'Facebook', 'www.instagram.com': 'Instagram' }
  if (services[url.hostname]) return services[url.hostname]
  if (url.hostname !== 'local.invalid') return url.hostname.replace(/^www\./, '')
  return decodeURIComponent(url.pathname).split('/').filter(Boolean).join(' / ').replace(/-/g, ' ') || 'Home'
 } catch { return href }
}
