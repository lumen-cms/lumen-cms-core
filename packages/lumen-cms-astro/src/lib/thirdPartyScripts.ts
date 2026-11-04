export function isHubspotLoader(source?: string) {
 try {
  const url = new URL(source || '', 'https://localhost')
  return /^js(?:-[a-z0-9]+)?\.hs-scripts\.com$/.test(url.hostname) && /^\/\d+\.js$/.test(url.pathname)
 } catch { return false }
}

