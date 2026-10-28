import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from 'react'

type SpeechOptions = {
  text: string
  voice?: SpeechSynthesisVoice | null
  rate?: number
  pitch?: number
  volume?: number
}
type SpeechSnapshot = {
  supported: boolean
  voices: SpeechSynthesisVoice[]
}
const serverSnapshot: SpeechSnapshot = { supported: false, voices: [] }
const getServerSnapshot = () => serverSnapshot
const isSupported = () =>
  typeof window !== 'undefined' &&
  !!window.speechSynthesis &&
  typeof window.SpeechSynthesisUtterance === 'function'

function createVoiceStore() {
  let snapshot = serverSnapshot
  return {
    subscribe(notify: () => void) {
      if (!isSupported()) return () => {}
      const synthesis = window.speechSynthesis
      synthesis.addEventListener('voiceschanged', notify)
      return () => synthesis.removeEventListener('voiceschanged', notify)
    },
    getSnapshot() {
      if (!isSupported()) return serverSnapshot
      const voices = window.speechSynthesis.getVoices()
      // Browsers can return a fresh array each time; snapshots must be stable.
      const unchanged =
        snapshot.supported &&
        voices.length === snapshot.voices.length &&
        voices.every((voice, index) => {
          const previous = snapshot.voices[index]
          return (
            voice.voiceURI === previous.voiceURI &&
            voice.name === previous.name &&
            voice.lang === previous.lang &&
            voice.default === previous.default &&
            voice.localService === previous.localService
          )
        })
      if (!unchanged) snapshot = { supported: true, voices }
      return snapshot
    }
  }
}

// The button only needs synthesis, not microphone/speech-recognition access.
export function useSpeechSynthesis() {
  const store = useMemo(() => createVoiceStore(), [])
  const { supported, voices } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerSnapshot
  )
  const [speaking, setSpeaking] = useState(false)
  const utterances = useRef(new Set<SpeechSynthesisUtterance>())

  useEffect(() => {
    const active = utterances.current
    const synthesis = isSupported() ? window.speechSynthesis : undefined
    return () => {
      if (!active.size) return
      for (const utterance of active) {
        utterance.onend = null
        utterance.onerror = null
      }
      active.clear()
      // The browser exposes cancellation for the global speech queue only.
      synthesis?.cancel()
    }
  }, [])

  const speak = useCallback(
    ({
      text,
      voice = null,
      rate = 1,
      pitch = 1,
      volume = 1
    }: SpeechOptions) => {
      if (!isSupported()) return
      const utterance = new window.SpeechSynthesisUtterance(text)
      utterance.voice = voice
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume
      const finish = () => {
        if (!utterances.current.delete(utterance)) return
        setSpeaking(utterances.current.size > 0)
      }
      utterance.onend = finish
      utterance.onerror = finish
      utterances.current.add(utterance)
      setSpeaking(true)
      try {
        window.speechSynthesis.speak(utterance)
      } catch (error) {
        finish()
        throw error
      }
    },
    []
  )

  const cancel = useCallback(() => {
    if (!isSupported()) return
    // Clear ownership before cancel: browsers may synchronously deliver end/error.
    utterances.current.clear()
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  return { speak, cancel, speaking, supported, voices }
}
