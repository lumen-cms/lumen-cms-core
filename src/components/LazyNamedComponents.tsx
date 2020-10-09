import dynamic from 'next/dynamic'
import { LmCoreComponents } from '@CONFIG'

LmCoreComponents.parallax_provider = dynamic(
  () =>
    import(
      /* webpackChunkName: 'parallax' */ './section/parallaxHelpers/ParallaxProviderDefaultExport'
    )
)
LmCoreComponents.instagram_post = dynamic(
  () => import(/* webpackChunkName: 'instagram' */ './instagram/InstagramPost')
)
LmCoreComponents.instagram_list = dynamic(
  () => import(/* webpackChunkName: 'instagram' */ './instagram/InstagramList')
)
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
  () => import(/* webpackChunkName: 'popper' */ './dialog/Dialog')
)

LmCoreComponents.section_parallax = dynamic(
  () => import(/* webpackChunkName: 'parallax' */ './section/SectionParallax')
)
LmCoreComponents.accordion = dynamic(
  () => import(/* webpackChunkName: 'accordion' */ './accordion/Accordion')
)
LmCoreComponents.accordion_item = dynamic(
  () => import(/* webpackChunkName: 'accordion' */ './accordion/AccordionItem')
)

LmCoreComponents.snackbar = dynamic(
  () => import(/* webpackChunkName: 'snackbar' */ './snackbar/Snackbar')
)
LmCoreComponents.image_list = dynamic(
  () => import(/* webpackChunkName: 'imageList' */ './image-list/ImageList')
)
LmCoreComponents.image_list_item = dynamic(
  () => import(/* webpackChunkName: 'imageList' */ './image-list/ImageListItem')
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
  () => import(/* webpackChunkName: 'timeline' */ './timeline/TimelineItem')
)
LmCoreComponents.timeline = dynamic(
  () => import(/* webpackChunkName: 'timeline' */ './timeline/Timeline')
)
LmCoreComponents.tabs = dynamic(
  () => import(/* webpackChunkName: 'tabs' */ './tabs/Tabs')
)
LmCoreComponents.hubspot_meeting = dynamic(
  () =>
    import(/* webpackChunkName: 'hubspot' */ './hubspot-meeting/HubspotMeeting')
)
LmCoreComponents.iframe = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './iframe/Iframe')
)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
LmCoreComponents.iframe_advanced = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './iframe/Iframe')
)
LmCoreComponents.chat_tawkto = dynamic(
  () => import(/* webpackChunkName: 'tawkto' */ './chat/TawktoChatButton')
)
LmCoreComponents.chat_facebook = dynamic(
  () =>
    import(/* webpackChunkName: 'facebookChat' */ './chat/FacebookChatButton')
)
LmCoreComponents.paragraph = dynamic(
  () => import(/* webpackChunkName: 'paragraph' */ './paragraph/Paragraph')
)
LmCoreComponents.form = dynamic(
  () => import(/* webpackChunkName: 'googleForm' */ './google-form/GoogleForm')
)
LmCoreComponents.ecommerce_checkout = dynamic(
  () =>
    import(
      /* webpackChunkName: 'ecommerce_checkout' */ './ecommerce/EcommerceCheckout'
    )
)
LmCoreComponents.ecommerce_fastspring_product = dynamic(
  () =>
    import(
      /* webpackChunkName: 'fastspring' */ './ecommerce/fastspring/LmFastSpringCheckout'
    )
)
LmCoreComponents.ecommerce_shopify_checkout = dynamic(
  () =>
    import(
      /* webpackChunkName: 'fastspring' */ './ecommerce/shopify/ShopifyProduct'
    )
)
