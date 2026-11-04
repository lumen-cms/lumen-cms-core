import { vercelImageConfig } from './vercel-config.mjs'
import { isStoryblokImage } from './policy'

/** The managed optimizer negotiates format and preserves source aspect ratio.
 * Keep explicit transforms and animation on the existing image path. */
export function useVercelRemoteImage(source: string, options: {
 enabled: boolean; allowed: boolean; format?: string; fit?: string; position?: string
}) {
 return options.enabled && options.allowed && /^https?:/.test(source)
  && !isStoryblokImage(source) && !/^https:\/\/img2\.storyblok\.com\//i.test(source)
  && /\.(?:jpe?g|png|avif)(?:[?#]|$)/i.test(source)
  && !options.format && !options.fit && !options.position
}

export function vercelImageVariant(source: string, width: number, quality: number) {
 if (!Number.isFinite(width) || width <= 0) throw new Error('Invalid image width')
 if (!Number.isInteger(quality) || quality < 1 || quality > 100) throw new Error('Invalid image quality')
 const actualWidth = vercelImageConfig.sizes.find(size => size >= width) ?? vercelImageConfig.sizes.at(-1)!
 return { width: actualWidth, src: `/_vercel/image?${new URLSearchParams({ url: source, w: String(actualWidth), q: String(quality) })}` }
}
