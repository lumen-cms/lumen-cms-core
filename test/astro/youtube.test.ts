// @vitest-environment happy-dom
import { afterEach, expect, it } from 'vitest'
import { youtubeVideoId } from '../../packages/lumen-cms-astro/src/lib/youtube'
import { initializeYoutubeEmbeds } from '../../packages/lumen-cms-astro/src/client/youtube'

afterEach(() => document.body.replaceChildren())
it('recognizes supported YouTube URLs without matching lookalike domains', () => {
 for (const url of ['https://www.youtube.com/embed/f5h2j0juYIs?start=20', 'https://youtu.be/f5h2j0juYIs', '//www.youtube-nocookie.com/embed/f5h2j0juYIs', 'https://youtube.com/watch?v=f5h2j0juYIs']) expect(youtubeVideoId(url)).toBe('f5h2j0juYIs')
 for (const url of ['https://youtube.com.evil.test/embed/f5h2j0juYIs', 'https://example.test/?v=f5h2j0juYIs', 'invalid', 'https://youtube.com/embed/invalid']) expect(youtubeVideoId(url)).toBeUndefined()
})
it('keeps the iframe inert until activation and preserves its configuration', () => {
 document.body.innerHTML = '<button data-lm-youtube>Play video</button><template><iframe src="https://www.youtube.com/embed/f5h2j0juYIs?start=20" allow="fullscreen" sandbox="allow-scripts allow-same-origin" class="embed-responsive-item" title="Video" loading="lazy"></iframe></template>'
 initializeYoutubeEmbeds()
 initializeYoutubeEmbeds()
 expect(document.querySelector('iframe')).toBeNull()
 document.querySelector('button')!.click()
 const iframe = document.querySelector('iframe')!
 expect(new URL(iframe.src).searchParams.get('start')).toBe('20')
 expect(new URL(iframe.src).searchParams.get('autoplay')).toBe('1')
 expect(iframe.allow).toContain('autoplay')
 expect(iframe.getAttribute('sandbox')).toBe('allow-scripts allow-same-origin')
 expect(iframe.className).toBe('embed-responsive-item')
 expect(iframe.loading).toBe('eager')
 expect(document.querySelector('button, template')).toBeNull()
 expect(document.querySelectorAll('iframe')).toHaveLength(1)
})
