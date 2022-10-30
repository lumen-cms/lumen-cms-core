import { LmSelectFieldProps } from './formBuilderTypes'
import {
  CheckboxButtonGroup,
  MultiSelectElement,
  RadioButtonGroup,
  SelectElement
} from 'react-hook-form-mui'

export default function LmFormSelectField({
  content,
  ...rest
}: LmSelectFieldProps) {
  const { label, name, placeholder, help_text, required, options, type, _uid } =
    content
  const currentOptions =
    options?.map((option) => ({
      id: option.value || option.label,
      title: option.label || option.id,
      label: option.label || option.id
    })) || []
  console.log('values', name, label, type)

  return {
    checkbox: (
      <CheckboxButtonGroup
        label={label}
        required={required}
        helperText={help_text}
        options={currentOptions}
        name={name || _uid}
      />
    ),
    radio: (
      <RadioButtonGroup
        label={label}
        required={required}
        options={currentOptions}
        name={name || _uid}
        helperText={help_text}
      />
    ),
    'multi-select': (
      <MultiSelectElement
        name={name || _uid}
        label={label}
        placeholder={placeholder}
        required={required}
        options={currentOptions}
        itemKey={'id'}
        itemValue={'id'}
        itemLabel={'label'}
        type={'text'}
        variant={rest.options.variant || 'standard'}
        margin={rest.options.margin || undefined}
        fullWidth={rest.options.full_width}
        helperText={help_text}
      />
    ),
    single: (
      <SelectElement
        name={name || _uid}
        label={label || undefined}
        style={{ minWidth: '168px' }}
        variant={rest.options.variant || 'standard'}
        options={currentOptions}
        placeholder={placeholder || undefined}
        required={required}
        helperText={help_text || undefined}
        margin={rest.options.margin || undefined}
        fullWidth={rest.options.full_width}
      />
    )
  }[type || 'single']
}
