import { Field, GoogleForm } from 'react-google-forms-hooks'

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
