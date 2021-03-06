import {
  ButtonSpeechTextStoryblok,
  ButtonStoryblok
} from '../../typings/generated/components-schema'

export type LmButtonProps = {
  content: ButtonStoryblok
  onClick?: () => void
  type?: string
  disabled?: boolean
}

export type LmButtonSpeechTextProps = {
  content: ButtonSpeechTextStoryblok
}
