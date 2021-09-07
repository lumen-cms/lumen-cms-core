import { LmFormContainerProps } from './formBuilderTypes'
import { LmComponentRender } from '@LmComponentRender'

export default function LmFormContainer({ content }: LmFormContainerProps) {
  return content.form?.content ? (
    <LmComponentRender
      content={content.form?.content}
      additional_fields={content.additional_fields}
      success_message={content.success_message}
    />
  ) : null
}
