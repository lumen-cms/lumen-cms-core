import { LmSelectFieldProps } from './formBuilderTypes'
import {
  CheckboxButtonGroup,
  MultiSelectElement,
  RadioButtonGroup,
  SelectElement
} from 'react-hook-form-mui'

export default function LmFormTextField({
  content,
  ...rest
}: LmSelectFieldProps) {
  const {
    label,
    name,
    placeholder,
    help_text,
    required,
    options,
    type = 'single'
  } = content
  const currentOptions =
    options?.map((option) => ({
      id: option.value || option.label,
      title: option.label || option.id,
      label: option.label || option.id
    })) || []
  return {
    checkbox: (
      <CheckboxButtonGroup
        label={label}
        required={required}
        helperText={help_text}
        options={currentOptions}
        name={name}
      />
    ),
    radio: (
      <RadioButtonGroup
        label={label}
        required={required}
        options={currentOptions}
        name={name}
        helperText={help_text}
      />
    ),
    'multi-select': (
      <MultiSelectElement
        name={name}
        label={label}
        placeholder={placeholder}
        required={required}
        menuItems={currentOptions}
        itemKey={'id'}
        itemValue={'id'}
        itemLabel={'label'}
        variant={rest.options.variant}
        margin={rest.options.margin}
        fullWidth={rest.options.full_width}
        helperText={help_text}
      />
    ),
    single: (
      <SelectElement
        name={name}
        label={label}
        style={{ minWidth: '168px' }}
        variant={rest.options.variant}
        options={currentOptions}
        placeholder={placeholder}
        required={required}
        helperText={help_text}
        margin={rest.options.margin}
        fullWidth={rest.options.full_width}
      />
    )
  }[type]
}
