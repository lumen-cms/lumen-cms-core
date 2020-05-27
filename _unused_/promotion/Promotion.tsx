import SbEditable from 'storyblok-react'
import React, { FunctionComponent } from 'react'
import Image from '../image/Image'
import PromotionItem from './PromotionItem'
import { PromotionStoryblok } from '../../typings/generated/components-schema'
import { useWindowDimensions } from '../provider/WindowDimensionsProvider'

const Promotion: FunctionComponent<{ content: PromotionStoryblok }> = ({ content }) => {
  const dimensions = useWindowDimensions()
  const image = content.image && content.image[0]
  const body = content.body || []
  return (
    <SbEditable content={content}>
      <div className="lm-promotion">
        <Image content={image} />
        {body.map((blok) => <PromotionItem {...blok}
                                           dimensions={dimensions}
                                           key={blok._uid} />)}
      </div>
    </SbEditable>
  )
}

export default Promotion
