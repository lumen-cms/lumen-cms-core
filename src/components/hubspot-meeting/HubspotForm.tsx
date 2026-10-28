import { LmHubspotFormProps } from './hubspotTypes'
import { useExternalScript as useScript } from '../../utils/hooks/useExternalScript'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          region?: string
          portalId?: string
          formId?: string
          target: string
        }) => void
      }
    }
  }
}

export default function HubspotForm({ content }: LmHubspotFormProps) {
  const { form_id, _uid, portal_id, region } = content
  const status = useScript('//js.hsforms.net/forms/shell.js')
  const initialized = useRef<string | null>(null)
  useEffect(() => {
    if (status !== 'ready') return
    const key = JSON.stringify([_uid, form_id, portal_id, region])
    if (initialized.current === key) return
    const target = document.getElementById(`form_${_uid}`)
    if (!target || !window.hbspt) return
    // Strict Mode replays effects. Create once for a given form configuration.
    target.replaceChildren()
    window.hbspt.forms.create({
      region,
      portalId: portal_id,
      formId: form_id,
      target: `#form_${_uid}`
    })
    initialized.current = key
  }, [_uid, form_id, portal_id, region, status])

  return (
    <>
      <div id={`form_${content._uid}`} />
    </>
  )
}
