import React, { useEffect, useState } from 'react'
import { useAppContext } from '../provider/context/AppContext'
import { useScrollOnce } from '../../utils/hooks/useScrolledOnce'
import { FacbookChatButtonProps } from './chatTypings'
import useScript, { ScriptStatus } from '../../utils/hooks/useScript'

declare global {
  interface Window {
    fbAsyncInit?: () => void
    FB?: {
      init: (props: any) => void
      CustomerChat: {
        hide: () => void
        showDialog: () => void
        hideDialog: () => void
        show: (shouldShowDialog?: boolean) => void
      }
      [k: string]: any
    }
  }
}

export function FacebookChatButton({ content }: FacbookChatButtonProps) {
  const { insideStoryblok } = useAppContext()
  const isScrolled = useScrollOnce()
  const startInclude =
    !insideStoryblok && content.page_id && (content.disable_lazy || isScrolled)
  const [initialized, setInitialized] = useState<boolean>(false)
  const [, status] = useScript(
    startInclude
      ? 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
      : '',
    {
      id: 'facebook-jssdk'
    }
  )
  if (!initialized) {
    window.fbAsyncInit = function () {
      window.FB?.init({
        xfbml: true,
        version: 'v8.0'
      })
      setInitialized(true)
    }
  }
  if (ScriptStatus.ERROR === status) {
    console.log(status)
  }

  useEffect(() => {
    window?.FB?.CustomerChat?.show()
    return () => {
      window?.FB?.CustomerChat?.hide()
    }
  }, [])

  return startInclude ? (
    // <MessengerCustomerChat
    //   pageId={content.page_id}
    //   appId={content.app_id}
    // />
    <div
      className="fb-customerchat"
      // @ts-ignore
      attribution="setup_tool"
      page_id={content.page_id}
    />
  ) : null
}
