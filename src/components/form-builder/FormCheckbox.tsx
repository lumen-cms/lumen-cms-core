import { LmFormCheckboxProps } from './formBuilderTypes'
import { CheckboxElement } from 'react-hook-form-mui'

export default function LmFormCheckbox({ content }: LmFormCheckboxProps) {
  const { name, label, required, value, _uid } = content
  return (
    <CheckboxElement
      name={name || _uid}
      label={label}
      required={required}
      value={value}
    />
  )
}
