import { useEffect, useState } from 'react'
import { hijackGoogleFormsXHR } from './hijackGoogleFormXHR'
import parseHijackedFormData, {
  ParseHijackGoogleFormPayload
} from './parseHijackedFormData'

export type StructuredFormProps = ParseHijackGoogleFormPayload | undefined

export function useGoogleForm(formUrl: string) {
  const [formStructure, setFormStructure] = useState<StructuredFormProps>(
    undefined
  )
  useEffect(() => {
    if (!formStructure && formUrl) {
      hijackGoogleFormsXHR(XMLHttpRequest)
      ;(() => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', formUrl)
        xhr.onload = () => {
          const parsedData = parseHijackedFormData(xhr.response)
          setFormStructure(parsedData)
        }
        xhr.send()
      })()
    }
  }, [formStructure, formUrl])

  return {
    formStructure
  }
}
