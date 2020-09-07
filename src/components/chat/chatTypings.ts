import {
  ChatFacebookStoryblok,
  ChatTawktoStoryblok,
  ChatWhatsappStoryblok
} from '../../typings/generated/components-schema'

export type TawktoProps = {
  content: ChatTawktoStoryblok
}

export type WhatsappChatButtonProps = {
  content: ChatWhatsappStoryblok
}

export type FacbookChatButtonProps = {
  content: ChatFacebookStoryblok
}
