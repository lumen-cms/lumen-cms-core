import { useState } from 'react'

export function formHandling({ helpText = '', helpTextPersistent = false, errorMsgEmail, errorMsgRequired }: {
  helpText?: string
  helpTextPersistent?: boolean
  errorMsgEmail?: string
  errorMsgRequired?: string
}) {
  const initialMsg = {
    children: helpText,
    persistent: helpTextPersistent,
    validationMsg: false
  }
  let [msg, setMsg] = useState<{
    children?: string
    validationMsg?: boolean
    persistent?: boolean
  }>(initialMsg)

  const onInputChange = (input: HTMLInputElement) => {
    if (input.type === 'email' && input.validity.typeMismatch) {
      setMsg({
        children: errorMsgEmail,
        validationMsg: true,
        persistent: true
      })
    } else if (input.validity.valueMissing) {
      setMsg({
        children: errorMsgRequired,
        validationMsg: true,
        persistent: true
      })
    } else {
      setMsg(initialMsg)
    }
  }

  return { msg, onInputChange }
}
