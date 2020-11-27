import { LmComponentRender } from '@LmComponentRender'
import React from 'react'
// @ts-ignore
import { useSpeechSynthesis } from 'react-speech-kit'
import { LmButtonSpeechTextProps } from './buttonTypes'
import { ButtonStoryblok } from '../../typings/generated/components-schema'

const locale = 'de'
export default function ButtonSpeechText({ content }: LmButtonSpeechTextProps) {
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis()
  const currentVoices: SpeechSynthesisVoice[] = voices
  const trigger: ButtonStoryblok | undefined =
    Array.isArray(content.trigger) && content.trigger[0]

  const onClick = () => {
    if (speaking) {
      cancel()
      return
    }
    const selectedVoice = currentVoices.find((v) => v.lang.startsWith(locale))
    const allNodes = document.querySelectorAll('.enable__speech')
    const texts: string[] = []
    allNodes.forEach((node) => {
      // @ts-ignore
      texts.push(node.innerText)
    })
    speak({ text: texts.join('\n'), voice: selectedVoice })
  }
  if (!supported) {
    return <div>not supported..</div>
  }
  return (
    <LmComponentRender
      content={
        {
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
  )
}
