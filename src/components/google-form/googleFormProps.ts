import { FormStoryblok } from '../../typings/generated/components-schema'
import { GoogleFormWithDate } from '../../utils/initial-props/component-data/googleFormsToJsonTypes'

export type LmGoogleFormProps = {
  content: FormStoryblok & {
    form_data: GoogleFormWithDate
  }
}
