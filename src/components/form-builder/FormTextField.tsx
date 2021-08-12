import { LmFormTextFieldProps } from './formBuilderTypes'
import { TextFieldElement } from 'react-hook-form-mui'

export default function LmFormTextField({
  content,
  options
}: LmFormTextFieldProps) {
  const {
    label,
    name,
    placeholder,
    help_text,
    textarea,
    required,
    type,
    rows,
    max_rows,
    _uid
  } = content
  const { margin, full_width, variant } = options
  return (
    <TextFieldElement
      name={name || _uid}
      variant={variant || 'standard'}
      label={label || undefined}
      placeholder={placeholder || undefined}
      required={required}
      helperText={help_text || undefined}
      multiline={textarea || undefined}
      type={type || 'text'}
      margin={margin || undefined}
      rows={textarea ? (rows ? Number(rows) : 3) : undefined}
      maxRows={textarea && max_rows ? Number(max_rows) : undefined}
      fullWidth={full_width}
    />
  )
}
