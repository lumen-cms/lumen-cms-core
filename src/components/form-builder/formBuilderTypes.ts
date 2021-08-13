import {
  FormBuilderStoryblok,
  FormCheckboxStoryblok,
  FormSelectStoryblok,
  FormTextfieldStoryblok
} from '../../typings/generated/components-schema'
import { StoryData } from 'storyblok-js-client'

export type LmFormBuilderProps = {
  content: FormBuilderStoryblok
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
  content: LmFormContainerProps & {
    form: StoryData<FormBuilderStoryblok>
  }
}
