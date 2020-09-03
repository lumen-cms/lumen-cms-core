import { LmComponentRender } from '../src'
import { ChatTawktoStoryblok, ChatWhatsappStoryblok } from '../src/typings/generated/components-schema'
import * as React from 'react'


export default {
  title: 'Chat'
}

export const Tawkto = () => (
  <div>
    <LmComponentRender content={{
      _uid: '123',
      component: 'chat_tawkto',
      account: '5bea5fe60e6b3311cb78fdf8',
      disable_lazy: true
    } as ChatTawktoStoryblok} />
  </div>
)

export const Whatsapp = () => (
  <div>
    <LmComponentRender content={{
      _uid: '123',
      component: 'chat_whatsapp',
      phone_number: '00491773079466',
      tooltip: 'This is a veeeeeeeeeery long tooltip message',
      welcome_message: 'This is the welcome message'
    } as ChatWhatsappStoryblok} />
  </div>
)
