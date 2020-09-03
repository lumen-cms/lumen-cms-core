// @ts-ignore
import MessengerCustomerChat from 'react-messenger-customer-chat'
import React from 'react'
import { useAppContext } from '../..'
import { useScrollOnce } from '../../utils/hooks/useScrolledOnce'
import { FacbookChatButtonProps } from './chatTypings'

export function FacebookChatButton({ content }: FacbookChatButtonProps) {
  const { insideStoryblok } = useAppContext()
  const isScrolled = useScrollOnce()
  const startInclude = !insideStoryblok && content.disable_lazy || isScrolled

  return (startInclude && content.page_id && content.app_id) ? (
    <MessengerCustomerChat
      pageId={content.page_id}
      appId={content.app_id}
    />
  ) : null
}
