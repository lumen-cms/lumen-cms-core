import { Field, GoogleForm } from '../../../vendor/google-forms'

export type GoogleFormWithDate = Omit<GoogleForm, 'fields'> & {
  fields: FieldWithDate[]
}

export interface DateField {
  id: string
  label: string
  required: boolean
  type: 'DATE'
}

export type FieldWithDate = Field | DateField
