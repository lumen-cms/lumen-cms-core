import { FormStoryblok } from '../../typings/generated/components-schema'
import { GoogleFormDataProps } from '../../utils/hooks/googleForms/parseHijackedFormData'

export type LmGoogleFormProps = {
  content: FormStoryblok & {
    form_data: GoogleFormDataProps
  }
}
