/** Only recognize YouTube hosts, never arbitrary URLs containing “youtube”. */
export function youtubeVideoId(source: string): string | undefined {
 try {
  const url = new URL(source.startsWith('//') ? `https:${source}` : source)
  if (!['https:', 'http:'].includes(url.protocol)) return
  const host = url.hostname.replace(/^www\./, '')
  const id = host === 'youtu.be' ? url.pathname.split('/')[1]
   : ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)
    ? url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] : undefined
  return id && /^[\w-]{11}$/.test(id) ? id : undefined
 } catch { return }
}
