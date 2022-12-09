import {
  FormBuilderStoryblok,
  FormCheckboxStoryblok,
  FormContainerStoryblok,
  FormSelectStoryblok,
  FormTextfieldStoryblok
} from '../../typings/generated/components-schema'
import { ISbStoryData } from 'storyblok-js-client'

export type LmFormBuilderProps = {
  content: FormBuilderStoryblok
  onSubmit?: (data: any) => void
  additional_fields?: FormBuilderStoryblok['additional_fields']
  success_message?: FormBuilderStoryblok['success_message']
}

export type LmFormTextFieldProps = {
  content: FormTextfieldStoryblok
  options: Omit<
    FormBuilderStoryblok,
    'success_message' | 'fields' | 'submit' | 'endpoint'
  >
}
export type LmSelectFieldProps = {
  content: FormSelectStoryblok
  options: Omit<
    FormBuilderStoryblok,
    'success_message' | 'fields' | 'submit' | 'endpoint'
  >
}

export type LmFormCheckboxProps = {
  content: FormCheckboxStoryblok
  options: Omit<
    FormBuilderStoryblok,
    'success_message' | 'fields' | 'submit' | 'endpoint'
  >
}

export type LmFormContainerProps = {
  content: FormContainerStoryblok & {
    form: ISbStoryData<FormBuilderStoryblok>
  }
}
