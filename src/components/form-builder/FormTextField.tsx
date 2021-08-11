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
    max_rows
  } = content
  const { margin, full_width, variant } = options
  return (
    <TextFieldElement
      name={name}
      variant={variant}
      label={label}
      placeholder={placeholder}
      required={required}
      helperText={help_text}
      multiline={textarea}
      type={type}
      margin={margin}
      rows={textarea ? (rows ? Number(rows) : 3) : undefined}
      maxRows={textarea && max_rows ? Number(max_rows) : undefined}
      fullWidth={full_width}
    />
  )
}
