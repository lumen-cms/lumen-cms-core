// @vitest-environment happy-dom
import { act, StrictMode, useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useSpeechSynthesis } from './useSpeechSynthesis'

let host: HTMLDivElement
let root: Root
let speech: ReturnType<typeof useSpeechSynthesis>
let voices: SpeechSynthesisVoice[]
let synthesis: EventTarget & {
  getVoices: ReturnType<typeof vi.fn>
  speak: ReturnType<typeof vi.fn>
  cancel: ReturnType<typeof vi.fn>
}
class Utterance {
  voice: SpeechSynthesisVoice | null = null
  rate = 1
  pitch = 1
  volume = 1
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  constructor(public text: string) {}
}
function Probe() {
  const current = useSpeechSynthesis()
  useEffect(() => {
    speech = current
  }, [current])
  return (
    <span>
      {current.supported
        ? current.speaking
          ? 'speaking'
          : 'idle'
        : 'unsupported'}
    </span>
  )
}
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  voices = []
  synthesis = Object.assign(new EventTarget(), {
    getVoices: vi.fn(() => [...voices]),
    speak: vi.fn(),
    cancel: vi.fn()
  })
  vi.stubGlobal('speechSynthesis', synthesis)
  vi.stubGlobal('SpeechSynthesisUtterance', Utterance)
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
  vi.unstubAllGlobals()
})

it('preserves the unsupported server render and gracefully handles missing browser APIs', async () => {
  expect(renderToString(<Probe />)).toBe('<span>unsupported</span>')
  vi.stubGlobal('speechSynthesis', undefined)
  await act(async () => root.render(<Probe />))
  expect(host.textContent).toBe('unsupported')
  await act(async () => speech.speak({ text: 'ignored' }))
  expect(synthesis.speak).not.toHaveBeenCalled()
})

it('discovers immediate and delayed voices without replacing another listener', async () => {
  const otherListener = vi.fn()
  synthesis.addEventListener('voiceschanged', otherListener)
  const german = {
    name: 'German',
    lang: 'de-DE',
    voiceURI: 'de',
    default: false,
    localService: true
  } as SpeechSynthesisVoice
  voices = [german]
  await act(async () =>
    root.render(
      <StrictMode>
        <Probe />
      </StrictMode>
    )
  )
  expect(speech.voices).toEqual([german])
  const english = { ...german, lang: 'en-GB', voiceURI: 'en' }
  voices = [german, english]
  await act(async () => synthesis.dispatchEvent(new Event('voiceschanged')))
  expect(speech.voices).toEqual(voices)
  expect(otherListener).toHaveBeenCalledTimes(1)
  await act(async () => root.render(null))
  synthesis.dispatchEvent(new Event('voiceschanged'))
  expect(otherListener).toHaveBeenCalledTimes(2)
})

it('preserves speech options, creates fresh utterances, and handles finish/error/cancel', async () => {
  await act(async () => root.render(<Probe />))
  const voice = { lang: 'de-DE' } as SpeechSynthesisVoice
  await act(async () =>
    speech.speak({ text: 'Hallo', voice, rate: 0.8, pitch: 1.1, volume: 0.5 })
  )
  const first = synthesis.speak.mock.calls[0][0] as Utterance
  expect(first).toMatchObject({
    text: 'Hallo',
    voice,
    rate: 0.8,
    pitch: 1.1,
    volume: 0.5
  })
  expect(host.textContent).toBe('speaking')
  await act(async () => first.onend?.())
  expect(host.textContent).toBe('idle')
  await act(async () => speech.speak({ text: 'Hallo' }))
  const second = synthesis.speak.mock.calls[1][0] as Utterance
  expect(second).not.toBe(first)
  await act(async () => second.onerror?.())
  expect(host.textContent).toBe('idle')
  await act(async () => speech.speak({ text: 'Cancel' }))
  await act(async () => speech.cancel())
  expect(synthesis.cancel).toHaveBeenCalledTimes(1)
  expect(host.textContent).toBe('idle')
})

it('cleans up active speech and voice subscriptions on unmount', async () => {
  const remove = vi.spyOn(synthesis, 'removeEventListener')
  await act(async () =>
    root.render(
      <StrictMode>
        <Probe />
      </StrictMode>
    )
  )
  expect(synthesis.cancel).not.toHaveBeenCalled()
  await act(async () => speech.speak({ text: 'Stop on navigation' }))
  const utterance = synthesis.speak.mock.calls[0][0] as Utterance
  await act(async () => root.render(null))
  expect(utterance.onend).toBeNull()
  expect(utterance.onerror).toBeNull()
  expect(synthesis.cancel).toHaveBeenCalledTimes(1)
  expect(remove).toHaveBeenCalledWith('voiceschanged', expect.any(Function))
})
