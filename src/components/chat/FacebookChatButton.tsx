import { useEffect } from 'react'
import { useExternalScript as useScript } from '../../utils/hooks/useExternalScript'
import { useScrollOnce } from '../../utils/hooks/useScrolledOnce'
import { FacbookChatButtonProps } from './chatTypings'
import { useAppContext } from '@context/AppContext'

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

export default function LmFacebookChatButton({
  content
}: FacbookChatButtonProps) {
  const { insideStoryblok } = useAppContext()
  const isScrolled = useScrollOnce()
  const startInclude =
    !insideStoryblok && content.page_id && (content.disable_lazy || isScrolled)
  // Register before the script-loader effect; never access window during SSR.
  useEffect(() => {
    if (!startInclude) return
    const previous = window.fbAsyncInit
    const initialize = () => {
      window.FB?.init({ xfbml: true, version: 'v8.0' })
    }
    window.fbAsyncInit = initialize
    if (window.FB) initialize()
    return () => {
      if (window.fbAsyncInit === initialize) window.fbAsyncInit = previous
    }
  }, [startInclude])
  const status = useScript(
    startInclude
      ? 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
      : '',
    {
      attributes: {
        id: 'facebook-jssdk'
      }
    }
  )
  if ('error' === status) {
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
      // eslint-disable-next-line
      // @ts-ignore
      attribution="setup_tool"
      page_id={content.page_id}
    />
  ) : null
}
