import type {
  DividerStoryblok,
  HtmlStoryblok
} from '../../../typings/generated/components-schema'
import { LmComponentRender } from '../../../components/CoreComponents'
import translations from '../../utils/translations'
import { mainFlexRowHeadline } from './travelSectionContent'
import type { TravelSectionProps } from './travelSectionContent'

export function TravelServices({ content, langKey }: TravelSectionProps) {
  return (
    <LmComponentRender
      content={{
        _uid: 'service-tabs',
        component: 'section',
        body: [
          mainFlexRowHeadline({
            icon: 'home-circle-outline',
            text: translations[langKey].travelDetail.accommodation
          }),
          {
            _uid: 'asdasfa',
            component: 'html',
            body: content.travel_accommodation?.description,
            styles: [{ margin: '0 0 40px 0' }]
          } as HtmlStoryblok,
          {
            component: 'divider',
            _uid: '123322asdsa'
          } as DividerStoryblok,
          mainFlexRowHeadline({
            icon: 'beaker-check-outline',
            text: translations[langKey].travelDetail.service
          }),
          {
            _uid: '12332asdfsa2',
            component: 'html',
            body: content.travel_service?.description
          } as HtmlStoryblok
        ]
      }}
    />
  )
}
