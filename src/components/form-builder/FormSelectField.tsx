import { LmSelectFieldProps } from './formBuilderTypes'
import { SelectElement } from 'react-hook-form-mui'

export default function LmFormTextField({
  content,
  ...rest
}: LmSelectFieldProps) {
  const { label, name, placeholder, help_text, required, options } = content
  return (
    <SelectElement
      name={name}
      label={label}
      style={{ minWidth: '168px' }}
      variant={rest.options.variant}
      options={options?.map((option) => ({
        id: option.value || option.label,
        title: option.label || option.id
      }))}
      placeholder={placeholder}
      required={required}
      helperText={help_text}
      margin={rest.options.margin}
      fullWidth={rest.options.full_width}
    />
  )
}
