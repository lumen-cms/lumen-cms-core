import { fetchGoogleFormDataClient } from './fetchGoogleFormData'
import { FormStoryblok } from '../../../typings/generated/components-schema'
import parseHijackedFormData, {
  GoogleFormDataProps
} from '../../hooks/googleForms/parseHijackedFormData'

export const fetchGoogleFormData = async (url: string) => {
  if (typeof window !== 'undefined') {
    return fetchGoogleFormDataClient(url)
  }
  if (url.indexOf('docs.google.com') !== -1) {
    return fetch(
      `https://googleformrestyler.apixml.net/corsProxy.aspx?base64Url=${Buffer.from(
        url.trim()
      ).toString('base64')}`
    ).then((r) => r.text())
  }
  return ''
}

export const googleFormGetData = async (
  formProps: FormStoryblok
): Promise<GoogleFormDataProps | undefined | null> => {
  if (!formProps.api) {
    return null
  }
  const res = await fetchGoogleFormData(formProps.api)
  return parseHijackedFormData(res)
}
