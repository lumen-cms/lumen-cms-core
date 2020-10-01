import dynamic from 'next/dynamic'
import { LmCoreComponents } from '..'

LmCoreComponents.chat_whatsapp = dynamic(
  () => import(/* webpackChunkName: 'popper' */ './chat/WhatsappChatButton')
)
LmCoreComponents.list_search_autocomplete = dynamic(
  () =>
    import(
      /* webpackChunkName: 'popper' */ './list-widget/ListSearchAutocomplete'
    )
)
LmCoreComponents.category_box = dynamic(
  () => import(/* webpackChunkName: 'popper' */ './list-widget/CategoryBox')
)
LmCoreComponents.list_search_field = dynamic(
  () => import(/* webpackChunkName: 'popper' */ './list-widget/ListSearchField')
)

LmCoreComponents.dialog = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './dialog/Dialog')
)

LmCoreComponents.section_parallax = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './section/SectionParallax')
)

LmCoreComponents.accordion = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './accordion/Accordion')
)
LmCoreComponents.accordion_item = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './accordion/AccordionItem')
)

LmCoreComponents.snackbar = dynamic(
  () => import(/* webpackChunkName: 'snackbar' */ './snackbar/Snackbar')
)
LmCoreComponents.image_list = dynamic(
  () => import(/* webpackChunkName: 'slider' */ './image-list/ImageList')
)
LmCoreComponents.image_list_item = dynamic(
  () => import(/* webpackChunkName: 'slider' */ './image-list/ImageListItem')
)
LmCoreComponents.slider = dynamic(
  () => import(/* webpackChunkName: 'slider' */ './slider/Slider')
)
LmCoreComponents.section_video_bg = dynamic(
  () => import(/* webpackChunkName: 'videoPlayer' */ './section/SectionVideoBg')
)
LmCoreComponents.player = dynamic(
  () => import(/* webpackChunkName: 'videoPlayer' */ './player/Player')
)
LmCoreComponents.timeline_item = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './timeline/TimelineItem')
)
LmCoreComponents.timeline = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './timeline/Timeline')
)
LmCoreComponents.tabs = dynamic(
  () => import(/* webpackChunkName: 'slider' */ './tabs/Tabs')
)
LmCoreComponents.hubspot_meeting = dynamic(
  () =>
    import(/* webpackChunkName: 'hubspot' */ './hubspot-meeting/HubspotMeeting')
)
LmCoreComponents.iframe = dynamic(
  () => import(/* webpackChunkName: 'iframe' */ './iframe/Iframe')
)
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
LmCoreComponents.iframe_advanced = LmCoreComponents.iframe
LmCoreComponents.chat_tawkto = dynamic(
  () => import(/* webpackChunkName: 'tawkto' */ './chat/TawktoChatButton')
)
LmCoreComponents.chat_facebook = dynamic(
  () =>
    import(/* webpackChunkName: 'facebookChat' */ './chat/FacebookChatButton')
)

LmCoreComponents.instagram_post = dynamic(
  () => import(/* webpackChunkName: 'instagram' */ './instagram/InstagramPost')
)
LmCoreComponents.instagram_list = dynamic(
  () => import(/* webpackChunkName: 'instagram' */ './instagram/InstagramList')
)
