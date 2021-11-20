import dynamic from 'next/dynamic'
import { LmCoreComponents } from '@CONFIG'

LmCoreComponents.table = dynamic(
  () => import(/* webpackChunkName: 'table' */ './table/Table')
)

LmCoreComponents.motion = dynamic(
  () => import(/* webpackChunkName: 'motion' */ './motion/Motion')
)

LmCoreComponents.parallax_provider = dynamic(
  () =>
    import(
      /* webpackChunkName: 'parallax' */ './section/helper/ParallaxProviderDefaultExport'
    )
)
LmCoreComponents.gallery = dynamic(() => import('./gallery/LmGallery'))
// LmCoreComponents.instagram_post = dynamic(
//   () => import(/* webpackChunkName: 'instagram' */ './instagram/InstagramPost')
// )
// LmCoreComponents.instagram_list = dynamic(
//   () => import(/* webpackChunkName: 'instagram' */ './instagram/InstagramList')
// )
LmCoreComponents.instagram_post = () => null // instagram disabled for now
LmCoreComponents.instagram_list = () => null // instagram disabled for now

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
  () => import(/* webpackChunkName: 'popper' */ './snackbar/Snackbar')
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
LmCoreComponents.timeline_item = dynamic(
  () => import(/* webpackChunkName: 'timeline' */ './timeline/TimelineItem')
)
LmCoreComponents.timeline = dynamic(
  () => import(/* webpackChunkName: 'timeline' */ './timeline/Timeline')
)
LmCoreComponents.tabs = dynamic(
  () => import(/* webpackChunkName: 'slider' */ './tabs/Tabs')
)
LmCoreComponents.hubspot_meeting = dynamic(
  () =>
    import(/* webpackChunkName: 'hubspot' */ './hubspot-meeting/HubspotMeeting')
)

LmCoreComponents.paragraph = dynamic(
  () => import(/* webpackChunkName: 'paragraph' */ './paragraph/Paragraph')
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
LmCoreComponents.auth_container = dynamic(
  () => import(/* webpackChunkName: 'authContainer' */ './auth/AuthContainer')
)
LmCoreComponents.bottom_navigation = dynamic(
  () =>
    import(
      /* webpackChunkName: 'bottomNavigation' */ './bottom-navigation/BottomNavigation'
    )
)
LmCoreComponents.button_speech_text = dynamic(
  () =>
    import(
      /* webpackChunkName: 'buttonSpeechText' */ './button/ButtonSpeechText'
    ),
  { ssr: false }
)
// LmCoreComponents.auth_form = dynamic(
//   () => import(/* webpackChunkName: 'bottomNavigation' */ './auth/AuthForm')
// )

LmCoreComponents.form_container = dynamic(
  () =>
    import(
      /* webpackChunkName: 'formBuilder' */ './form-builder/LmFormContainer'
    )
)

LmCoreComponents.form_builder = dynamic(
  () =>
    import(/* webpackChunkName: 'formBuilder' */ './form-builder/FormBuilder')
)
LmCoreComponents.form_textfield = dynamic(
  () =>
    import(/* webpackChunkName: 'formBuilder' */ './form-builder/FormTextField')
)
LmCoreComponents.form_select = dynamic(
  () =>
    import(
      /* webpackChunkName: 'formBuilder' */ './form-builder/FormSelectField'
    )
)
LmCoreComponents.form_checkbox = dynamic(
  () =>
    import(/* webpackChunkName: 'formBuilder' */ './form-builder/FormCheckbox')
)

LmCoreComponents.card_list_item = dynamic(
  () => import(/* webpackChunkName: 'lists' */ './card/CardListItem')
)

LmCoreComponents.card_list = dynamic(
  () => import(/* webpackChunkName: 'lists' */ './card/CardList')
)

LmCoreComponents.list_widget = dynamic(
  () => import(/* webpackChunkName: 'lists' */ './list-widget/ListWidget')
)

LmCoreComponents.event_calendar = dynamic(() => import('./event/EventCalendar'))

LmCoreComponents.list_stories = dynamic(
  () => import('./list-widget/ListStories')
)
