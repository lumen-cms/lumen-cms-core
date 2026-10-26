// Derived from react-google-forms-hooks 1.2.4. See LICENSE.
import { GoogleForm } from './types'
const OTHER_OPTION = '__other_option__'
const OTHER_OPTION_RESPONSE = 'other_option_response'

export const GOOGLE_FORMS_URL = 'https://docs.google.com/forms/d'

export const formatQuestionName = (id: string) => {
  if (id.includes(OTHER_OPTION_RESPONSE)) {
    return `entry.${id.replace(
      `-${OTHER_OPTION}-${OTHER_OPTION_RESPONSE}`,
      ''
    )}.${OTHER_OPTION_RESPONSE}`
  }

  return `entry.${id}`
}

export const submitToGoogleForms = async (
  form: GoogleForm,
  formData: Record<
    string,
    string | string[] | number | boolean | null | undefined
  >
): Promise<boolean> => {
  const urlParams = new URLSearchParams()
  Object.keys(formData).forEach((key) => {
    if (formData[key]) {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((answer: string) => {
          urlParams.append(formatQuestionName(key), answer)
        })
      } else {
        urlParams.append(formatQuestionName(key), String(formData[key]))
      }
    }
  })

  const fetchedResult = await fetch(
    `${GOOGLE_FORMS_URL}/${
      form.action
    }/formResponse?submit=Submit&${urlParams.toString()}`,
    {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )

  const wasSuccessful =
    fetchedResult.ok &&
    fetchedResult.status < 300 &&
    fetchedResult.status >= 200

  return wasSuccessful
}
