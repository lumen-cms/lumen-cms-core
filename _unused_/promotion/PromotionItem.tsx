import SbEditable from 'storyblok-react'
import React, { createRef, FunctionComponent, RefObject } from 'react'
import Components from '@components'
import clsx from 'clsx'
import { PromotionItemStoryblok } from '../../typings/generated/components-schema'
import { WithWindowDimensionsProps } from '../provider/WindowDimensionsProvider'


const PromotionItem: FunctionComponent<PromotionItemStoryblok & {
  dimensions: WithWindowDimensionsProps
}> = (props) => {
  const container: RefObject<HTMLDivElement> = createRef()
  const body = props.body || []
  const action = props.action || []
  const className = clsx('lm-promotion__item', {
    [`lm-promotion__item-${props.variant ? props.variant : 'variant'}`]: true,
    [`lm-promotion__item-${props.position}`]: !!props.position
  })

  return (
    <SbEditable content={props}>
      <div className={className} ref={container}>
        <div>
          <div className="lm-promotion__content">
            {body.map(blok => Components(blok))}
          </div>
          <div className="lm-promotion__action">
            {action.map((blok) => Components(blok))}
          </div>
        </div>
      </div>
    </SbEditable>
  )
}

export default PromotionItem
