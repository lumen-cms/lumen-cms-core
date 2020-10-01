import React from 'react'
import Fab from '@material-ui/core/Fab'
import Whatsapp from 'mdi-material-ui/Whatsapp'
import Tooltip from '@material-ui/core/Tooltip'
import { WhatsappChatButtonProps } from './chatTypings'

const whatsappUrl = `https://wa.me`

export default function WhatsappChatButton({
  content
}: WhatsappChatButtonProps) {
  let phoneNumber = content.phone_number || ''
  phoneNumber = phoneNumber.replace(/[^\w\s]/gi, '').replace(/ /g, '')
  const url = new URL(`${whatsappUrl}/${phoneNumber}`)

  return (
    <Tooltip placement="top" title={content.tooltip || ''}>
      <Fab
        onClick={() => {
          window.open(url.toString())
        }}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          backgroundColor: '#4dc247',
          color: 'white'
        }}
      >
        <Whatsapp />
      </Fab>
    </Tooltip>
  )
}
