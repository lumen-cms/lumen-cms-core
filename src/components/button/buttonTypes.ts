import {
  ButtonSpeechTextStoryblok,
  ButtonStoryblok
} from '../../typings/generated/components-schema'

export type LmButtonProps = {
  content: ButtonStoryblok
  onClick?: import('react').MouseEventHandler<HTMLElement>
  type?: string
  disabled?: boolean
  additionalClassName?: string
}

export type LmButtonSpeechTextProps = {
  content: ButtonSpeechTextStoryblok
}
