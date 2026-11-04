import { inferRemoteSize, isRemoteAllowed, imageMetadata } from 'astro/assets/utils'
import type { ImageMetadata } from 'astro'
import type { AstroConfig } from 'astro'
import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { retryRead } from 'lumen-cms-shared/server/retryRead'
type ImageConfig = AstroConfig['image']

export async function publicImageMetadata(source: string) {
  if (!source.startsWith('/') || source.startsWith('//')) return undefined
  const root = resolve(process.env.LUMEN_PUBLIC_DIR || 'public')
  const path = resolve(root, '.' + decodeURIComponent(source.split(/[?#]/)[0]))
  if (!path.startsWith(root + sep)) throw new Error('Invalid public image path')
  const metadata = await imageMetadata(await readFile(path), source)
  // Keep a directory segment for root-level assets: Astro's filename builder
  // otherwise joins '/' twice and creates a protocol-relative URL.
  return { ...metadata, src: '/.' + source, fsPath: path }
}
import { normalizeImageSource, storyblokDimensions } from './policy'

/** Only probe when CMS/Storyblok metadata is unavailable; never invent an aspect ratio. */
export async function imageDimensions(source: string, config: ImageConfig, metadata?: { width?: number; height?: number }): Promise<Pick<ImageMetadata, 'width' | 'height'>> {
  if (metadata?.width && metadata?.height) return { width: metadata.width, height: metadata.height }
  const dimensions = storyblokDimensions(source)
  if (dimensions) return dimensions
  const local = await publicImageMetadata(source)
  if (local) return local
  const normalized = normalizeImageSource(source)
  if (!isRemoteAllowed(normalized, config)) throw new Error(`Image dimensions are required for unconfigured source: ${source}`)
  // Astro wraps transport errors without preserving the HTTP status. A bounded
  // retry tolerates dropped connections; persistent missing assets still fail.
  return retryRead(() => inferRemoteSize(normalized, config), () => true)
}
