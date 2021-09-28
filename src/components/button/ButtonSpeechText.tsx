import { LmComponentRender } from '@LmComponentRender'
import React, { useRef } from 'react'
// eslint-disable-next-line
// @ts-ignore
import { useSpeechSynthesis } from 'react-speech-kit'
import { LmButtonSpeechTextProps } from './buttonTypes'
import { ButtonStoryblok } from '../../typings/generated/components-schema'
import { useRouter } from 'next/router'

export default function LmButtonSpeechText({
  content
}: LmButtonSpeechTextProps) {
  const { locale } = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis()
  const currentVoices: SpeechSynthesisVoice[] = voices
  const { full_page, ...props } = content
  const trigger = Array.isArray(props.trigger) ? props.trigger[0] : undefined

  const onClick = () => {
    if (speaking) {
      cancel()
      return
    }
    const selectedVoice = currentVoices.find((v) =>
      v.lang.startsWith(locale || 'de')
    )

    const allNodes = full_page
      ? document.querySelectorAll('.enable__speech') || []
      : ref.current
          ?.closest('.lm-section')
          ?.querySelectorAll('.enable__speech') || []

    const texts: string[] = []
    allNodes.forEach((node) => {
      // eslint-disable-next-line
      // @ts-ignore
      texts.push(node.innerText)
    })
    speak({ text: texts.join('\n'), voice: selectedVoice })
  }
  if (!supported) {
    return <div>not supported..</div>
  }
  return (
    <div ref={ref}>
      <LmComponentRender
        content={
          {
            id: content._uid,
            _uid: content._uid,
            component: 'button',
            label: 'Click to speech',
            ...(trigger || {}),
            ...(speaking
              ? {
                  trailing_icon: {
                    name: 'account-voice'
                  }
                }
              : {})
          } as ButtonStoryblok
        }
        onClick={onClick}
      />
    </div>
  )
}
