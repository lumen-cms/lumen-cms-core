import { LmFormContainerProps } from './formBuilderTypes'
import { LmComponentRender } from '@LmComponentRender'

export default function LmFormContainer({ content }: LmFormContainerProps) {
  return content.form?.content ? (
    <LmComponentRender content={content.form?.content} />
  ) : null
}
