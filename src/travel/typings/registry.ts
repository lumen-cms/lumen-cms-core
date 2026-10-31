import type { ComponentProps } from 'react'
import type Travel from '../components/travel/Travel'
import type TravelListWidget from '../components/travel-list/TravelListWidget'
import type AuslandszeitListWidget from '../components/auslandszeit/AuslandszeitListWidget'

declare module '../../typings/storyblok-registry' {
  interface StoryblokComponentMap {
    travel: ComponentProps<typeof Travel>['content'] & {
      component: 'travel'
      _uid: string
    }
    travels_list_widget: ComponentProps<typeof TravelListWidget>['content']
    travels_search_box: { component: 'travels_search_box'; _uid: string }
    auslandszeit_list_widget: ComponentProps<
      typeof AuslandszeitListWidget
    >['content']
  }
}
