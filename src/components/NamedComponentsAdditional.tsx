import { LmCoreComponents } from '@CONFIG'
import LmAccordion from './accordion/Accordion'
import LmAccordionItem from './accordion/AccordionItem'
import LmCardList from './card/CardList'
import LmWhatsappChatButton from './chat/WhatsappChatButton'
import LmTawktoChatButton from './chat/TawktoChatButton'
import LmFacebookChatButton from './chat/FacebookChatButton'
import LmDialog from './dialog/Dialog'
import LmIframe from './iframe/Iframe'
import LmEcommerceCheckout from './ecommerce/EcommerceCheckout'
import LmFastSpringCheckout from './ecommerce/fastspring/LmFastSpringCheckout'
import LmHubspotMeeting from './hubspot-meeting/HubspotMeeting'
import LmImageList from './image-list/ImageList'
import LmImageListItem from './image-list/ImageListItem'
import LmListSearchAutocomplete from './list-widget/ListSearchAutocomplete'
import LmParagraph from './paragraph/Paragraph'
import LmMotion from './motion/Motion'
import LmPlayer from './player/Player'
import LmSlider from './slider/Slider'
import LmSnackbar from './snackbar/Snackbar'
import LmTable from './table/Table'
import LmTabs from './tabs/Tabs'
import LmTimeline from './timeline/Timeline'
import LmTimelineItem from './timeline/TimelineItem'
import LmCardListItem from './card/CardListItem'
import LmListWidget from './list-widget/ListWidget'
import LmSectionVideo from './section/SectionVideoBg'
import LmSectionParallax from './section/SectionParallax'
import LmGoogleFormContainer from './google-form/LmGoogleFormContainer'

// assign all additional components non dynamic for Storybook
LmCoreComponents.table = LmTable
LmCoreComponents.card_list = LmCardList
LmCoreComponents.card_list_item = LmCardListItem
LmCoreComponents.list_widget = LmListWidget // todo 5
LmCoreComponents.motion = LmMotion
// LmCoreComponents.parallax_provider = ParallaxProviderDefaultExport
// LmCoreComponents.instagram_post = LmInstagramPost
// LmCoreComponents.instagram_list = LmInstagramList
LmCoreComponents.chat_whatsapp = LmWhatsappChatButton
LmCoreComponents.list_search_autocomplete = LmListSearchAutocomplete
// LmCoreComponents.category_box = LmCategoryBox
// LmCoreComponents.list_search_field = LmListSearchField
LmCoreComponents.dialog = LmDialog
LmCoreComponents.section_parallax = LmSectionParallax
LmCoreComponents.accordion = LmAccordion
LmCoreComponents.accordion_item = LmAccordionItem
LmCoreComponents.snackbar = LmSnackbar
LmCoreComponents.image_list = LmImageList
LmCoreComponents.image_list_item = LmImageListItem
LmCoreComponents.slider = LmSlider
LmCoreComponents.section_video_bg = LmSectionVideo
LmCoreComponents.player = LmPlayer
LmCoreComponents.timeline = LmTimeline
LmCoreComponents.timeline_item = LmTimelineItem
LmCoreComponents.tabs = LmTabs
LmCoreComponents.hubspot_meeting = LmHubspotMeeting
LmCoreComponents.iframe = LmIframe
LmCoreComponents.iframe_advanced = LmIframe as any
LmCoreComponents.chat_tawkto = LmTawktoChatButton
LmCoreComponents.chat_facebook = LmFacebookChatButton
LmCoreComponents.paragraph = LmParagraph
LmCoreComponents.form = LmGoogleFormContainer
LmCoreComponents.ecommerce_checkout = LmEcommerceCheckout
LmCoreComponents.ecommerce_fastspring_product = LmFastSpringCheckout
// LmCoreComponents.auth_container = AuthContainer
// LmCoreComponents.bottom_navigation = LmBottomNavigation
// LmCoreComponents.button_speech_text = ButtonSpeechText
