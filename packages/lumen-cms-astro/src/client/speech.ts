import { onUnmount } from './lifecycle'

export function initializeSpeech() {
 document.querySelectorAll<HTMLElement>('[data-lm-speech]:not([data-speech-ready])').forEach(root => {
  root.dataset.speechReady = 'true'
  if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') {
   root.textContent = 'not supported..'
   return
  }
  const synthesis = window.speechSynthesis
  let active: SpeechSynthesisUtterance | undefined
  const update = () => { root.dataset.speaking = String(!!active) }
  const clear = () => { if (active) { active.onend = null; active.onerror = null }; active = undefined; update() }
  root.addEventListener('click', event => {
   if (!(event.target instanceof Element) || !event.target.closest('button,a')) return
   event.preventDefault(); event.stopPropagation()
   if (active) { clear(); synthesis.cancel(); return }
   const scope = root.dataset.fullPage === 'true' ? document : root.closest('.lm-section')
   const text = Array.from(scope?.querySelectorAll<HTMLElement>('.enable__speech') || []).map(node => node.innerText).join('\n')
   const utterance = new window.SpeechSynthesisUtterance(text)
   utterance.voice = synthesis.getVoices().find(voice => voice.lang.startsWith(root.dataset.locale || 'de')) || null
   utterance.rate = 1; utterance.pitch = 1; utterance.volume = 1
   utterance.onend = utterance.onerror = () => { if (active === utterance) clear() }
   active = utterance; update()
   try { synthesis.speak(utterance) } catch (error) { clear(); throw error }
  })
  onUnmount(root, () => { if (active) { clear(); synthesis.cancel() } })
  update()
 })
}
