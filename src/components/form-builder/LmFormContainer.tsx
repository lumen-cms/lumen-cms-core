import { LmFormContainerProps } from './formBuilderTypes'
import { LmComponentRender } from '../CoreComponents'

export default function LmFormContainer({ content }: LmFormContainerProps) {
  return typeof content.form === 'object' && content.form?.content ? (
    <LmComponentRender
      content={content.form?.content}
      additional_fields={content.additional_fields}
      success_message={content.success_message}
    />
  ) : null
}
