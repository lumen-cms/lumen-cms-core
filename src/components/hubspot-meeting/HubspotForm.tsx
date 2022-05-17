import { LmHubspotFormProps } from './hubspotTypes'
import useScript, { ScriptStatus } from '@charlietango/use-script'
import { useEffect } from 'react'

export default function HubspotForm({ content }: LmHubspotFormProps) {
  const { form_id, _uid, portal_id, region } = content
  const [, status] = useScript('//js.hsforms.net/forms/shell.js')
  useEffect(() => {
    if (status === ScriptStatus.READY) {
      // @ts-ignore
      if (typeof window.hbspt !== 'undefined') {
        // @ts-ignore
        window.hbspt.forms.create({
          region: region,
          portalId: portal_id,
          formId: form_id,
          target: `#form_${_uid}`
        })
      } else {
        console.log('Hubspot forms not initialized.')
        console.log('Hubspot forms not initialized.')
      }
    }
  }, [_uid, form_id, portal_id, region, status])

  return (
    <>
      <div id={`form_${content._uid}`} />
    </>
  )
}
