import type { FormHiddenFieldStoryblok } from '../../typings/generated/components-schema'

type HiddenValue = Pick<
  FormHiddenFieldStoryblok,
  'name' | 'value' | 'is_number'
>

export function additionalFormData(fields: readonly HiddenValue[]) {
  return Object.fromEntries(
    fields.map((field) => [
      field.name,
      field.is_number ? Number(field.value) : field.value
    ])
  )
}
