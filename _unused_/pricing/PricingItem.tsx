import SbEditable from 'storyblok-react'
import { Card } from '@rmwc/card'
import Components from '@components'
import { FunctionComponent } from 'react'
import { PricingItemStoryblok } from '../../typings/generated/components-schema'


const PricingItem: FunctionComponent<PricingItemStoryblok> = (props) => {
  const media = props.image && props.image[0]
  const title = props.title || []
  const price = props.price || []
  const promotion = props.promotion || []
  const features = props.features || []
  const subtitle = props.subtitle || []
  const button = props.button || []

  return (
    <SbEditable content={props}>
      <Card style={{ height: '100%' }}>
        {media && <div className="lm-pricing__media">{Components(media)}</div>}
        <div className={`lm-pricing__title${!title.length ? ' lm-no-title' : ''}`}>{title.map(v => Components(v))}</div>
        {price.length > 0 && (
          <div className="lm-pricing__price">
            {promotion.length > 0 && promotion.map(v => Components(v))}
            {price.map(v => Components(v))}
          </div>
        )}
        {subtitle.length > 0 && <div className="lm-pricing__subtitle">{subtitle.map(v => Components(v))}</div>}
        {features.length > 0 && <div className="lm-pricing__features">
          <ul>{features.map(v => {
            return <li key={v._uid}>{Components(v)}</li>
          })}</ul>
        </div>}
        {button.length > 0 && <div className="lm-pricing__action">{button.map(v => Components(v))}</div>}
      </Card>
    </SbEditable>
  )
}

export default PricingItem
