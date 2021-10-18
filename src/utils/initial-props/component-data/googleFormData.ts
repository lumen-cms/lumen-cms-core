import { fetchGoogleFormDataClient } from './fetchGoogleFormData'
import { FormStoryblok } from '../../../typings/generated/components-schema'
import { googleFormsToJson } from './googleFormsToJson'
import { GoogleFormWithDate } from './googleFormsToJsonTypes'

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
): Promise<GoogleFormWithDate | undefined | null> => {
  if (!formProps.api) {
    return null
  }

  try {
    const result = await googleFormsToJson(formProps.api)
    return result
  } catch (err) {
    console.error(err)
    return null
  }
}
