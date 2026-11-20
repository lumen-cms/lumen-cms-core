// Shared registry inventory for static builds and SSR previews.
import AuthContainer from '../components/AuthContainer.astro'
import AuthForm from '../components/AuthForm.astro'
import Accordion from '../components/Accordion.astro'
import AccordionItem from '../components/AccordionItem.astro'
import Avatar from '../components/Avatar.astro'
import BottomNavigation from '../components/BottomNavigation.astro'
import Button from '../components/Button.astro'
import ButtonList from '../components/blocks/ButtonList.astro'
import SpeechButton from '../components/SpeechButton.astro'
import Card from '../components/Card.astro'
import CardList from '../components/CardList.astro'
import CardListItem from '../components/CardListItem.astro'
import CategoryBox from '../components/CategoryBox.astro'
import Chat from '../components/Chat.astro'
import WhatsappChat from '../components/WhatsappChat.astro'
import Column from '../components/blocks/Column.astro'
import DateHeadline from '../components/blocks/DateHeadline.astro'
import Dialog from '../components/Dialog.astro'
import Divider from '../components/Divider.astro'
import Checkout from '../components/blocks/Checkout.astro'
import FastSpringProduct from '../components/FastSpringProduct.astro'
import ShopifyProduct from '../components/ShopifyProduct.astro'
import Event from '../components/Event.astro'
import EventCalendar from '../components/EventCalendar.astro'
import FlexRow from '../components/blocks/FlexRow.astro'
import GoogleForm from '../components/GoogleForm.astro'
import FormBuilder from '../components/FormBuilder.astro'
import FormField from '../components/FormField.astro'
import FormContainer from '../components/blocks/FormContainer.astro'
import Gallery from '../components/Gallery.astro'
import CmsHeadline from '../components/CmsHeadline.astro'
import Html from '../components/blocks/Html.astro'
import Hubspot from '../components/Hubspot.astro'
import CmsIcon from '../components/CmsIcon.astro'
import Iframe from '../components/Iframe.astro'
import Image from '../components/Image.astro'
import ImageList from '../components/ImageList.astro'
import ImageListItem from '../components/ImageListItem.astro'
import Disabled from '../components/blocks/Disabled.astro'
import Link from '../components/Link.astro'
import Search from '../components/Search.astro'
import ListSearchField from '../components/ListSearchField.astro'
import ListStories from '../components/ListStories.astro'
import ListWidget from '../components/ListWidget.astro'
import Motion from '../components/Motion.astro'
import NavLink from '../components/NavLink.astro'
import NavList from '../components/NavList.astro'
import NavMenu from '../components/NavMenu.astro'
import News from '../components/News.astro'
import Page from '../components/blocks/Page.astro'
import Paragraph from '../components/Paragraph.astro'
import Player from '../components/Player.astro'
import Row from '../components/blocks/Row.astro'
import RowNested from '../components/blocks/RowNested.astro'
import Section from '../components/blocks/Section.astro'
import SectionParallax from '../components/SectionParallax.astro'
import SectionVideo from '../components/SectionVideo.astro'
import Swiper from '../components/Swiper.astro'
import Snackbar from '../components/Snackbar.astro'
import StaticContainer from '../components/blocks/StaticContainer.astro'
import StaticSection from '../components/blocks/StaticSection.astro'
import SwiperItem from '../components/SwiperItem.astro'
import Table from '../components/Table.astro'
import Tabs from '../components/Tabs.astro'
import Timeline from '../components/Timeline.astro'
import TimelineItem from '../components/TimelineItem.astro'
import ToolbarLogo from '../components/ToolbarLogo.astro'
import ToolbarBlock from '../components/ToolbarBlock.astro'

export const components = {
 auth_container: AuthContainer,
 auth_form: AuthForm,
 accordion: Accordion,
 accordion_item: AccordionItem,
 avatar: Avatar,
 bottom_navigation: BottomNavigation,
 button: Button,
 button_list: ButtonList,
 button_speech_text: SpeechButton,
 card: Card,
 card_list: CardList,
 card_list_item: CardListItem,
 category_box: CategoryBox,
 chat_facebook: Chat,
 chat_tawkto: Chat,
 chat_whatsapp: WhatsappChat,
 column: Column,
 date_headline: DateHeadline,
 dialog: Dialog,
 divider: Divider,
 ecommerce_checkout: Checkout,
 ecommerce_fastspring_product: FastSpringProduct,
 ecommerce_shopify_checkout: ShopifyProduct,
 event: Event,
 event_calendar: EventCalendar,
 flex_row: FlexRow,
 form: GoogleForm,
 form_builder: FormBuilder,
 form_checkbox: FormField,
 form_container: FormContainer,
 form_select: FormField,
 form_textfield: FormField,
 gallery: Gallery,
 headline: CmsHeadline,
 html: Html,
 hubspot_form: Hubspot,
 hubspot_meeting: Hubspot,
 icon: CmsIcon,
 iframe: Iframe,
 iframe_advanced: Iframe,
 image: Image,
 image_list: ImageList,
 image_list_item: ImageListItem,
 instagram_list: Disabled,
 instagram_post: Disabled,
 link: Link,
 list_search_autocomplete: Search,
 list_search_field: ListSearchField,
 list_stories: ListStories,
 list_widget: ListWidget,
 motion: Motion,
 nav_item: NavLink,
 nav_list: NavList,
 nav_menu: NavMenu,
 nav_menu_item: NavLink,
 news: News,
 page: Page,
 error_page: Page,
 paragraph: Paragraph,
 player: Player,
 rich_text_editor: Paragraph,
 row: Row,
 row_nested: RowNested,
 section: Section,
 section_parallax: SectionParallax,
 section_video_bg: SectionVideo,
 slider: Swiper,
 snackbar: Snackbar,
 static_container: StaticContainer,
 static_section: StaticSection,
 swiper: Swiper,
 swiper_item: SwiperItem,
 table: Table,
 tabs: Tabs,
 timeline: Timeline,
 timeline_item: TimelineItem,
 toolbar_logo: ToolbarLogo,
 toolbar_navi_button: ToolbarBlock,
 toolbar_row: ToolbarBlock,
 toolbar_row_section: ToolbarBlock,
 toolbar_search: Search,
}
