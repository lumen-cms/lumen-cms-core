/** Keep aligned with config/nextjs_base_config.js. */
export const imageWidths = [16, 32, 48, 64, 96, 128, 256, 360, 384, 640, 768, 1024, 1280, 1536]
export function normalizeImageSource(source: string) { return source.replace(/^\/\//, 'https://') }
export function isStoryblokImage(source: string) {
  try { const url = new URL(normalizeImageSource(source)); return url.protocol === 'https:' && url.hostname === 'a.storyblok.com' } catch { return false }
}
export function isSvgImage(source: string) { return /\.svg$/i.test(source.split(/[?#]/)[0]) }
export function storyblokDimensions(source: string) {
  if (!isStoryblokImage(source)) return undefined
  const match = new URL(normalizeImageSource(source)).pathname.match(/\/(\d+)x(\d+)\//)
  return match && Number(match[1]) > 0 && Number(match[2]) > 0 ? { width: Number(match[1]), height: Number(match[2]) } : undefined
}
export function responsiveCandidates(width: number, sizes?: string, widths?: number[], densities?: (number | `${number}x`)[]) {
  if (widths && densities) throw new Error('Image widths and densities cannot be combined')
  if (densities) return [...new Set(densities.map(value => Number.parseFloat(String(value))))].filter(n => n > 0 && Number.isFinite(n)).map(n => ({ width: Math.round(width * n), descriptor: `${n}x` }))
  const fixedSize = sizes?.match(/^(\d+(?:\.\d+)?)px$/)
  if (!widths && fixedSize) return [1, 2].map(density => { const width = Math.round(Number(fixedSize[1]) * density); return { width, descriptor: `${width}w` } })
  if (widths || sizes) return [...new Set(widths || imageWidths)].filter(n => n > 0 && Number.isFinite(n)).sort((a,b) => a-b).map(n => ({ width: n, descriptor: `${n}w` }))
  return [1, 2].map(n => ({ width: width * n, descriptor: `${n}x` }))
}
