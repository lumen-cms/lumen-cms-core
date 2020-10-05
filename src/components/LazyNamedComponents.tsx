import dynamic from 'next/dynamic'

export const LmLazyComponents = {
  instagram_post: dynamic(
    () =>
      import(/* webpackChunkName: 'instagram' */ './instagram/InstagramPost')
  ),
  instagram_list: dynamic(
    () =>
      import(/* webpackChunkName: 'instagram' */ './instagram/InstagramList')
  ),
  chat_whatsapp: dynamic(
    () => import(/* webpackChunkName: 'popper' */ './chat/WhatsappChatButton')
  ),
  list_search_autocomplete: dynamic(
    () =>
      import(
        /* webpackChunkName: 'popper' */ './list-widget/ListSearchAutocomplete'
      )
  ),
  category_box: dynamic(
    () => import(/* webpackChunkName: 'popper' */ './list-widget/CategoryBox')
  ),
  list_search_field: dynamic(
    () =>
      import(/* webpackChunkName: 'popper' */ './list-widget/ListSearchField')
  ),

  dialog: dynamic(
    () => import(/* webpackChunkName: 'addon' */ './dialog/Dialog')
  ),

  section_parallax: dynamic(
    () => import(/* webpackChunkName: 'addon' */ './section/SectionParallaxOld')
  ),
  section_parallax2: dynamic(
    () => import(/* webpackChunkName: 'addon' */ './section/SectionParallaxOld')
  ),
  accordion: dynamic(
    () => import(/* webpackChunkName: 'addon' */ './accordion/Accordion')
  ),
  accordion_item: dynamic(
    () => import(/* webpackChunkName: 'addon' */ './accordion/AccordionItem')
  ),

  snackbar: dynamic(
    () => import(/* webpackChunkName: 'snackbar' */ './snackbar/Snackbar')
  ),
  image_list: dynamic(
    () => import(/* webpackChunkName: 'slider' */ './image-list/ImageList')
  ),
  image_list_item: dynamic(
    () => import(/* webpackChunkName: 'slider' */ './image-list/ImageListItem')
  ),
  slider: dynamic(
    () => import(/* webpackChunkName: 'slider' */ './slider/Slider')
  ),
  section_video_bg: dynamic(
    () =>
      import(/* webpackChunkName: 'videoPlayer' */ './section/SectionVideoBg')
  ),
  player: dynamic(
    () => import(/* webpackChunkName: 'videoPlayer' */ './player/Player')
  ),
  timeline_item: dynamic(
    () => import(/* webpackChunkName: 'addon' */ './timeline/TimelineItem')
  ),
  timeline: dynamic(
    () => import(/* webpackChunkName: 'addon' */ './timeline/Timeline')
  ),
  tabs: dynamic(() => import(/* webpackChunkName: 'slider' */ './tabs/Tabs')),
  hubspot_meeting: dynamic(
    () =>
      import(
        /* webpackChunkName: 'hubspot' */ './hubspot-meeting/HubspotMeeting'
      )
  ),
  iframe: dynamic(
    () => import(/* webpackChunkName: 'iframe' */ './iframe/Iframe')
  ),

  iframe_advanced: dynamic(
    () => import(/* webpackChunkName: 'iframe' */ './iframe/Iframe')
  ),
  chat_tawkto: dynamic(
    () => import(/* webpackChunkName: 'tawkto' */ './chat/TawktoChatButton')
  ),
  chat_facebook: dynamic(
    () =>
      import(/* webpackChunkName: 'facebookChat' */ './chat/FacebookChatButton')
  ),
  paragraph: dynamic(
    () => import(/* webpackChunkName: 'paragraph' */ './paragraph/Paragraph')
  ),
  form: dynamic(
    () =>
      import(/* webpackChunkName: 'googleForm' */ './google-form/GoogleForm')
  )
}
