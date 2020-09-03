import React from 'react'
import { useAppContext } from '../provider/context/AppContext'
import { useScrollOnce } from '../../utils/hooks/useScrolledOnce'
import { FacbookChatButtonProps } from './chatTypings'
import useScript, { ScriptStatus } from '../../utils/hooks/useScript'

export function FacebookChatButton({ content }: FacbookChatButtonProps) {
  const { insideStoryblok } = useAppContext()
  const isScrolled = useScrollOnce()
  const startInclude = !insideStoryblok && content.disable_lazy || isScrolled
  const [, status] = useScript(startInclude ? 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js' : '', {
    id: 'facebook-jssdk'
  })
  window['fbAsyncInit'] = function() {

    window['FB'].init({
      xfbml: true,
      version: 'v8.0'
    })
  }
  if (ScriptStatus.ERROR === status) {
    console.log(status)
  }

  return (startInclude && content.page_id && content.app_id) ? (
      // <MessengerCustomerChat
      //   pageId={content.page_id}
      //   appId={content.app_id}
      // />
      <div className="fb-customerchat"
        // @ts-ignore
           attribution="setup_tool"
           page_id={content.page_id}>
      </div>
    ) :
    null
}
