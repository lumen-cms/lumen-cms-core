// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { initializeSpeech } from '../../packages/lumen-cms-astro/src/client/speech'

function fixture(fullPage = false) {
 const speak = vi.fn(), cancel = vi.fn()
 const voices = [{ lang: 'de-DE' }, { lang: 'en-GB' }]
 vi.stubGlobal('speechSynthesis', { speak, cancel, getVoices: () => voices })
 vi.stubGlobal('SpeechSynthesisUtterance', class {
  constructor(public text: string) {}
 })
 document.body.innerHTML = `<div class="enable__speech">Outside</div><section class="lm-section"><h2 class="enable__speech">Heading</h2><p class="enable__speech">Paragraph</p><div data-lm-speech data-locale="en" data-full-page="${fullPage}"><button>Speak</button></div></section>`
 initializeSpeech(); initializeSpeech()
 const root = document.querySelector<HTMLElement>('[data-lm-speech]')!
 const button = root.querySelector('button')!
 return { speak, cancel, voices, root, button }
}
afterEach(() => {
 document.dispatchEvent(new Event('astro:before-swap'))
 document.body.replaceChildren()
})

it('reads only the nearest section, selects locale voice and toggles cancellation', () => {
 const { speak, cancel, voices, root, button } = fixture()
 button.click()
 expect(speak).toHaveBeenCalledTimes(1)
 expect(speak.mock.calls[0][0]).toMatchObject({ text: 'Heading\nParagraph', voice: voices[1], rate: 1, pitch: 1, volume: 1 })
 expect(root.dataset.speaking).toBe('true')
 button.click()
 expect(cancel).toHaveBeenCalledTimes(1)
 expect(root.dataset.speaking).toBe('false')
})

it('reads the full page and resets on completion or error', () => {
 const { speak, root, button } = fixture(true)
 button.click()
 expect(speak.mock.calls[0][0].text).toBe('Outside\nHeading\nParagraph')
 speak.mock.calls[0][0].onend()
 expect(root.dataset.speaking).toBe('false')
 button.click()
 speak.mock.calls[1][0].onerror()
 expect(root.dataset.speaking).toBe('false')
})

it('cancels owned speech when containing content unmounts, but not idle speech', () => {
 const { cancel, button, root } = fixture()
 button.click()
 root.parentElement!.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 expect(cancel).toHaveBeenCalledTimes(1)
 document.dispatchEvent(new Event('astro:before-swap'))
 expect(cancel).toHaveBeenCalledTimes(1)
})

it('renders the existing unsupported message without requesting microphone access', () => {
 fixture()
 vi.stubGlobal('speechSynthesis', undefined)
 document.body.innerHTML = '<div data-lm-speech><button>Speak</button></div>'
 initializeSpeech()
 expect(document.body.textContent).toBe('not supported..')
})
