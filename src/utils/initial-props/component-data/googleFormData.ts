import { GoogleForm, googleFormsToJson } from 'react-google-forms-hooks'
import { FormStoryblok } from '../../../typings/generated/components-schema'

export const googleFormGetData = async (
  formProps: FormStoryblok
): Promise<GoogleForm | undefined | null> => {
  console.log('insde google form')
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
