import type {
  BackgroundStoryblok,
  RowStoryblok
} from '../../../typings/generated/components-schema'
import { LmComponentRender } from '../../../components/CoreComponents'
import type { TravelSectionProps } from './travelSectionContent'
import { useCurrency } from '../travel-list/helpers'
import { getTravelDetailsColumn } from './travelDetailsContent'
import { getTravelBookingColumn } from './travelBookingContent'

export function TravelOverview({ content, langKey }: TravelSectionProps) {
  const currency = useCurrency(langKey === 'DE' ? 'de' : 'en')
  return (
    <LmComponentRender
      content={{
        _uid: 'fast-facts',
        component: 'section',
        body: [
          {
            _uid: 'row-1',
            component: 'row',
            reverse_on_mobile: true,
            justify: 'flex-start',
            align_items: 'flex-start',
            body: [
              getTravelDetailsColumn({ content, langKey }),
              getTravelBookingColumn({ content, langKey }, currency)
            ]
          } as RowStoryblok
        ],
        background: [
          {
            _uid: '2',
            component: 'background'
          } as BackgroundStoryblok
        ]
      }}
    />
  )
}
