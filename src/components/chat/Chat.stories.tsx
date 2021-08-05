import * as React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import {
  ChatFacebookStoryblok,
  ChatTawktoStoryblok,
  ChatWhatsappStoryblok
} from '../../typings/generated/components-schema'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Interaction/Chat'
}

export const Tawkto = () => (
  <div>
    <LmComponentRender
      content={
        {
          _uid: '123',
          component: 'chat_tawkto',
          account: '5bea5fe60e6b3311cb78fdf8',
          disable_lazy: true
        } as ChatTawktoStoryblok
      }
    />
  </div>
)

export const Whatsapp = () => (
  <div>
    <LmComponentRender
      content={
        {
          _uid: '123',
          component: 'chat_whatsapp',
          phone_number: '00491773079466',
          tooltip: 'This is a veeeeeeeeeery long tooltip message',
          welcome_message: 'This is the welcome message'
        } as ChatWhatsappStoryblok
      }
    />
  </div>
)
export const Facebook = () => (
  <div>
    This Only works online on play.lumen.media!!
    <LmComponentRender
      content={
        {
          _uid: '123',
          component: 'chat_facebook',
          disable_lazy: true,
          page_id: '1456836611252852'
        } as ChatFacebookStoryblok
      }
    />
  </div>
)
