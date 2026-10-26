// Common fields used by the Storybook editors in the exported CMS schema.
export type StorybookSchemaField = {
  type: string
  required?: boolean
  field_type?: string
  default_value?: string | number | boolean
  options?: { value: string; name: string }[]
}
