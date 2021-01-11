import React, { useEffect, useState } from 'react'
import useScript, { ScriptStatus } from '@charlietango/use-script'
import { useScrollOnce } from '../../utils/hooks/useScrolledOnce'
import { FacbookChatButtonProps } from './chatTypings'
import { useInsideStoryblok } from '../provider/SettingsPageProvider'

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

export default function FacebookChatButton({
  content
}: FacbookChatButtonProps) {
  const insideStoryblok = useInsideStoryblok()
  const isScrolled = useScrollOnce()
  const startInclude =
    !insideStoryblok && content.page_id && (content.disable_lazy || isScrolled)
  const [initialized, setInitialized] = useState<boolean>(false)
  const [, status] = useScript(
    startInclude
      ? 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
      : '',
    {
      attributes: {
        id: 'facebook-jssdk'
      }
    }
  )
  if (!initialized) {
    window.fbAsyncInit = () => {
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      attribution="setup_tool"
      page_id={content.page_id}
    />
  ) : null
}
