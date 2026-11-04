import sharp from 'astro/assets/services/sharp'
import type { ExternalImageService } from 'astro'

/** Prerender HTML with the same URLs used by SSR. The runtime Sharp service
 * handles these requests; omitting transform prevents build-time image fan-out. */
const service: ExternalImageService = {
 validateOptions: sharp.validateOptions,
 getURL: sharp.getURL,
 getSrcSet: sharp.getSrcSet,
 getHTMLAttributes: sharp.getHTMLAttributes,
}
export default service
