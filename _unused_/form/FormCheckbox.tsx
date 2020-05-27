// import { formHandling } from './formHandling'
// import { Checkbox } from '@rmwc/checkbox'
import { FunctionComponent } from 'react'
import { FormCheckboxStoryblok } from '../../typings/generated/components-schema'
// import { TextFieldHelperText } from '@rmwc/textfield'

const FormCheckbox: FunctionComponent<FormCheckboxStoryblok> = (content) => {
  console.log(content)
  // let inputRef: HTMLInputElement
  // const { msg, onInputChange } = formHandling({
  //   helpText: content.help_text,
  //   helpTextPersistent: content.help_text_persistent,
  //   errorMsgRequired: content.errorMsgRequired,
  //   errorMsgEmail: content.errorMsgEmail
  // })

  // not yet implemented
  // if (content.onChange) {
  //   fieldProps.onChange = (ev) => content.onChange(ev.target.value)
  // }
  // let className = ''
  // if (msg.validationMsg) {
  //   className = 'lm-checkbox-failed'
  // } else {
  //   className = ''
  // }

  return 'still not done yet...'
  // return (
  //   <>
  //     <Checkbox
  //       id={content._uid}
  //       label={content.label}
  //       name={content.name}
  //       required={!!content.required}
  //       inputRef={(el: any) => inputRef = el}
  //       className={className}
  //       onBlur={() => onInputChange(inputRef)}
  //     />
  //     {msg.children && <TextFieldHelperText
  //       validationMsg={msg.validationMsg}
  //       persistent={msg.persistent}
  //     >{msg.children}</TextFieldHelperText>}
  //   </>
  // )
}

export default FormCheckbox
